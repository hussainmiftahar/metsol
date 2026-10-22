import { getGradeFromScore, getGradePointForGrade, LETTER_GRADE_MAP, SPECIAL_GRADES } from "../../../shared/grading.js";
import { normalizeStudentId, ResultPdfError } from "./pdfParser.js";

const HEADER_ALIASES = new Map([
  ["studentid", "studentId"],
  ["idnumber", "studentId"],
  ["studentname", "studentName"],
  ["coursecode", "courseCode"],
  ["course", "courseTitle"],
  ["coursename", "courseTitle"],
  ["coursetitle", "courseTitle"],
  ["credit", "credits"],
  ["credits", "credits"],
  ["credithour", "credits"],
  ["credithours", "credits"],
  ["marks", "marks"],
  ["score", "marks"],
  ["totalmarks", "marks"],
  ["grade", "grade"],
  ["lettergrade", "grade"],
  ["gradepoint", "gradePoint"],
  ["semester", "semester"],
  ["term", "semester"],
  ["academicyear", "academicYear"],
  ["year", "academicYear"],
  ["gpa", "gpa"],
  ["cgpa", "cgpa"],
]);

const compact = (value) => String(value ?? "").toLocaleLowerCase("en").replace(/[^a-z0-9]/gu, "");

const parseNumericCell = (value, label, { optional = false } = {}) => {
  if (!value?.trim()) {
    if (optional) return null;
    throw new ResultPdfError(`A result row is missing ${label}.`, "MALFORMED_RESULT_ROW");
  }
  const normalized = value.replace(/,/gu, "").trim();
  if (!/^\d+(?:\.\d+)?$/u.test(normalized)) {
    throw new ResultPdfError(`A result row has an invalid ${label}.`, "MALFORMED_RESULT_ROW");
  }
  const number = Number(normalized);
  if (!Number.isFinite(number)) {
    throw new ResultPdfError(`A result row has an invalid ${label}.`, "MALFORMED_RESULT_ROW");
  }
  return number;
};

const getHeaderKey = (value) => HEADER_ALIASES.get(compact(value)) ?? null;

const identifyHeader = (line) => {
  const columns = line.items
    .map((item, index) => ({ index, x: item.x, key: getHeaderKey(item.str) }))
    .filter((item) => item.key);
  const keys = new Set(columns.map(({ key }) => key));
  const hasCourse = keys.has("courseCode") || keys.has("courseTitle");
  const hasGradeOrMarks = keys.has("grade") || keys.has("marks");

  if (!keys.has("studentId") || !keys.has("credits") || !hasCourse || !hasGradeOrMarks) return null;
  return { columns, itemStarts: line.items.map(({ x }) => x) };
};

const mapRowCells = (line, header) => {
  const cells = new Map();
  for (const item of line.items) {
    let columnIndex = -1;
    for (let index = 0; index < header.itemStarts.length; index += 1) {
      if (item.x >= header.itemStarts[index] - 1) columnIndex = index;
      else break;
    }
    if (columnIndex < 0) continue;
    const column = header.columns.find(({ index }) => index === columnIndex);
    if (!column) continue;
    cells.set(column.key, [...(cells.get(column.key) ?? []), item.str]);
  }
  return new Map([...cells].map(([key, values]) => [key, values.join(" ").trim()]));
};

const parseResultRow = (cells) => {
  const rawStudentId = cells.get("studentId")?.trim() ?? "";
  const studentIdNormalized = normalizeStudentId(rawStudentId);
  const courseCode = cells.get("courseCode")?.trim() || null;
  const courseTitle = cells.get("courseTitle")?.trim() || null;
  const hasResultContent = cells.has("grade") || cells.has("marks") || cells.has("credits");

  if (!rawStudentId && !hasResultContent) return null;
  if (!studentIdNormalized || (!courseCode && !courseTitle)) {
    throw new ResultPdfError("A result row could not be reliably associated with a Student ID and course.", "UNRELIABLE_RESULT_ROW");
  }

  const credits = parseNumericCell(cells.get("credits"), "credit value");
  if (credits <= 0 || credits > 100) {
    throw new ResultPdfError("A result row has an invalid credit value.", "MALFORMED_RESULT_ROW");
  }

  const marks = parseNumericCell(cells.get("marks"), "marks", { optional: true });
  if (marks !== null && (marks < 0 || marks > 100)) {
    throw new ResultPdfError("A result row has marks outside the 0 to 100 range.", "MALFORMED_RESULT_ROW");
  }
  let grade = cells.get("grade")?.replace(/\s+/gu, "").toUpperCase() || null;
  if (!grade && marks !== null) grade = getGradeFromScore(marks)?.grade ?? null;
  if (!grade || !Object.hasOwn(LETTER_GRADE_MAP, grade)) {
    throw new ResultPdfError("A result row has a missing or unsupported grade.", "MALFORMED_RESULT_ROW");
  }
  const gradePointValue = parseNumericCell(cells.get("gradePoint"), "grade point", { optional: true });
  if (gradePointValue !== null && (gradePointValue < 0 || gradePointValue > 4)) {
    throw new ResultPdfError("A result row has an invalid grade point.", "MALFORMED_RESULT_ROW");
  }
  const gradePoint = SPECIAL_GRADES.has(grade) ? 0 : gradePointValue ?? getGradePointForGrade(grade);

  return {
    studentId: rawStudentId,
    studentIdNormalized,
    studentName: cells.get("studentName")?.trim() || null,
    courseCode,
    courseTitle,
    credits,
    marks,
    grade,
    gradePoint,
    semester: cells.get("semester")?.trim() || null,
    academicYear: cells.get("academicYear")?.trim() || null,
    gpa: parseNumericCell(cells.get("gpa"), "GPA", { optional: true }),
    cgpa: parseNumericCell(cells.get("cgpa"), "CGPA", { optional: true }),
  };
};

export const parseResultLines = (lines) => {
  let header = null;
  let headerLineIndex = -1;
  for (let index = 0; index < lines.length; index += 1) {
    header = identifyHeader(lines[index]);
    if (header) {
      headerLineIndex = index;
      break;
    }
  }
  if (!header) {
    throw new ResultPdfError(
      "Unable to recognize a result table with Student ID, course, credit, and grade or marks columns.",
      "UNSUPPORTED_RESULT_LAYOUT"
    );
  }

  const records = [];
  const uniqueStudents = new Set();
  const duplicateKeys = new Set();
  for (const line of lines.slice(headerLineIndex + 1)) {
    if (!line.items?.length) continue;
    if (identifyHeader(line)) continue;
    const record = parseResultRow(mapRowCells(line, header));
    if (!record) continue;
    const duplicateKey = [
      record.studentIdNormalized,
      record.semester ?? "",
      record.academicYear ?? "",
      record.courseCode ?? "",
      record.courseTitle ?? "",
      record.credits,
      record.grade,
    ].join("|");
    if (duplicateKeys.has(duplicateKey)) {
      throw new ResultPdfError("The PDF contains duplicate result rows; no records were imported.", "DUPLICATE_RESULT_ROW");
    }
    duplicateKeys.add(duplicateKey);
    uniqueStudents.add(record.studentIdNormalized);
    records.push(record);
  }

  if (!records.length) {
    throw new ResultPdfError("No reliable student result records were found in this PDF.", "NO_RESULT_RECORDS");
  }

  return { records, studentCount: uniqueStudents.size };
};

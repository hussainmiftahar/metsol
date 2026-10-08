import { normalizeStudentId } from "./pdfParser.js";

export const getAuthenticatedStudentResultFilter = (resultImportId, authenticatedStudentId) => ({
  resultImportId,
  studentIdNormalized: normalizeStudentId(authenticatedStudentId),
});

export const filterRecordsForStudent = (records, authenticatedStudentId) => {
  const normalizedStudentId = normalizeStudentId(authenticatedStudentId);
  if (!normalizedStudentId) return [];
  return records.filter((record) => record.studentIdNormalized === normalizedStudentId);
};

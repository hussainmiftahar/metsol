import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const TEXT_LINE_TOLERANCE = 2.5;

export class ResultPdfError extends Error {
  constructor(message, code = "INVALID_RESULT_PDF") {
    super(message);
    this.name = "ResultPdfError";
    this.code = code;
  }
}

export const normalizeStudentId = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .replace(/\s+/gu, "")
    .toLocaleUpperCase("en");

export const isPdfBuffer = (buffer) =>
  Buffer.isBuffer(buffer) && /%PDF-\d\.\d/u.test(buffer.subarray(0, 1024).toString("latin1"));

const makeTextLines = (items) => {
  const positioned = items
    .filter((item) => typeof item.str === "string" && item.str.trim())
    .map((item) => ({ text: item.str.trim(), x: item.transform?.[4] ?? 0, y: item.transform?.[5] ?? 0 }))
    .sort((left, right) => right.y - left.y || left.x - right.x);

  const lines = [];
  for (const item of positioned) {
    let line = lines.at(-1);
    if (!line || Math.abs(line.y - item.y) > TEXT_LINE_TOLERANCE) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }
    line.items.push({ str: item.text, x: item.x });
  }

  return lines.map((line) => ({ items: line.items.sort((left, right) => left.x - right.x) }));
};

export const extractPdfLines = async (buffer) => {
  if (!isPdfBuffer(buffer)) {
    throw new ResultPdfError("The uploaded file is not a valid PDF.");
  }

  let document;
  try {
    document = await getDocument({ data: new Uint8Array(buffer), useSystemFonts: true }).promise;
    if (document.numPages === 0) {
      throw new ResultPdfError("The PDF contains no pages.", "PDF_EMPTY");
    }
    const allLines = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      allLines.push(...makeTextLines(content.items));
    }

    if (!allLines.length) {
      throw new ResultPdfError("This PDF contains no extractable text. Scanned PDFs need OCR before import.", "OCR_REQUIRED");
    }
    return allLines;
  } catch (error) {
    if (error instanceof ResultPdfError) throw error;
    if (error?.name === "PasswordException") {
      throw new ResultPdfError("This PDF is password-protected and cannot be imported.", "PDF_PASSWORD_PROTECTED");
    }
    throw new ResultPdfError("The PDF is corrupted or could not be read.", "PDF_READ_FAILED");
  } finally {
    await document?.destroy();
  }
};

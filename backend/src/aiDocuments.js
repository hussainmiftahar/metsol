import { extname } from "node:path";
import mammoth from "mammoth";
import { extractPdfLines, isPdfBuffer, ResultPdfError } from "./result-import/pdfParser.js";

export const MAX_AI_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const MAX_AI_DOCUMENT_TEXT = 30_000;
const MAX_AI_DOCUMENT_PAGES = 100;

export class AiDocumentError extends Error {
  constructor(message, status = 422, code = "DOCUMENT_INVALID") {
    super(message);
    this.name = "AiDocumentError";
    this.status = status;
    this.code = code;
  }
}

const extractText = async (buffer, extension) => {
  if (extension === ".pdf") {
    if (!isPdfBuffer(buffer)) {
      throw new AiDocumentError("The uploaded file is not a valid PDF.");
    }
    try {
      const lines = await extractPdfLines(buffer, { maxPages: MAX_AI_DOCUMENT_PAGES });
      return lines.map((line) => line.items.map((item) => item.str).join(" ")).join("\n");
    } catch (error) {
      if (error instanceof ResultPdfError) {
        throw new AiDocumentError(error.message, 422, error.code);
      }
      throw error;
    }
  }

  if (extension === ".docx") {
    if (buffer.subarray(0, 4).toString("binary") !== "PK\u0003\u0004") {
      throw new AiDocumentError("The uploaded file is not a valid DOCX document.");
    }
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new AiDocumentError("The DOCX file is corrupted or could not be read.");
    }
  }

  if (extension === ".txt") {
    const text = buffer.toString("utf8");
    if (text.includes("\u0000")) {
      throw new AiDocumentError("The uploaded TXT file is not valid plain text.");
    }
    return text;
  }

  throw new AiDocumentError("Upload a PDF, DOCX, or TXT file.", 400, "UNSUPPORTED_DOCUMENT");
};

export async function extractAiDocument(file) {
  if (!file?.buffer || !Buffer.isBuffer(file.buffer)) {
    throw new AiDocumentError("Choose a document to upload.", 400, "FILE_REQUIRED");
  }

  if (file.buffer.length > MAX_AI_DOCUMENT_BYTES) {
    throw new AiDocumentError("Documents must be 10 MB or smaller.", 413, "FILE_TOO_LARGE");
  }

  const extension = extname(file.originalname || "").toLocaleLowerCase("en");
  const text = (await extractText(file.buffer, extension))
    .replace(/\u0000/gu, "")
    .replace(/\r\n?/gu, "\n")
    .trim();

  if (!text) {
    throw new AiDocumentError("No extractable text was found in this document. Scanned PDFs need OCR, which is not available yet.", 422, "DOCUMENT_TEXT_EMPTY");
  }

  const truncated = text.length > MAX_AI_DOCUMENT_TEXT;
  let content = text.slice(0, MAX_AI_DOCUMENT_TEXT);
  if (truncated && /[\uD800-\uDBFF]$/u.test(content)) {
    content = content.slice(0, -1);
  }

  return { text: content, truncated };
}

import assert from "node:assert/strict";
import test from "node:test";
import { extractAiDocument, MAX_AI_DOCUMENT_TEXT } from "../src/aiDocuments.js";

test("extracts plain-text documents", async () => {
  const document = await extractAiDocument({
    originalname: "lecture.txt",
    buffer: Buffer.from("  Course overview\r\nKey concept: recursion.  ", "utf8"),
  });

  assert.deepEqual(document, {
    text: "Course overview\nKey concept: recursion.",
    truncated: false,
  });
});

test("caps extracted document text at the configured context limit", async () => {
  const document = await extractAiDocument({
    originalname: "long-notes.txt",
    buffer: Buffer.from(`${"a".repeat(MAX_AI_DOCUMENT_TEXT - 1)}😀tail`, "utf8"),
  });

  assert.equal(document.text.length, MAX_AI_DOCUMENT_TEXT - 1);
  assert.equal(document.truncated, true);
  assert.equal(document.text.endsWith("\uD83D"), false);
});

test("rejects unsupported, invalid, and empty documents with clear errors", async () => {
  await assert.rejects(
    extractAiDocument({ originalname: "old-word.doc", buffer: Buffer.from("text") }),
    { message: "Upload a PDF, DOCX, or TXT file.", code: "UNSUPPORTED_DOCUMENT" }
  );

  await assert.rejects(
    extractAiDocument({ originalname: "broken.pdf", buffer: Buffer.from("not a PDF") }),
    { message: "The uploaded file is not a valid PDF.", code: "DOCUMENT_INVALID" }
  );

  await assert.rejects(
    extractAiDocument({ originalname: "broken.docx", buffer: Buffer.from("not a DOCX") }),
    { message: "The uploaded file is not a valid DOCX document.", code: "DOCUMENT_INVALID" }
  );

  await assert.rejects(
    extractAiDocument({ originalname: "empty.txt", buffer: Buffer.from(" \r\n ") }),
    { message: "No extractable text was found in this document. Scanned PDFs need OCR, which is not available yet.", code: "DOCUMENT_TEXT_EMPTY" }
  );
});

test("rejects documents larger than the upload limit", async () => {
  await assert.rejects(
    extractAiDocument({
      originalname: "too-large.txt",
      buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
    }),
    { message: "Documents must be 10 MB or smaller.", status: 413, code: "FILE_TOO_LARGE" }
  );
});

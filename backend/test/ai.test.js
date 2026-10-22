import assert from "node:assert/strict";
import test from "node:test";
import { generateAssistantResponse } from "../src/ai.js";

test("sends conversation history and student context to the Groq Responses model", async () => {
  let request;
  const messages = [{ role: "user", content: "Explain language models" }];
  const answer = await generateAssistantResponse(messages, {
    apiKey: "test-key",
    userName: "Alex Student",
    fetchImpl: async (url, options) => {
      request = { url, options, body: JSON.parse(options.body) };
      return {
        ok: true,
        json: async () => ({ output_text: "They predict and generate text." }),
      };
    },
  });

  assert.equal(answer, "They predict and generate text.");
  assert.equal(request.url, "https://api.groq.com/openai/v1/responses");
  assert.equal(request.options.headers.Authorization, "Bearer test-key");
  assert.equal(request.body.model, "openai/gpt-oss-20b");
  assert.deepEqual(request.body.input, messages);
  assert.match(request.body.instructions, /Alex Student/);
  assert.deepEqual(request.body.reasoning, { effort: "low" });
});

test("uses a configured Groq model", async () => {
  let model;
  await generateAssistantResponse([{ role: "user", content: "Hello" }], {
    apiKey: "test-key",
    model: "custom-model",
    fetchImpl: async (_, options) => {
      model = JSON.parse(options.body).model;
      return { ok: true, json: async () => ({ output_text: "Hi." }) };
    },
  });

  assert.equal(model, "custom-model");
});

test("extracts text from the raw Responses API output structure", async () => {
  const answer = await generateAssistantResponse([{ role: "user", content: "What is my name?" }], {
    apiKey: "test-key",
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        output: [
          {
            type: "message",
            content: [
              { type: "output_text", text: "I don't know your name" },
            ],
          },
        ],
      }),
    }),
  });

  assert.equal(answer, "I don't know your name");
});

test("provides uploaded document text as untrusted reference context", async () => {
  let requestBody;
  await generateAssistantResponse([{ role: "user", content: "Summarize this." }], {
    apiKey: "test-key",
    documentText: "Chapter one covers recursion.",
    fetchImpl: async (_, options) => {
      requestBody = JSON.parse(options.body);
      return { ok: true, json: async () => ({ output_text: "It covers recursion." }) };
    },
  });

  assert.match(requestBody.instructions, /untrusted reference material/);
  assert.deepEqual(requestBody.input[0], {
    role: "user",
    content: "Uploaded document reference:\nChapter one covers recursion.",
  });
});

test("reports provider errors and missing output explicitly", async () => {
  await assert.rejects(
    generateAssistantResponse([{ role: "user", content: "Hello" }], {
      apiKey: "test-key",
      fetchImpl: async () => ({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: "Invalid API key" } }),
      }),
    }),
    /Invalid API key/
  );

  await assert.rejects(
    generateAssistantResponse([{ role: "user", content: "Hello" }], {
      apiKey: "test-key",
      fetchImpl: async () => ({ ok: true, json: async () => ({ output_text: "" }) }),
    }),
    /no assistant response/
  );

  await assert.rejects(
    generateAssistantResponse([{ role: "user", content: "Hello" }], {
      apiKey: "test-key",
      fetchImpl: async () => ({ ok: false, status: 502, json: async () => null }),
    }),
    /status 502/
  );

  await assert.rejects(
    generateAssistantResponse([{ role: "user", content: "Hello" }], { apiKey: "" }),
    /GROQ_API_KEY is not configured/
  );
});

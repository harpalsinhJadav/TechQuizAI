import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// ---------------- MAIN HANDLER ---------------- //

serve(async (req) => {
  try {
    // Handle CORS (important for frontend later)
    if (req.method === "OPTIONS") {
      return new Response("ok");
    }

    const body = await req.json();
    const { topic, content } = body;

    if (!topic && !content) {
      return jsonResponse({ error: "Missing topic or content" }, 400);
    }

    const text = content || topic;

    // 1️⃣ Chunking
    const chunks = chunkText(text);

    // 2️⃣ Context (basic for now, will upgrade in RAG step)
    const context = chunks.slice(0, 5).join("\n");

    // 3️⃣ Generate Quiz
    const quiz = await generateQuiz(context);

    return jsonResponse({ quiz });

  } catch (err) {
    console.error("ERROR:", err);
    return jsonResponse({ error: err.message || "Internal Server Error" }, 500);
  }
});

// ---------------- RESPONSE HELPER ---------------- //

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    }
  });
}

// ---------------- CHUNKING ---------------- //

function chunkText(text: string) {
  const size = 500;
  const overlap = 100;

  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));
  }

  return chunks;
}

// ---------------- GROK QUIZ GENERATION ---------------- //

async function generateQuiz(context: string) {
  const prompt = `
You are TechQuizAI.

Generate 5 multiple-choice questions (MCQs) from the content below.

Content:
${context}

Rules:
- 4 options per question
- Only 1 correct answer
- Medium difficulty
- Return ONLY valid JSON

Format:
[
 {
  "question": "",
  "options": ["", "", "", ""],
  "correctIndex": 0,
  "explanation": ""
 }
]
`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  const data = await res.json();

  console.log("GEMINI RAW RESPONSE:", JSON.stringify(data));

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  try {
    return JSON.parse(text);
  } catch {
    console.log("⚠️ Cleaning Gemini response...");

    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON found in Gemini response");
    }

    const cleanJson = text.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(cleanJson);
  }
}
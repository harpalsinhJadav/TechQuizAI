import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROK_API = "https://api.x.ai/v1";

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
You are TechQuizAI, an AI quiz generator.

Return ONLY valid JSON.
Do NOT include any text before or after JSON.

Generate 5 MCQs from the content below:

${context}

Rules:
- 4 options per question
- Only 1 correct answer
- Medium difficulty

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

  const res = await fetch(`${GROK_API}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("GROK_API_KEY")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "grok-3",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();

  // 🔍 Log full response (VERY IMPORTANT for debugging)
  console.log("GROK RAW RESPONSE:", JSON.stringify(data));

  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("Grok returned empty response");
  }

  try {
    // ✅ Direct parse attempt
    return JSON.parse(text);

  } catch (err) {
    console.log("⚠️ Invalid JSON, attempting cleanup...");

    // 🧠 Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.log("❌ No JSON found in response:", text);
      throw new Error("No valid JSON found in Grok response");
    }

    const cleanJson = text.slice(jsonStart, jsonEnd + 1);

    try {
      return JSON.parse(cleanJson);
    } catch (err2) {
      console.log("❌ Failed to parse cleaned JSON:", cleanJson);
      throw new Error("Failed to parse quiz JSON after cleanup");
    }
  }
}
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROK_API = "https://api.x.ai/v1";

// ---------------- MAIN HANDLER ---------------- //

serve(async (req) => {
  try {
    const { topic, content } = await req.json();

    if (!topic && !content) {
      return jsonResponse({ error: "Missing input" }, 400);
    }

    const text = content || topic;

    const chunks = chunkText(text);
    const context = chunks.slice(0, 5).join("\n");

    const quiz = await generateQuiz(context);

    return jsonResponse({ quiz });

  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
});

// ---------------- HELPERS ---------------- //

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function chunkText(text: string) {
  const size = 500;
  const overlap = 100;

  const chunks = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

// ---------------- GROK LLM ---------------- //

async function generateQuiz(context: string) {
  const prompt = `
You are TechQuizAI, an AI quiz generator.

Generate 5 MCQs from the content below.

${context}

Rules:
- 4 options
- 1 correct answer
- Medium difficulty
- JSON only

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
  const text = data.choices?.[0]?.message?.content;

  return JSON.parse(text);
}
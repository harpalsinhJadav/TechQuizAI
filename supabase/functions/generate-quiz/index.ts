import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ---------------- ENV ---------------- //

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const PRIMARY_MODEL = "models/gemini-3.1-flash-lite-preview";
const FALLBACK_MODEL = "models/gemini-2.0-flash-lite-001";

// Supabase
const supabase = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

// ---------------- MAIN HANDLER ---------------- //

serve(async (req) => {
  try {
    // CORS
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders() });
    }

    if (!GEMINI_API_KEY) {
      return jsonResponse({ error: "Missing GEMINI_API_KEY" }, 500);
    }

    const body = await req.json();
    const { topic, content } = body;

    if (!topic && !content) {
      return jsonResponse({ error: "Missing topic or content" }, 400);
    }

    const text = content || topic;

    // 1️⃣ Chunking
    const chunks = chunkText(text);

    // 2️⃣ Save document
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({ content: text })
      .select()
      .single();

    if (docError) throw docError;

    // 3️⃣ Store chunks with embeddings
    await storeChunks(doc.id, chunks);

    // 4️⃣ Retrieve relevant context (RAG)
    const context = await getRelevantChunks(text);

    // 5️⃣ Generate quiz
    const quiz = await generateQuiz(context);

    // Save quiz
    const quizId = await saveQuiz(doc.id, quiz);

    return jsonResponse({
      success: true,
      quizId,
      total: quiz.length,
      data: quiz
    });

  } catch (err) {
    console.error("ERROR:", err);
    return jsonResponse(
      { error: err.message || "Internal Server Error" },
      500
    );
  }
});

// ---------------- RESPONSE HELPERS ---------------- //

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json"
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  };
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

// ---------------- EMBEDDING ---------------- //

async function getEmbedding(text: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: {
        parts: [{ text }]
      }
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Embedding failed");
  }

  return data?.embedding?.values;
}

// ---------------- STORE CHUNKS ---------------- //

async function storeChunks(documentId: string, chunks: string[]) {
  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);

    await supabase.from("chunks").insert({
      document_id: documentId,
      content: chunk,
      embedding
    });
  }
}

// ---------------- RETRIEVAL ---------------- //

async function getRelevantChunks(query: string, k = 5) {
  const embedding = await getEmbedding(query);

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    match_count: k
  });

  if (error) throw error;

  return data.map((item: any) => item.content).join("\n");
}

// ---------------- QUIZ GENERATION ---------------- //

async function generateQuiz(context: string) {
  try {
    return await tryGenerate(context, PRIMARY_MODEL);
  } catch {
    console.log("⚠️ Primary model failed, switching to fallback");
    return await tryGenerate(context, FALLBACK_MODEL);
  }
}

async function tryGenerate(context: string, model: string) {
  const prompt = `
You are TechQuizAI.

Generate 5 MCQs from the content below.

${context}

Rules:
- 4 options
- 1 correct answer
- Medium difficulty
- Return ONLY JSON

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

  const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 2048
      }
    })
  });

  const data = await res.json();

  console.log(`MODEL (${model}) RESPONSE:`, JSON.stringify(data));

  if (!res.ok) {
    throw new Error(data?.error?.message || "Gemini API failed");
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON format");
    }

    return JSON.parse(text.slice(start, end + 1));
  }
}


// ------------ Save Quiz -------------------//
async function saveQuiz(documentId: string, quiz: any[]) {
  // 1. Create quiz
  const { data: quizRow, error: quizError } = await supabase
    .from("quizzes")
    .insert({ document_id: documentId })
    .select()
    .single();

  if (quizError) throw quizError;

  // 2. Prepare questions
  const questions = quiz.map((q) => ({
    quiz_id: quizRow.id,
    question: q.question,
    options: q.options,
    correct_index: q.correctIndex,
    explanation: q.explanation
  }));

  // 3. Insert questions
  const { error: questionError } = await supabase
    .from("questions")
    .insert(questions);

  if (questionError) throw questionError;

  return quizRow.id;
}
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ---------------- ENV ---------------- //

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const PRIMARY_MODEL = "models/gemini-3.1-flash-lite-preview";
const EMBEDDING_MODEL = "models/gemini-embedding-001";

const supabase = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

// ---------------- RATE LIMIT ---------------- //

const rateLimitMap = new Map();

function rateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const user = rateLimitMap.get(ip) || [];
  const filtered = user.filter((t: number) => now - t < windowMs);

  if (filtered.length >= maxRequests) {
    throw new Error("Too many requests. Try again later.");
  }

  filtered.push(now);
  rateLimitMap.set(ip, filtered);
}

// ---------------- VALIDATION ---------------- //

function validateInput(body: any) {
  const { topic, content } = body;

  if (!topic && !content) {
    throw new Error("Topic or content is required");
  }

  if (topic && typeof topic !== "string") {
    throw new Error("Invalid topic");
  }

  if (content && typeof content !== "string") {
    throw new Error("Invalid content");
  }

  const text = topic || content;

  if (text.length > 5000) {
    throw new Error("Input too large");
  }

  return text;
}

// ---------------- RESPONSE HELPERS ---------------- //

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  };
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json"
    }
  });
}

function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message
    }),
    {
      status,
      headers: corsHeaders()
    }
  );
}

// ---------------- RETRY + TIMEOUT ---------------- //

async function fetchWithRetry(url: string, options: any, retries = 2) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    if (!res.ok) throw new Error("API failed");

    return res;
  } catch (err) {
    if (retries === 0) throw err;

    await new Promise(r => setTimeout(r, 1000));
    return fetchWithRetry(url, options, retries - 1);
  }
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
  const url = `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`;

  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] }
    })
  });

  const data = await res.json();

  if (!data?.embedding?.values) {
    throw new Error("Embedding failed");
  }

  return data.embedding.values;
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

  return data.map((i: any) => i.content).join("\n");
}

// ---------------- QUIZ GENERATION ---------------- //

async function generateQuiz(context: string) {
  const prompt = `
Generate 5 MCQs.

${context}

Return ONLY a JSON array of objects with this EXACT format:
    [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctIndex": number (0-3),
        "explanation": "string explaining why the answer is correct"
      }
    ]
    `;

  const url = `https://generativelanguage.googleapis.com/v1beta/${PRIMARY_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  const data = await res.json();

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response");

  return JSON.parse(text);
}

// ---------------- SAVE QUIZ ---------------- //

async function saveQuiz(documentId: string, quiz: any[]) {
  const { data: quizRow, error } = await supabase
    .from("quizzes")
    .insert({ document_id: documentId })
    .select()
    .single();

  if (error) throw error;

  const questions = quiz.map((q) => ({
    quiz_id: quizRow.id,
    question: q.question,
    options: q.options,
    correct_index: q.correctIndex,
    explanation: q.explanation
  }));

  await supabase.from("questions").insert(questions);

  return quizRow.id;
}

// ---------------- MAIN ---------------- //

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders() });
    }

    if (!GEMINI_API_KEY) {
      return errorResponse("Missing API key", 500);
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    rateLimit(ip);

    const body = await req.json();
    const text = validateInput(body);

    const chunks = chunkText(text);

    const { data: doc } = await supabase
      .from("documents")
      .insert({ content: text })
      .select()
      .single();

    await storeChunks(doc.id, chunks);

    const context = await getRelevantChunks(text);

    const quiz = await generateQuiz(context);

    const quizId = await saveQuiz(doc.id, quiz);

    return jsonResponse({
      success: true,
      quizId,
      total: quiz.length,
      data: quiz
    });

  } catch (err: any) {
    console.log(JSON.stringify({
      type: "ERROR",
      message: err.message,
      time: new Date().toISOString()
    }));

    return errorResponse(err.message || "Internal Server Error", 500);
  }
});
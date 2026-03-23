import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

serve(async () => {
  try {
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
        { status: 500 }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("LIST MODELS RESPONSE:", JSON.stringify(data));

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: 500
      });
    }

    // ✅ Filter only usable models
    const models = (data.models || [])
      .filter((m: any) =>
        m.supportedGenerationMethods?.includes("generateContent")
      )
      .map((m: any) => ({
        name: m.name,
        displayName: m.displayName
      }));

    return new Response(JSON.stringify({ models }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders() });
    }

    const { quizId } = await req.json();

    if (!quizId) {
      return jsonResponse({ error: "Missing quizId" }, 400);
    }

    // 1. Fetch questions
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId);

    if (error) throw error;

    return jsonResponse({
      success: true,
      total: data.length,
      data
    });

  } catch (err) {
    return jsonResponse(
      { error: err.message || "Internal Server Error" },
      500
    );
  }
});

// ---------------- HELPERS ---------------- //

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
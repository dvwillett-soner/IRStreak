export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle Pre-flight OPTIONS requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // API Route for the Syllabus Database
    if (url.pathname === "/api/syllabus" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM Syllabus ORDER BY section ASC, step_index ASC"
        ).all();
        
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Serve static files (HTML, etc.)
    return env.ASSETS.fetch(request);
  }
};

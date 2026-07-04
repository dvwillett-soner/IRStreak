export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // LOGGING: This will appear in your Cloudflare Dashboard "Observability > Logs"
    console.log("Request received for path:", url.pathname);

    // 1. API Route
    if (url.pathname === "/api/syllabus") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM Syllabus ORDER BY section ASC, step_index ASC"
        ).all();
        
        return new Response(JSON.stringify(results), { 
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          } 
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 2. Static Assets
    return env.ASSETS.fetch(request);
  }
};

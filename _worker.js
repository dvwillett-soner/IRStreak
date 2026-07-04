export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API Route for Database
    if (url.pathname === "/api/syllabus") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM Syllabus ORDER BY section ASC, step_index ASC"
        ).all();
        
        return new Response(JSON.stringify(results), { 
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // Serve static files from the 'public' folder
    return env.ASSETS.fetch(request);
  }
};

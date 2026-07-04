export default {
  async fetch(request, env) {
    // 1. Handle CORS Preflight (OPTIONS request)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://irstreak.pages.dev", // Replace with your frontend URL
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);

    // 2. API Logic
    if (url.pathname === "/api/syllabus") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM Syllabus ORDER BY section ASC, step_index ASC"
        ).all();

        return new Response(JSON.stringify(results), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://irstreak.pages.dev", // Replace with your frontend URL
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "https://irstreak.pages.dev" },
        });
      }
    }

    // 3. Default for unknown routes
    return new Response("Not Found", { status: 404 });
  }
};

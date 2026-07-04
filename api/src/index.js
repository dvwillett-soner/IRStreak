export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/syllabus" || url.pathname === "/syllabus") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM Syllabus ORDER BY section, id, step_index"
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

    return new Response("No match found for path: " + url.pathname, { status: 404 });
  }
};

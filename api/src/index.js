export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Log the request to your Cloudflare dashboard logs
    console.log("Incoming request for:", url.pathname);

    // Explicitly allow both /api/syllabus and just /syllabus 
    // in case the URL pathing is stripping the /api/
    if (url.pathname === "/api/syllabus" || url.pathname === "/syllabus") {
      try {
        // Return a simple success message first to prove it works
        return new Response(JSON.stringify({ status: "success", path_received: url.pathname }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    return new Response("No match found for path: " + url.pathname, { status: 404 });
  }
};

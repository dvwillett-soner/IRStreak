export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // This will catch EVERYTHING regardless of the path
    // If this works, we know the Worker is finally live.
    return new Response(JSON.stringify({ 
      message: "The Worker is alive!", 
      path: url.pathname 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

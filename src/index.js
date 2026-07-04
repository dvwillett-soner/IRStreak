export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. ROUTE: YOUR ORDERS API LOGS
    if (url.pathname === "/api/orders" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT Id, CustomerName, OrderDate FROM Orders ORDER BY OrderDate DESC LIMIT 100"
        ).all(); // Queries D1 smoothly
        
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
          status: 500, 
          headers: corsHeaders 
        });
      }
    }

    // 2. ROUTE: GOOGLE ACCOUNT SYNC LOGIC
    if (url.pathname === "/api/auth/google" && request.method === "POST") {
      try {
        const { token, xp, streak, progress } = await request.json();
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const userClaims = JSON.parse(atob(base64));

        if (!userClaims.email_verified) {
          return new Response(JSON.stringify({ success: false, error: "Email unverified" }), { status: 401, headers: corsHeaders });
        }

        const email = userClaims.email;

        await env.DB.prepare(`
          INSERT INTO Users (id, xp, streak, progress) VALUES (?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET 
            xp = CASE WHEN excluded.xp > Users.xp THEN excluded.xp ELSE Users.xp END,
            streak = excluded.streak,
            progress = excluded.progress,
            updated_at = CURRENT_TIMESTAMP
        `).bind(email, xp || 0, streak || 1, JSON.stringify(progress || {})).run();

        const record = await env.DB.prepare("SELECT * FROM Users WHERE id = ?").bind(email).first();

        return new Response(JSON.stringify({
          success: true,
          email: record.id,
          name: userClaims.name,
          xp: record.xp,
          streak: record.streak,
          progress: JSON.parse(record.progress)
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 3. FALLBACK ROUTE: Fall back to rendering your public asset folder automatically
    return env.ASSETS.fetch(request);
  }
};

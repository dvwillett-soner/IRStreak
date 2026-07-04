export async function onRequestGet({ env }) {
  try {
    // We explicitly pull the DB binding from the environment context
    const db = env.DB;
    const { results } = await db.prepare(
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

// Convex is always-on — no keep-alive ping needed.
// This endpoint exists for Vercel Cron compatibility.
export const GET = async () => new Response("OK", { status: 200 });

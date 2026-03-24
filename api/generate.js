import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { review, userId } = req.body;

  let { data: user } = await supabase
    .from("users").select("credits").eq("id", userId).single();

  if (!user) {
    await supabase.from("users").insert({ id: userId, credits: 3 });
    user = { credits: 3 };
  }

  if (user.credits <= 0) {
    return res.status(403).json({ error: "No credits" });
  }

  try {
    const prompt = "Si profesionalny customer support. Napís kratku profesionalnu odpoved v slovenskom jazyku na tuto recenziu zakaznika: " + review;

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const geminiData = await geminiRes.json();
        console.log("GEMINI_KEY_SET:", !!process.env.GEMINI_API_KEY);
        console.log("GEMINI_RESPONSE:", JSON.stringify(geminiData));
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Chyba generovania";

    await supabase.from("users").update({ credits: user.credits - 1 }).eq("id", userId);

    res.json({ reply, credits: user.credits - 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

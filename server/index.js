import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get("/", (req, res) => {
  res.send("API running");
});

app.post("/generate", async (req, res) => {
  try {
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
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Chyba generovania";

    await supabase.from("users").update({ credits: user.credits - 1 }).eq("id", userId);

    res.json({ reply, credits: user.credits - 1 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: "AI Review Tool - 50 kreditov" },
          unit_amount: 1000
        },
        quantity: 1
      }],
      metadata: { userId },
      success_url: process.env.FRONTEND_URL + "/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: process.env.FRONTEND_URL + "/",
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send("Webhook Error");
  }
  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const { data: u } = await supabase.from("users").select("credits").eq("id", s.metadata.userId).single();
    await supabase.from("users").update({ credits: (u?.credits || 0) + 50 }).eq("id", s.metadata.userId);
  }
  res.json({ received: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

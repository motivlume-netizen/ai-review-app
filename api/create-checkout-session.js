const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "AI Review Credits (50 credits)",
              description: "50 AI-generated review responses",
            },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: process.env.FRONTEND_URL + "?success=true",
      cancel_url: process.env.FRONTEND_URL + "?canceled=true",
      metadata: { userId },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

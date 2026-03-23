import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function generateUserId() {
  const existing = localStorage.getItem("userId");
  if (existing) return existing;
  const newId = crypto.randomUUID();
  localStorage.setItem("userId", newId);
  return newId;
}

function App() {
  const [review, setReview] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(3);
  const [userId] = useState(generateUserId);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id")) {
      setPaid(true);
      setCredits(50);
    }
  }, []);

  const generate = async () => {
    if (!review.trim()) return alert("Vloz recenziu!");
    if (credits <= 0) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch(API_URL + "/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, userId }),
      });
      if (res.status === 403) { setCredits(0); setLoading(false); return; }
      const data = await res.json();
      setResponse(data.reply);
      setCredits(data.credits ?? credits - 1);
    } catch { alert("Chyba! Skus znova."); }
    setLoading(false);
  };

  const buyCredits = async () => {
    try {
      const res = await fetch(API_URL + "/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      window.location.href = data.url;
    } catch { alert("Chyba pri platbe."); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: 640, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⭐</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "white", margin: 0 }}>AI Odpovede na Recenzie</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 10, fontSize: 17 }}>Profesionalna odpoved za 5 sekund</p>
        </div>
        <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <label style={{ fontWeight: 700, color: "#1e293b", fontSize: 16 }}>Recenzia zakaznika:</label>
            <span style={{ background: credits > 0 ? "#dcfce7" : "#fee2e2", color: credits > 0 ? "#16a34a" : "#dc2626", padding: "6px 14px", borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
              {credits} kreditov
            </span>
          </div>
          <textarea
            placeholder="Vloz sem recenziu zakaznika..."
            value={review}
            onChange={e => setReview(e.target.value)}
            style={{ width: "100%", height: 130, border: "2px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", fontSize: 15, resize: "vertical", boxSizing: "border-box", outline: "none" }}
          />
          <button onClick={generate} disabled={loading || credits <= 0}
            style={{ width: "100%", marginTop: 14, padding: "16px 0", background: loading || credits <= 0 ? "#94a3b8" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "white", border: "none", borderRadius: 12, fontSize: 17, fontWeight: 700, cursor: loading || credits <= 0 ? "not-allowed" : "pointer" }}>
            {loading ? "Generujem..." : "Vygeneruj odpoved"}
          </button>
        </div>
        {response && (
          <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, color: "#1e293b", fontWeight: 700 }}>Navrhnutá odpoved:</h3>
              <button onClick={copyToClipboard} style={{ padding: "8px 18px", background: copied ? "#dcfce7" : "#f1f5f9", color: copied ? "#16a34a" : "#475569", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                {copied ? "Skopirovane!" : "Kopirovat"}
              </button>
            </div>
            <p style={{ color: "#374151", lineHeight: 1.8, margin: 0 }}>{response}</p>
          </div>
        )}
        {credits <= 0 && (
          <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💳</div>
            <h3 style={{ color: "#1e293b", margin: "0 0 8px", fontWeight: 700 }}>Minul si kredity</h3>
            <p style={{ color: "#64748b", marginBottom: 20 }}>Kupte si 50 kreditov za 10€</p>
            <button onClick={buyCredits} style={{ padding: "16px 40px", background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)", color: "white", border: "none", borderRadius: 12, fontSize: 17, fontWeight: 700, cursor: "pointer" }}>
              Kupit 50 kreditov - 10€
            </button>
          </div>
        )}
        {paid && credits > 0 && (
          <div style={{ background: "#dcfce7", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <p style={{ color: "#16a34a", fontWeight: 700, margin: 0 }}>Platba uspesna! +50 kreditov.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

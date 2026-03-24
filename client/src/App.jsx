áéýííóííáááčť€čéóííľíááíťáší€áďáóíááččáíťš⚡ďáďž🇸🇰ýúžč🎯áóžáďááíá📋éííďýížľ📊óíšš👥íááčí⭐íťá→🤖áňéáňáťíííťáá—ýáčúšť→ťííž💬áíýáľýšý🤖ďĎšúšíážíšíáýčíšíšďšášščýáýýľíééčďí⚡✓✕ýčťľíšččť—žá⭐©šáéžúáížď⚡áížáí⏳ď✨ťď✅áď✓íé📋íť💳áú€čúť—€import { useState, useEffect } from "react";

function generateUserId() {
    const existing = localStorage.getItem("userId");
    if (existing) return existing;
    const newId = crypto.randomUUID();
    localStorage.setItem("userId", newId);
    return newId;
}

const PLANS = [
  {
        name: "Free",
        price: "Zadarmo",
        credits: 3,
        color: "#6B7280",
        features: ["3 kredity celkovo", "Základné AI odpovede", "Slovenský jazyk", "Kopírovanie odpovedí"],
        missing: ["História odpovedí", "Analytics", "Tímová spolupráca", "Prioritná podpora"],
        cta: "Začať zadarmo",
        highlight: false,
  },
  {
        name: "Pro",
        price: "€9.99",
        period: "/mesiac",
        credits: 50,
        color: "#6366F1",
        features: ["50 kreditov/mesiac", "Pokročilé AI odpovede", "História odpovedí (30 dní)", "Email podpora", "Analytics prehľad"],
        missing: ["Tímová spolupráca", "API prístup"],
        cta: "Vybrať Pro",
        highlight: true,
        badge: "Najpopulárnejší",
  },
  {
        name: "Elite",
        price: "€29.99",
        period: "/mesiac",
        credits: 500,
        color: "#F59E0B",
        features: ["500 kreditov/mesiac", "Prioritná AI odpoveď", "Neobmedzená história", "Tímová spolupráca (3 členovia)", "Pokročilá Analytics", "API prístup", "Priority 24/7 podpora"],
        missing: [],
        cta: "Vybrať Elite",
        highlight: false,
        badge: "Najlepšia hodnota",
  },
  ];

const FEATURES = [
  { icon: "⚡", title: "Odpoveď za 3 sekundy", desc: "AI vygeneruje profesionálnu odpoveď na recenziu okamžite." },
  { icon: "🇸🇰", title: "Slovenský jazyk", desc: "Odpovede sú vždy v perfektnej slovenčine." },
  { icon: "🎯", title: "Profesionálny tón", desc: "Každá odpoveď je zdvorilá, profesionálna a zaujímavá." },
  { icon: "📋", title: "Jednoduché kopírovanie", desc: "Skopírujte odpoveď jedným kliknutím a vložte ju kamkoľvek." },
  { icon: "📊", title: "História odpovedí", desc: "Sledujte všetky vaše odpovede na jednom mieste (Pro+)." },
  { icon: "👥", title: "Tímová spolupráca", desc: "Pridajte členov tímu a spravujte odpovede spolu (Elite)." },
  ];

export default function App() {
    const [page, setPage] = useState("home");
    const [review, setReview] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [credits, setCredits] = useState(3);
    const [userId] = useState(generateUserId);
    const [copied, setCopied] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("success")) {
                setCredits(50);
                setPage("app");
        }
  }, []);

  const generate = async () => {
        if (!review.trim()) return alert("Vlož recenziu!");
        if (credits <= 0) return;
        setLoading(true);
        setResponse("");
        try {
                const res = await fetch("/api/generate", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ review, userId }),
                });
                if (res.status === 403) { setCredits(0); setLoading(false); return; }
                const data = await res.json();
                setResponse(data.reply);
                setCredits(data.credits ?? credits - 1);
        } catch { alert("Chyba! Skús znova."); }
        setLoading(false);
  };

  const buyCredits = async () => {
        try {
                const res = await fetch("/api/create-checkout-session", {
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

  // ─── STYLES ───────────────────────────────────────────────────────────────
  const s = {
        body: { fontFamily: "'Inter', system-ui, sans-serif", background: "#F9FAFB", color: "#111827", minHeight: "100vh" },
        nav: { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100 },
        navLogo: { fontWeight: 800, fontSize: 20, color: "#111827", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
        navLinks: { display: "flex", gap: 32, alignItems: "center" },
        navLink: { color: "#6B7280", fontWeight: 500, fontSize: 15, cursor: "pointer", border: "none", background: "none" },
        navCta: { background: "#111827", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", border: "none" },
        hero: { maxWidth: 900, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" },
        heroTag: { display: "inline-block", background: "#EEF2FF", color: "#6366F1", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 },
        heroTitle: { fontSize: 52, fontWeight: 900, lineHeight: 1.15, margin: "0 0 20px", color: "#111827", letterSpacing: "-1px" },
        heroSub: { fontSize: 18, color: "#6B7280", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 },
        heroCta: { background: "#111827", color: "#fff", padding: "16px 36px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", border: "none", marginRight: 12 },
        heroCtaSecondary: { background: "#fff", color: "#111827", padding: "16px 36px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", border: "2px solid #E5E7EB" },
        section: { maxWidth: 1100, margin: "0 auto", padding: "60px 24px" },
        sectionTitle: { fontSize: 36, fontWeight: 800, textAlign: "center", marginBottom: 12, color: "#111827", letterSpacing: "-0.5px" },
        sectionSub: { fontSize: 17, color: "#6B7280", textAlign: "center", marginBottom: 48, lineHeight: 1.6 },
        featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 },
        featureCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "28px 28px", transition: "box-shadow 0.2s" },
        featureIcon: { fontSize: 32, marginBottom: 12 },
        featureTitle: { fontWeight: 700, fontSize: 17, marginBottom: 6, color: "#111827" },
        featureDesc: { color: "#6B7280", fontSize: 14, lineHeight: 1.6 },
        plansGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "start" },
        planCard: (highlight) => ({ background: highlight ? "#111827" : "#fff", border: highlight ? "none" : "1px solid #E5E7EB", borderRadius: 20, padding: "36px 32px", position: "relative", boxShadow: highlight ? "0 20px 60px rgba(0,0,0,0.15)" : "none" }),
        planBadge: (color) => ({ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: color, color: "#fff", padding: "4px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }),
        planName: (highlight) => ({ fontWeight: 800, fontSize: 22, marginBottom: 4, color: highlight ? "#fff" : "#111827" }),
        planPrice: (highlight) => ({ fontSize: 42, fontWeight: 900, color: highlight ? "#fff" : "#111827", lineHeight: 1 }),
        planPeriod: (highlight) => ({ fontSize: 15, color: highlight ? "rgba(255,255,255,0.6)" : "#9CA3AF", marginLeft: 2 }),
        planCredits: (highlight) => ({ fontSize: 13, color: highlight ? "rgba(255,255,255,0.7)" : "#6B7280", margin: "12px 0 24px", background: highlight ? "rgba(255,255,255,0.1)" : "#F3F4F6", padding: "6px 12px", borderRadius: 8, display: "inline-block" }),
        planFeature: (highlight) => ({ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 14, color: highlight ? "rgba(255,255,255,0.9)" : "#374151" }),
        planMissing: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 14, color: "#D1D5DB" },
        planCta: (highlight) => ({ width: "100%", marginTop: 28, padding: "14px 0", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", border: "none", background: highlight ? "#fff" : "#111827", color: highlight ? "#111827" : "#fff" }),
        divider: { height: 1, background: "#E5E7EB", margin: "0 24px" },
        appWrap: { maxWidth: 720, margin: "0 auto", padding: "40px 24px" },
        appHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
        appTitle: { fontSize: 28, fontWeight: 800, color: "#111827" },
        creditBadge: (ok) => ({ background: ok ? "#D1FAE5" : "#FEE2E2", color: ok ? "#065F46" : "#991B1B", padding: "8px 16px", borderRadius: 20, fontSize: 14, fontWeight: 700 }),
        card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "28px", marginBottom: 20 },
        label: { fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 8, display: "block" },
        textarea: { width: "100%", height: 140, border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "12px 14px", fontSize: 15, resize: "vertical", boxSizing: "border-box", outline: "none", fontFamily: "inherit", color: "#111827" },
        btn: (disabled) => ({ width: "100%", marginTop: 14, padding: "14px 0", background: disabled ? "#E5E7EB" : "#111827", color: disabled ? "#9CA3AF" : "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer" }),
        responseCard: { background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 16, padding: "24px", marginBottom: 20 },
        responseText: { color: "#374151", lineHeight: 1.8, fontSize: 15, whiteSpace: "pre-wrap" },
        copyBtn: (copied) => ({ padding: "8px 16px", background: copied ? "#D1FAE5" : "#fff", color: copied ? "#065F46" : "#6B7280", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }),
        noCreditsCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "36px", textAlign: "center", marginTop: 20 },
        footer: { background: "#111827", color: "#9CA3AF", textAlign: "center", padding: "32px 24px", fontSize: 14, marginTop: 80 },
  };

  // ─── NAVIGATION ───────────────────────────────────────────────────────────
  const Nav = () => (
        <nav style={s.nav}>
                <div style={s.navLogo} onClick={() => setPage("home")}>
                          <span>⭐</span>span>
                        <span>ReviewAI</span>span>
                </div>div>
              <div style={s.navLinks}>
                      <button style={s.navLink} onClick={() => setPage("home")}>Domov</button>button>
                      <button style={s.navLink} onClick={() => { setPage("home"); setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 100); }}>Cenník</button>button>
                      <button style={s.navCta} onClick={() => setPage("app")}>Otvoriť aplikáciu →</button>button>
              </div>div>
        </nav>nav>
      );
  
    // ─── HOME PAGE ────────────────────────────────────────────────────────────
    if (page === "home") return (
          <div style={s.body}>
                <Nav />
          
            {/* HERO */}
                <div style={s.hero}>
                        <div style={s.heroTag}>🤖 Poháňané Gemini 2.5 AI</div>div>
                        <h1 style={s.heroTitle}>
                                  Profesionálne odpovede<br />na recenzie za sekundy
                        </h1>h1>
                        <p style={s.heroSub}>
                                  Prestaňte tráviť hodiny písaním odpovedí na Google recenzie. Nechajte AI urobiť prácu za vás — rýchlo, profesionálne, v slovenčine.
                        </p>p>
                        <button style={s.heroCta} onClick={() => setPage("app")}>Vyskúšať zadarmo →</button>button>
                        <button style={s.heroCtaSecondary} onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>Zobraziť cenník</button>button>
                </div>div>
          
            {/* DEMO PREVIEW */}
                <div style={{ maxWidth: 680, margin: "0 auto 60px", padding: "0 24px" }}>
                        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Príklad použitia</div>div>
                                  <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "14px 16px", marginBottom: 16, fontSize: 14, color: "#374151", border: "1px solid #E5E7EB" }}>
                                              💬 <strong>Recenzia zákazníka:</strong>strong> "Skvelý obchod, personál veľmi ochotný, produkt prišiel rýchlo!"
                                  </div>div>
                                  <div style={{ background: "#EEF2FF", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "#374151", border: "1px solid #C7D2FE" }}>
                                              🤖 <strong>AI Odpoveď:</strong>strong> "Ďakujeme za Vašu skvelú recenziu! Teší nás, že ste boli spokojní s naším personálom aj rýchlym doručením. Tešíme sa na Vašu ďalšiu návštevu!"
                                  </div>div>
                        </div>div>
                </div>div>
          
                <div style={s.divider} />
          
            {/* FEATURES */}
                <div style={s.section}>
                        <p style={{ ...s.heroTag, display: "block", textAlign: "center", marginBottom: 16 }}>Funkcie</p>p>
                        <h2 style={s.sectionTitle}>Všetko čo potrebujete</h2>h2>
                        <p style={s.sectionSub}>Jednoduchý nástroj s výkonnými funkciami pre podnikateľov a marketérov.</p>p>
                        <div style={s.featuresGrid}>
                          {FEATURES.map((f, i) => (
                        <div key={i} style={s.featureCard}>
                                      <div style={s.featureIcon}>{f.icon}</div>div>
                                      <div style={s.featureTitle}>{f.title}</div>div>
                                      <div style={s.featureDesc}>{f.desc}</div>div>
                        </div>div>
                      ))}
                        </div>div>
                </div>div>
          
                <div style={s.divider} />
          
            {/* PRICING */}
                <div id="pricing" style={s.section}>
                        <p style={{ ...s.heroTag, display: "block", textAlign: "center", marginBottom: 16 }}>Cenník</p>p>
                        <h2 style={s.sectionTitle}>Jednoduché, transparentné ceny</h2>h2>
                        <p style={s.sectionSub}>Začnite zadarmo. Upgradujte keď budete pripravení.</p>p>
                        <div style={s.plansGrid}>
                          {PLANS.map((plan, i) => (
                        <div key={i} style={s.planCard(plan.highlight)}>
                          {plan.badge && <div style={s.planBadge(plan.color)}>{plan.badge}</div>div>}
                                      <div style={s.planName(plan.highlight)}>{plan.name}</div>div>
                                      <div style={{ margin: "12px 0 0" }}>
                                                      <span style={s.planPrice(plan.highlight)}>{plan.price}</span>span>
                                        {plan.period && <span style={s.planPeriod(plan.highlight)}>{plan.period}</span>span>}
                                      </div>div>
                                      <div style={s.planCredits(plan.highlight)}>⚡ {plan.credits} kreditov</div>div>
                                      <div style={{ marginTop: 8 }}>
                                        {plan.features.map((f, j) => (
                                            <div key={j} style={s.planFeature(plan.highlight)}>
                                                                <span style={{ color: "#10B981", flexShrink: 0 }}>✓</span>span>
                                                                <span>{f}</span>span>
                                            </div>div>
                                          ))}
                                        {plan.missing.map((f, j) => (
                                            <div key={j} style={s.planMissing}>
                                                                <span style={{ flexShrink: 0 }}>✕</span>span>
                                                                <span>{f}</span>span>
                                            </div>div>
                                          ))}
                                      </div>div>
                                      <button style={s.planCta(plan.highlight)} onClick={() => plan.name === "Free" ? setPage("app") : buyCredits()}>
                                        {plan.cta}
                                      </button>button>
                        </div>div>
                      ))}
                        </div>div>
                </div>div>
          
            {/* CTA BANNER */}
                <div style={{ background: "#111827", margin: "0 24px 0", borderRadius: 20, padding: "48px 32px", textAlign: "center", maxWidth: 1052, marginLeft: "auto", marginRight: "auto" }}>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Pripravený začať?</h2>h2>
                        <p style={{ color: "#9CA3AF", fontSize: 16, marginBottom: 28 }}>Pridaj sa k stovkám podnikateľov, ktorí šetria čas s ReviewAI.</p>p>
                        <button style={{ ...s.heroCta, background: "#fff", color: "#111827" }} onClick={() => setPage("app")}>
                                  Začať zadarmo — žiadna kreditná karta
                        </button>button>
                </div>div>
          
            {/* FOOTER */}
                <footer style={s.footer}>
                        <div style={{ marginBottom: 8, fontWeight: 700, color: "#fff" }}>⭐ ReviewAI</div>div>
                        <div>© 2026 ReviewAI. Všetky práva vyhradené.</div>div>
                </footer>footer>
          </div>div>
        );
  
    // ─── APP PAGE ─────────────────────────────────────────────────────────────
    return (
          <div style={{ ...s.body, background: "#F9FAFB" }}>
                <Nav />
                <div style={s.appWrap}>
                        <div style={s.appHeader}>
                                  <div>
                                              <div style={s.appTitle}>Generátor odpovedí</div>div>
                                              <div style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>Vložte recenziu a AI vygeneruje odpoveď</div>div>
                                  </div>div>
                                  <div style={s.creditBadge(credits > 0)}>⚡ {credits} kreditov</div>div>
                        </div>div>
                
                        <div style={s.card}>
                                  <label style={s.label}>Recenzia zákazníka:</label>label>
                                  <textarea
                                                placeholder="Vložte sem recenziu zákazníka..."
                                                value={review}
                                                onChange={e => setReview(e.target.value)}
                                                style={s.textarea}
                                              />
                                  <button onClick={generate} disabled={loading || credits <= 0} style={s.btn(loading || credits <= 0)}>
                                    {loading ? "⏳ Generujem odpoveď..." : "✨ Vygenerovať odpoveď"}
                                  </button>button>
                        </div>div>
                
                  {response && (
                      <div style={s.card}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>✅ Navrhnutá odpoveď:</div>div>
                                                <button onClick={copyToClipboard} style={s.copyBtn(copied)}>
                                                  {copied ? "✓ Skopírované!" : "📋 Kopírovať"}
                                                </button>button>
                                  </div>div>
                                  <div style={s.responseText}>{response}</div>div>
                      </div>div>
                        )}
                
                  {credits <= 0 && (
                      <div style={s.noCreditsCard}>
                                  <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>div>
                                  <h3 style={{ color: "#111827", marginBottom: 8, fontWeight: 700 }}>Minuli sa vám kredity</h3>h3>
                                  <p style={{ color: "#6B7280", marginBottom: 20, fontSize: 15 }}>Kúpte si 50 kreditov za €9.99 a pokračujte</p>p>
                                  <button onClick={buyCredits} style={{ padding: "14px 32px", background: "#111827", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                                                Kúpiť kredity — €9.99
                                  </button>button>
                      </div>div>
                        )}
                </div>div>
          </div>div>
        );
}</span>

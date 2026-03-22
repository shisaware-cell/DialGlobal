import { Activity, Hash, MessageCircle } from "lucide-react";

const stats = [
  {
    label: "Numbers",
    value: 6,
    delta: "+2 this week",
    icon: Hash,
    glow: "radial-gradient(circle at 20% 20%, rgba(232,160,32,0.35), transparent 60%)",
    stripe: "linear-gradient(135deg, #E8A020 0%, #F0B64D 100%)",
  },
  {
    label: "Messages",
    value: 128,
    delta: "+19 today",
    icon: MessageCircle,
    glow: "radial-gradient(circle at 80% 20%, rgba(22,163,74,0.30), transparent 62%)",
    stripe: "linear-gradient(135deg, #16A34A 0%, #4ACE78 100%)",
  },
  {
    label: "Calls",
    value: 34,
    delta: "12 min avg",
    icon: Activity,
    glow: "radial-gradient(circle at 15% 80%, rgba(37,99,235,0.30), transparent 62%)",
    stripe: "linear-gradient(135deg, #2563EB 0%, #4E8BFF 100%)",
  },
] as const;

export default function DashboardStatsTilesV1() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(165deg, #F6F2EA 0%, #F0ECE2 55%, #EFE9DE 100%)",
        padding: "48px 20px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontFamily: "'Manrope', 'Segoe UI', sans-serif",
              fontSize: 12,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: "#7A7062",
              margin: 0,
            }}
          >
            Dashboard Snapshot
          </p>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(26px, 4vw, 42px)",
              lineHeight: 1.03,
              letterSpacing: -0.7,
              margin: "8px 0 0",
              color: "#1F1A14",
            }}
          >
            Stats Tiles Redesign
          </h1>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <article
                key={s.label}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 22,
                  border: "1px solid rgba(70,58,40,0.16)",
                  background: "rgba(255,255,255,0.64)",
                  backdropFilter: "blur(8px)",
                  boxShadow:
                    "0 14px 28px rgba(66,52,28,0.09), inset 0 1px 0 rgba(255,255,255,0.72)",
                  padding: "18px 16px 16px",
                  transform: `translateY(${i % 2 ? 6 : 0}px)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: s.glow,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: -42,
                    top: -42,
                    width: 130,
                    height: 130,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.46)",
                    border: "1px solid rgba(255,255,255,0.56)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(50,38,24,0.14)",
                      background: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <Icon size={14} color="#3B3020" strokeWidth={2.2} />
                    <span
                      style={{
                        fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#322718",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>

                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: "#14A44D",
                      boxShadow: "0 0 0 6px rgba(20,164,77,0.12)",
                    }}
                  />
                </div>

                <div style={{ position: "relative", marginTop: 16 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "'Fraunces', Georgia, serif",
                        fontWeight: 700,
                        letterSpacing: -0.8,
                        lineHeight: 1,
                        color: "#20170F",
                        fontSize: "clamp(34px, 4vw, 44px)",
                      }}
                    >
                      {s.value}
                    </p>
                    <span
                      style={{
                        marginBottom: 6,
                        fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                        fontSize: 12,
                        color: "#786B5A",
                        textTransform: "uppercase",
                        letterSpacing: 1.1,
                      }}
                    >
                      total
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "6px 0 0",
                      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                      fontSize: 12,
                      color: "#4E4334",
                    }}
                  >
                    {s.delta}
                  </p>
                </div>

                <div
                  style={{
                    position: "relative",
                    marginTop: 14,
                    height: 6,
                    borderRadius: 999,
                    background: "rgba(40,30,20,0.10)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, (s.value / 140) * 100 + 28)}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: s.stripe,
                    }}
                  />
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

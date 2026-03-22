import { BarChart3, Hash, MessageCircle } from "lucide-react";

const stats = [
  {
    key: "numbers",
    label: "Active Numbers",
    value: 7,
    trend: "+2 this week",
    icon: Hash,
    bg: "linear-gradient(140deg, #fff7e8 0%, #ffe8bf 100%)",
    ring: "conic-gradient(from 40deg, #d97706 0% 72%, #fef3c7 72% 100%)",
    accent: "#b45309",
  },
  {
    key: "messages",
    label: "Messages",
    value: 184,
    trend: "+21% today",
    icon: MessageCircle,
    bg: "linear-gradient(145deg, #e9fff5 0%, #b8f5da 100%)",
    ring: "conic-gradient(from 15deg, #059669 0% 83%, #d1fae5 83% 100%)",
    accent: "#047857",
  },
  {
    key: "calls",
    label: "Calls",
    value: 36,
    trend: "11 missed",
    icon: BarChart3,
    bg: "linear-gradient(145deg, #eef2ff 0%, #c7d2fe 100%)",
    ring: "conic-gradient(from 20deg, #4f46e5 0% 61%, #e0e7ff 61% 100%)",
    accent: "#3730a3",
  },
] as const;

export default function DashboardStatTilesPreview() {
  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=IBM+Plex+Mono:wght@400;600&display=swap');

        * { box-sizing: border-box; }

        .root {
          min-height: 100vh;
          padding: 32px;
          background:
            radial-gradient(1200px 380px at 15% -5%, rgba(217, 119, 6, .12), transparent 56%),
            radial-gradient(900px 360px at 95% 15%, rgba(79, 70, 229, .14), transparent 52%),
            #f5f3ef;
          font-family: "IBM Plex Mono", monospace;
          color: #1f2937;
        }

        .wrap {
          max-width: 1080px;
          margin: 0 auto;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: .26em;
          text-transform: uppercase;
          opacity: .65;
          margin-bottom: 8px;
        }

        .title {
          font-family: "Syne", sans-serif;
          font-size: clamp(30px, 5vw, 46px);
          line-height: 1;
          letter-spacing: -.04em;
          margin: 0 0 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .tile {
          border-radius: 22px;
          padding: 16px;
          border: 1px solid rgba(17, 24, 39, .08);
          box-shadow: 0 10px 24px rgba(17, 24, 39, .06);
          position: relative;
          overflow: hidden;
          transform: translateY(12px);
          opacity: 0;
          animation: reveal .55s cubic-bezier(.19,.79,.23,.99) forwards;
        }

        .tile:nth-child(2) { animation-delay: 90ms; }
        .tile:nth-child(3) { animation-delay: 160ms; }

        .tile::after {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          right: -48px;
          top: -48px;
          border-radius: 999px;
          background: rgba(255,255,255,.48);
          filter: blur(1px);
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }

        .label {
          font-size: 11px;
          letter-spacing: .14em;
          text-transform: uppercase;
          opacity: .74;
        }

        .badge {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,.7);
          border: 1px solid rgba(17,24,39,.1);
          backdrop-filter: blur(8px);
        }

        .bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .value {
          font-family: "Syne", sans-serif;
          font-weight: 800;
          font-size: clamp(32px, 5vw, 54px);
          line-height: .9;
          letter-spacing: -.05em;
          margin: 0;
        }

        .trend {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: .04em;
          opacity: .82;
        }

        .ring {
          width: 66px;
          aspect-ratio: 1;
          border-radius: 999px;
          position: relative;
          flex-shrink: 0;
        }

        .ring::before {
          content: "";
          position: absolute;
          inset: 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(17,24,39,.08);
        }

        @keyframes reveal {
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 860px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="wrap">
        <div className="eyebrow">Dashboard Preview</div>
        <h1 className="title">Top Stat Tiles Redesign</h1>

        <div className="grid">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.key} className="tile" style={{ background: item.bg }}>
                <div className="top">
                  <div className="label">{item.label}</div>
                  <div className="badge">
                    <Icon size={18} color={item.accent} strokeWidth={2.2} />
                  </div>
                </div>

                <div className="bottom">
                  <div>
                    <p className="value" style={{ color: item.accent }}>
                      {item.value.toLocaleString()}
                    </p>
                    <div className="trend">{item.trend}</div>
                  </div>

                  <div className="ring" style={{ background: item.ring }} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

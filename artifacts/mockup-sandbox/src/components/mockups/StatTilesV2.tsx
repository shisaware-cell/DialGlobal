/**
 * PREVIEW ONLY — not applied to production code.
 * Dashboard stat tiles redesign V2 for DialGlobal.
 * Aesthetic: Refined dark-glass utility cards with monochromatic
 * accents, micro-bar sparklines, and crisp tabular numerals.
 */

const BARS = {
  numbers:  [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 1.0],
  messages: [0.6, 0.4, 0.9, 0.5, 0.7, 0.8, 0.95],
  calls:    [0.4, 0.6, 0.3, 0.8, 0.5, 0.6, 0.7],
};

const TILES = [
  {
    id: "numbers",
    label: "Numbers",
    value: "7",
    sub: "active",
    delta: "+2",
    deltaLabel: "this week",
    positive: true,
    accent: "#E8A020",
    accentDim: "rgba(232,160,32,0.12)",
    accentGlow: "rgba(232,160,32,0.22)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
        <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
      </svg>
    ),
  },
  {
    id: "messages",
    label: "Messages",
    value: "184",
    sub: "received",
    delta: "+21%",
    deltaLabel: "today",
    positive: true,
    accent: "#16A34A",
    accentDim: "rgba(22,163,74,0.10)",
    accentGlow: "rgba(22,163,74,0.20)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: "calls",
    label: "Calls",
    value: "36",
    sub: "total",
    delta: "11",
    deltaLabel: "missed",
    positive: false,
    accent: "#2563EB",
    accentDim: "rgba(37,99,235,0.10)",
    accentGlow: "rgba(37,99,235,0.20)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.85-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
      </svg>
    ),
  },
] as const;

export default function StatTilesV2() {
  return (
    <div className="preview-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .preview-root {
          min-height: 100vh;
          background: #0E0C0A;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          font-family: 'Bricolage Grotesque', sans-serif;
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: rgba(255,255,255,.35);
          margin-bottom: 18px;
          align-self: flex-start;
          max-width: 640px;
          width: 100%;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
          max-width: 640px;
        }

        /* ---------- TILE ---------- */
        .tile {
          position: relative;
          border-radius: 20px;
          padding: 18px 18px 16px;
          background: #181512;
          border: 1px solid rgba(255,255,255,.07);
          overflow: hidden;
          cursor: default;

          opacity: 0;
          transform: translateY(16px);
          animation: rise .5s cubic-bezier(.22,.87,.24,1) forwards;
        }
        .tile:nth-child(2) { animation-delay: 80ms; }
        .tile:nth-child(3) { animation-delay: 160ms; }

        .tile::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0;
          transition: opacity .25s;
          pointer-events: none;
        }
        .tile:hover::before { opacity: 1; }

        /* glow blob */
        .tile-glow {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          right: -40px;
          top: -40px;
          filter: blur(40px);
          opacity: .45;
          pointer-events: none;
          transition: opacity .3s;
        }
        .tile:hover .tile-glow { opacity: .7; }

        /* ---------- TOP ROW ---------- */
        .tile-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .tile-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(255,255,255,.45);
        }

        .tile-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
          transition: background .2s;
          flex-shrink: 0;
        }
        .tile:hover .tile-icon {
          background: rgba(255,255,255,.08);
        }

        /* ---------- VALUE ---------- */
        .tile-value-row {
          display: flex;
          align-items: baseline;
          gap: 7px;
          position: relative;
          z-index: 1;
          margin-bottom: 14px;
        }

        .tile-value {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          font-size: 44px;
          line-height: .9;
          letter-spacing: -.04em;
          color: #fff;
          font-variant-numeric: tabular-nums;
        }

        .tile-sub {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(255,255,255,.3);
          margin-bottom: 2px;
        }

        /* ---------- SPARKLINE ---------- */
        .sparkline {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 28px;
          position: relative;
          z-index: 1;
          margin-bottom: 12px;
        }

        .spark-bar {
          flex: 1;
          border-radius: 3px 3px 2px 2px;
          background: rgba(255,255,255,.1);
          transition: background .2s;
          transform-origin: bottom;
          animation: grow .45s cubic-bezier(.19,.87,.23,1) both;
        }
        .tile:hover .spark-bar { background: rgba(255,255,255,.15); }

        /* last bar is the "active" one */
        .spark-bar:last-child {
          border-radius: 4px 4px 2px 2px;
        }

        /* ---------- DELTA CHIP ---------- */
        .tile-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,.05);
          padding-top: 10px;
        }

        .delta-chip {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          border-radius: 6px;
          padding: 2px 7px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .04em;
        }

        .delta-txt {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,.3);
          letter-spacing: .02em;
        }

        /* ---------- DIVIDER label at bottom ---------- */
        .context-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: .15em;
          text-transform: uppercase;
          color: rgba(255,255,255,.18);
          margin-top: 20px;
          max-width: 640px;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .context-label::before,
        .context-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,.07);
        }

        @keyframes rise {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      <div className="section-label">Dashboard · Activity Overview</div>

      <div className="grid">
        {TILES.map((tile, ti) => {
          const bars = BARS[tile.id];
          return (
            <div className="tile" key={tile.id} style={{ ['--delay' as string]: `${ti * 80}ms` }}>
              {/* glow blob */}
              <div className="tile-glow" style={{ background: tile.accent }} />

              {/* top row */}
              <div className="tile-top">
                <span className="tile-label">{tile.label}</span>
                <div className="tile-icon" style={{ color: tile.accent }}>
                  {tile.icon}
                </div>
              </div>

              {/* value */}
              <div className="tile-value-row">
                <span className="tile-value">{tile.value}</span>
                <span className="tile-sub">{tile.sub}</span>
              </div>

              {/* sparkline */}
              <div className="sparkline">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="spark-bar"
                    style={{
                      height: `${h * 100}%`,
                      background: i === bars.length - 1
                        ? tile.accent
                        : `rgba(255,255,255,0.09)`,
                      animationDelay: `${ti * 80 + i * 30}ms`,
                      boxShadow: i === bars.length - 1
                        ? `0 0 8px ${tile.accentGlow}`
                        : 'none',
                    }}
                  />
                ))}
              </div>

              {/* footer delta */}
              <div className="tile-footer">
                <span
                  className="delta-chip"
                  style={{
                    background: tile.positive ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.12)',
                    color: tile.positive ? '#4ade80' : '#f87171',
                  }}
                >
                  {tile.positive ? '↑' : '↓'} {tile.delta}
                </span>
                <span className="delta-txt">{tile.deltaLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="context-label">real-time · updated just now</div>
    </div>
  );
}

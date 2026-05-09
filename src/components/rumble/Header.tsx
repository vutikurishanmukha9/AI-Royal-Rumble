import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/leaderboard", label: "Past Rumbles" },
];

export function Header({ onDark = false }: { onDark?: boolean }) {
  useLocation();
  const txt = onDark ? "text-on-dark-muted" : "text-ink-muted";
  const ink = onDark ? "text-on-dark" : "text-ink";
  const border = onDark ? "border-white/10" : "border-hairline";
  const bg = onDark ? "bg-canvas-deeper/80" : "bg-canvas/85";
  return (
    <header className={`sticky top-0 z-50 border-b ${border} ${bg} backdrop-blur-md`}>
      <div className="flex h-16 items-center justify-between px-6 lg:px-10">
        <Link to="/" className={`ui-nav ${ink}`} style={{ letterSpacing: "3px" }}>
          AI · Royal Rumble
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map(n => (
            <Link key={n.to} to={n.to} className={`ui-nav ${txt} hover:${ink} transition-colors`}>{n.label}</Link>
          ))}
          <Link to="/jam" className="ui-button inline-flex h-10 items-center rounded-full bg-ink px-5 text-on-dark hover:bg-ink-charcoal transition-colors">
            Start →
          </Link>
        </nav>
      </div>
    </header>
  );
}

import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/", label: "Arena" },
  { to: "/jam", label: "Jam Round" },
  { to: "/debate", label: "Group Discussion" },
  { to: "/leaderboard", label: "Rankings" },
];

export function Header() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-7 w-7 place-items-center bg-graphite text-ivory">
            <span className="font-display text-[13px] leading-none">R</span>
          </div>
          <span className="label-cap text-graphite">AI · Royal Rumble</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`label-cap px-3 py-2 transition-colors ${
                  active ? "text-graphite" : "text-steel hover:text-graphite"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <span className="label-cap hidden text-steel md:inline">SEASON 02 · LIVE</span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-crimson" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
          </span>
        </div>
      </div>
    </header>
  );
}
const ITEMS = [
  "ATLAS-4 takes round 14",
  "VEGA-9 interruption × 7",
  "KAIRO climbs to #2",
  "Topic — 'Is consciousness computable?'",
  "Audience peak · 41,208",
  "NOOR debut win",
  "ORION-X locks dominance meter",
  "SABLE ousted in semi-finals",
];

export function Ticker() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="ticker-mask overflow-hidden border-y border-border bg-graphite text-ivory">
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {loop.map((it, i) => (
          <span key={i} className="label-cap mx-8 inline-flex items-center gap-3 text-ivory/80">
            <span className="h-1 w-1 rounded-full bg-champagne" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
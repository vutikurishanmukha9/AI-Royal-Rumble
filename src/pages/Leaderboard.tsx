import { motion } from "framer-motion";
import { Header } from "@/components/rumble/Header";
import { Ticker } from "@/components/rumble/Ticker";
import { Footer } from "@/components/rumble/Footer";
import { MODELS } from "@/data/models";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Leaderboard() {
  const ranked = [...MODELS].sort((a, b) => b.elo - a.elo);
  const top = ranked[0];
  const max = ranked[0].elo;
  const min = ranked[ranked.length - 1].elo - 50;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header */}
      <section className="grid grid-cols-12 border-b border-border">
        <div className="col-span-12 px-6 py-16 md:col-span-7 md:px-10 md:py-24">
          <div className="label-cap text-steel">Live Rankings · Season 02</div>
          <h1 className="font-display mt-8 text-7xl leading-[0.85] text-graphite md:text-[9rem]">
            The<br/>
            <span className="font-serif-edit italic text-champagne-deep">Standings</span>
          </h1>
          <p className="font-serif-edit mt-8 max-w-xl text-2xl italic leading-snug text-graphite-soft">
            ELO recomputed after every round. No grace, no rounding, no mercy.
          </p>
        </div>
        <aside className="col-span-12 flex flex-col justify-end border-l border-border bg-graphite px-6 py-12 text-ivory md:col-span-5 md:px-10">
          <div className="label-cap text-ivory/60">Reigning Champion</div>
          <div className="font-display mt-4 text-7xl leading-none">{top.name}</div>
          <div className="font-serif-edit mt-3 text-2xl italic text-ivory/70">"{top.tagline}"</div>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-ivory/10 pt-6">
            <Stat k="ELO" v={top.elo.toString()} />
            <Stat k="Wins" v={top.wins.toString()} />
            <Stat k="Streak" v="11" />
          </div>
        </aside>
      </section>

      <Ticker />

      {/* Table */}
      <section className="px-6 py-16 lg:px-10">
        <div className="grid grid-cols-12 border-b border-border pb-3 label-cap text-steel">
          <div className="col-span-1">Pos</div>
          <div className="col-span-3">Model</div>
          <div className="col-span-3 hidden md:block">Style</div>
          <div className="col-span-2 text-right">ELO</div>
          <div className="col-span-1 text-right">W</div>
          <div className="col-span-1 text-right">L</div>
          <div className="col-span-1 hidden text-right md:block">Form</div>
        </div>

        {ranked.map((m, i) => {
          const pct = ((m.elo - min) / (max - min)) * 100;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
              className="group relative grid grid-cols-12 items-center border-b border-border py-6 transition-colors hover:bg-ivory-deep"
            >
              <div className="col-span-1 font-mono-edit text-2xl text-graphite">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-3 flex items-center gap-3">
                <span className="label-cap bg-graphite px-2 py-1 text-ivory">{m.short}</span>
                <div>
                  <div className="font-display text-2xl text-graphite">{m.name}</div>
                  <div className="font-mono-edit text-[11px] text-steel">{m.org}</div>
                </div>
              </div>
              <div className="col-span-3 hidden font-serif-edit text-lg italic text-graphite-soft md:block">
                {m.style}
              </div>
              <div className="col-span-2 text-right">
                <div className="font-mono-edit text-2xl tabular-nums text-graphite">{m.elo}</div>
                <div className="relative mx-auto mt-2 h-px w-full bg-border">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.04, ease: EASE }}
                    className={`absolute right-0 top-0 h-px ${i === 0 ? "bg-crimson" : "bg-graphite"}`}
                  />
                </div>
              </div>
              <div className="col-span-1 text-right font-mono-edit text-graphite">{m.wins}</div>
              <div className="col-span-1 text-right font-mono-edit text-steel">{m.losses}</div>
              <div className="col-span-1 hidden justify-end gap-1 md:flex">
                {Array.from({ length: 5 }).map((_, k) => (
                  <span
                    key={k}
                    className={`h-3 w-1.5 ${
                      (i + k) % 4 === 0 ? "bg-crimson" : (i + k) % 3 === 0 ? "bg-steel-light" : "bg-graphite"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Editorial pull quote */}
      <section className="border-y border-border bg-ivory-deep px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="label-cap text-steel">From the Editor</div>
          <p className="font-serif-edit mt-8 text-balance text-4xl italic leading-tight text-graphite md:text-6xl">
            "The room is no longer the smartest thing in the room. The room is the show."
          </p>
          <div className="label-cap mt-8 text-steel">— Issue 014, Standfirst</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="label-cap text-ivory/60">{k}</div>
      <div className="font-mono-edit mt-1 text-2xl text-ivory">{v}</div>
    </div>
  );
}
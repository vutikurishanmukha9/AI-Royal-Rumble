import { Header } from "@/components/rumble/Header";
import { Footer } from "@/components/rumble/Footer";
import { IdentityStripe } from "@/components/rumble/IdentityStripe";
import { MODELS } from "@/data/models";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const sorted = [...MODELS].sort((a,b) => b.elo - a.elo);
  const top = sorted[0].elo;

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
          <div className="ui-label text-ink-muted">Season 01 · Standings</div>
          <h1 className="font-display mt-4 text-ink" style={{ fontSize:"clamp(56px, 8vw, 96px)", lineHeight:.95, letterSpacing:"-0.04em" }}>
            The Rankings.
          </h1>
          <p className="mt-6 max-w-xl text-ink-charcoal" style={{ fontSize: 18 }}>
            ELO is earned the same way it's lost — in front of an audience that doesn't blink.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="grid grid-cols-12 gap-4 border-b border-hairline pb-3 ui-label text-ink-muted">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Model</div>
          <div className="col-span-4">Form</div>
          <div className="col-span-1 text-right">W</div>
          <div className="col-span-1 text-right">L</div>
          <div className="col-span-1 text-right">ELO</div>
        </div>

        {sorted.map((m, i) => (
          <motion.div key={m.id}
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.45, delay:i*.04, ease:[0.22,1,0.36,1] }}
            className="grid grid-cols-12 items-center gap-4 border-b border-hairline py-6">
            <div className="col-span-1 font-mono-ui ui-num text-ink" style={{ fontSize: 22 }}>{String(i+1).padStart(2,"0")}</div>
            <div className="col-span-4">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5" style={{ background: m.tint }} />
                <span className="font-display text-ink" style={{ fontSize: 22 }}>{m.name}</span>
              </div>
              <div className="ui-label text-ink-muted mt-1">{m.org} · {m.tagline}</div>
              <IdentityStripe colors={m.stripe} className="mt-2 max-w-[260px]" />
            </div>
            <div className="col-span-4">
              <div className="h-[8px] w-full bg-hairline-soft overflow-hidden rounded-full">
                <motion.div initial={{ width:0 }} whileInView={{ width:`${(m.elo/top)*100}%` }} viewport={{ once:true }} transition={{ duration:.9, ease:[0.22,1,0.36,1] }}
                  className="h-full" style={{ background: i === 0 ? "hsl(var(--combat-red))" : m.tint }} />
              </div>
            </div>
            <div className="col-span-1 text-right font-mono-ui ui-num text-ink">{m.wins}</div>
            <div className="col-span-1 text-right font-mono-ui ui-num text-ink-muted">{m.losses}</div>
            <div className="col-span-1 text-right font-mono-ui ui-num text-ink" style={{ fontSize: 18 }}>{m.elo}</div>
          </motion.div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

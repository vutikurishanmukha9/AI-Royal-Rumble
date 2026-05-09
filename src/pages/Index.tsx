import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/rumble/Header";
import { Footer } from "@/components/rumble/Footer";
import { IdentityStripe } from "@/components/rumble/IdentityStripe";
import { MODELS } from "@/data/models";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Index() {
  const [task, setTask] = useState("");
  return (
    <div className="min-h-screen bg-canvas">
      <Header onDark />

      {/* HERO — full bleed near-black */}
      <section className="relative overflow-hidden bg-canvas-deeper" style={{ minHeight: "calc(100vh - 64px)" }}>
        <div className="orb h-[420px] w-[420px] bg-orb-peach opacity-[0.18] -top-20 -left-10" style={{ animation: "orb-drift 14s ease-in-out infinite" }} />
        <div className="orb h-[300px] w-[300px] bg-orb-sky opacity-[0.10] bottom-10 right-20" style={{ animation: "orb-drift 18s ease-in-out infinite reverse" }} />

        <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-[1400px] flex-col justify-center px-6 py-20 lg:px-12">
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, ease:EASE }} className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-combat animate-pulse-dot" />
            <span className="ui-label text-on-dark-muted">Season 01 · Live Now</span>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, ease:EASE }}
            className="font-display mt-8 text-on-dark"
            style={{ fontSize: "clamp(56px, 9vw, 128px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}>
            Every AI Claims<br/>Superiority.
          </motion.h1>
          <motion.h2 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, ease:EASE, delay:.12 }}
            className="font-display mt-2 text-on-dark/90"
            style={{ fontSize: "clamp(40px, 6.5vw, 96px)", lineHeight: 0.9, letterSpacing: "-0.03em", paddingLeft: "max(20px, 4vw)" }}>
            <em className="not-italic">Tonight</em> They Prove It.
          </motion.h2>

          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3, duration:.6 }} className="mt-10 max-w-xl text-on-dark-muted text-balance" style={{ fontSize: 18 }}>
            Enter your task. Watch them fight. You decide.
          </motion.p>

          {/* task pill + CTA */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4, duration:.6, ease:EASE }}
            className="mt-8 flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
            <div className="flex h-14 flex-1 items-center rounded-full border border-hairline bg-canvas px-6 focus-within:border-2 focus-within:border-combat transition-colors">
              <input
                value={task} onChange={e=>setTask(e.target.value)}
                placeholder="WHAT DO YOU NEED HELP WITH?"
                className="ui-button h-full w-full bg-transparent text-ink placeholder:text-ink-stone outline-none"
                style={{ fontSize: 13 }}
              />
            </div>
            <Link to="/jam" className="ui-button inline-flex h-14 items-center justify-center rounded-full bg-ink px-7 text-on-dark hover:bg-ink-charcoal transition-colors">
              Start the Rumble →
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.6, duration:.7 }} className="mt-10 ui-label text-on-dark-muted">
            {MODELS.map(m => m.name).join(" · ")}
          </motion.div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="border-y border-hairline bg-canvas">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-3">
          {[
            ["12,847", "Rumbles Fought"],
            ["9", "AIs in the Arena"],
            ["3.2M", "Votes Cast"],
          ].map(([n,l],i) => (
            <div key={l} className={`px-8 py-14 ${i<2?"md:border-r border-hairline":""} ${i>0?"border-t md:border-t-0":""}`}>
              <div className="font-mono-ui text-ink ui-num" style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>{n}</div>
              <div className="ui-label text-ink-muted mt-3">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — alternating bands */}
      {[
        { n:"01", t:"Enter Your Task", c:"Type what you need. A draft, a strategy, a decision. The arena turns it into a contest.", dark:false },
        { n:"02", t:"The Jam Round",   c:"Each model gets sixty seconds to define itself, name its weapons, and stake a claim.", dark:true },
        { n:"03", t:"The Group Discussion", c:"Up to four models share one stage. Interruptions tracked. Dominance metered. You watch the truth surface.", dark:false },
      ].map((s, i) => (
        <section key={s.n} className={`relative ${s.dark ? "bg-canvas-deeper text-on-dark" : "bg-canvas text-ink"}`}>
          <IdentityStripe colors={["#5A6472","#2A2826","#8B1E2D"]} />
          <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-8 px-6 py-28 lg:px-12">
            <div className="col-span-12 md:col-span-5">
              <div className={`ui-label ${s.dark?"text-on-dark-muted":"text-ink-muted"}`}>{s.n} — Step</div>
              <h3 className="font-display mt-4" style={{ fontSize: 44, lineHeight: 1.1, letterSpacing: "-0.03em" }}>{s.t}</h3>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <p className={`text-balance ${s.dark?"text-on-dark/80":"text-ink-charcoal"}`} style={{ fontSize: 19, lineHeight: 1.6 }}>{s.c}</p>
            </div>
          </div>
        </section>
      ))}

      {/* AI ROSTER */}
      <section className="bg-canvas border-t border-hairline">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
          <div className="flex items-end justify-between">
            <div>
              <div className="ui-label text-ink-muted">The Competitors</div>
              <h2 className="font-display mt-3" style={{ fontSize: 64, lineHeight: 1, letterSpacing:"-0.04em" }}>Nine in the arena.</h2>
            </div>
            <Link to="/leaderboard" className="ui-nav hidden text-ink-muted hover:text-combat md:inline">Full rankings →</Link>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODELS.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, amount:.2 }}
                transition={{ duration:.6, delay:i*.04, ease:EASE }}
                className="border border-hairline rounded-md p-7"
                style={{ background: m.tint }}
              >
                <div className="flex items-start justify-between">
                  <div className="ui-label text-ink-muted">№ {String(i+1).padStart(2,"0")}</div>
                  <div className="ui-label text-ink-muted">{m.org}</div>
                </div>
                <h3 className="font-display mt-8 text-ink" style={{ fontSize: 28, lineHeight: 1.1 }}>{m.name}</h3>
                <IdentityStripe colors={m.stripe} className="mt-3" />
                <p className="mt-3 text-ink-charcoal italic" style={{ fontSize: 14 }}>{m.tagline}</p>
                <div className="mt-8 flex items-end justify-between border-t border-ink/10 pt-4">
                  <div>
                    <div className="ui-label text-ink-muted">ELO</div>
                    <div className="font-mono-ui ui-num text-ink mt-1" style={{ fontSize: 22 }}>{m.elo}</div>
                  </div>
                  <div className="text-right">
                    <div className="ui-label text-ink-muted">W · L</div>
                    <div className="font-mono-ui ui-num text-ink mt-1" style={{ fontSize: 22 }}>{m.wins}·{m.losses}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER PANEL */}
      <section className="bg-canvas-deeper">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center px-6 py-24 text-center lg:px-12">
          <p className="font-display text-on-dark text-balance" style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Your Task. Their Battle.<br/><em className="not-italic">Your Vote.</em>
          </p>
          <Link to="/jam" className="ui-button mt-10 inline-flex h-12 items-center rounded-full bg-combat px-7 text-on-dark hover:bg-combat/85 transition-colors">
            Enter the Arena →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

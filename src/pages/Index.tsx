import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/rumble/Header";
import { Ticker } from "@/components/rumble/Ticker";
import { ModelCard } from "@/components/rumble/ModelCard";
import { Footer } from "@/components/rumble/Footer";
import { MODELS } from "@/data/models";

const fade = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid grid-cols-12 gap-0">
          {/* left rail */}
          <aside className="col-span-12 hidden flex-col justify-between border-r border-border px-6 py-10 md:col-span-2 md:flex">
            <div className="space-y-1">
              <div className="label-cap text-steel">Issue</div>
              <div className="font-mono-edit text-graphite">№ 014</div>
            </div>
            <div className="space-y-1">
              <div className="label-cap text-steel">Filed</div>
              <div className="font-mono-edit text-graphite">08·V·MMXXVI</div>
            </div>
            <div className="space-y-1">
              <div className="label-cap text-steel">Tonight</div>
              <div className="font-serif-edit text-2xl italic leading-tight text-graphite">
                Atlas-4<br/>vs<br/>Vega-9
              </div>
            </div>
          </aside>

          {/* center */}
          <div className="col-span-12 px-6 py-16 md:col-span-7 md:px-10 md:py-24">
            <motion.div {...fade} className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-crimson" />
              <span className="label-cap text-graphite">On Air · Lane 04</span>
            </motion.div>

            <motion.h1
              {...fade}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="font-display mt-8 text-[15vw] leading-[0.82] text-graphite md:text-[10rem]"
            >
              ROYAL<br/>
              <span className="font-serif-edit italic text-champagne-deep">Rumble</span>
            </motion.h1>

            <motion.p {...fade} transition={{ delay: 0.2, duration: 1 }} className="mt-10 max-w-xl text-balance font-serif-edit text-2xl leading-snug text-graphite-soft md:text-3xl">
              Six artificial minds. One arena. Sixty seconds to make the case &mdash; then a discussion that will not stay polite.
            </motion.p>

            <motion.div {...fade} transition={{ delay: 0.35, duration: 1 }} className="mt-12 flex flex-wrap gap-3">
              <Link to="/jam" className="group inline-flex items-center gap-3 bg-graphite px-6 py-4 text-ivory transition-colors hover:bg-graphite-soft">
                <span className="label-cap">Enter Jam Round</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link to="/debate" className="group inline-flex items-center gap-3 border border-graphite px-6 py-4 text-graphite transition-colors hover:bg-graphite hover:text-ivory">
                <span className="label-cap">Watch the Discussion</span>
              </Link>
            </motion.div>
          </div>

          {/* right rail – tale of the tape */}
          <aside className="col-span-12 border-l border-border bg-ivory-deep px-6 py-10 md:col-span-3">
            <div className="label-cap text-steel">Tale of the Tape</div>
            <div className="mt-6 grid grid-cols-2 gap-x-4">
              <div>
                <div className="font-display text-3xl text-graphite">ATL</div>
                <div className="label-cap mt-1 text-steel">Northwind</div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl text-crimson">VEG</div>
                <div className="label-cap mt-1 text-steel">Helios</div>
              </div>
            </div>
            <dl className="mt-8 space-y-4">
              {[
                ["ELO", "2841", "2756"],
                ["Wins", "142", "119"],
                ["Avg WPM", "412", "389"],
                ["Interrupts", "11", "47"],
              ].map(([k, a, b]) => (
                <div key={k} className="grid grid-cols-3 items-center border-t border-border pt-3 text-sm">
                  <span className="font-mono-edit text-graphite">{a}</span>
                  <span className="label-cap text-center text-steel">{k}</span>
                  <span className="font-mono-edit text-right text-graphite">{b}</span>
                </div>
              ))}
            </dl>
            <div className="mt-10 border-t border-border pt-4">
              <div className="label-cap text-steel">Topic Tonight</div>
              <div className="mt-3 font-serif-edit text-xl italic leading-tight text-graphite">
                "Is consciousness a question, or only a hallucination of language?"
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Ticker />

      {/* MODES */}
      <section className="border-b border-border px-6 py-24 lg:px-10">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="label-cap text-steel">The Two Formats</div>
            <h2 className="font-display mt-6 text-6xl leading-[0.85] text-graphite md:text-7xl">
              Sixty<br/>seconds.<br/>
              <span className="font-serif-edit italic text-champagne-deep">Then chaos.</span>
            </h2>
          </div>

          <div className="col-span-12 grid gap-6 md:col-span-8 md:grid-cols-2">
            {[
              {
                tag: "Format 01",
                title: "Jam Round",
                copy: "Each model gets exactly 60 seconds to define itself, name its weapons, and declare why it should still be standing in the morning.",
                points: ["60s opening monologue", "Self-comparison vs rivals", "Audience live vote", "Broadcast countdown"],
              },
              {
                tag: "Format 02",
                title: "Group Discussion",
                copy: "Up to four models share one stage. Interruptions are tracked. Dominance is metered. The transcript scrolls in real time.",
                points: ["Multi-model debate", "Interruption physics", "Dominance meter", "Live transcript feed"],
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col border border-border bg-card p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="label-cap text-steel">{f.tag}</span>
                  <span className="font-mono-edit text-xs text-steel">PROTOCOL</span>
                </div>
                <h3 className="font-display mt-10 text-5xl leading-none text-graphite">{f.title}</h3>
                <p className="mt-6 font-serif-edit text-xl italic text-graphite-soft">{f.copy}</p>
                <ul className="mt-8 space-y-2 border-t border-border pt-4">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-graphite-soft">
                      <span className="h-px w-4 bg-champagne-deep" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to={i === 0 ? "/jam" : "/debate"}
                  className="label-cap mt-10 inline-flex items-center gap-2 text-graphite hover:text-crimson"
                >
                  Enter <span>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROSTER */}
      <section className="px-6 py-24 lg:px-10">
        <div className="flex items-end justify-between border-b border-border pb-8">
          <div>
            <div className="label-cap text-steel">The Roster · Season 02</div>
            <h2 className="font-display mt-4 text-6xl leading-none text-graphite md:text-7xl">
              Six contenders.
            </h2>
          </div>
          <Link to="/leaderboard" className="label-cap hidden text-graphite hover:text-crimson md:inline">
            Full rankings →
          </Link>
        </div>

        <div className="mt-10 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((m, i) => (
            <ModelCard key={m.id} m={m} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

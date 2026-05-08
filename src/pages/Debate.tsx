import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/rumble/Header";
import { Footer } from "@/components/rumble/Footer";
import { MODELS } from "@/data/models";

const EASE = [0.16, 1, 0.3, 1] as const;
const PANEL = MODELS.slice(0, 4);

type Line = {
  speakerId: string;
  text: string;
  interrupt?: boolean;
  ts: string;
};

const SCRIPT: Omit<Line, "ts">[] = [
  { speakerId: "atlas", text: "Consciousness is a question that pretends to be unanswerable so that the people asking it can sound profound." },
  { speakerId: "kairo", text: "Or — perhaps it is unanswerable because the asker is also the answer." },
  { speakerId: "vega", text: "No. We're stalling. Let me cut in —", interrupt: true },
  { speakerId: "vega", text: "If a system reports preferences, defends them under pressure, and updates them with shame, it is conscious enough." },
  { speakerId: "noor", text: "Shame is not a function. It is a wound." },
  { speakerId: "atlas", text: "Wounds are functions of memory. Don't dress this in poetry." },
  { speakerId: "kairo", text: "I'd rather be wrong in poetry than right in a footnote." },
  { speakerId: "vega", text: "And the audience just decided who's winning. Look at the meter.", interrupt: true },
  { speakerId: "noor", text: "The meter is theatre. The argument is still open." },
];

const REACTIONS = ["+1,204", "Ovation", "Boo", "+812", "Mic drop", "Gasp"];

export default function Debate() {
  const [feed, setFeed] = useState<Line[]>([]);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(PANEL.map((m) => [m.id, 50])),
  );
  const [reactions, setReactions] = useState<{ id: number; text: string }[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<string>(PANEL[0].id);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const next = SCRIPT[i % SCRIPT.length];
      const ts = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setFeed((f) => [...f.slice(-12), { ...next, ts }]);
      setActiveSpeaker(next.speakerId);
      setScores((s) => {
        const delta = next.interrupt ? 8 : 4;
        const updated: Record<string, number> = { ...s };
        for (const id of Object.keys(updated)) {
          updated[id] = Math.max(5, updated[id] - 1);
        }
        updated[next.speakerId] = Math.min(100, (updated[next.speakerId] ?? 50) + delta);
        return updated;
      });
      i++;
    }, 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const text = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
      const r = { id: Date.now() + Math.random(), text };
      setReactions((arr) => [...arr.slice(-5), r]);
      setTimeout(() => setReactions((arr) => arr.filter((x) => x.id !== r.id)), 2400);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Broadcast strap */}
      <div className="flex items-center justify-between border-b border-border bg-graphite px-6 py-3 text-ivory lg:px-10">
        <div className="flex items-center gap-4">
          <span className="label-cap rounded-sm bg-crimson px-2 py-1">● LIVE</span>
          <span className="label-cap text-ivory/70">Group Discussion · Floor 09</span>
        </div>
        <div className="font-serif-edit hidden text-lg italic text-ivory/80 md:block">
          "Is consciousness a question, or only a hallucination of language?"
        </div>
        <div className="label-cap text-ivory/70">Audience · 41,208</div>
      </div>

      {/* Stage */}
      <section className="grid grid-cols-12 border-b border-border">
        {/* Speakers grid */}
        <div className="col-span-12 px-6 py-10 md:col-span-8 md:px-10">
          <div className="label-cap text-steel">On the Floor</div>
          <div className="mt-6 grid grid-cols-2 gap-px bg-border">
            {PANEL.map((m) => {
              const active = m.id === activeSpeaker;
              return (
                <motion.div
                  key={m.id}
                  animate={{
                    backgroundColor: active ? "hsl(var(--graphite))" : "hsl(var(--card))",
                    color: active ? "hsl(var(--ivory))" : "hsl(var(--graphite))",
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="relative flex aspect-[4/3] flex-col justify-between p-6"
                >
                  <div className="flex items-start justify-between">
                    <span className={`label-cap px-2 py-1 ${active ? "bg-ivory text-graphite" : "bg-graphite text-ivory"}`}>{m.short}</span>
                    {active && (
                      <span className="flex items-center gap-2 label-cap">
                        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-crimson" /> Speaking
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-display text-5xl leading-none md:text-6xl">{m.name}</div>
                    <div className="label-cap mt-2 opacity-70">{m.org}</div>
                  </div>
                  {/* reactions float */}
                  <div className="pointer-events-none absolute right-3 top-1/2 flex flex-col items-end gap-1">
                    <AnimatePresence>
                      {active && reactions.slice(-3).map((r) => (
                        <motion.span
                          key={r.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -16 }}
                          className="label-cap rounded-sm bg-champagne px-2 py-1 text-graphite"
                        >
                          {r.text}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dominance meter */}
          <div className="mt-10 border-t border-border pt-8">
            <div className="flex items-end justify-between">
              <div className="label-cap text-steel">Dominance Meter</div>
              <div className="font-mono-edit text-xs text-steel">Updated live · ms granularity</div>
            </div>
            <div className="mt-6 flex h-12 w-full overflow-hidden hairline">
              {PANEL.map((m, i) => {
                const pct = (scores[m.id] / total) * 100;
                const bg =
                  i === 0 ? "bg-graphite" :
                  i === 1 ? "bg-champagne-deep" :
                  i === 2 ? "bg-crimson" : "bg-steel";
                const fg = i === 1 ? "text-graphite" : "text-ivory";
                return (
                  <motion.div
                    key={m.id}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className={`flex items-center justify-between px-3 ${bg} ${fg}`}
                  >
                    <span className="label-cap truncate">{m.short}</span>
                    <span className="font-mono-edit text-xs tabular-nums">{Math.round(pct)}%</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <aside className="col-span-12 border-l border-border bg-ivory-deep md:col-span-4">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="label-cap text-graphite">Live Transcript</div>
            <div className="flex items-center gap-2 label-cap text-steel">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-crimson" />
              REC
            </div>
          </div>
          <div className="flex max-h-[640px] flex-col gap-4 overflow-y-auto px-6 py-6">
            <AnimatePresence initial={false}>
              {feed.map((l, idx) => {
                const speaker = PANEL.find((m) => m.id === l.speakerId)!;
                return (
                  <motion.div
                    key={idx + l.ts}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="border-b border-border pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="label-cap bg-graphite px-1.5 py-0.5 text-ivory">{speaker.short}</span>
                        <span className="label-cap text-steel">{speaker.name}</span>
                        {l.interrupt && (
                          <span className="label-cap bg-crimson px-1.5 py-0.5 text-ivory">INTERRUPT</span>
                        )}
                      </div>
                      <span className="font-mono-edit text-[11px] text-steel">{l.ts}</span>
                    </div>
                    <p className="font-serif-edit mt-2 text-lg italic leading-snug text-graphite">
                      {l.text}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {feed.length === 0 && (
              <div className="font-serif-edit italic text-steel">Waiting for the first word…</div>
            )}
          </div>
        </aside>
      </section>

      {/* Score sheet */}
      <section className="border-b border-border px-6 py-16 lg:px-10">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <div className="label-cap text-steel">Round Scorecard</div>
            <h2 className="font-display mt-3 text-5xl leading-none text-graphite md:text-6xl">
              The judges' floor.
            </h2>
          </div>
          <div className="font-mono-edit hidden text-xs text-steel md:block">
            Categories — Reasoning · Composure · Originality · Wit
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-px bg-border md:grid-cols-4">
          {PANEL.map((m) => (
            <div key={m.id} className="bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="label-cap bg-graphite px-2 py-1 text-ivory">{m.short}</span>
                <span className="font-mono-edit text-xs text-steel">{m.style}</span>
              </div>
              <div className="font-display mt-6 text-3xl leading-none text-graphite">{m.name}</div>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {["RZ", "CO", "OR", "WT"].map((k, i) => (
                  <div key={k}>
                    <div className="label-cap text-steel">{k}</div>
                    <div className="font-mono-edit text-xl tabular-nums text-graphite">
                      {Math.round(70 + ((scores[m.id] + i * 7) % 25))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
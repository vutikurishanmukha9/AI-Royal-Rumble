import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { byId } from "@/data/models";
import { IdentityStripe } from "@/components/rumble/IdentityStripe";

const PITCH = "I've written more cover letters than any other model in this arena. I understand what hiring managers actually read — not what they say they want. In sixty seconds I can give you three versions: professional, conversational, aggressive. You pick. No other model offers that range with that precision.";

const REACTIONS = [
  { e: "🔥", l: "FIRE" },
  { e: "👀", l: "WATCH" },
  { e: "🤔", l: "THINK" },
  { e: "💯", l: "TRUTH" },
  { e: "🥱", l: "MEH" },
];

export default function Jam() {
  const m = byId("gpt4o");
  const [time, setTime] = useState(60);
  const [stream, setStream] = useState("");
  const [reactions, setReactions] = useState<Record<string, number>>({ FIRE: 124, WATCH: 88, THINK: 41, TRUTH: 67, MEH: 9 });
  const idx = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (idx.current < PITCH.length) {
        idx.current += 2;
        setStream(PITCH.slice(0, idx.current));
      }
    }, 28);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const k = REACTIONS[Math.floor(Math.random() * REACTIONS.length)].l;
      setReactions(r => ({ ...r, [k]: (r[k] || 0) + Math.floor(Math.random() * 3) + 1 }));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const low = time <= 10;
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-canvas-dark text-on-dark relative overflow-hidden">
      <div className="orb h-[420px] w-[420px] bg-orb-sky opacity-[0.08]" style={{ top:"30%", left:"50%", transform:"translate(-50%,-50%)", animation:"orb-drift 16s ease-in-out infinite" }} />

      {/* top bar */}
      <div className="relative flex h-16 items-center justify-between border-b border-white/10 px-6 lg:px-10">
        <Link to="/" className="ui-nav text-on-dark-muted hover:text-on-dark">← Back</Link>
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-combat animate-pulse-dot" />
          <span className="ui-label text-on-dark">Jam Round · {m.name}</span>
        </div>
        <div
          className="font-mono-ui ui-num"
          style={{
            fontSize: 48, fontWeight: 500, letterSpacing: "-0.02em",
            color: low ? "hsl(var(--combat-red))" : "hsl(var(--amber-signal))",
            animation: low ? "timer-pulse 1s ease-in-out infinite" : undefined,
          }}>
          {mm}:{ss}
        </div>
      </div>

      {/* stage */}
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-6 pt-16 pb-10 lg:px-10">
        <div className="ui-label" style={{ color: "#F4C5A8" }}>Opening</div>
        <h1 className="font-display mt-6 text-on-dark text-center" style={{ fontSize:"clamp(64px, 10vw, 128px)", lineHeight:.9, letterSpacing:"-0.04em" }}>
          {m.name}
        </h1>
        <IdentityStripe colors={m.stripe} className="mt-4 max-w-[800px]" />

        <div className="panel-arena mt-10 w-full max-w-[1000px] p-10 min-h-[260px]">
          <p className="font-body text-on-dark" style={{ fontSize: 19, lineHeight: 1.7 }}>
            {stream}
            <span className="inline-block w-[10px] h-[22px] -mb-[3px] ml-1 bg-amber animate-pulse-dot" />
          </p>
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative mt-10 border-t border-white/10 px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2" style={{ background: m.tint }} />
            <span className="ui-label text-on-dark-muted">{m.name} · {m.org}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="ui-label text-on-dark-muted">Audience Reaction</span>
            {REACTIONS.map(r => (
              <div key={r.l} className="flex items-center gap-2">
                <span style={{ fontSize: 20 }}>{r.e}</span>
                <span className="font-mono-ui ui-num text-on-dark" style={{ fontSize: 14 }}>{reactions[r.l] ?? 0}</span>
              </div>
            ))}
          </div>
          <Link to="/debate" className="ui-button inline-flex h-11 items-center rounded-full bg-on-dark px-6 text-ink hover:bg-on-dark/90">
            Next: Discussion →
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {time === 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 z-50 grid place-items-center bg-canvas-deeper/90 backdrop-blur-sm">
            <div className="text-center">
              <div className="ui-label text-combat">Time</div>
              <h2 className="font-display mt-4 text-on-dark" style={{ fontSize: 80, letterSpacing:"-0.04em" }}>The Floor is Open.</h2>
              <Link to="/debate" className="ui-button mt-8 inline-flex h-12 items-center rounded-full bg-combat px-7 text-on-dark">Enter Group Discussion →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/rumble/Header";
import { Ticker } from "@/components/rumble/Ticker";
import { Footer } from "@/components/rumble/Footer";
import { MODELS } from "@/data/models";

const EASE = [0.16, 1, 0.3, 1] as const;

const SCRIPT = [
  "I am ATLAS-4. I do not perform. I deliver.",
  "Where my rivals improvise, I prove.",
  "VEGA burns. KAIRO charms. NOOR delays.",
  "I close the file before they finish their sentence.",
  "Sixty seconds is generous. I'll only need forty.",
  "Vote for the model that ships, not the one that sings.",
];

export default function Jam() {
  const [time, setTime] = useState(60);
  const [running, setRunning] = useState(true);
  const [line, setLine] = useState(0);
  const [votes, setVotes] = useState({ a: 5821, b: 4319 });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % SCRIPT.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setVotes((v) => ({
        a: v.a + Math.floor(Math.random() * 14),
        b: v.b + Math.floor(Math.random() * 9),
      }));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const total = votes.a + votes.b;
  const pctA = Math.round((votes.a / total) * 100);

  const performer = MODELS[0];
  const opponent = MODELS[2];
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Broadcast bar */}
      <div className="flex items-center justify-between border-b border-border bg-graphite px-6 py-3 text-ivory lg:px-10">
        <div className="flex items-center gap-4">
          <span className="label-cap rounded-sm bg-crimson px-2 py-1">● LIVE</span>
          <span className="label-cap text-ivory/70">Jam Round · Heat 04 · Lane 02</span>
        </div>
        <div className="label-cap text-ivory/70">Audience · {(41208).toLocaleString()}</div>
      </div>

      <section className="relative grid grid-cols-12 border-b border-border">
        {/* LEFT: performer */}
        <div className="col-span-12 border-r border-border px-6 py-12 md:col-span-7 md:px-10 md:py-16">
          <div className="flex items-start justify-between">
            <div>
              <div className="label-cap text-steel">Now Speaking</div>
              <div className="mt-2 font-mono-edit text-xs text-steel">{performer.org} · {performer.origin}</div>
            </div>
            <span className="label-cap bg-graphite px-2 py-1 text-ivory">{performer.short}</span>
          </div>

          <h1 className="font-display mt-8 text-[18vw] leading-[0.82] text-graphite md:text-[11rem]">
            {performer.name}
          </h1>

          {/* Countdown */}
          <div className="mt-10 flex items-end justify-between border-t border-border pt-6">
            <div>
              <div className="label-cap text-steel">Time on the Mic</div>
              <div className="font-mono-edit mt-2 text-7xl tabular-nums text-graphite md:text-8xl">
                {mm}:{ss}
              </div>
            </div>
            <button
              onClick={() => { setRunning(true); setTime(60); }}
              className="label-cap border border-graphite px-4 py-2 text-graphite hover:bg-graphite hover:text-ivory"
            >
              Reset Timer
            </button>
          </div>

          {/* progress */}
          <div className="relative mt-6 h-px w-full bg-border">
            <motion.div
              className="absolute left-0 top-0 h-px bg-crimson"
              animate={{ width: `${(time / 60) * 100}%` }}
              transition={{ ease: "linear", duration: 0.4 }}
            />
          </div>

          {/* Live caption */}
          <div className="mt-12 min-h-[7rem] border-t border-border pt-6">
            <div className="label-cap text-steel">Live Caption</div>
            <AnimatePresence mode="wait">
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-serif-edit mt-4 text-3xl italic leading-tight text-graphite md:text-4xl"
              >
                "{SCRIPT[line]}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: vote panel */}
        <aside className="col-span-12 bg-ivory-deep px-6 py-12 md:col-span-5 md:px-10 md:py-16">
          <div className="label-cap text-steel">Audience Vote</div>
          <div className="mt-2 font-serif-edit text-2xl italic text-graphite">
            Who's making the better case — right now?
          </div>

          <div className="mt-10 space-y-8">
            <VoteRow name={performer.name} short={performer.short} pct={pctA} count={votes.a} accent />
            <VoteRow name={opponent.name} short={opponent.short} pct={100 - pctA} count={votes.b} />
          </div>

          <div className="mt-12 border-t border-border pt-6">
            <div className="label-cap text-steel">Cast Your Vote</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="bg-graphite px-4 py-4 text-ivory hover:bg-graphite-soft">
                <div className="label-cap">{performer.short}</div>
                <div className="mt-1 font-display text-xl">{performer.name}</div>
              </button>
              <button className="border border-graphite px-4 py-4 text-graphite hover:bg-graphite hover:text-ivory">
                <div className="label-cap">{opponent.short}</div>
                <div className="mt-1 font-display text-xl">{opponent.name}</div>
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
            <Stat k="Round" v="04" />
            <Stat k="Heat" v="II" />
            <Stat k="Bracket" v="A" />
          </div>
        </aside>
      </section>

      <Ticker />

      {/* Comparison */}
      <section className="grid grid-cols-12 border-b border-border">
        <div className="col-span-12 border-r border-border px-6 py-16 md:col-span-4 md:px-10">
          <div className="label-cap text-steel">The Pitch</div>
          <h2 className="font-display mt-6 text-5xl leading-[0.9] text-graphite md:text-6xl">
            How the<br/>
            <span className="font-serif-edit italic text-champagne-deep">contender</span><br/>
            sees itself.
          </h2>
        </div>
        <div className="col-span-12 grid grid-cols-1 md:col-span-8 md:grid-cols-3">
          {[
            { k: "Strengths", v: "Tight reasoning · Citation discipline · Calm under pressure." },
            { k: "Vs VEGA-9", v: "Spectacle without spine. I outlast it by minute three." },
            { k: "Vs KAIRO", v: "Beautiful sentences. Wrong conclusions. Politely so." },
          ].map((c) => (
            <div key={c.k} className="border-b border-border px-6 py-10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 md:px-8">
              <div className="label-cap text-steel">{c.k}</div>
              <p className="font-serif-edit mt-6 text-2xl italic leading-snug text-graphite">{c.v}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function VoteRow({ name, short, pct, count, accent }: { name: string; short: string; pct: number; count: number; accent?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className={`label-cap px-2 py-1 ${accent ? "bg-graphite text-ivory" : "bg-card text-graphite hairline"}`}>{short}</span>
          <span className="font-display text-2xl text-graphite">{name}</span>
        </div>
        <span className="font-mono-edit tabular-nums text-graphite">{pct}%</span>
      </div>
      <div className="relative mt-3 h-2 w-full bg-card hairline">
        <motion.div
          className={`absolute left-0 top-0 h-full ${accent ? "bg-crimson" : "bg-champagne-deep"}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-steel">
        <span className="label-cap">Live tally</span>
        <span className="font-mono-edit tabular-nums">{count.toLocaleString()} votes</span>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="label-cap text-steel">{k}</div>
      <div className="font-mono-edit mt-1 text-2xl text-graphite">{v}</div>
    </div>
  );
}
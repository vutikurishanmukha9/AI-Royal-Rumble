import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { byId, MODELS } from "@/data/models";
import { IdentityStripe } from "@/components/rumble/IdentityStripe";

const A = byId("gpt");
const B = byId("claude");
const ACTIVE = [A, B, byId("gemini"), byId("grok")];

const A_TEXT = "I've written more cover letters than any other model in this arena. I understand what hiring managers actually read — not what they say they want. In sixty seconds I can give you three versions: professional, conversational, aggressive. You pick.";
const B_TEXT = "GPT-4o's range is real. But range without accuracy is noise. I've read the research on what actually gets callbacks. It's not three versions. It's one honest version that doesn't sound like every other AI-generated letter. I'll write something that reads like a human wrote it on their best day.";

const CHAIN_SEED = [
  { ai: A, kind: "CLAIMS", text: "Better at coding tasks under pressure" },
  { ai: B, kind: "COUNTERS", text: "Accuracy beats speed every time" },
  { ai: A, kind: "ATTACKS", text: "Accuracy without range is brittle" },
  { ai: B, kind: "DEFENDS", text: "Range without accuracy is noise" },
  { ai: byId("gemini"), kind: "INTERJECTS", text: "Both miss the user's actual need" },
  { ai: byId("grok"), kind: "MOCKS", text: "This is the most polite war I've seen" },
];

const PHASE_COLOR: Record<string, string> = {
  Opening: "#F4C5A8",
  Attacking: "#A8E4C5",
  Defending: "#C8B8E0",
  Closing: "#E0C896",
};

function useStream(text: string) {
  const [s, setS] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setS(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [text]);
  return s;
}

export default function Debate() {
  const a = useStream(A_TEXT);
  const b = useStream(B_TEXT);
  const [chain, setChain] = useState(CHAIN_SEED.slice(0, 1));
  const [scores, setScores] = useState<Record<string, number>>({ gpt: 34, claude: 28, gemini: 18, grok: 12 });

  useEffect(() => {
    let i = 1;
    const t = setInterval(() => {
      if (i < CHAIN_SEED.length) { setChain(c => [...c, CHAIN_SEED[i]]); i++; }
    }, 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setScores(s => {
        const ids = Object.keys(s);
        const k = ids[Math.floor(Math.random() * ids.length)];
        const next = { ...s, [k]: Math.min(60, s[k] + (Math.random() > .4 ? 1 : -1)) };
        return next;
      });
    }, 900);
    return () => clearInterval(t);
  }, []);

  const total = Object.values(scores).reduce((x,y)=>x+y,0) || 1;
  const leader = Object.entries(scores).sort((x,y)=>y[1]-x[1])[0][0];

  return (
    <div className="min-h-screen bg-canvas-dark text-on-dark grid grid-rows-[64px_1fr] grid-cols-[1fr_260px]">
      {/* top bar */}
      <div className="col-span-2 flex h-16 items-center justify-between border-b border-white/10 px-6 lg:px-10">
        <Link to="/jam" className="ui-nav text-on-dark-muted hover:text-on-dark">← Back</Link>
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-combat animate-pulse-dot" />
          <span className="ui-label text-on-dark">Group Discussion · Round 2 of 3</span>
        </div>
        <span className="ui-label text-on-dark-muted">Topic · Cover Letter</span>
      </div>

      {/* main 2x2 */}
      <div className="relative grid grid-cols-2 grid-rows-2">
        {/* center amber glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[160px] w-[160px] rounded-full"
             style={{ background:"radial-gradient(circle, hsl(var(--amber-signal)) 0%, transparent 70%)", animation:"glow-breathe 4s ease-in-out infinite" }} />

        {/* AI A */}
        <Panel m={A} phase="Attacking" countering text={a} />
        {/* AI B */}
        <Panel m={B} phase="Defending" text={b} />

        {/* Argument chain */}
        <div className="panel-arena p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between">
            <div className="ui-label text-on-dark-muted">Argument Chain</div>
            <div className="ui-label text-on-dark-muted">Live</div>
          </div>
          <div className="mt-5 space-y-3 overflow-y-auto no-scrollbar flex-1">
            <AnimatePresence initial={false}>
              {chain.map((c, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.3, ease:[0.22,1,0.36,1] }}
                  className="border-l-2 pl-3 py-1"
                  style={{ borderColor: c.ai.tint }}>
                  <div className="font-mono-ui text-xs" style={{ color: c.ai.tint, letterSpacing:"1.5px" }}>
                    [{c.ai.name}] → {c.kind}
                  </div>
                  <div className="text-on-dark mt-1" style={{ fontSize:14, lineHeight:1.5 }}>{c.text}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Dominance */}
        <div className="panel-arena p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="ui-label text-on-dark-muted">Dominance</div>
            <div className="font-mono-ui ui-num text-amber text-xs">LIVE</div>
          </div>

          {/* horizontal stacked bar */}
          <div className="mt-5 h-2 w-full flex overflow-hidden rounded-full bg-white/5">
            {Object.entries(scores).map(([id, v]) => (
              <motion.div key={id} animate={{ width: `${(v/total)*100}%` }} transition={{ duration:.6, ease:[0.22,1,0.36,1] }}
                style={{ background: id === leader ? "hsl(var(--combat-red))" : byId(id).tint }} />
            ))}
          </div>

          {/* vote bars */}
          <div className="mt-6 space-y-3 flex-1">
            {Object.entries(scores).sort((x,y)=>y[1]-x[1]).map(([id, v]) => {
              const m = byId(id);
              return (
                <div key={id}>
                  <div className="flex items-center justify-between">
                    <span className="ui-label text-on-dark-muted">{m.name}</span>
                    <span className="font-mono-ui ui-num text-amber" style={{ fontSize: 14 }}>{Math.round((v/total)*100)}%</span>
                  </div>
                  <div className="mt-1 h-[6px] w-full bg-white/5 overflow-hidden">
                    <motion.div animate={{ width: `${(v/total)*100}%` }} transition={{ duration:.6, ease:[0.22,1,0.36,1] }}
                      className="h-full" style={{ background: id === leader ? "hsl(var(--combat-red))" : m.tint }} />
                  </div>
                </div>
              );
            })}
          </div>

          <Link to="/vote" className="ui-button mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-combat px-6 text-on-dark hover:bg-combat/85">
            Cast Your Vote →
          </Link>
        </div>
      </div>

      {/* sidebar */}
      <aside className="border-l border-white/10 bg-canvas-deeper p-6 overflow-y-auto">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-combat text-on-dark ui-label rounded-sm">Round 2 / 3 · Live</span>
        </div>
        <div className="ui-label text-on-dark-muted mt-8 mb-4">Active AIs</div>
        <ul className="space-y-3">
          {ACTIVE.map((m,i) => (
            <li key={m.id} className="border-l-2 pl-3 py-1" style={{ borderColor: m.tint }}>
              <div className="font-mono-ui text-on-dark" style={{ fontSize:13, letterSpacing:"1.5px", textTransform:"uppercase" }}>{m.name}</div>
              <div className="text-xs mt-1" style={{ color: Object.values(PHASE_COLOR)[i] }}>
                {Object.keys(PHASE_COLOR)[i] ?? "Closing"}
              </div>
            </li>
          ))}
        </ul>

        <div className="ui-label text-on-dark-muted mt-10 mb-3">Roster on Bench</div>
        <div className="flex flex-wrap gap-2">
          {MODELS.filter(m=>!ACTIVE.find(a=>a.id===m.id)).map(m => (
            <span key={m.id} className="font-mono-ui text-[10px] text-on-dark-muted px-2 py-1 border border-white/10" style={{ letterSpacing:"1.5px" }}>
              {m.short}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Panel({ m, phase, text, countering }: { m: ReturnType<typeof byId>; phase: string; text: string; countering?: boolean }) {
  return (
    <div className="panel-arena p-6 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2" style={{ background: m.tint }} />
          <span className="font-display text-on-dark" style={{ fontSize: 22 }}>{m.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {countering && <span className="ui-label text-amber">Countering ↗</span>}
          <span className="ui-label" style={{ color: PHASE_COLOR[phase] }}>{phase}</span>
        </div>
      </div>
      <IdentityStripe colors={m.stripe} className="mt-3" />
      <p className="font-body text-on-dark mt-5 flex-1" style={{ fontSize: 16, lineHeight: 1.65 }}>
        {text}
        <span className="inline-block w-[8px] h-[18px] -mb-[2px] ml-1 bg-amber/80 animate-pulse-dot" />
      </p>
    </div>
  );
}

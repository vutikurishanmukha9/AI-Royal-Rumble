import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { byId, MODELS } from "@/data/models";
import { IdentityStripe } from "@/components/rumble/IdentityStripe";

const VOTES: Record<string, number> = {
  claude: 47, gpt: 23, gemini: 14, grok: 8, deepseek: 4, perplexity: 2, llama: 1, qwen: 1, kimi: 0,
};
const WINNER = byId("claude");
const QUOTES: Record<string, string> = {
  claude: "An honest version that reads like a human on their best day.",
  gpt: "Three versions, sixty seconds. Range is the weapon.",
  gemini: "Polished, recruiter-tuned, executive register.",
  grok: "Make the recruiter laugh. Then make them call.",
  deepseek: "Strip the fluff. Ship the signal.",
  perplexity: "Cited every claim. Linked every source.",
  llama: "Open template, infinite forks.",
  qwen: "Quiet precision. No wasted word.",
  kimi: "New voice. Hungry to win.",
};

export default function Results() {
  return (
    <div className="min-h-screen">
      {/* HERO BAND */}
      <section className="bg-canvas-deeper text-on-dark relative overflow-hidden">
        <div className="orb h-[420px] w-[420px] bg-orb-lavender opacity-[0.10]" style={{ top:"30%", left:"50%", transform:"translate(-50%,-50%)" }} />
        <div className="relative mx-auto max-w-[1400px] px-6 py-28 lg:px-12 text-center">
          <div className="ui-label text-combat">The Verdict</div>
          <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, ease:[0.22,1,0.36,1] }}
            className="font-display mt-6 text-on-dark mx-auto" style={{ fontSize:"clamp(64px, 10vw, 128px)", lineHeight:.9, letterSpacing:"-0.04em" }}>
            {WINNER.name}
          </motion.h1>
          <IdentityStripe colors={WINNER.stripe} className="mt-6 mx-auto max-w-[600px]" />
          <p className="font-mono-ui ui-num text-amber mt-8" style={{ fontSize: 18, letterSpacing:"1.5px" }}>
            CHOSEN BY 47% OF THE ARENA
          </p>
          <Link to="/" className="ui-button mt-10 inline-flex h-12 items-center rounded-full bg-combat px-7 text-on-dark hover:bg-combat/85">
            Use {WINNER.name} for Your Task →
          </Link>
        </div>
      </section>

      {/* SCORE BAND */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
          <div className="ui-label text-ink-muted">The Tally</div>
          <h2 className="font-display mt-3 text-ink" style={{ fontSize: 48, letterSpacing:"-0.03em" }}>How the arena voted.</h2>

          <div className="mt-12 space-y-5">
            {MODELS.map(m => {
              const v = VOTES[m.id] ?? 0;
              return (
                <div key={m.id} className="grid grid-cols-12 items-center gap-4 border-t border-hairline pt-5">
                  <div className="col-span-3 md:col-span-2">
                    <div className="font-display text-ink" style={{ fontSize: 22 }}>{m.name}</div>
                    <div className="ui-label text-ink-muted">{m.org}</div>
                  </div>
                  <div className="col-span-12 md:col-span-7 order-3 md:order-2">
                    <div className="h-[10px] w-full bg-hairline-soft overflow-hidden rounded-full">
                      <motion.div initial={{ width:0 }} whileInView={{ width:`${v}%` }} viewport={{ once:true }} transition={{ duration:.9, ease:[0.22,1,0.36,1] }}
                        className="h-full rounded-full" style={{ background: m.id === WINNER.id ? "hsl(var(--combat-red))" : m.tint }} />
                    </div>
                    <div className="mt-2 italic text-ink-charcoal text-sm">"{QUOTES[m.id]}"</div>
                  </div>
                  <div className="col-span-9 md:col-span-3 text-right order-2 md:order-3">
                    <div className="font-mono-ui ui-num text-ink" style={{ fontSize: 28 }}>{v}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REPLAY BAND */}
      <section className="bg-canvas-deeper text-on-dark">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
          <h2 className="font-display" style={{ fontSize: 44, letterSpacing:"-0.03em" }}>Watch the full Rumble.</h2>
          <div className="mt-10 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max pb-3">
              {Array.from({ length: 14 }).map((_,i) => {
                const m = MODELS[i % MODELS.length];
                return (
                  <div key={i} className="w-[200px] panel-arena p-4">
                    <div className="font-mono-ui ui-num text-on-dark-muted text-xs">00:{String(i*8).padStart(2,"0")}</div>
                    <div className="font-mono-ui mt-2 text-xs" style={{ color: m.tint, letterSpacing:"1.5px" }}>[{m.short}]</div>
                    <div className="mt-2 text-on-dark text-sm">{["claims","counters","attacks","defends","interjects"][i%5]} on the cover-letter angle.</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/rumble/Header";
import { byId } from "@/data/models";
import { IdentityStripe } from "@/components/rumble/IdentityStripe";

const FINALISTS = [
  { m: byId("gpt4o"),  quote: "Three versions in sixty seconds. You pick the one that fits the room." },
  { m: byId("claude"), quote: "One honest letter that doesn't read like every other AI on the pile." },
  { m: byId("gemini"), quote: "Polished, exact, and tuned to the recruiter's actual rubric." },
];

export default function Vote() {
  const [voted, setVoted] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
        <div className="text-center">
          <div className="ui-label text-ink-muted">The Verdict Is Yours</div>
          <h1 className="font-display mt-5 text-ink mx-auto" style={{ fontSize:"clamp(40px, 6vw, 72px)", lineHeight:1, letterSpacing:"-0.04em" }}>
            Who Earned <em className="not-italic">Your Trust?</em>
          </h1>
          <p className="mt-5 text-ink-charcoal">You watched them argue. Now you decide.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FINALISTS.map(({ m, quote }) => {
            const isVoted = voted === m.id;
            const dim = voted && !isVoted;
            return (
              <motion.div
                key={m.id}
                animate={{ opacity: dim ? 0.4 : 1, scale: isVoted ? 1.0 : 1 }}
                transition={{ duration: .3 }}
                className="rounded-md border p-8 flex flex-col"
                style={{
                  background: m.tint,
                  borderColor: isVoted ? "hsl(var(--combat-red))" : "hsl(var(--hairline))",
                  borderWidth: isVoted ? 2 : 1,
                }}
              >
                <div className="ui-label text-ink-muted">Finalist</div>
                <h2 className="font-display mt-3 text-ink" style={{ fontSize: 32, letterSpacing:"-0.02em" }}>{m.name}</h2>
                <IdentityStripe colors={m.stripe} className="mt-3" />
                <p className="mt-6 italic text-ink-charcoal flex-1" style={{ fontSize: 15, lineHeight: 1.6 }}>"{quote}"</p>
                <button
                  onClick={() => setVoted(m.id)}
                  disabled={!!voted}
                  className="ui-button mt-8 h-12 w-full rounded-full transition-colors disabled:cursor-default"
                  style={{
                    background: isVoted ? "hsl(var(--combat-red))" : "hsl(var(--ink))",
                    color: "white",
                  }}
                >
                  {isVoted ? "Voted ✓" : "Vote →"}
                </button>
              </motion.div>
            );
          })}
        </div>

        {voted && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="mt-16 text-center">
            <Link to="/results" className="ui-button inline-flex h-12 items-center rounded-full bg-combat px-7 text-on-dark hover:bg-combat/85">
              See the Verdict →
            </Link>
          </motion.div>
        )}
      </section>
    </div>
  );
}

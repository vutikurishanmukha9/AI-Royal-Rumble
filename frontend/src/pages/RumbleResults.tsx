import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getResults, ResultsResponse } from "@/lib/api";
import { byId } from "@/data/models";
import { IdentityStripe } from "@/components/rumble/IdentityStripe";

function safeModel(aiName: string | null) {
  if (!aiName) return null;
  try {
    return byId(aiName);
  } catch {
    return null;
  }
}

export default function RumbleResults() {
  const { rumbleId } = useParams();
  const [results, setResults] = useState<ResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rumbleId) return;
    getResults(rumbleId).then(setResults).catch((err) => setError(err.message));
  }, [rumbleId]);

  const winner = safeModel(results?.winner || null);
  const totalVotes = results?.total_votes || 0;

  return (
    <div className="min-h-screen bg-canvas">
      <section className="bg-canvas-deeper text-on-dark">
        <div className="mx-auto max-w-[1400px] px-6 py-24 text-center lg:px-12">
          <div className="ui-label text-combat">The Verdict</div>
          <h1 className="font-display mt-6" style={{ fontSize: "clamp(56px, 9vw, 120px)", lineHeight: 0.9 }}>
            {winner?.name || results?.winner_display_name || "Awaiting Results"}
          </h1>
          {winner && <IdentityStripe colors={winner.stripe} className="mx-auto mt-6 max-w-[620px]" />}
          <p className="mt-8 font-mono-ui text-amber">
            {results ? `${results.winner_percentage}% OF ${totalVotes} VOTES` : "Loading final tally"}
          </p>
          <Link to="/" className="ui-button mt-10 inline-flex h-12 items-center rounded-full bg-combat px-7 text-on-dark">
            Start Another Rumble
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-12">
        {error && <div className="border border-combat bg-combat/10 p-4 text-ink">{error}</div>}
        {results && (
          <>
            <div className="ui-label text-ink-muted">Task</div>
            <h2 className="font-display mt-3 text-ink" style={{ fontSize: 42 }}>{results.task}</h2>
            <div className="mt-10 space-y-5">
              {Object.entries(results.final_votes).sort((a, b) => b[1] - a[1]).map(([aiName, count]) => {
                const model = safeModel(aiName);
                const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                return (
                  <div key={aiName} className="border-t border-hairline pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display text-ink" style={{ fontSize: 26 }}>{model?.name || aiName}</div>
                        <div className="ui-label text-ink-muted">{model?.tagline || "Competitor"}</div>
                      </div>
                      <div className="font-mono-ui ui-num text-ink" style={{ fontSize: 30 }}>{percent}%</div>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-hairline-soft">
                      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: model?.tint || "hsl(var(--combat-red))" }} />
                    </div>
                    {results.key_arguments[aiName] && (
                      <p className="mt-3 text-sm italic text-ink-charcoal">"{results.key_arguments[aiName]}"</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

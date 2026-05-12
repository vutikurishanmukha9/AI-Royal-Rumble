import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { castVote, getRumble, RumbleArgument, streamUrl } from "@/lib/api";
import { byId } from "@/data/models";
import { IdentityStripe } from "@/components/rumble/IdentityStripe";

type StreamEvent = {
  id: string;
  type: string;
  data: Record<string, unknown>;
};

const EVENT_TYPES = [
  "rumble_started",
  "round_started",
  "ai_turn_started",
  "ai_token",
  "ai_turn_completed",
  "round_completed",
  "gd_counter_started",
  "voting_open",
  "vote_update",
  "rumble_completed",
  "error",
];

function safeModel(aiName: string) {
  try {
    return byId(aiName);
  } catch {
    return byId("gpt4o");
  }
}

export default function RumbleLive() {
  const { rumbleId } = useParams();
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("loading");
  const [selectedAis, setSelectedAis] = useState<string[]>([]);
  const [argumentsList, setArgumentsList] = useState<RumbleArgument[]>([]);
  const [liveText, setLiveText] = useState<Record<string, string>>({});
  const [activeTurn, setActiveTurn] = useState<{ ai_name: string; phase: string } | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [votedAi, setVotedAi] = useState<string | null>(null);

  useEffect(() => {
    if (!rumbleId) return;

    let source: EventSource | null = null;

    getRumble(rumbleId)
      .then((state) => {
        setTask(state.task);
        setStatus(state.status);
        setSelectedAis(state.selected_ais);
        setVotes(state.votes);
        setWinner(state.winner ?? null);
        setArgumentsList(state.rounds.flatMap((round) => round.arguments));
      })
      .catch((err) => setError(err.message));

    source = new EventSource(streamUrl(rumbleId));
    EVENT_TYPES.forEach((type) => {
      source?.addEventListener(type, (message) => {
        const data = JSON.parse(message.data || "{}");
        setEvents((current) => [...current.slice(-80), { id: message.lastEventId, type, data }]);

        if (type === "rumble_started") {
          setTask(String(data.task || ""));
          setSelectedAis((data.ais as string[]) || []);
          setStatus("running");
        }
        if (type === "round_started") setStatus(String(data.round_type || "running"));
        if (type === "ai_turn_started" || type === "gd_counter_started") {
          setActiveTurn({
            ai_name: String(data.ai_name),
            phase: String(data.phase || data.argument_type || "Speaking"),
          });
        }
        if (type === "ai_token") {
          const aiName = String(data.ai_name);
          setLiveText((current) => ({ ...current, [aiName]: String(data.chunk || "") }));
        }
        if (type === "ai_turn_completed") {
          const aiName = String(data.ai_name);
          const content = String(data.full_content || "");
          setArgumentsList((current) => [
            ...current,
            {
              ai_name: aiName,
              argument_type: "turn",
              content,
              phase: "Completed",
            },
          ]);
          setLiveText((current) => ({ ...current, [aiName]: "" }));
        }
        if (type === "voting_open") {
          setStatus("voting");
          setSelectedAis((data.ais as string[]) || []);
        }
        if (type === "vote_update") {
          setVotes((data.votes as Record<string, number>) || {});
        }
        if (type === "rumble_completed") {
          setStatus("completed");
          setWinner(String(data.winner || ""));
          setVotes((data.final_votes as Record<string, number>) || {});
        }
        if (type === "error") {
          setError(String(data.message || data.code || "Stream error"));
        }
      });
    });
    source.onerror = () => setError("Live stream connection is retrying.");

    return () => source?.close();
  }, [rumbleId]);

  const totalVotes = Object.values(votes).reduce((sum, value) => sum + value, 0);
  const activeAis = selectedAis.length ? selectedAis : ["gpt4o", "claude", "gemini"];
  const currentPanels = useMemo(() => activeAis.slice(0, 4), [activeAis]);

  async function submitVote(aiName: string) {
    if (!rumbleId) return;
    try {
      const result = await castVote(rumbleId, aiName);
      setVotedAi(result.voted_ai);
      setVotes(result.current_votes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote failed");
    }
  }

  return (
    <div className="min-h-screen bg-canvas-dark text-on-dark">
      <header className="flex min-h-16 items-center justify-between border-b border-white/10 px-6 py-4 lg:px-10">
        <Link to="/" className="ui-nav text-on-dark-muted hover:text-on-dark">Back</Link>
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-combat animate-pulse-dot" />
          <span className="ui-label text-on-dark">Live Rumble</span>
        </div>
        <span className="ui-label text-on-dark-muted">{status}</span>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-6 px-6 py-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <section className="space-y-6">
          <div className="panel-arena p-6">
            <div className="ui-label text-on-dark-muted">Task</div>
            <h1 className="font-display mt-3 text-on-dark" style={{ fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1 }}>
              {task || "Preparing the arena..."}
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {currentPanels.map((aiName) => {
              const model = safeModel(aiName);
              const text = liveText[aiName] || argumentsList.filter((item) => item.ai_name === aiName).at(-1)?.content || "Waiting for the next turn.";
              const isActive = activeTurn?.ai_name === aiName;
              return (
                <motion.div
                  key={aiName}
                  animate={{ opacity: isActive ? 1 : 0.82, scale: isActive ? 1.01 : 1 }}
                  className="panel-arena min-h-[280px] p-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-on-dark" style={{ fontSize: 28 }}>{model.name}</h2>
                    <span className="ui-label" style={{ color: model.tint }}>{isActive ? activeTurn?.phase : model.short}</span>
                  </div>
                  <IdentityStripe colors={model.stripe} className="mt-3" />
                  <p className="mt-5 text-on-dark/85" style={{ fontSize: 15, lineHeight: 1.7 }}>
                    {text}
                    {isActive && <span className="ml-1 inline-block h-4 w-2 bg-amber align-middle animate-pulse-dot" />}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="panel-arena p-6">
            <div className="ui-label text-on-dark-muted">Transcript</div>
            <div className="mt-4 max-h-[420px] space-y-4 overflow-y-auto pr-2 no-scrollbar">
              {argumentsList.map((argument, index) => {
                const model = safeModel(argument.ai_name);
                return (
                  <div key={`${argument.ai_name}-${index}`} className="border-l-2 pl-4" style={{ borderColor: model.tint }}>
                    <div className="font-mono-ui text-xs" style={{ color: model.tint, letterSpacing: "1.5px" }}>
                      [{model.short}] {argument.argument_type}
                    </div>
                    <p className="mt-1 text-sm text-on-dark/80">{argument.content}</p>
                  </div>
                );
              })}
              {!argumentsList.length && <p className="text-on-dark-muted">The first arguments will appear here as soon as the stream begins.</p>}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="panel-arena p-6">
            <div className="ui-label text-on-dark-muted">Vote</div>
            <div className="mt-4 space-y-3">
              {activeAis.map((aiName) => {
                const model = safeModel(aiName);
                const count = votes[aiName] || 0;
                const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                return (
                  <div key={aiName}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="ui-label text-on-dark">{model.name}</span>
                      <span className="font-mono-ui ui-num text-amber">{percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: model.tint }} />
                    </div>
                    <button
                      disabled={status !== "voting" || !!votedAi}
                      onClick={() => submitVote(aiName)}
                      className="ui-button mt-2 h-9 w-full rounded-full bg-on-dark text-ink disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {votedAi === aiName ? "Voted" : "Vote"}
                    </button>
                  </div>
                );
              })}
            </div>
            {status !== "voting" && <p className="mt-4 text-sm text-on-dark-muted">Voting opens after the debate rounds finish.</p>}
            {status === "completed" && rumbleId && (
              <Link to={`/rumble/${rumbleId}/results`} className="ui-button mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-combat px-5 text-on-dark">
                View Results
              </Link>
            )}
          </div>

          <div className="panel-arena p-6">
            <div className="ui-label text-on-dark-muted">Event Feed</div>
            <div className="mt-4 max-h-[360px] space-y-2 overflow-y-auto no-scrollbar">
              {events.slice(-18).reverse().map((event) => (
                <div key={event.id || `${event.type}-${Math.random()}`} className="border border-white/10 p-3">
                  <div className="font-mono-ui text-xs text-amber">{event.type}</div>
                  <div className="mt-1 text-xs text-on-dark-muted">{JSON.stringify(event.data).slice(0, 140)}</div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="border border-combat bg-combat/10 p-4 text-sm text-on-dark">
              {error}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

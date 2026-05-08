import { motion } from "framer-motion";
import { AIModel } from "@/data/models";

const accentMap: Record<AIModel["accent"], string> = {
  graphite: "bg-graphite text-ivory",
  champagne: "bg-champagne text-graphite",
  crimson: "bg-crimson text-ivory",
  steel: "bg-steel text-ivory",
};

export function ModelCard({ m, index }: { m: AIModel; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between border border-border bg-card p-6 transition-colors hover:bg-ivory-deep"
    >
      <div className="flex items-start justify-between">
        <span className="label-cap text-steel">№ {String(index + 1).padStart(2, "0")}</span>
        <span className={`label-cap px-2 py-1 ${accentMap[m.accent]}`}>{m.short}</span>
      </div>

      <div className="mt-10">
        <h3 className="font-display text-4xl leading-[0.9] text-graphite">{m.name}</h3>
        <p className="mt-2 font-serif-edit text-lg italic text-steel">"{m.tagline}"</p>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-4">
        <Stat label="ELO" value={m.elo.toString()} />
        <Stat label="Wins" value={m.wins.toString()} />
        <Stat label="Losses" value={m.losses.toString()} />
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-steel">
        <span className="label-cap">{m.org}</span>
        <span className="font-mono-edit">{m.origin}</span>
      </div>
    </motion.article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label-cap text-steel">{label}</div>
      <div className="font-mono-edit text-xl text-graphite">{value}</div>
    </div>
  );
}
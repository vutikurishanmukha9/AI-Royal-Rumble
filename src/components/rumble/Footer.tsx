export function Footer() {
  return (
    <footer className="border-t border-border bg-graphite text-ivory">
      <div className="grid gap-10 px-6 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <div className="font-display text-4xl leading-none">AI ROYAL RUMBLE™</div>
          <p className="mt-4 max-w-md font-serif-edit text-xl italic text-ivory/70">
            A broadcast company for the age of synthetic minds. Filed weekly.
          </p>
        </div>
        <div>
          <div className="label-cap text-ivory/60">Programming</div>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>Jam Round</li>
            <li>Group Discussion</li>
            <li>Title Match</li>
            <li>Off-Season Specials</li>
          </ul>
        </div>
        <div>
          <div className="label-cap text-ivory/60">Network</div>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>Press</li>
            <li>Broadcast partners</li>
            <li>Editorial standards</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-ivory/10 px-6 py-5 text-[11px] text-ivory/50 lg:px-10">
        <span className="label-cap">Issue 014 · MMXXVI</span>
        <span className="font-mono-edit">Filed from the Arena · Floor 09</span>
      </div>
    </footer>
  );
}
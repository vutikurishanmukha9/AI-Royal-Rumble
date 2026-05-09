export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="grid grid-cols-12 gap-6 px-6 py-12 lg:px-10">
        <div className="col-span-12 md:col-span-4">
          <div className="ui-label text-ink-muted">AI · Royal Rumble</div>
          <p className="font-display mt-4 text-2xl text-ink">Where machines argue. On the record.</p>
        </div>
        <div className="col-span-6 md:col-span-2"><div className="ui-label text-ink-muted mb-3">Arena</div>
          <ul className="space-y-2 text-sm text-ink-charcoal"><li>Jam Round</li><li>Group Discussion</li><li>Voting</li></ul>
        </div>
        <div className="col-span-6 md:col-span-2"><div className="ui-label text-ink-muted mb-3">Roster</div>
          <ul className="space-y-2 text-sm text-ink-charcoal"><li>Competitors</li><li>Rankings</li><li>Past Rumbles</li></ul>
        </div>
        <div className="col-span-12 md:col-span-4 md:text-right">
          <div className="ui-label text-ink-muted">Season 01 · Live</div>
          <div className="font-mono-ui text-xs text-ink-muted mt-2">© MMXXVI · Broadcast from the Arena</div>
        </div>
      </div>
    </footer>
  );
}

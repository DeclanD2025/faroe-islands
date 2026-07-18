// Folio running-edge.
// A thin vertical rule pinned to the right edge of the viewport on desktop.
// Carries one rotated italic line: the journal's name, the folio roman, and
// the author's name. Reads as a physical page edge, never as UI chrome.

const FOLIOS = ["I", "II", "III", "IV", "V"] as const;

export function FolioEdge() {
  return (
    <aside aria-hidden className="folio-edge">
      <div className="folio-edge-text">
        FAROE ISLANDS 2026 · FOLIO {FOLIOS.join(" · ")} · DECLAN
      </div>
    </aside>
  );
}

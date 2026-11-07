// Re-inserts the characters of a lyric line that the hand-written segments
// leave out — the spacing between phrases, the quote marks — so a rendered line
// reads exactly like its source text.
export function keepSourceText(lines) {
  return lines.map((line) => {
    if (!line.segments) return line;
    const source = line.japanese;
    const segments = [];
    let cursor = 0;
    line.segments.forEach((segment) => {
      const at = source.indexOf(segment.text, cursor);
      if (at === -1) {
        segments.push(segment);
        return;
      }
      if (at > cursor) segments.push({ text: source.slice(cursor, at) });
      segments.push(segment);
      cursor = at + segment.text.length;
    });
    if (cursor < source.length) segments.push({ text: source.slice(cursor) });
    return { ...line, segments };
  });
}
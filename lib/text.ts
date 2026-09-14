/**
 * `pros`, `cons` and `bestFor` are single free-text columns, but editors write them
 * two different ways: as one sentence, or as several points separated by line breaks
 * or semicolons. This turns either shape into a list without a schema change and
 * without re-authoring the rows that already exist.
 *
 * A single-item result is the signal to render a paragraph rather than a one-bullet list.
 */
export function toBullets(value: string | null | undefined): string[] {
  if (!value) return [];

  const byLine = splitAndClean(value, /\r?\n/);
  if (byLine.length > 1) return byLine;

  const bySemicolon = splitAndClean(value, ";");
  if (bySemicolon.length > 1) return bySemicolon;

  const single = value.trim();
  return single ? [single] : [];
}

function splitAndClean(value: string, separator: string | RegExp) {
  return value
    .split(separator)
    .map((part) => part.trim().replace(/[;,]$/, ""))
    .filter(Boolean);
}

/**
 * A readable label for "<category> tools".
 *
 * Several category names already end in "Tools" ("AI Tools"), so appending another
 * produced "AI Tools tools". Lower-casing is also wrong here - it turns "AI" into "ai".
 */
export function categoryToolsLabel(name: string) {
  const trimmed = name.trim();
  return /\btools?$/i.test(trimmed) ? trimmed : `${trimmed} tools`;
}

/** Trims to a whole word so card summaries never end mid-word. */
export function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, "")}…`;
}

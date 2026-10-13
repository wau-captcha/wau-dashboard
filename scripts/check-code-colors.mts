// Checks CodeBlock's highlighting against the reference screenshot: runs lib/highlight.ts on the
// screenshot's sample and compares the dark colour and the italic of each listed token, printing
// every mismatch. Exits with 1 if there is any.
//   pnpm dlx tsx scripts/check-code-colors.mts
import { darkCodeTheme } from "../lib/code-themes";
import { highlightCode } from "../lib/highlight";

const SAMPLE = `import React from 'react';

export default function Movie({
  title,
  genre,
  description,
  price,
  onBuy
}) {
  return (
    <div className="movie">
      <div className="details">
        <h1>
          {title}
          <span className="price">{price}</span>
        </h1>
        <p className="description">{description}</p>
        <span className="genre">{genre}</span>
      </div>
      <div>
        <button onClick={onBuy}>Buy!</button>
      </div>
    </div>
  );
}`;

const COLORS = {
  white: "#EEFFFF",
  cyan: "#89DDFF",
  purple: "#C792EA",
  blue: "#82AAFF",
  pink: "#FF5370",
  red: "#F07178",
  green: "#C3E88D",
} as const;

type Color = keyof typeof COLORS;
/** A token's text, as it appears next in its line, with its colour and whether it is italic. */
type Expected = [text: string, color: Color, italic?: "italic"];

const parameter = (name: string, comma: boolean): Expected[] => [[name, "pink"], ...(comma ? [[",", "white"] as Expected] : [])];

/** By line number, the tokens the screenshot shows, in order. */
const EXPECTED: Record<number, Expected[]> = {
  1: [["import", "cyan", "italic"], ["React", "white"], ["from", "cyan", "italic"], ["'", "cyan"], ["react", "green"], ["'", "cyan"], [";", "cyan"]],
  3: [["export", "cyan", "italic"], ["default", "cyan", "italic"], ["function", "purple"], ["Movie", "blue"], ["(", "cyan"], ["{", "cyan"]],
  4: parameter("title", true),
  5: parameter("genre", true),
  6: parameter("description", true),
  7: parameter("price", true),
  8: parameter("onBuy", false),
  9: [["}", "cyan"], [")", "cyan"], ["{", "cyan"]],
  10: [["return", "cyan", "italic"], ["(", "white"]],
  11: [["<", "cyan"], ["div", "red"], ["className", "purple", "italic"], ["=", "cyan"], ['"', "white"], ["movie", "green"], ['"', "white"], [">", "cyan"]],
  14: [["{", "cyan"], ["title", "white"], ["}", "cyan"]],
  21: [
    ["<", "cyan"],
    ["button", "red"],
    ["onClick", "purple", "italic"],
    ["=", "cyan"],
    ["{", "cyan"],
    ["onBuy", "white"],
    ["}", "cyan"],
    [">", "cyan"],
    ["Buy!", "white"],
    ["</", "cyan"],
    ["button", "red"],
    [">", "cyan"],
  ],
  24: [[")", "white"], [";", "cyan"]],
  25: [["}", "cyan"]],
};

const DEFAULT_DARK = darkCodeTheme.colors["editor.foreground"].toUpperCase();
const lines = highlightCode(SAMPLE, "tsx");
const sampleLines = SAMPLE.split("\n");
const mismatches: string[] = [];
let checked = 0;

if (lines.length !== sampleLines.length) mismatches.push(`expected ${sampleLines.length} lines, got ${lines.length}`);

for (const [lineNumber, expected] of Object.entries(EXPECTED)) {
  const index = Number(lineNumber) - 1;
  const tokens = lines[index] ?? [];
  const text = tokens.map((token) => token.content).join("");
  if (text !== sampleLines[index]) {
    mismatches.push(`line ${lineNumber}: text ${JSON.stringify(text)} instead of ${JSON.stringify(sampleLines[index])}`);
    continue;
  }
  // The index of the token that covers each character of the line.
  const covering: number[] = [];
  tokens.forEach((token, tokenIndex) => covering.push(...Array<number>(token.content.length).fill(tokenIndex)));

  let cursor = 0;
  for (const [part, color, italic] of expected) {
    checked++;
    const start = text.indexOf(part, cursor);
    if (start === -1) {
      mismatches.push(`line ${lineNumber}: ${JSON.stringify(part)} not found after column ${cursor + 1}`);
      continue;
    }
    cursor = start + part.length;
    const wanted = `${COLORS[color]}${italic ? " italic" : ""}`;
    const seen = new Set<string>();
    for (let offset = start; offset < cursor; offset++) {
      const token = tokens[covering[offset]];
      seen.add(`${(token.dark ?? DEFAULT_DARK).toUpperCase()}${token.darkItalic ? " italic" : ""}`);
    }
    const actual = [...seen].join(" + ");
    if (actual !== wanted) mismatches.push(`line ${lineNumber}: ${JSON.stringify(part)} is ${actual}, expected ${wanted} (${color})`);
  }
}

for (const mismatch of mismatches) console.log(`MISMATCH ${mismatch}`);
console.log(`${checked} tokens checked, ${mismatches.length} mismatch${mismatches.length === 1 ? "" : "es"}.`);
process.exitCode = mismatches.length > 0 ? 1 : 0;

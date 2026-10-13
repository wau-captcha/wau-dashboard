import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import bash from "shiki/langs/bash.mjs";
import html from "shiki/langs/html.mjs";
import java from "shiki/langs/java.mjs";
import javascript from "shiki/langs/javascript.mjs";
import json from "shiki/langs/json.mjs";
import jsx from "shiki/langs/jsx.mjs";
import kotlin from "shiki/langs/kotlin.mjs";
import tsx from "shiki/langs/tsx.mjs";
import typescript from "shiki/langs/typescript.mjs";
import xml from "shiki/langs/xml.mjs";
import { darkCodeTheme, lightCodeTheme } from "./code-themes";

/**
 * Syntax highlighting for CodeBlock, synchronous so Server and Client Components render the same
 * HTML. Shiki's core with the JavaScript RegExp engine (no WASM) and only the grammars the site's
 * samples use; created once, when this module first loads.
 */
const highlighter = createHighlighterCoreSync({
  engine: createJavaScriptRegexEngine(),
  themes: [lightCodeTheme, darkCodeTheme],
  langs: [tsx, typescript, javascript, jsx, json, html, xml, bash, java, kotlin],
});

export type CodeGrammar = "tsx" | "typescript" | "javascript" | "jsx" | "json" | "html" | "xml" | "bash" | "java" | "kotlin";

const GRAMMAR_NAMES: Record<string, CodeGrammar> = {
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  tsx: "tsx",
  jsx: "jsx",
  json: "json",
  html: "html",
  xml: "xml",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  java: "java",
  kotlin: "kotlin",
  gradle: "kotlin",
  kts: "kotlin",
};

const FILE_EXTENSIONS: Record<string, CodeGrammar> = {
  tsx: "tsx",
  ts: "typescript",
  jsx: "jsx",
  js: "javascript",
  mjs: "javascript",
  json: "json",
  html: "html",
  xml: "xml",
  java: "java",
  kt: "kotlin",
  kts: "kotlin",
  sh: "bash",
};

/**
 * The grammar for CodeBlock's `language`: a language name such as "bash", or a file name such as
 * "app/signup/page.tsx" by its extension. Null for anything else, which is shown as plain text.
 */
export function codeGrammar(language: string | undefined): CodeGrammar | null {
  const name = language?.trim().toLowerCase();
  if (!name) return null;
  if (Object.hasOwn(GRAMMAR_NAMES, name)) return GRAMMAR_NAMES[name];
  const dot = name.lastIndexOf(".");
  if (dot === -1) return null;
  const extension = name.slice(dot + 1);
  return Object.hasOwn(FILE_EXTENSIONS, extension) ? FILE_EXTENSIONS[extension] : null;
}

/**
 * A run of text in a line with how each theme shows it. A colour is left out where it is the
 * theme's default text colour, and a plain token has neither colour nor italic.
 */
export type CodeToken = {
  content: string;
  light?: string;
  dark?: string;
  lightItalic: boolean;
  darkItalic: boolean;
};

export type CodeLine = CodeToken[];

const THEMES = { light: lightCodeTheme.name, dark: darkCodeTheme.name };
const DEFAULT_COLORS = {
  light: lightCodeTheme.colors["editor.foreground"].toLowerCase(),
  dark: darkCodeTheme.colors["editor.foreground"].toLowerCase(),
};

/** A theme's colour of a token, or undefined where it is that theme's default text colour. */
function themeColor(value: string | undefined, theme: "light" | "dark"): string | undefined {
  if (!value || value === "inherit" || value.toLowerCase() === DEFAULT_COLORS[theme]) return undefined;
  return value;
}

function sameLook(a: CodeToken, b: CodeToken): boolean {
  return a.light === b.light && a.dark === b.dark && a.lightItalic === b.lightItalic && a.darkItalic === b.darkItalic;
}

/** The lines of `code` as tokens; the newline that ends the last line does not open another. */
function tokenize(code: string, language: string | undefined): CodeLine[] {
  const text = code.replace(/\r\n?/g, "\n").replace(/\n$/, "");
  const grammar = codeGrammar(language);
  if (!grammar) {
    return text.split("\n").map((line) => (line ? [{ content: line, lightItalic: false, darkItalic: false }] : []));
  }

  const { tokens } = highlighter.codeToTokens(text, { lang: grammar, themes: THEMES, defaultColor: false });
  return tokens.map((line) => {
    const merged: CodeToken[] = [];
    for (const { content, htmlStyle = {} } of line) {
      const previous = merged.at(-1);
      // Spaces look the same in any colour, and both code fonts are as wide: they join the token
      // before them, or open the line as plain text.
      if (!content.trim()) {
        if (previous) previous.content += content;
        else merged.push({ content, lightItalic: false, darkItalic: false });
        continue;
      }
      const token: CodeToken = {
        content,
        lightItalic: htmlStyle["--shiki-light-font-style"] === "italic",
        darkItalic: htmlStyle["--shiki-dark-font-style"] === "italic",
      };
      const light = themeColor(htmlStyle["--shiki-light"], "light");
      const dark = themeColor(htmlStyle["--shiki-dark"], "dark");
      if (light) token.light = light;
      if (dark) token.dark = dark;
      if (previous && sameLook(previous, token)) previous.content += content;
      else merged.push(token);
    }
    return merged;
  });
}

/** Recent results: client components render the same blocks again on every state change. */
const cache = new Map<string, CodeLine[]>();
const CACHE_SIZE = 64;

/** Highlights `code` with both themes at once; see CodeToken. */
export function highlightCode(code: string, language?: string): CodeLine[] {
  const key = `${language ?? ""}\u0000${code}`;
  const cached = cache.get(key);
  if (cached) {
    cache.delete(key);
    cache.set(key, cached);
    return cached;
  }
  const lines = tokenize(code, language);
  cache.set(key, lines);
  if (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value!);
  return lines;
}

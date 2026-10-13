import type { ThemeRegistration } from "shiki/core";

/**
 * The two Shiki themes of CodeBlock: Material Lighter on the light site, Material Oceanic on the
 * dark one. Both give every TextMate scope the same role, so a token keeps its meaning and its
 * italic when the theme changes; only the colours differ. Italic is for control keywords,
 * attribute names, comments and `this`; nothing is bold.
 */
type Role =
  | "text"
  | "control"
  | "punctuation"
  | "declaration"
  | "attribute"
  | "function"
  | "parameter"
  | "tag"
  | "string"
  | "key"
  | "literal"
  | "self"
  | "type"
  | "comment";

const ITALIC_ROLES: ReadonlySet<Role> = new Set<Role>(["control", "attribute", "self", "comment"]);

/**
 * The scopes of each role. TextMate gives a token the rule of its most specific matching selector
 * (the deepest scope, then the longest one, then parent scopes), so general selectors such as
 * `punctuation` only reach what nothing more precise claims. `a > b` means b's direct parent is a.
 */
const SCOPES: Record<Role, string[]> = {
  text: [
    "variable",
    "variable.other.readwrite",
    // Brackets of calls and expressions, and commas.
    "meta.brace.round",
    "punctuation.bracket.round",
    "meta.method-call punctuation.definition.parameters",
    "punctuation.separator.comma",
    "punctuation.separator.parameter",
    "punctuation.separator.array",
    "punctuation.separator.dictionary.pair",
    "source.java punctuation.separator.delimiter",
    // The package path of a Java import.
    "storage.modifier.import",
    "storage.modifier.package",
    // The quotes around a JSX, HTML or XML attribute value, unlike those of strings in code.
    "meta.tag.attributes > string.quoted punctuation.definition.string",
    "meta.attribute > string.quoted punctuation.definition.string",
    "meta.tag.xml > string.quoted punctuation.definition.string",
  ],
  control: [
    "keyword.control",
    "keyword.control.import",
    "keyword.control.export",
    "keyword.control.from",
    "keyword.control.default",
    "keyword.control.flow",
    "keyword.control.conditional",
    "keyword.control.loop",
    "keyword.control.trycatch",
    "keyword.operator.new",
    "keyword.operator.expression",
    "storage.modifier.async",
    "keyword.other.import",
    "keyword.other.package",
  ],
  punctuation: [
    "keyword.operator",
    "punctuation",
    "meta.brace",
    "meta.brace.square",
    "meta.brace.curly",
    "punctuation.definition.string",
    "punctuation.definition.tag",
    "punctuation.section.embedded",
    "punctuation.definition.template-expression",
    "punctuation.definition.parameters",
    "punctuation.definition.binding-pattern",
    "punctuation.definition.block",
    "punctuation.terminator",
    "punctuation.accessor",
    "storage.type.function.arrow",
    // Bash: flags and the backslash that continues a line.
    "constant.other.option",
    "constant.character.escape.line-continuation",
  ],
  declaration: ["storage.type", "storage.modifier", "keyword.other", "storage.type.primitive"],
  attribute: ["entity.other.attribute-name"],
  function: [
    "entity.name.function",
    "support.function",
    "meta.function-call entity.name.function",
    "entity.name.type.class",
    // Bash: the command a line runs.
    "entity.name.command",
    "support.function.builtin",
  ],
  parameter: ["variable.parameter"],
  tag: ["entity.name.tag", "support.class.component"],
  string: ["string", "string.quoted", "string.template"],
  key: ["meta.object-literal.key", "support.type.property-name", "support.type.property-name.json"],
  literal: ["constant.numeric", "constant.language"],
  self: ["variable.language.this", "variable.language.super"],
  // Java writes every class it names as storage.type; its primitives stay declarations above.
  type: ["entity.name.type", "support.type", "meta.type.annotation", "source.java storage.type"],
  comment: ["comment", "punctuation.definition.comment"],
};

const LIGHT: Record<Role, string> = {
  text: "#37474F",
  control: "#39ADB5",
  punctuation: "#39ADB5",
  declaration: "#7C4DFF",
  attribute: "#7C4DFF",
  function: "#6182B8",
  parameter: "#E53935",
  tag: "#E53935",
  string: "#6A9A2F",
  key: "#E53935",
  literal: "#F76D47",
  self: "#E53935",
  type: "#B8860B",
  comment: "#90A4AE",
};

const DARK: Record<Role, string> = {
  text: "#EEFFFF",
  control: "#89DDFF",
  punctuation: "#89DDFF",
  declaration: "#C792EA",
  attribute: "#C792EA",
  function: "#82AAFF",
  parameter: "#FF5370",
  tag: "#F07178",
  string: "#C3E88D",
  key: "#F07178",
  literal: "#F78C6C",
  self: "#FF5370",
  type: "#FFCB6B",
  comment: "#546E7A",
};

export type CodeTheme = ThemeRegistration & {
  name: string;
  colors: { "editor.background": string; "editor.foreground": string };
};

function codeTheme(name: string, type: "light" | "dark", background: string, palette: Record<Role, string>): CodeTheme {
  return {
    name,
    type,
    colors: { "editor.background": background, "editor.foreground": palette.text },
    tokenColors: (Object.keys(SCOPES) as Role[]).map((role) => ({
      scope: SCOPES[role],
      // An explicit "" clears an italic a parent scope set.
      settings: { foreground: palette[role], fontStyle: ITALIC_ROLES.has(role) ? "italic" : "" },
    })),
  };
}

export const lightCodeTheme = codeTheme("wau-material-lighter", "light", "#FAFAFA", LIGHT);
export const darkCodeTheme = codeTheme("wau-material-oceanic", "dark", "#263238", DARK);

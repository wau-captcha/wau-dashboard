/**
 * Text as a search compares it: lowercase, without Vietnamese accents, so "khoa" finds "Khóa" and
 * "dang" finds "Đăng", and with each run of spaces made one.
 */
export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

/** Whether one of the fields contains the query, both normalized for search; an empty query matches. */
export function matchesSearch(query: string, ...fields: string[]): boolean {
  const needle = normalizeForSearch(query);
  return needle === "" || fields.some((field) => normalizeForSearch(field).includes(needle));
}

/**
 * The shape a translation must follow: same keys as the English source, any text in the
 * string slots, same parameters for message functions. A missing or extra key fails `tsc`.
 */
export type Translation<T> = T extends (...args: infer Args) => string
  ? (...args: Args) => string
  : T extends string
    ? string
    : { [Key in keyof T]: Translation<T[Key]> };

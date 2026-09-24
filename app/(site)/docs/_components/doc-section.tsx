import type { ReactNode } from "react";

/**
 * One section of the docs, reachable from the table of contents by its id. Its scroll margin
 * clears the header, which takes two rows on phones.
 */
export function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="grid scroll-mt-32 gap-4 sm:scroll-mt-24">
      <h2 className="font-brand text-title font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

/** A paragraph of docs prose. */
export function Prose({ children }: { children: ReactNode }) {
  return <p className="max-w-3xl text-prose text-muted-foreground">{children}</p>;
}

/** A small heading inside a section, e.g. above an endpoint. */
export function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-heading font-medium text-foreground">{children}</h3>;
}

/** A bulleted list of short docs facts. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid max-w-3xl list-disc gap-2 pl-5 text-prose text-muted-foreground marker:text-faint-foreground">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

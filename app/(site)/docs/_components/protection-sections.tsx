import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { autoCheckServer, autoCheckWidget, hostnameCheck } from "../../_components/snippets";
import { Bullets, DocSection, Prose, SubHeading } from "./doc-section";

type Sections = Dictionary["docs"]["sections"];

/** Site binding and what each SDK version sends: before the REST reference. */
export function BindingSections({ text }: { text: Sections }) {
  const versions = text.sdkVersions;
  const flag = (value: boolean) => (value ? versions.yes : versions.no);

  return (
    <>
      <DocSection id="site-binding" title={text.siteBinding.title}>
        <Prose>{text.siteBinding.body}</Prose>
        <Prose>{text.siteBinding.compare}</Prose>
        <CodeBlock language="javascript" code={hostnameCheck} />
        <Prose>{text.siteBinding.forgeable}</Prose>
      </DocSection>

      <DocSection id="sdk-versions" title={versions.title}>
        <Prose>{versions.body}</Prose>
        <Table aria-label={versions.title}>
          <TableHeader>
            <TableRow>
              <TableHead>{versions.columns.sdk}</TableHead>
              <TableHead>{versions.columns.siteKey}</TableHead>
              <TableHead>{versions.columns.behavior}</TableHead>
              <TableHead>{versions.columns.pow}</TableHead>
              <TableHead>{versions.columns.hints}</TableHead>
              <TableHead>{versions.columns.siteverify}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.rows.map((row) => (
              <TableRow key={row.sdk}>
                <TableCell className="font-mono text-overline">{row.sdk}</TableCell>
                <TableCell>{flag(row.siteKey)}</TableCell>
                <TableCell>{flag(row.behavior)}</TableCell>
                <TableCell>{flag(row.pow)}</TableCell>
                <TableCell>{flag(row.hints)}</TableCell>
                <TableCell>{row.body ? versions.jsonBody : versions.query}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Prose>{versions.oldClients}</Prose>
      </DocSection>
    </>
  );
}

/** What auto_check stops and what it does not, what it sends and how to ask for it: after the reference. */
export function AutoCheckSection({ text, baseUrl }: { text: Sections; baseUrl: string }) {
  const auto = text.autoCheck;
  return (
    <DocSection id="auto-check" title={auto.title}>
      <Prose>{auto.body}</Prose>
      <SubHeading>{auto.stopsTitle}</SubHeading>
      <Bullets items={auto.stops} />
      <SubHeading>{auto.limitsTitle}</SubHeading>
      <Bullets items={auto.limits} />
      <Prose>{auto.sends}</Prose>
      <Prose>{auto.fallback}</Prose>
      <Prose>{auto.integration}</Prose>
      <CodeBlock language="html" code={autoCheckWidget(baseUrl)} />
      <CodeBlock language="javascript" code={autoCheckServer} />
      <Prose>{auto.usage}</Prose>
      <Link href="/captchas/auto-check" className={buttonVariants({ variant: "link", className: "justify-self-start px-0" })}>
        {auto.more}
      </Link>
    </DocSection>
  );
}

/** What the service does not detect: the last section. */
export function LimitationsSection({ text }: { text: Sections }) {
  return (
    <DocSection id="limitations" title={text.limitations.title}>
      <Prose>{text.limitations.body}</Prose>
      <Bullets items={text.limitations.items} />
    </DocSection>
  );
}

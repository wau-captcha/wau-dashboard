import { CodeBlock } from "@/components/ui/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { hostnameCheck } from "../../_components/snippets";
import { Bullets, DocSection, Prose } from "./doc-section";

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

/** What the service does not detect: the last section. */
export function LimitationsSection({ text }: { text: Sections }) {
  return (
    <DocSection id="limitations" title={text.limitations.title}>
      <Prose>{text.limitations.body}</Prose>
      <Bullets items={text.limitations.items} />
    </DocSection>
  );
}

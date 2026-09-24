import { CodeBlock } from "@/components/ui/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { install, reactAction, reactModal, reactPage } from "../../_components/snippets";
import { DocSection, Prose, SubHeading } from "./doc-section";

type ReactText = Dictionary["docs"]["sections"]["react"];

/** The React component: installing it, a Next.js form with its server action, the modal mode and the props. */
export function ReactSection({ text, baseUrl }: { text: ReactText; baseUrl: string }) {
  return (
    <DocSection id="react" title={text.title}>
      <Prose>{text.body}</Prose>
      <CodeBlock language="bash" code={install.react} />
      <SubHeading>{text.nextTitle}</SubHeading>
      <Prose>{text.next}</Prose>
      <CodeBlock language="app/signup/page.tsx" code={reactPage(baseUrl)} />
      <CodeBlock language="app/signup/actions.ts" code={reactAction(baseUrl)} />
      <SubHeading>{text.modalTitle}</SubHeading>
      <Prose>{text.modal}</Prose>
      <CodeBlock language="app/signup/signup-captcha.tsx" code={reactModal(baseUrl)} />
      <SubHeading>{text.propsTitle}</SubHeading>
      <Table aria-label={text.propsTitle}>
        <TableHeader>
          <TableRow>
            <TableHead>{text.prop}</TableHead>
            <TableHead>{text.meaning}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {text.props.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-mono text-overline">{row.name}</TableCell>
              <TableCell className="whitespace-normal">{row.meaning}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Prose>{text.reset}</Prose>
    </DocSection>
  );
}

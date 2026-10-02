import { CodeBlock } from "@/components/ui/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { restNewChallenge, restSiteVerify, restVerifyAnswer } from "../../_components/snippets";
import { Bullets, DocSection, Prose, SubHeading } from "./doc-section";

type Sections = Dictionary["docs"]["sections"];

/** Reference docs: the REST endpoints, challenge types, limits and error codes. */
export function ReferenceSections({ text, baseUrl }: { text: Sections; baseUrl: string }) {
  return (
    <>
      <DocSection id="rest-api" title={text.api.title}>
        <Prose>{text.api.body}</Prose>
        <SubHeading>
          <code className="font-mono">GET /challenge/new</code>
        </SubHeading>
        <Prose>{text.api.newChallenge}</Prose>
        <CodeBlock language="bash" code={restNewChallenge(baseUrl)} />
        <SubHeading>
          <code className="font-mono">POST /challenge/verify</code>
        </SubHeading>
        <Prose>{text.api.verifyAnswer}</Prose>
        <CodeBlock language="bash" code={restVerifyAnswer(baseUrl)} />
        <SubHeading>
          <code className="font-mono">POST /siteverify</code>
        </SubHeading>
        <Prose>{text.api.siteVerify}</Prose>
        <CodeBlock language="bash" code={restSiteVerify(baseUrl)} />
      </DocSection>

      <DocSection id="challenge-types" title={text.challengeTypes.title}>
        <Bullets
          items={[
            text.challengeTypes.imageDistort,
            text.challengeTypes.motionNoise,
            text.challengeTypes.slidePuzzle,
          ]}
        />
        <Prose>{text.challengeTypes.note}</Prose>
      </DocSection>

      <DocSection id="security" title={text.security.title}>
        <Bullets
          items={[
            text.security.lifetimes,
            text.security.origins,
            text.security.rotation,
            text.security.quota,
            text.security.scraping,
          ]}
        />
      </DocSection>

      <DocSection id="errors" title={text.errors.title}>
        <Prose>{text.errors.sdkNote}</Prose>
        <Table aria-label={text.errors.title}>
          <TableHeader>
            <TableRow>
              <TableHead>{text.errors.code}</TableHead>
              <TableHead>{text.errors.meaning}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {text.errors.rows.map((row) => (
              <TableRow key={row.code}>
                <TableCell className="font-mono text-overline">{row.code}</TableCell>
                <TableCell className="whitespace-normal">{row.meaning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DocSection>
    </>
  );
}

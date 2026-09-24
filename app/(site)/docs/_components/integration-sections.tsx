import { CodeBlock } from "@/components/ui/code-block";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { clientCustom, install, javaVerify, nodeVerify, widgetBundler, widgetScript } from "../../_components/snippets";
import { Bullets, DocSection, Prose, SubHeading } from "./doc-section";
import { ReactSection } from "./react-section";

type Sections = Dictionary["docs"]["sections"];

/** The docs from the idea to a working integration: keys, the widget, React, the client and the server SDKs. */
export function IntegrationSections({ text, baseUrl }: { text: Sections; baseUrl: string }) {
  return (
    <>
      <DocSection id="overview" title={text.overview.title}>
        <Prose>{text.overview.body}</Prose>
        <SubHeading>{text.overview.keysTitle}</SubHeading>
        <Bullets items={[text.overview.siteKey, text.overview.secretKey, text.overview.keysWhere]} />
      </DocSection>

      <DocSection id="quick-start" title={text.quickStart.title}>
        <ol className="grid max-w-3xl list-decimal gap-2 pl-5 text-prose text-muted-foreground marker:text-faint-foreground">
          <li>{text.quickStart.step1}</li>
          <li>{text.quickStart.step2}</li>
          <li>{text.quickStart.step3}</li>
        </ol>
      </DocSection>

      <DocSection id="widget" title={text.widget.title}>
        <Prose>{text.widget.body}</Prose>
        <CodeBlock language="html" code={widgetScript(baseUrl)} />
        <Prose>{text.widget.attributes}</Prose>
        <Prose>{text.widget.bundler}</Prose>
        <CodeBlock language="bash" code={install.browser} />
        <CodeBlock language="javascript" code={widgetBundler(baseUrl)} />
      </DocSection>

      <ReactSection text={text.react} baseUrl={baseUrl} />

      <DocSection id="client" title={text.client.title}>
        <Prose>{text.client.body}</Prose>
        <CodeBlock language="javascript" code={clientCustom(baseUrl)} />
      </DocSection>

      <DocSection id="node" title={text.node.title}>
        <Prose>{text.node.body}</Prose>
        <CodeBlock language="bash" code={install.node} />
        <CodeBlock language="javascript" code={nodeVerify(baseUrl)} />
      </DocSection>

      <DocSection id="java" title={text.java.title}>
        <Prose>{text.java.body}</Prose>
        <CodeBlock language="xml" code={install.java} />
        <CodeBlock language="java" code={javaVerify(baseUrl)} />
      </DocSection>
    </>
  );
}

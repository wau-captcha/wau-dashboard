"use client";

import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { install } from "./snippets";

/** How to install each SDK, one tab per platform. */
export function SdkTabs({ labels }: { labels: { browser: string; react: string; node: string } }) {
  return (
    <Tabs defaultValue="browser">
      <TabsList>
        <TabsTab value="browser">{labels.browser}</TabsTab>
        <TabsTab value="react">{labels.react}</TabsTab>
        <TabsTab value="node">{labels.node}</TabsTab>
      </TabsList>
      <TabsPanel value="browser" className="pt-4">
        <CodeBlock language="bash" code={install.browser} />
      </TabsPanel>
      <TabsPanel value="react" className="pt-4">
        <CodeBlock language="bash" code={install.react} />
      </TabsPanel>
      <TabsPanel value="node" className="pt-4">
        <CodeBlock language="bash" code={install.node} />
      </TabsPanel>
    </Tabs>
  );
}

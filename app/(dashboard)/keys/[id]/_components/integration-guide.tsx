"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/client";

export type IntegrationGuideProps = {
  siteKey: string;
  /** Public address of the WAU Captcha API (WAU_PUBLIC_API_URL). */
  baseUrl: string;
};

/** Ready-to-paste calls for the three endpoints a site needs. */
export function IntegrationGuide({ siteKey, baseUrl }: IntegrationGuideProps) {
  const text = useI18n().t.keyDetail.guide;

  const newChallenge = `// ${text.createComment}
const response = await fetch(
  "${baseUrl}/challenge/new?site_key=${siteKey}",
);
const { challenge_id, challenge_type, image, mime_type } = await response.json();
// ${text.imageComment}`;

  const verify = `// ${text.verifyComment}
const response = await fetch("${baseUrl}/challenge/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ challenge_id, answer, site_key: "${siteKey}" }),
});
const { success, token } = await response.json();
// ${text.tokenComment}
// ${text.sdkComment}`;

  const siteVerify = `# ${text.siteVerifyComment}
curl -X POST "${baseUrl}/siteverify" \\
  -H "Authorization: Bearer $WAU_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d "{\\"token\\": \\"$TOKEN\\"}"

# {"success": true, "challenge_type": "image_distort", ...}`;

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="new">
          <TabsList>
            <TabsTab value="new">{text.create}</TabsTab>
            <TabsTab value="verify">{text.verify}</TabsTab>
            <TabsTab value="siteverify">{text.siteVerify}</TabsTab>
          </TabsList>
          <TabsPanel value="new">
            <CodeBlock code={newChallenge} language="javascript" />
          </TabsPanel>
          <TabsPanel value="verify">
            <CodeBlock code={verify} language="javascript" />
          </TabsPanel>
          <TabsPanel value="siteverify">
            <CodeBlock code={siteVerify} language="bash" />
          </TabsPanel>
        </Tabs>
      </CardContent>
    </Card>
  );
}

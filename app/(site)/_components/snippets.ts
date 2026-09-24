/**
 * Code samples of the home page and the docs. They are the same in every language; only the
 * address of the gateway changes, so each takes it as a parameter.
 */

export const install = {
  browser: "npm install @wau-captcha/client",
  react: "npm install @wau-captcha/react",
  node: "npm install @wau-captcha/server",
  java: `<dependency>
    <groupId>com.waucaptcha</groupId>
    <artifactId>wau-captcha-sdk</artifactId>
    <version>1.0.0</version>
</dependency>`,
};

export const widgetScript = (baseUrl: string) => `<script src="https://cdn.jsdelivr.net/npm/@wau-captcha/client@1/dist/wau-captcha.global.js"></script>

<form action="/signup" method="post">
  <input name="email" type="email" required />
  <div data-wau-captcha data-site-key="pk_…" data-base-url="${baseUrl}"></div>
  <button type="submit">Sign up</button>
</form>`;

export const widgetBundler = (baseUrl: string) => `import { renderWidget } from "@wau-captcha/client";

const widget = renderWidget(document.querySelector("#captcha"), {
  siteKey: "pk_…",
  baseUrl: "${baseUrl}",
  onSuccess(token) {
    // Also in the hidden input "wau-captcha-token" of the surrounding form.
  },
  onError(error) {
    console.error(error.code, error.message);
  },
});`;

export const reactPage = (baseUrl: string) => `import { WauCaptcha } from "@wau-captcha/react";
import { signUp } from "./actions";

export default function SignUpPage() {
  return (
    <form action={signUp}>
      <input name="email" type="email" required />
      <WauCaptcha siteKey="pk_…" baseUrl="${baseUrl}" />
      <button type="submit">Sign up</button>
    </form>
  );
}`;

export const reactAction = (baseUrl: string) => `"use server";

import { WauCaptchaServer } from "@wau-captcha/server";

export async function signUp(formData: FormData) {
  const captcha = new WauCaptchaServer({
    secretKey: process.env.WAU_SECRET_KEY!,
    baseUrl: "${baseUrl}",
  });
  const result = await captcha.verifyToken(String(formData.get("wau-captcha-token") ?? ""));
  if (!result.success) throw new Error("Please solve the captcha.");
  // … create the account
}`;

export const reactModal = (baseUrl: string) => `"use client";

import { ChallengeType, WauCaptcha, WauCaptchaMode } from "@wau-captcha/react";

export function SignUpCaptcha() {
  return (
    <WauCaptcha
      mode={WauCaptchaMode.MODAL}
      challengeType={ChallengeType.MOTION_NOISE}
      siteKey="pk_…"
      baseUrl="${baseUrl}"
      onSuccess={(token) => console.log("solved", token)}
      onError={(error) => console.error(error.code)}
    />
  );
}`;

export const clientCustom = (baseUrl: string) => `import { ChallengeType, WauCaptchaClient } from "@wau-captcha/client";

const captcha = new WauCaptchaClient({ siteKey: "pk_…", baseUrl: "${baseUrl}" });

const challenge = await captcha.newChallenge(); // or { challengeType: ChallengeType.MOTION_NOISE }
image.src = challenge.imageUrl;
image.width = challenge.width;
image.height = challenge.height;

const result = await captcha.verify(challenge.id, input.value);
if (result.success) {
  // Send result.token to your server with the form.
} else {
  // Wrong answer: the challenge is used up, fetch a new one.
}`;

export const nodeVerify = (baseUrl: string) => `import { ErrorCode, WauCaptchaServer } from "@wau-captcha/server";

const wau = new WauCaptchaServer({
  secretKey: process.env.WAU_SECRET_KEY,
  baseUrl: "${baseUrl}",
});

app.post("/signup", async (req, res) => {
  try {
    const result = await wau.verifyToken(req.body["wau-captcha-token"]);
    if (!result.success) return res.status(400).send("Please solve the captcha.");
  } catch (error) {
    if (error.code === ErrorCode.SECRET_KEY_INVALID) console.error("Check WAU_SECRET_KEY");
    return res.status(503).send("Captcha check unavailable."); // fail closed
  }
  // … create the account
});`;

export const javaVerify = (baseUrl: string) => `WauCaptchaClient wau = WauCaptchaClient.builder()
        .baseUrl("${baseUrl}")
        .secretKey(System.getenv("WAU_SECRET_KEY"))
        .build();

try {
    if (!wau.verifyToken(request.getParameter("wau-captcha-token")).success()) {
        // reject the request
    }
} catch (WauCaptchaException e) {
    // e.getCode(): SECRET_KEY_INVALID, NETWORK_ERROR, … — fail closed
}`;

export const restNewChallenge = (baseUrl: string) => `curl "${baseUrl}/challenge/new?site_key=pk_…&challenge_type=image_distort"

{
  "challenge_id": "0f9c…",
  "challenge_type": "image_distort",
  "image": "iVBORw0KGgo…",
  "mime_type": "image/png",
  "width": 200,
  "height": 70,
  "expires_in": 120
}`;

export const restVerifyAnswer = (baseUrl: string) => `curl -X POST "${baseUrl}/challenge/verify" \\
  -H "Content-Type: application/json" \\
  -d '{"challenge_id": "0f9c…", "answer": "a8Kq2"}'

{ "success": true, "token": "…", "expires_in": 120 }`;

export const restSiteVerify = (baseUrl: string) => `curl -X POST "${baseUrl}/siteverify?token=$TOKEN" \\
  -H "Authorization: Bearer $WAU_SECRET_KEY"

{ "success": true, "challenge_type": "image_distort", "challenge_ts": "2026-09-23T08:15:02Z" }`;

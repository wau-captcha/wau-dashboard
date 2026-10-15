import { CLIENT_CDN_INTEGRITY, CLIENT_CDN_URL } from "@/lib/sdk-cdn";

/**
 * Code samples of the home page and the docs. They are the same in every language; only the
 * public address of the API (WAU_PUBLIC_API_URL) changes, so each takes it as a parameter.
 */

export const install = {
  browser: "npm install @wau-captcha/client",
  react: "npm install @wau-captcha/react",
  node: "npm install @wau-captcha/server",
  java: `<dependency>
    <groupId>com.waucaptcha</groupId>
    <artifactId>wau-captcha-sdk</artifactId>
    <version>1.1.0</version>
</dependency>`,
  gradle: `implementation("com.waucaptcha:wau-captcha-sdk:1.1.0")`,
};

export const widgetScript = (baseUrl: string) => `<script
  src="${CLIENT_CDN_URL}"
  integrity="${CLIENT_CDN_INTEGRITY}"
  crossorigin="anonymous"></script>

<form action="/signup" method="post">
  <input name="email" type="email" required />
  <div data-wau-captcha data-site-key="pk_…" data-base-url="${baseUrl}"></div>
  <button type="submit">Sign up</button>
</form>`;

/** The integrity hash of another release of the <script> build. */
export const sriCommand = (version: string) => `# In a clone of github.com/wau-captcha/wau-sdk-js:
node scripts/sri.mjs ${version}

# Or with curl and openssl:
curl -s https://cdn.jsdelivr.net/npm/@wau-captcha/client@${version}/dist/wau-captcha.global.js \\
  | openssl dgst -sha384 -binary | openssl base64 -A`;

export const auditSignatures = `npm install @wau-captcha/server
npm audit signatures`;

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

import { BehaviorVerdict, WauCaptchaServer } from "@wau-captcha/server";

export async function signUp(formData: FormData) {
  const captcha = new WauCaptchaServer({
    secretKey: process.env.WAU_SECRET_KEY!,
    baseUrl: "${baseUrl}",
  });
  const result = await captcha.verifyToken(String(formData.get("wau-captcha-token") ?? ""));
  // hostname is the website the captcha was solved on: it must be yours.
  if (!result.success || result.hostname !== "shop.example.com") throw new Error("Please solve the captcha.");
  // Sign-up accepts human only: suspicious is a scripted session, and not_measured means the
  // client sent no behaviour data (an SDK before 1.2.0 or a hand-written call), so it is untrusted.
  if (result.behavior.verdict !== BehaviorVerdict.HUMAN) throw new Error("Please try again.");
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

// Fetch it when it is shown, not ahead of time. The client solves its proof of work meanwhile.
const challenge = await captcha.newChallenge(); // or { challengeType: ChallengeType.MOTION_NOISE }
image.src = challenge.imageUrl;
image.width = challenge.width;
image.height = challenge.height;

// Sends the site key and the proof of work too; pass { behavior } from recordBehavior as well.
const result = await captcha.verify(challenge.id, input.value);
if (result.success) {
  // Send result.token to your server with the form.
} else {
  // Wrong answer: the challenge is used up, fetch a new one.
}`;

export const nodeVerify = (baseUrl: string) => `import { BehaviorVerdict, ErrorCode, WauCaptchaServer } from "@wau-captcha/server";

const wau = new WauCaptchaServer({
  secretKey: process.env.WAU_SECRET_KEY,
  baseUrl: "${baseUrl}",
});

app.post("/signup", async (req, res) => {
  try {
    const result = await wau.verifyToken(req.body["wau-captcha-token"]);
    // hostname is the website the captcha was solved on: compare it with yours.
    if (!result.success || result.hostname !== "shop.example.com") return res.status(400).send("Please solve the captcha.");
    // result.behavior: { verdict, score, reasons }. not_measured means no behaviour data was sent:
    // untrusted. Decide about suspicious per form; for sign-up, accept human only.
    if (result.behavior.verdict !== BehaviorVerdict.HUMAN) return res.status(400).send("Please try again.");
  } catch (error) {
    if (error.code === ErrorCode.SECRET_KEY_INVALID) console.error("Check WAU_SECRET_KEY");
    return res.status(503).send("Captcha check unavailable."); // fail closed
  }
  // … create the account
});`;

export const javaVerify = (baseUrl: string) => `import com.waucaptcha.BehaviorVerdict;
import com.waucaptcha.ErrorCode;
import com.waucaptcha.SiteVerifyResult;
import com.waucaptcha.WauCaptchaClient;
import com.waucaptcha.WauCaptchaException;

// Build it once and share it: it is immutable and safe to use from many threads.
WauCaptchaClient wau = WauCaptchaClient.builder()
        .baseUrl("${baseUrl}")
        .secretKey(System.getenv("WAU_SECRET_KEY"))
        .build();

boolean captchaPassed(String token) {
    try {
        SiteVerifyResult result = wau.verifyToken(token);
        // hostname is the website the captcha was solved on: compare it with yours.
        if (!result.success() || !result.hostname().equals("shop.example.com")) return false;
        // result.behavior(): verdict, score, reasons. NOT_MEASURED means no behaviour data was sent:
        // untrusted. Decide about SUSPICIOUS per form; for sign-up, accept HUMAN only.
        return result.behavior().verdict() == BehaviorVerdict.HUMAN;
    } catch (WauCaptchaException e) {
        if (ErrorCode.SECRET_KEY_INVALID.equals(e.getCode())) log.error("Check WAU_SECRET_KEY");
        return false; // fail closed: the token could not be checked
    }
}`;

export const javaChallenge = (baseUrl: string) => `WauCaptchaClient captcha = WauCaptchaClient.builder()
        .baseUrl("${baseUrl}")
        .siteKey("pk_…")
        .build();

Challenge challenge = captcha.newChallenge(ChallengeType.OBJECT_ROTATE);
// Show frame 0 of challenge.image(), then of challenge.secondImage(): each is a strip of
// challenge.frameCount() frames. Record each round's presses, as RotateRound(frame, presses,
// doneMs), and how the person behaved. The call sends the site key and the proof of work too.
AnswerResult result = captcha.verifyRotate(challenge, List.of(round1, round2), behavior);
if (result.success()) {
    // Send result.token() to your server, which redeems it with verifyToken.
}`;

export const restNewChallenge = (baseUrl: string) => `curl "${baseUrl}/challenge/new?site_key=pk_…&challenge_type=image_distort"

{
  "challenge_id": "0f9c…",
  "challenge_type": "image_distort",
  "image": "iVBORw0KGgo…",
  "mime_type": "image/png",
  "width": 200,
  "height": 70,
  "expires_in": 120,
  "pow_salt": "q2Jq0tbV1Wm9u3hS5bH0pA==",
  "pow_difficulty": 15
}`;

export const restVerifyAnswer = (baseUrl: string) => `curl -X POST "${baseUrl}/challenge/verify" \\
  -H "Content-Type: application/json" \\
  -d '{"challenge_id": "0f9c…", "answer": "a8Kq2", "site_key": "pk_…", "pow_nonce": "48213", "behavior": { "version": 1, "elapsed_ms": 4210, … }}'

{ "success": true, "token": "…", "expires_in": 120, "clearance": "…" }`;

export const restSiteVerify = (baseUrl: string) => `curl -X POST "${baseUrl}/siteverify" \\
  -H "Authorization: Bearer $WAU_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d "{\\"token\\": \\"$TOKEN\\"}"

{
  "success": true,
  "challenge_type": "image_distort",
  "challenge_ts": "2026-09-23T08:15:02Z",
  "behavior": { "verdict": "human", "score": 1, "reasons": [] },
  "hostname": "shop.example.com"
}`;

export const autoCheckWidget = (baseUrl: string) => `<div
  data-wau-captcha
  data-site-key="pk_…"
  data-base-url="${baseUrl}"
  data-challenge-type="auto_check"
  data-fallback-type="image_distort"
  data-appearance="interaction-only"></div>`;

export const autoCheckServer = `const result = await wau.verifyToken(token);
if (!result.success || result.hostname !== "shop.example.com") throw new Error("Please solve the captcha.");
// Passed auto_check on its signals alone, without a puzzle: a sign-up asks for one instead.
if (result.behavior.reasons.includes("first_visit")) {
  // e.g. show the form again with challengeType slide_puzzle
}`;

export const hostnameCheck = `const result = await wau.verifyToken(token);
if (!result.success || result.hostname !== "shop.example.com") {
  // Unknown token, or solved on another website: refuse the request.
}`;

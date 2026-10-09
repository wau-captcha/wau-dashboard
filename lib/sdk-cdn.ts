/**
 * The @wau-captcha/client release the CDN snippet of the docs loads, and the Subresource
 * Integrity hash of its <script> build. The two change together, after each release: run
 * `node scripts/sri.mjs <version>` in wau-sdk-js and paste both here. The version is exact, never
 * a range like @1, so the hash always matches the file the browser gets.
 */
export const CLIENT_CDN_VERSION = "1.2.0";
export const CLIENT_CDN_INTEGRITY = "sha384-JCCDk22ace8H/SxwJrBtMwmAZJ6nI6xzrCg+Lt3L3AqM6S4vd1j5VGPkgPNCUHla";

export const CLIENT_CDN_URL = `https://cdn.jsdelivr.net/npm/@wau-captcha/client@${CLIENT_CDN_VERSION}/dist/wau-captcha.global.js`;

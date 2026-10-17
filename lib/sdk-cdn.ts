/**
 * The @waucaptcha-sdk/client release the CDN snippet of the docs loads, and the Subresource
 * Integrity hash of its <script> build. The two change together, after each release: run
 * `node scripts/sri.mjs <version>` in wau-sdk-js and paste both here. The version is exact, never
 * a range like @1, so the hash always matches the file the browser gets.
 */
export const CLIENT_CDN_VERSION = "1.7.0";
export const CLIENT_CDN_INTEGRITY = "sha384-6HEd83rCb1Wox8RT7prjB5GeuWB7ylmSj1DBZ9+2varqFoa+2OMJKpCYl7xktRTs";

export const CLIENT_CDN_URL = `https://cdn.jsdelivr.net/npm/@waucaptcha-sdk/client@${CLIENT_CDN_VERSION}/dist/wau-captcha.global.js`;

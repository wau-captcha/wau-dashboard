/** Shared between the server session helpers and the proxy, which cannot import server-only code. */
export const SESSION_COOKIE = "wau_session";

/**
 * Nonce that binds a Google ID token to the browser that asked for it. The proxy issues it on
 * /login, the sign-in action sends it with the token and wau-services checks that both match.
 */
export const GOOGLE_NONCE_COOKIE = "wau_google_nonce";

/** Hands a nonce the proxy just issued to the render of the same request. */
export const GOOGLE_NONCE_HEADER = "x-google-nonce";

export const GOOGLE_NONCE_MAX_AGE_SECONDS = 60 * 60;

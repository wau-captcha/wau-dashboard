/** The parts of Google Identity Services (accounts.google.com/gsi/client) the dashboard uses. */

export type GoogleCredentialResponse = {
  /** The ID token (JWT). */
  credential: string;
  select_by?: string;
};

export type GoogleIdConfiguration = {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  /** Echoed as the `nonce` claim of the ID token. */
  nonce?: string;
  ux_mode?: "popup" | "redirect";
};

export type GoogleButtonConfiguration = {
  type: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black" | "outline_dark";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  /** Minimum width in pixels, at most 400. */
  width?: string;
  locale?: string;
};

export type GoogleAccountsId = {
  /** Only the configuration of the latest call is used. */
  initialize: (config: GoogleIdConfiguration) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleAccountsId } };
  }
}

const SCRIPT_URL = "https://accounts.google.com/gsi/client";

let loading: Promise<GoogleAccountsId> | undefined;

/**
 * Loads the script once per page; a failed load can be retried. `hl` sets the language of
 * the text Google draws before its button frame is ready; the frame itself follows `locale`.
 */
export function loadGoogleIdentity(hl: string): Promise<GoogleAccountsId> {
  const ready = window.google?.accounts?.id;
  if (ready) return Promise.resolve(ready);

  loading ??= new Promise<GoogleAccountsId>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${SCRIPT_URL}?hl=${encodeURIComponent(hl)}`;
    script.async = true;
    const fail = (message: string) => {
      script.remove();
      loading = undefined;
      reject(new Error(message));
    };
    script.onload = () => {
      const api = window.google?.accounts?.id;
      if (api) resolve(api);
      else fail("Google Identity Services did not initialise");
    };
    script.onerror = () => fail("Google Identity Services failed to load");
    document.head.appendChild(script);
  });
  return loading;
}

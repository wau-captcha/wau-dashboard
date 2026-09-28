import type { Locale } from "./config";
import { account } from "./messages/account";
import { admin } from "./messages/admin";
import { auth } from "./messages/auth";
import { billing } from "./messages/billing";
import { challengeTypes } from "./messages/challenge-types";
import { common } from "./messages/common";
import { docs } from "./messages/docs";
import { errors } from "./messages/errors";
import { keyDetail } from "./messages/key-detail";
import { keys } from "./messages/keys";
import { site } from "./messages/site";
import { usage } from "./messages/usage";

/**
 * All app strings for one language. Plain module (no server-only): client components import it
 * directly because message functions cannot cross the server/client boundary as props.
 */
export type Dictionary = {
  common: typeof common.en;
  auth: typeof auth.en;
  usage: typeof usage.en;
  keys: typeof keys.en;
  keyDetail: typeof keyDetail.en;
  account: typeof account.en;
  billing: typeof billing.en;
  errors: typeof errors.en;
  challengeTypes: typeof challengeTypes.en;
  admin: typeof admin.en;
  site: typeof site.en;
  docs: typeof docs.en;
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: common.en,
    auth: auth.en,
    usage: usage.en,
    keys: keys.en,
    keyDetail: keyDetail.en,
    account: account.en,
    billing: billing.en,
    errors: errors.en,
    challengeTypes: challengeTypes.en,
    admin: admin.en,
    site: site.en,
    docs: docs.en,
  },
  vi: {
    common: common.vi,
    auth: auth.vi,
    usage: usage.vi,
    keys: keys.vi,
    keyDetail: keyDetail.vi,
    account: account.vi,
    billing: billing.vi,
    errors: errors.vi,
    challengeTypes: challengeTypes.vi,
    admin: admin.vi,
    site: site.vi,
    docs: docs.vi,
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

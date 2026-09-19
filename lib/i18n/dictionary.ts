import type { Locale } from "./config";
import { account } from "./messages/account";
import { admin } from "./messages/admin";
import { auth } from "./messages/auth";
import { challengeTypes } from "./messages/challenge-types";
import { common } from "./messages/common";
import { errors } from "./messages/errors";
import { keyDetail } from "./messages/key-detail";
import { keys } from "./messages/keys";
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
  errors: typeof errors.en;
  challengeTypes: typeof challengeTypes.en;
  admin: typeof admin.en;
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: common.en,
    auth: auth.en,
    usage: usage.en,
    keys: keys.en,
    keyDetail: keyDetail.en,
    account: account.en,
    errors: errors.en,
    challengeTypes: challengeTypes.en,
    admin: admin.en,
  },
  vi: {
    common: common.vi,
    auth: auth.vi,
    usage: usage.vi,
    keys: keys.vi,
    keyDetail: keyDetail.vi,
    account: account.vi,
    errors: errors.vi,
    challengeTypes: challengeTypes.vi,
    admin: admin.vi,
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

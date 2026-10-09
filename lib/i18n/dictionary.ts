import type { Locale } from "./config";
import { account } from "./messages/account";
import { admin } from "./messages/admin";
import { appeals } from "./messages/appeals";
import { auth } from "./messages/auth";
import { billing } from "./messages/billing";
import { captchaGuides } from "./messages/captcha-guides";
import { captchas } from "./messages/captchas";
import { challengeTypes } from "./messages/challenge-types";
import { common } from "./messages/common";
import { docs } from "./messages/docs";
import { errors } from "./messages/errors";
import { keyActivity } from "./messages/key-activity";
import { keyDetail } from "./messages/key-detail";
import { keyProtection } from "./messages/key-protection";
import { keys } from "./messages/keys";
import { legal } from "./messages/legal";
import { payments } from "./messages/payments";
import { site } from "./messages/site";
import { trust } from "./messages/trust";
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
  keyProtection: typeof keyProtection.en;
  keyActivity: typeof keyActivity.en;
  account: typeof account.en;
  billing: typeof billing.en;
  payments: typeof payments.en;
  errors: typeof errors.en;
  challengeTypes: typeof challengeTypes.en;
  admin: typeof admin.en;
  appeals: typeof appeals.en;
  site: typeof site.en;
  docs: typeof docs.en;
  captchas: typeof captchas.en;
  captchaGuides: typeof captchaGuides.en;
  legal: typeof legal.en;
  trust: typeof trust.en;
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: common.en,
    auth: auth.en,
    usage: usage.en,
    keys: keys.en,
    keyDetail: keyDetail.en,
    keyProtection: keyProtection.en,
    keyActivity: keyActivity.en,
    account: account.en,
    billing: billing.en,
    payments: payments.en,
    errors: errors.en,
    challengeTypes: challengeTypes.en,
    admin: admin.en,
    appeals: appeals.en,
    site: site.en,
    docs: docs.en,
    captchas: captchas.en,
    captchaGuides: captchaGuides.en,
    legal: legal.en,
    trust: trust.en,
  },
  vi: {
    common: common.vi,
    auth: auth.vi,
    usage: usage.vi,
    keys: keys.vi,
    keyDetail: keyDetail.vi,
    keyProtection: keyProtection.vi,
    keyActivity: keyActivity.vi,
    account: account.vi,
    billing: billing.vi,
    payments: payments.vi,
    errors: errors.vi,
    challengeTypes: challengeTypes.vi,
    admin: admin.vi,
    appeals: appeals.vi,
    site: site.vi,
    docs: docs.vi,
    captchas: captchas.vi,
    captchaGuides: captchaGuides.vi,
    legal: legal.vi,
    trust: trust.vi,
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

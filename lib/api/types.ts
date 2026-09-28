/** Shapes returned by wau-services, in the JSON names the gateway sends. */

export type User = {
  id: string;
  /** Display name taken from the Google profile; not unique. */
  username: string;
  email: string;
  /** The tier now: a paid tier past tier_expires_at is already reported as free. */
  tier_id: string;
  tier_name: string;
  create_date: string;
  /** When the paid tier ends and the account goes back to free; null when it never ends. */
  tier_expires_at?: string | null;
};

export type AuthReply = {
  access_token: string;
  /** Seconds until the token expires. */
  expires_in: number;
  user: User;
};

/**
 * An administrator of the admin console. Administrators are not users: they have their own
 * table, sign-in and session, and a person may be both with the same Gmail.
 */
export type Admin = {
  id: string;
  username: string;
  email: string;
  create_date: string;
};

export type AdminAuthReply = {
  access_token: string;
  /** Seconds until the token expires. */
  expires_in: number;
  admin: Admin;
};

export type ApiKey = {
  id: string;
  name: string;
  site_key: string;
  secret_key: string;
  is_active: boolean;
  create_date: string;
  /** Blocked by an administrator or the scraping check; only an administrator can lift it. */
  is_suspended: boolean;
  /** Addresses allowed to use the site key; empty lets every address. Only GetApiKey fills it. */
  allowed_origins?: AllowedOrigin[];
  /** The secret key the last reset replaced, while it still works. */
  previous_secret_key?: string;
  previous_secret_key_expires_at?: string;
  suspend_reason: SuspendReason;
};

/** Why a key is suspended; empty when it is not. */
export type SuspendReason = "" | "ADMIN" | "SCRAPING";

/** One address, or network, allowed to use a site key. */
export type AllowedOrigin = {
  /** IPv4 or IPv6 network, e.g. "203.0.113.4/32" or "203.0.113.0/24". */
  ip_address: string;
  description?: string;
  /** Missing on a row that has not been saved yet. */
  create_date?: string;
};

export type ApiKeySet = {
  api_keys: ApiKey[];
  max_api_keys: number;
};

/**
 * What became of a set of challenges: issued (/challenge/new), answered (/challenge/verify) and
 * answered right. Only right answers count as usage against the quota.
 */
export type UsageCount = {
  challenges: number;
  verifications: number;
  successes: number;
};

export type DailyUsage = UsageCount & {
  /** Local date, "YYYY-MM-DD". */
  date: string;
};

/** One API key or challenge type, day by day over the same days as Usage.days. */
export type UsageSeries = UsageCount & {
  id: string;
  days: DailyUsage[];
  /** The key's name, which may be empty; empty for a challenge type. */
  name: string;
  /** Whether the key was deleted since; its usage still counts. */
  deleted: boolean;
  /** When the key was created; empty for a challenge type. */
  create_date: string;
};

export type Usage = UsageCount & {
  days: DailyUsage[];
  /** Busiest first; empty for the whole system. */
  by_api_key: UsageSeries[];
  by_challenge_type: UsageSeries[];
};

/** Successful verifications today against the daily quota of the tier. */
export type Quota = {
  used: number;
  limit: number;
  /** Local date being counted, "YYYY-MM-DD". */
  date: string;
  resets_at: string;
  /** Minutes until resets_at, worked out when the quota was fetched. */
  minutes_to_reset: number;
};

export type AdminStats = {
  users: number;
  banned_users: number;
  api_keys: number;
  suspended_api_keys: number;
  scraping_api_keys: number;
};

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  tier_id: string;
  tier_name: string;
  create_date: string;
  is_banned: boolean;
  api_key_count: number;
  quota_used: number;
  daily_quota: number;
  /** When the paid tier ends; null when it never ends. */
  tier_expires_at?: string | null;
};

export type UserPage = {
  users: AdminUser[];
  total_size: number;
};

/** An API key as administrators see it: never with its secret key. */
export type AdminApiKey = {
  id: string;
  name: string;
  site_key: string;
  is_active: boolean;
  is_suspended: boolean;
  suspend_reason: SuspendReason;
  create_date: string;
  challenges_today: number;
  verifications_today: number;
};

export type ChallengeType = {
  id: string;
  code: string;
};

/**
 * What buying one month of a plan does for the viewer: "upgrade" starts it now (the time left on
 * the current plan is dropped), "renew" moves the current end a month later, and "" means it
 * cannot be bought (not sold, below the current plan, or the current plan with no end date).
 */
export type Purchase = "" | "upgrade" | "renew";

/** How long one purchase extends a plan. */
export type BillingPeriod = "month" | "year";

/** A tier as it is sold, by the month or by the year. */
export type Plan = {
  tier_id: string;
  tier_name: string;
  description: string;
  /** VND for one month; 0 for a plan that is not sold (free). Plans rank by it. */
  monthly_price: number;
  /** VND for one year; 0 when the plan is not sold by the year. */
  yearly_price: number;
  daily_quota: number;
  challenge_types: string[];
  purchase: Purchase;
};

export type PlanSet = {
  /** Cheapest first. */
  plans: Plan[];
  current_tier_id: string;
  /** When the current plan ends; null when it never ends. */
  current_tier_expires_at: string | null;
};

/** "expired": not paid in time; it still succeeds if SePay reports the payment later. */
export type TransactionStatus = "pending" | "succeeded" | "expired";

/** One month or one year of a plan, bought or being bought. */
export type Transaction = {
  id: string;
  tier_id: string;
  tier_name: string;
  /** VND. */
  amount: number;
  period: BillingPeriod;
  status: TransactionStatus;
  /** The order invoice number SePay shows. */
  payment_code: string;
  create_date: string;
  expires_at: string;
  paid_at: string | null;
};

/** A pending transaction and the signed form the browser posts to SePay, fields in order. */
export type Checkout = {
  transaction: Transaction;
  action_url: string;
  fields: { name: string; value: string }[];
};

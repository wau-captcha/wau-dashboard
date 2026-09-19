/** Shapes returned by wau-services, in the JSON names the gateway sends. */

export type User = {
  id: string;
  /** Display name taken from the Google profile; not unique. */
  username: string;
  email: string;
  tier_id: string;
  tier_name: string;
  create_date: string;
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
  suspend_reason: SuspendReason;
};

/** Why a key is suspended; empty when it is not. */
export type SuspendReason = "" | "admin" | "scraping";

export type ApiKeySet = {
  api_keys: ApiKey[];
  max_api_keys: number;
};

export type UsageCount = {
  total: number;
  success: number;
};

export type DailyUsage = UsageCount & {
  /** Local date, "YYYY-MM-DD". */
  date: string;
};

export type ChallengeTypeUsage = UsageCount & {
  challenge_type: string;
};

/** One API key or challenge type, day by day over the same days as Usage.days. */
export type UsageSeries = UsageCount & {
  id: string;
  days: DailyUsage[];
};

export type Usage = UsageCount & {
  days: DailyUsage[];
  challenge_types: ChallengeTypeUsage[];
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

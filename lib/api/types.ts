/** Shapes returned by wau-services, in the JSON names the gateway sends. */

export type User = {
  id: string;
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

export type ApiKey = {
  id: string;
  name: string;
  site_key: string;
  secret_key: string;
  is_active: boolean;
  create_date: string;
};

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

export type Usage = UsageCount & {
  days: DailyUsage[];
  challenge_types: ChallengeTypeUsage[];
};

export type ChallengeType = {
  id: string;
  code: string;
};

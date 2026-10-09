/** The appeals the admin console can list, by status; "all" lists every one. */
export const APPEAL_FILTERS = ["pending", "approved", "rejected", "all"] as const;

export type AppealFilter = (typeof APPEAL_FILTERS)[number];

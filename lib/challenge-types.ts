import type { Dictionary } from "@/lib/i18n/dictionary";

type ChallengeTypeText = Dictionary["challengeTypes"];
type Entry = { label: string; description: string };

function entry(id: string, t: ChallengeTypeText): Entry | undefined {
  return (t.types as Record<string, Entry | undefined>)[id];
}

/** "image_distort" → "Distorted text"; unknown ids are shown as they are. */
export function challengeTypeLabel(id: string, t: ChallengeTypeText): string {
  return entry(id, t)?.label ?? id;
}

export function challengeTypeDescription(id: string, t: ChallengeTypeText): string {
  return entry(id, t)?.description ?? t.fallbackDescription;
}

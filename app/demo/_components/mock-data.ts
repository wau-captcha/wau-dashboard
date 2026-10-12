import type { BadgeTone } from "@/components/ui/badge";
import type { SelectOption } from "@/components/ui/options";

// Deterministic pseudo-random data so the server and client render the same markup.
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const random = createRandom(20260915);
const hex = (length: number) => Array.from({ length }, () => Math.floor(random() * 16).toString(16)).join("");

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export type KeyStatus = "active" | "paused" | "deleted";

export const keyStatusMeta: Record<KeyStatus, { label: string; tone: BadgeTone }> = {
  active: { label: "Hoạt động", tone: "positive" },
  paused: { label: "Tạm dừng", tone: "warning" },
  deleted: { label: "Đã xóa", tone: "negative" },
};

export type DemoApiKey = {
  id: string;
  name: string;
  siteKey: string;
  secretKey: string;
  owner: string;
  tier: "free" | "premium";
  status: KeyStatus;
  requests: number;
  successRate: number;
  createdAt: Date;
};

export const apiKeys: DemoApiKey[] = [
  {
    id: "k1",
    name: "shop.johndoe.vn",
    siteKey: "pk_26b842dfa84e187d45bfe73655182748471351d8ecb93b36",
    secretKey: "sk_c582fa0b9d443ebe604ae50b3756c8b0560dda11c15e3c2a",
    owner: "john_doe",
    tier: "premium",
    status: "active",
    requests: 128430,
    successRate: 0.972,
    createdAt: new Date("2026-08-02T03:10:00Z"),
  },
  {
    id: "k2",
    name: "blog.johndoe.vn",
    siteKey: "pk_2439afc3901b63928624704a93fda564102959a6d8e7aea9",
    secretKey: "sk_ee06e26da3dd1e365e842ba29e4813917da1246f36becbec",
    owner: "john_doe",
    tier: "premium",
    status: "paused",
    requests: 5120,
    successRate: 0.941,
    createdAt: new Date("2026-08-11T09:45:00Z"),
  },
  {
    id: "k3",
    name: "janesmith.dev",
    siteKey: "pk_a834b1bc44ccc6acc68b8b78d552b30cefac0d73ff6ade0e",
    secretKey: "sk_4a43813384268b62be376cf7b81eb47ca9619c23e2b4c198",
    owner: "jane_smith",
    tier: "free",
    status: "active",
    requests: 9321,
    successRate: 0.958,
    createdAt: new Date("2026-09-01T12:00:00Z"),
  },
  {
    id: "k4",
    name: "acmeshop.example",
    siteKey: "pk_09eb63b2940720bfd832887c8fdc1973658317f2ae8d322e",
    secretKey: "sk_d628fcee5254443b091842f178f28ded2589356b6a7dc09e",
    owner: "acme_shop",
    tier: "free",
    status: "active",
    requests: 0,
    successRate: 0,
    createdAt: new Date("2026-09-14T16:20:00Z"),
  },
  ...(
    [
      ["tuyendung.nguyenvana.vn", "nguyen_van_a", "premium", "deleted", 20411, 0.912, "2026-06-20T02:00:00Z"],
      ["dattour.tranthib.com", "tran_thi_b", "free", "active", 764, 0.88, "2026-07-03T08:30:00Z"],
      ["api.levanc.io", "le_van_c", "premium", "active", 58210, 0.983, "2026-07-18T14:05:00Z"],
      ["forum.phamthid.vn", "pham_thi_d", "free", "paused", 3310, 0.903, "2026-08-25T11:15:00Z"],
    ] as const
  ).map(([name, owner, tier, status, requests, successRate, createdAt], index) => ({
    id: `k${index + 5}`,
    name,
    siteKey: `pk_${hex(48)}`,
    secretKey: `sk_${hex(48)}`,
    owner,
    tier,
    status,
    requests,
    successRate,
    createdAt: new Date(createdAt),
  })),
];

export type DemoUsageLog = {
  id: number;
  siteName: string;
  challengeType: string;
  success: boolean;
  timestamp: Date;
};

const logChallengeTypes = ["image_distort", "motion_noise", "slide_puzzle", "animal_jump", "object_rotate", "auto_check"];
const logStart = Date.UTC(2026, 8, 15, 7, 30, 0);

export const usageLogs: DemoUsageLog[] = Array.from({ length: 137 }, (_, index) => ({
  id: 48210 - index,
  siteName: apiKeys[Math.floor(random() * 7)].name,
  challengeType: logChallengeTypes[Math.floor(random() * logChallengeTypes.length)],
  success: random() > 0.17,
  timestamp: new Date(logStart - index * 540_000 - Math.floor(random() * 240_000)),
}));

export const challengeTypeOptions: SelectOption[] = [
  { value: "image_distort", label: "image_distort", description: "Ảnh chữ bị bóp méo" },
  { value: "motion_noise", label: "motion_noise", description: "GIF nhiễu chuyển động" },
  { value: "slide_puzzle", label: "slide_puzzle", description: "Kéo mảnh ghép" },
  { value: "animal_jump", label: "animal_jump", description: "Bấm con vật nhảy cao nhất" },
  { value: "object_rotate", label: "object_rotate", description: "Xoay vật theo mũi tên" },
  { value: "auto_check", label: "auto_check", description: "Xác minh ngầm, chỉ hiện captcha khi chưa chắc chắn" },
  { value: "behavioral_advanced", label: "behavioral_advanced", description: "Phân tích hành vi (sắp có)", disabled: true },
];

export const tierOptions: SelectOption[] = [
  { value: "free", label: "Free", description: "Challenge cơ bản" },
  { value: "premium", label: "Premium", description: "Mở khóa challenge nâng cao" },
];

export const intervalOptions: SelectOption[] = [
  { value: "1h", label: "1 giờ", group: "Theo giờ" },
  { value: "6h", label: "6 giờ", group: "Theo giờ" },
  { value: "24h", label: "24 giờ", group: "Theo giờ" },
  { value: "7d", label: "7 ngày", group: "Theo ngày" },
  { value: "30d", label: "30 ngày", group: "Theo ngày" },
  { value: "90d", label: "90 ngày", group: "Theo ngày" },
];

const usernames = [
  "john_doe", "jane_smith", "acme_shop", "nguyen_van_a", "tran_thi_b", "le_van_c", "pham_thi_d", "hoang_van_e",
  "vu_thi_f", "dang_van_g", "bui_thi_h", "do_van_i", "ho_thi_k", "ngo_van_l", "duong_thi_m", "ly_van_n",
  "truong_thi_o", "phan_van_p", "vo_thi_q", "dinh_van_r", "mai_thi_s", "to_van_t", "la_thi_u", "quach_van_v",
  "trinh_thi_x", "ha_van_y", "cao_thi_z", "luong_van_an", "ta_thi_binh", "kieu_van_cuong",
];

export const userOptions: SelectOption[] = usernames.map((name, index) => ({
  value: name,
  label: name,
  description: `${name}@example.com`,
  group: index % 3 === 0 ? "Premium" : "Free",
}));

/** Simulates a server search that returns at most 8 matches. */
export function searchUsers(query: string): SelectOption[] {
  const needle = query.trim().toLowerCase();
  return userOptions
    .filter((option) => option.label.includes(needle))
    .slice(0, 8)
    .map((option) => ({ value: option.value, label: option.label, description: option.description }));
}

import type { UsageRange } from "@/lib/usage-view";
import type { Translation } from "../types";

const period = (range: UsageRange) => (range === "all" ? "since the first captcha" : `in the last ${range} days`);

const en = {
  overview: {
    metaTitle: "Overview",
    metaDescription: "Captcha usage and the status of your API keys.",
    title: "Overview",
    description: (range: UsageRange) => `Captcha activity ${period(range)}.`,
    emptyTitle: "No API keys yet",
    emptyDescription: "Create your first key to embed a captcha on your site. Every captcha type is free for now.",
    emptyAction: "Create API key",
    activeKeys: "Active keys",
    keyLimit: (max: number) => `Up to ${max} keys`,
    challengeTypes: "Available captcha types",
  },
  range: {
    label: "Time range",
    days: (days: number) => `${days} days`,
    allTime: "All time",
  },
  stats: {
    solves: "Captcha solves",
    solvesHint: (verifications: string) => `Right answers out of ${verifications} verifications`,
    verifyRate: "Verify rate",
    verifyRateHint: (verifications: string, challenges: string) => `${verifications} of ${challenges} challenges verified`,
    successRate: "Success rate",
    successRateHint: (successes: string, verifications: string) => `${successes} of ${verifications} verifications right`,
  },
  charts: {
    byKeyTitle: (range: UsageRange) => `Verifications by API key ${period(range)}`,
    byKeyLabel: (range: UsageRange) => `/challenge/verify calls per day for each API key ${period(range)}`,
    byTypeTitle: (range: UsageRange) => `Verifications by captcha type ${period(range)}`,
    byTypeLabel: (range: UsageRange) => `/challenge/verify calls per day for each captcha type ${period(range)}`,
    dailyTitle: (range: UsageRange) => `Verifications ${period(range)}`,
    dailyLabel: (range: UsageRange) => `/challenge/verify calls per day ${period(range)}`,
    keyCount: (count: number) => (count === 1 ? "1 API key" : `${count} API keys`),
    typeCount: (count: number) => (count === 1 ? "1 captcha type" : `${count} captcha types`),
    key: "API key",
    type: "Captcha type",
    verifications: "Verifications",
    total: "Total",
    moreKeys: "More keys",
    other: "Other",
    deleted: (name: string) => `${name} (deleted)`,
    unnamedKey: (id: string) => `Key ${id}`,
    empty: "No verifications in this period.",
    allHidden: "Every line is hidden. Click a row to show it again.",
    note: "Challenges are /challenge/new calls, verifications /challenge/verify calls. Verify rate = verifications ÷ challenges; success rate = successful ÷ verifications. Click a row to hide or show its line.",
  },
  columns: {
    challenges: "Challenges",
    verifications: "Verifications",
    successes: "Successful",
    verifyRate: "Verify rate",
    successRate: "Success rate",
  },
  quota: {
    title: "Daily verifications",
    resetsIn: (hours: number, minutes: number) =>
      hours > 0 ? `Resets in ${hours} hr ${minutes} min` : `Resets in ${minutes} min`,
    used: (percent: string) => `${percent} used`,
    count: (used: string, limit: string) => `${used} of ${limit} successful verifications today`,
    full: "Today's quota is used up: new captchas are refused until the reset.",
    upgrade: "Upgrade plan",
  },
  summary: {
    byDay: "By day",
    byDayLabel: "Challenges and verifications by day",
    activeDays: "Days with challenges only.",
    date: "Date",
    empty: "No challenges yet.",
  },
};

const periodVi = (range: UsageRange) => (range === "all" ? "từ trước tới nay" : `trong ${range} ngày qua`);

const vi: Translation<typeof en> = {
  overview: {
    metaTitle: "Tổng quan",
    metaDescription: "Lượt dùng captcha và trạng thái khóa API của bạn.",
    title: "Tổng quan",
    description: (range) => `Hoạt động captcha ${periodVi(range)}.`,
    emptyTitle: "Chưa có khóa API",
    emptyDescription: "Tạo khóa đầu tiên để nhúng captcha vào trang của bạn. Mọi loại captcha đang miễn phí.",
    emptyAction: "Tạo khóa API",
    activeKeys: "Khóa đang hoạt động",
    keyLimit: (max) => `Tối đa ${max} khóa`,
    challengeTypes: "Loại captcha khả dụng",
  },
  range: {
    label: "Khoảng thời gian",
    days: (days) => `${days} ngày`,
    allTime: "Toàn bộ",
  },
  stats: {
    solves: "Lượt giải captcha",
    solvesHint: (verifications) => `Số lần trả lời đúng trên ${verifications} lượt xác minh`,
    verifyRate: "Tỉ lệ xác minh",
    verifyRateHint: (verifications, challenges) => `${verifications}/${challenges} challenge được xác minh`,
    successRate: "Tỉ lệ thành công",
    successRateHint: (successes, verifications) => `${successes}/${verifications} lượt xác minh đúng`,
  },
  charts: {
    byKeyTitle: (range) => `Lượt xác minh theo khóa API ${periodVi(range)}`,
    byKeyLabel: (range) => `Số lần gọi /challenge/verify mỗi ngày của từng khóa API ${periodVi(range)}`,
    byTypeTitle: (range) => `Lượt xác minh theo loại captcha ${periodVi(range)}`,
    byTypeLabel: (range) => `Số lần gọi /challenge/verify mỗi ngày của từng loại captcha ${periodVi(range)}`,
    dailyTitle: (range) => `Lượt xác minh ${periodVi(range)}`,
    dailyLabel: (range) => `Số lần gọi /challenge/verify mỗi ngày ${periodVi(range)}`,
    keyCount: (count) => `${count} khóa API`,
    typeCount: (count) => `${count} loại captcha`,
    key: "Khóa API",
    type: "Loại captcha",
    verifications: "Lượt xác minh",
    total: "Tổng",
    moreKeys: "Các khóa còn lại",
    other: "Khác",
    deleted: (name) => `${name} (đã xóa)`,
    unnamedKey: (id) => `Khóa ${id}`,
    empty: "Không có lượt xác minh nào trong khoảng này.",
    allHidden: "Mọi đường đang bị ẩn. Bấm vào một dòng để hiện lại.",
    note: "Challenge là số lần gọi /challenge/new, lượt xác minh là số lần gọi /challenge/verify. Tỉ lệ xác minh = lượt xác minh ÷ challenge; tỉ lệ thành công = xác minh đúng ÷ lượt xác minh. Bấm vào một dòng để ẩn hoặc hiện đường của nó.",
  },
  columns: {
    challenges: "Challenge",
    verifications: "Lượt xác minh",
    successes: "Xác minh đúng",
    verifyRate: "Tỉ lệ xác minh",
    successRate: "Tỉ lệ thành công",
  },
  quota: {
    title: "Lượt xác minh hôm nay",
    resetsIn: (hours: number, minutes: number) =>
      hours > 0 ? `Đặt lại sau ${hours} giờ ${minutes} phút` : `Đặt lại sau ${minutes} phút`,
    used: (percent: string) => `Đã dùng ${percent}`,
    count: (used: string, limit: string) => `${used}/${limit} lượt xác minh thành công hôm nay`,
    full: "Đã dùng hết quota hôm nay: captcha mới sẽ bị từ chối cho tới khi đặt lại.",
    upgrade: "Nâng cấp gói",
  },
  summary: {
    byDay: "Theo ngày",
    byDayLabel: "Challenge và lượt xác minh theo ngày",
    activeDays: "Chỉ những ngày có challenge.",
    date: "Ngày",
    empty: "Chưa có challenge nào.",
  },
};

export const usage = { en, vi };

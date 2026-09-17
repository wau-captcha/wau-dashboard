import type { Translation } from "../types";

const en = {
  overview: {
    metaTitle: "Overview",
    metaDescription: "Captcha usage and the status of your API keys.",
    title: "Overview",
    description: (days: number) => `Captcha solves in the last ${days} days.`,
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
  },
  stats: {
    solves: "Captcha solves",
    successful: "Successful",
    rate: "Success rate",
  },
  summary: {
    byDay: "By day",
    byType: "By captcha type",
    byDayLabel: "Captcha solves by day",
    byTypeLabel: "Captcha solves by type",
    date: "Date",
    type: "Captcha type",
    solves: "Solves",
    successful: "Successful",
    rate: "Rate",
    empty: "No solves yet.",
  },
};

const vi: Translation<typeof en> = {
  overview: {
    metaTitle: "Tổng quan",
    metaDescription: "Lượt dùng captcha và trạng thái khóa API của bạn.",
    title: "Tổng quan",
    description: (days) => `Lượt giải captcha trong ${days} ngày gần nhất.`,
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
  },
  stats: {
    solves: "Lượt giải captcha",
    successful: "Thành công",
    rate: "Tỉ lệ thành công",
  },
  summary: {
    byDay: "Theo ngày",
    byType: "Theo loại captcha",
    byDayLabel: "Lượt giải captcha theo ngày",
    byTypeLabel: "Lượt giải captcha theo loại",
    date: "Ngày",
    type: "Loại captcha",
    solves: "Lượt giải",
    successful: "Thành công",
    rate: "Tỉ lệ",
    empty: "Chưa có lượt giải nào.",
  },
};

export const usage = { en, vi };

import type { Translation } from "../types";

const en = {
  app: {
    name: "WAU Captcha",
    description: "Manage your WAU Captcha API keys and usage.",
  },
  nav: {
    label: "Main navigation",
    overview: "Overview",
    keys: "API keys",
    billing: "Billing",
    account: "Account",
  },
  user: {
    account: "Account",
    billing: "Plans & billing",
    signOut: "Sign out",
  },
  status: {
    active: "Active",
    paused: "Paused",
    suspended: "Suspended",
    throttled: "Throttled",
    banned: "Banned",
  },
  loadError: {
    title: "Couldn't load data",
    description: "The server isn't responding. Check your connection and try again.",
    retry: "Try again",
  },
  notFound: {
    title: "This page doesn't exist",
    description: "The link may be broken, or the page may have moved. Check the address, or carry on from one of these.",
    home: "Back to home",
    dashboard: "Go to dashboard",
    docs: "Read the docs",
    elsewhere: "Or try",
  },
};

const vi: Translation<typeof en> = {
  app: {
    name: "WAU Captcha",
    description: "Bảng điều khiển quản lý khóa API và lượt dùng WAU Captcha.",
  },
  nav: {
    label: "Điều hướng chính",
    overview: "Tổng quan",
    keys: "Khóa API",
    billing: "Thanh toán",
    account: "Tài khoản",
  },
  user: {
    account: "Tài khoản",
    billing: "Gói & thanh toán",
    signOut: "Đăng xuất",
  },
  status: {
    active: "Hoạt động",
    paused: "Tạm dừng",
    suspended: "Bị đình chỉ",
    throttled: "Bị giới hạn",
    banned: "Đã khóa",
  },
  loadError: {
    title: "Không tải được dữ liệu",
    description: "Máy chủ đang không phản hồi. Kiểm tra kết nối rồi thử lại.",
    retry: "Thử lại",
  },
  notFound: {
    title: "Trang này không tồn tại",
    description: "Đường link có thể đã hỏng, hoặc trang đã được chuyển đi. Hãy kiểm tra lại địa chỉ, hoặc đi tiếp từ một trong các trang dưới đây.",
    home: "Về trang chủ",
    dashboard: "Vào bảng điều khiển",
    docs: "Xem tài liệu",
    elsewhere: "Hoặc thử",
  },
};

export const common = { en, vi };

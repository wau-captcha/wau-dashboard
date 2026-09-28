import type { Translation } from "../types";

const en = {
  metaTitle: "Account",
  metaDescription: "Your account details and the captcha types you can use.",
  title: "Account",
  description: "Your sign-in details and plan.",
  info: {
    title: "Details",
    displayName: "Display name",
    email: "Email",
    signInMethod: "Sign-in method",
    google: "Google",
    plan: "Plan",
    planUntil: (date: string) => `until ${date}`,
    managePlan: "Plans & billing",
    joined: "Joined",
  },
  types: {
    title: "Available captcha types",
    description: "The captcha types your plan includes, at no extra cost.",
    tableLabel: "Available captcha types",
    type: "Captcha type",
    details: "Description",
    price: "Price",
    free: "Free",
    empty: "Your plan doesn't include any captcha types yet.",
  },
  session: {
    title: "Session",
    description: "Sign out of this browser.",
  },
};

const vi: Translation<typeof en> = {
  metaTitle: "Tài khoản",
  metaDescription: "Thông tin tài khoản và các loại captcha bạn được dùng.",
  title: "Tài khoản",
  description: "Thông tin đăng nhập và gói dịch vụ của bạn.",
  info: {
    title: "Thông tin",
    displayName: "Tên hiển thị",
    email: "Email",
    signInMethod: "Phương thức đăng nhập",
    google: "Google",
    plan: "Gói dịch vụ",
    planUntil: (date: string) => `tới ${date}`,
    managePlan: "Gói & thanh toán",
    joined: "Ngày tham gia",
  },
  types: {
    title: "Loại captcha khả dụng",
    description: "Các loại captcha gói của bạn có, không tính thêm phí.",
    tableLabel: "Loại captcha khả dụng",
    type: "Loại captcha",
    details: "Mô tả",
    price: "Giá",
    free: "Miễn phí",
    empty: "Gói của bạn chưa có loại captcha nào.",
  },
  session: {
    title: "Phiên đăng nhập",
    description: "Đăng xuất khỏi trình duyệt này.",
  },
};

export const account = { en, vi };

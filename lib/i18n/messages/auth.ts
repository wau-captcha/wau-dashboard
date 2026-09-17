import type { Translation } from "../types";

const en = {
  login: {
    metaTitle: "Sign in",
    metaDescription: "Sign in to manage your WAU Captcha API keys.",
    title: "Sign in",
    description: "Manage API keys and track captcha usage.",
    identifier: "Username or email",
    password: "Password",
    submit: "Sign in",
    noAccount: "Don't have an account?",
    switchLink: "Sign up",
  },
  register: {
    metaTitle: "Sign up",
    metaDescription: "Create a WAU Captcha account to get free API keys.",
    title: "Create an account",
    description: "Every captcha type is free for now. No payment details needed.",
    username: "Username",
    usernameHint: "3–32 characters: lowercase letters, digits or underscores.",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordHint: "At least 8 characters.",
    submit: "Create account",
    haveAccount: "Already have an account?",
    switchLink: "Sign in",
  },
  validation: {
    loginRequired: "Enter your username and password.",
    registerRequired: "Fill in every field.",
  },
};

const vi: Translation<typeof en> = {
  login: {
    metaTitle: "Đăng nhập",
    metaDescription: "Đăng nhập để quản lý khóa API WAU Captcha.",
    title: "Đăng nhập",
    description: "Quản lý khóa API và theo dõi lượt dùng captcha.",
    identifier: "Tên đăng nhập hoặc email",
    password: "Mật khẩu",
    submit: "Đăng nhập",
    noAccount: "Chưa có tài khoản?",
    switchLink: "Đăng ký",
  },
  register: {
    metaTitle: "Đăng ký",
    metaDescription: "Tạo tài khoản WAU Captcha để thuê khóa API miễn phí.",
    title: "Tạo tài khoản",
    description: "Mọi loại captcha đang miễn phí, không cần thẻ thanh toán.",
    username: "Tên đăng nhập",
    usernameHint: "3-32 ký tự, chỉ gồm chữ thường, số hoặc dấu gạch dưới.",
    email: "Email",
    emailPlaceholder: "ban@example.com",
    password: "Mật khẩu",
    passwordHint: "Tối thiểu 8 ký tự.",
    submit: "Tạo tài khoản",
    haveAccount: "Đã có tài khoản?",
    switchLink: "Đăng nhập",
  },
  validation: {
    loginRequired: "Vui lòng nhập tài khoản và mật khẩu.",
    registerRequired: "Vui lòng nhập đầy đủ thông tin.",
  },
};

export const auth = { en, vi };

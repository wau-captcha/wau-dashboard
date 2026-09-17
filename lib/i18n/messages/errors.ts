import type { Translation } from "../types";

/** Keyed by the `reason` and `metadata.field` values wau-services returns. */
const en = {
  reasons: {
    INVALID_CREDENTIALS: "Incorrect username or password.",
    USERNAME_TAKEN: "That username is already taken.",
    EMAIL_TAKEN: "That email is already in use.",
    UNAUTHENTICATED: "Your session has expired. Please sign in again.",
    API_KEY_NOT_FOUND: "API key not found.",
    API_KEY_LIMIT_REACHED: "You've reached the maximum number of API keys.",
    RATE_LIMITED: "Too many attempts. Please try again in a minute.",
    UPSTREAM_UNAVAILABLE: "The service is busy. Please try again.",
    GATEWAY_UNREACHABLE: "Couldn't reach the server. Please try again.",
    INTERNAL: "Something went wrong on our side. Please try again.",
  },
  fields: {
    username: "Usernames need 3–32 characters: lowercase letters, digits or underscores.",
    email: "Enter a valid email address.",
    password: "Passwords need 8 to 72 characters.",
    name: "Key names need 1 to 64 characters.",
  },
  generic: "Something went wrong. Please try again.",
};

const vi: Translation<typeof en> = {
  reasons: {
    INVALID_CREDENTIALS: "Tài khoản hoặc mật khẩu không đúng.",
    USERNAME_TAKEN: "Tên đăng nhập đã tồn tại.",
    EMAIL_TAKEN: "Email đã được sử dụng.",
    UNAUTHENTICATED: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
    API_KEY_NOT_FOUND: "Không tìm thấy khóa API.",
    API_KEY_LIMIT_REACHED: "Bạn đã đạt số khóa API tối đa.",
    RATE_LIMITED: "Bạn thao tác quá nhanh, vui lòng thử lại sau một phút.",
    UPSTREAM_UNAVAILABLE: "Hệ thống đang bận, vui lòng thử lại.",
    GATEWAY_UNREACHABLE: "Không kết nối được tới máy chủ, vui lòng thử lại.",
    INTERNAL: "Hệ thống gặp sự cố, vui lòng thử lại.",
  },
  fields: {
    username: "Tên đăng nhập phải có 3-32 ký tự, chỉ gồm a-z, 0-9 hoặc _.",
    email: "Email không hợp lệ.",
    password: "Mật khẩu phải có từ 8 đến 72 ký tự.",
    name: "Tên khóa phải có từ 1 đến 64 ký tự.",
  },
  generic: "Đã có lỗi xảy ra, vui lòng thử lại.",
};

export const errors = { en, vi };

import type { Translation } from "../types";

/** Keyed by the `reason` and `metadata.field` values wau-services returns. */
const en = {
  reasons: {
    GOOGLE_TOKEN_INVALID: "We couldn't verify your Google sign-in. Please try again.",
    GOOGLE_EMAIL_UNVERIFIED: "Your Google account's email address isn't verified. Verify it with Google, then try again.",
    GOOGLE_ACCOUNT_CONFLICT: "This email already belongs to another account, which can't be linked to this Google account.",
    UNAUTHENTICATED: "Your session has expired. Please sign in again.",
    API_KEY_NOT_FOUND: "API key not found.",
    API_KEY_LIMIT_REACHED: "You've reached the maximum number of API keys.",
    RATE_LIMITED: "Too many attempts. Please try again in a minute.",
    UPSTREAM_UNAVAILABLE: "The service is busy. Please try again.",
    SERVICES_UNREACHABLE: "Couldn't reach the server. Please try again.",
    ACCOUNT_BANNED: "This account has been locked by an administrator.",
    PERMISSION_DENIED: "This Google account isn't an administrator.",
    USER_NOT_FOUND: "User not found.",
    SERVICES_MISCONFIGURED: "This dashboard is not pointed at wau-services. Check WAU_SERVICES_URL in its environment.",
    INTERNAL: "Something went wrong on our side. Please try again.",
  },
  fields: {
    name: "Key names need 1 to 64 characters.",
  },
  generic: "Something went wrong. Please try again.",
};

const vi: Translation<typeof en> = {
  reasons: {
    GOOGLE_TOKEN_INVALID: "Không xác minh được lượt đăng nhập Google, vui lòng thử lại.",
    GOOGLE_EMAIL_UNVERIFIED: "Email của tài khoản Google chưa được xác minh. Hãy xác minh với Google rồi thử lại.",
    GOOGLE_ACCOUNT_CONFLICT: "Email này đã thuộc một tài khoản khác và không thể liên kết với tài khoản Google này.",
    UNAUTHENTICATED: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
    API_KEY_NOT_FOUND: "Không tìm thấy khóa API.",
    API_KEY_LIMIT_REACHED: "Bạn đã đạt số khóa API tối đa.",
    RATE_LIMITED: "Bạn thao tác quá nhanh, vui lòng thử lại sau một phút.",
    UPSTREAM_UNAVAILABLE: "Hệ thống đang bận, vui lòng thử lại.",
    SERVICES_UNREACHABLE: "Không kết nối được tới máy chủ, vui lòng thử lại.",
    ACCOUNT_BANNED: "Tài khoản này đã bị quản trị viên khóa.",
    PERMISSION_DENIED: "Tài khoản Google này không phải quản trị viên.",
    USER_NOT_FOUND: "Không tìm thấy người dùng.",
    SERVICES_MISCONFIGURED: "Dashboard chưa trỏ tới wau-services. Hãy kiểm tra biến WAU_SERVICES_URL.",
    INTERNAL: "Hệ thống gặp sự cố, vui lòng thử lại.",
  },
  fields: {
    name: "Tên khóa phải có từ 1 đến 64 ký tự.",
  },
  generic: "Đã có lỗi xảy ra, vui lòng thử lại.",
};

export const errors = { en, vi };

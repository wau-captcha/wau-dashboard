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
    PLAN_NOT_FOUND: "This plan can't be bought.",
    PLAN_DOWNGRADE_NOT_ALLOWED: "Plans can't be downgraded. You can renew your plan or upgrade it.",
    PLAN_NOT_RENEWABLE: "Your plan has no end date, so there is nothing to renew.",
    TRANSACTION_NOT_FOUND: "Payment not found.",
    SERVICES_MISCONFIGURED: "This dashboard is not pointed at wau-services. Check WAU_TENANT_URL and WAU_BILLING_URL in its environment.",
    INTERNAL: "Something went wrong on our side. Please try again.",
    APPEAL_NOT_ALLOWED: "Only a suspended key, or one throttled today, can be reviewed.",
    APPEAL_PENDING: "A review of this key is already waiting for an administrator.",
    APPEAL_NOT_FOUND: "This appeal doesn't exist or was decided already.",
  },
  fields: {
    name: "Key names need 1 to 64 characters.",
    ip_address: "Each source is an IPv4 or IPv6 address, with an optional prefix length: 203.0.113.4 or 203.0.113.0/24.",
    description: "A description may be at most 100 characters.",
    allowed_domains:
      "Each domain is a host name such as shop.example.com or *.example.com, without https:// or a path; only localhost may name a port. At most 50.",
    message: "The message needs 1 to 2,000 characters.",
    note: "The note may be at most 2,000 characters.",
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
    PLAN_NOT_FOUND: "Không thể mua gói này.",
    PLAN_DOWNGRADE_NOT_ALLOWED: "Không thể hạ gói. Bạn có thể gia hạn hoặc nâng cấp gói.",
    PLAN_NOT_RENEWABLE: "Gói của bạn không có ngày hết hạn nên không cần gia hạn.",
    TRANSACTION_NOT_FOUND: "Không tìm thấy giao dịch.",
    SERVICES_MISCONFIGURED: "Dashboard chưa trỏ tới wau-services. Hãy kiểm tra biến WAU_TENANT_URL và WAU_BILLING_URL.",
    INTERNAL: "Hệ thống gặp sự cố, vui lòng thử lại.",
    APPEAL_NOT_ALLOWED: "Chỉ khóa đang bị đình chỉ, hoặc bị giới hạn hôm nay, mới yêu cầu xem xét được.",
    APPEAL_PENDING: "Khóa này đã có một yêu cầu xem xét đang chờ quản trị viên.",
    APPEAL_NOT_FOUND: "Yêu cầu này không tồn tại hoặc đã được xử lý.",
  },
  fields: {
    name: "Tên khóa phải có từ 1 đến 64 ký tự.",
    ip_address: "Mỗi nguồn là một địa chỉ IPv4 hoặc IPv6, kèm độ dài prefix nếu cần: 203.0.113.4 hoặc 203.0.113.0/24.",
    description: "Mô tả dài tối đa 100 ký tự.",
    allowed_domains:
      "Mỗi tên miền là một host như shop.example.com hoặc *.example.com, không có https:// hay đường dẫn; chỉ localhost được kèm cổng. Tối đa 50.",
    message: "Lời nhắn cần từ 1 đến 2.000 ký tự.",
    note: "Ghi chú dài tối đa 2.000 ký tự.",
  },
  generic: "Đã có lỗi xảy ra, vui lòng thử lại.",
};

export const errors = { en, vi };

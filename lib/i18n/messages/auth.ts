import type { Translation } from "../types";

const en = {
  login: {
    metaTitle: "Sign in",
    metaDescription: "Sign in with Google to manage your WAU Captcha API keys.",
    title: "Sign in",
    description: "Manage API keys and track captcha usage.",
    newAccount: "No account yet? Signing in with Google creates one for you.",
    sessionExpired: "Your sign-in attempt expired. Please try again.",
    notConfiguredTitle: "Google sign-in isn't set up",
    bannedTitle: "Your account has been locked",
    banned: "An administrator locked this account, so you were signed out. Contact support if you think this is a mistake.",
    notConfigured: "Set GOOGLE_CLIENT_ID in the dashboard environment, then restart it.",
  },
  adminLogin: {
    metaTitle: "Admin sign-in",
    metaDescription: "Sign in to the WAU Captcha admin console.",
    title: "Admin sign-in",
    description: "Use the Google account of an administrator. This session is separate from the dashboard's.",
    userLogin: "Not an administrator? Sign in to the dashboard",
  },
  google: {
    loading: "Loading Google sign-in",
    loadFailed: "Couldn't load Google sign-in. Check your connection and try again.",
    notDrawn: "Google won't show its button for this address. Add it to the OAuth client's authorised JavaScript origins.",
    retry: "Try again",
    pending: "Signing you in…",
  },
};

const vi: Translation<typeof en> = {
  login: {
    metaTitle: "Đăng nhập",
    metaDescription: "Đăng nhập bằng Google để quản lý khóa API WAU Captcha.",
    title: "Đăng nhập",
    description: "Quản lý khóa API và theo dõi lượt dùng captcha.",
    newAccount: "Chưa có tài khoản? Hệ thống tự tạo khi bạn đăng nhập bằng Google.",
    sessionExpired: "Lượt đăng nhập đã hết hạn, vui lòng thử lại.",
    notConfiguredTitle: "Chưa cấu hình đăng nhập Google",
    bannedTitle: "Tài khoản của bạn đã bị khóa",
    banned: "Quản trị viên đã khóa tài khoản này nên bạn đã bị đăng xuất. Hãy liên hệ hỗ trợ nếu bạn cho rằng đây là nhầm lẫn.",
    notConfigured: "Hãy đặt GOOGLE_CLIENT_ID trong biến môi trường của dashboard rồi khởi động lại.",
  },
  adminLogin: {
    metaTitle: "Đăng nhập quản trị",
    metaDescription: "Đăng nhập trang quản trị WAU Captcha.",
    title: "Đăng nhập quản trị",
    description: "Dùng tài khoản Google của quản trị viên. Phiên này tách riêng với phiên dashboard.",
    userLogin: "Không phải quản trị viên? Đăng nhập dashboard",
  },
  google: {
    loading: "Đang tải đăng nhập Google",
    loadFailed: "Không tải được đăng nhập Google. Hãy kiểm tra kết nối rồi thử lại.",
    notDrawn: "Google không hiện nút cho địa chỉ này. Hãy thêm nó vào Authorized JavaScript origins của OAuth client.",
    retry: "Thử lại",
    pending: "Đang đăng nhập…",
  },
};

export const auth = { en, vi };

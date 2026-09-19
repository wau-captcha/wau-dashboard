import type { Translation } from "../types";

const en = {
  metaTitle: "API key details",
  created: (date: string) => `Created ${date}`,
  back: "All keys",
  info: {
    title: "Key details",
    siteKey: "Site key (used in the browser)",
    secretKey: "Secret key (server only)",
    id: "Key ID",
  },
  settings: {
    title: "Key settings",
    description: "Rename, pause or revoke this key.",
    name: "Key name",
    save: "Save name",
    active: "Key is active",
    activeHint: "Turn it off to stop issuing challenges without deleting the key.",
    rotateHint: "Regenerate the secret key if you think it has leaked. The old one stops working immediately.",
    rotate: "Regenerate secret key",
    rotateTitle: "Regenerate secret key?",
    rotateDescription: "Servers still using the old secret key get SECRET_KEY_INVALID until you update them.",
    rotateConfirm: "Regenerate",
    deleteHint: "Remove this key from your account. Sites using it can no longer create captchas.",
  },
  usageTitle: "Usage",
  guide: {
    title: "Integration guide",
    description: "Use the site key in the browser. Keep the secret key on your server and never ship it to users.",
    create: "1. Create a challenge",
    verify: "2. Check the answer",
    siteVerify: "3. Verify on your server",
    createComment: "Browser: fetch a new challenge",
    imageComment: "image is base64: use `data:${mime_type};base64,${image}` as the <img> src",
    verifyComment: "Browser: send the answer the user typed",
    tokenComment: "Send the token with your form when success is true",
    siteVerifyComment: "Your server: verify the one-time token",
  },
  notFound: {
    title: "API key not found",
    description: "This key doesn't exist, was deleted, or belongs to another account.",
    back: "Back to API keys",
  },
};

const vi: Translation<typeof en> = {
  metaTitle: "Chi tiết khóa API",
  created: (date) => `Tạo ngày ${date}`,
  back: "Danh sách khóa",
  info: {
    title: "Thông tin khóa",
    siteKey: "Site key (dùng ở trình duyệt)",
    secretKey: "Secret key (chỉ dùng ở máy chủ)",
    id: "Mã khóa",
  },
  settings: {
    title: "Cài đặt khóa",
    description: "Đổi tên, tạm dừng hoặc thu hồi khóa này.",
    name: "Tên khóa",
    save: "Lưu tên",
    active: "Khóa đang hoạt động",
    activeHint: "Tắt để tạm dừng phát challenge mà không xóa khóa.",
    rotateHint: "Tạo lại secret key khi nghi ngờ bị lộ. Secret cũ ngừng hoạt động ngay lập tức.",
    rotate: "Tạo lại secret key",
    rotateTitle: "Tạo lại secret key?",
    rotateDescription:
      "Mọi máy chủ đang dùng secret key cũ sẽ nhận lỗi SECRET_KEY_INVALID cho tới khi bạn cập nhật khóa mới.",
    rotateConfirm: "Tạo lại",
    deleteHint: "Xóa khóa khỏi tài khoản. Trang đang dùng khóa này sẽ không tạo được captcha nữa.",
  },
  usageTitle: "Lượt dùng",
  guide: {
    title: "Hướng dẫn tích hợp",
    description:
      "Site key dùng ở trình duyệt, secret key chỉ dùng ở máy chủ và không được đưa vào mã nguồn phía người dùng.",
    create: "1. Tạo challenge",
    verify: "2. Kiểm tra đáp án",
    siteVerify: "3. Xác minh phía máy chủ",
    createComment: "Trình duyệt: lấy một challenge mới",
    imageComment: "image là base64: dùng `data:${mime_type};base64,${image}` làm src của <img>",
    verifyComment: "Trình duyệt: gửi đáp án người dùng nhập",
    tokenComment: "Gửi token kèm form của bạn khi success = true",
    siteVerifyComment: "Máy chủ của bạn: xác minh token một lần",
  },
  notFound: {
    title: "Không tìm thấy khóa API",
    description: "Khóa này không tồn tại, đã bị xóa hoặc không thuộc tài khoản của bạn.",
    back: "Về danh sách khóa",
  },
};

export const keyDetail = { en, vi };

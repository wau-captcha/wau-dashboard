import type { Translation } from "../types";

const en = {
  domains: {
    title: "Allowed domains",
    description:
      "Only pages on these websites may use the site key. Enter host names: shop.example.com, *.example.com for its subdomains, localhost:3000 for development.",
    domain: "Domain",
    created: "Created",
    notSaved: "Not saved yet",
    placeholder: "shop.example.com",
    emptyWarning: "Any website can use this site key. Add your domains.",
    add: "Add domain",
    remove: "Remove",
    cancel: "Cancel",
    save: "Save",
    saved: "Allowed domains saved",
  },
  behavior: {
    label: "Require behaviour data",
    hint: "Refuse answers from clients that send no behaviour data, such as an SDK older than 1.2.0 or a hand-written integration. They get BEHAVIOR_REQUIRED.",
    offTitle: "Stop requiring behaviour data?",
    offDescription:
      "Tokens from clients that send no behaviour data will be accepted again, with the verdict not_measured. Turn it off only while you update an old integration.",
    offConfirm: "Turn off",
    on: "Behaviour data is now required",
    off: "Behaviour data is no longer required",
  },
  review: {
    flaggedTitle: "This key is throttled today",
    flagged:
      "The scraping check flagged it: few of the captchas it requested today were answered or solved, or many answers looked automated. Until midnight (GMT+7) it can request at most 60 captchas a minute.",
    numbers: (challenges: string, answers: string, solved: string, automated: string) =>
      `Today: ${challenges} captchas requested, ${answers} answered, ${solved} solved, ${automated} automated.`,
    prefetch: "The usual cause is fetching captchas ahead of time. Fetch one when the widget is shown.",
    request: "Request a review",
    requestHint: "Tell the administrator what the site does and what you changed. You can have one request open at a time.",
    messageLabel: "Message to the administrator",
    messagePlaceholder: "Our single-page app fetched a captcha on every page load. We now fetch it when the form opens.",
    submit: "Send request",
    sent: "Review requested",
    pending: (date: string) => `Review requested on ${date}. An administrator will look at it.`,
    approved: (date: string) => `Review approved on ${date}.`,
    rejected: (date: string) => `Review rejected on ${date}.`,
    note: (note: string) => `Administrator's note: ${note}`,
  },
};

const vi: Translation<typeof en> = {
  domains: {
    title: "Tên miền được phép",
    description:
      "Chỉ các trang trên những website này mới dùng được site key. Nhập tên miền: shop.example.com, *.example.com cho các tên miền con, localhost:3000 khi phát triển.",
    domain: "Tên miền",
    created: "Ngày tạo",
    notSaved: "Chưa lưu",
    placeholder: "shop.example.com",
    emptyWarning: "Website nào cũng dùng được site key này. Hãy thêm tên miền của bạn.",
    add: "Thêm tên miền",
    remove: "Xóa",
    cancel: "Hủy",
    save: "Lưu",
    saved: "Đã lưu tên miền được phép",
  },
  behavior: {
    label: "Bắt buộc dữ liệu hành vi",
    hint: "Từ chối câu trả lời từ client không gửi dữ liệu hành vi, như SDK cũ hơn 1.2.0 hoặc tích hợp tự viết. Các câu trả lời đó nhận lỗi BEHAVIOR_REQUIRED.",
    offTitle: "Thôi bắt buộc dữ liệu hành vi?",
    offDescription:
      "Token từ client không gửi dữ liệu hành vi sẽ lại được chấp nhận, với kết luận not_measured. Chỉ tắt trong lúc bạn cập nhật tích hợp cũ.",
    offConfirm: "Tắt",
    on: "Đã bắt buộc dữ liệu hành vi",
    off: "Đã thôi bắt buộc dữ liệu hành vi",
  },
  review: {
    flaggedTitle: "Khóa này đang bị giới hạn hôm nay",
    flagged:
      "Bộ kiểm tra chống cào dữ liệu đã gắn cờ khóa: hôm nay rất ít captcha khóa yêu cầu được trả lời hoặc giải đúng, hoặc nhiều câu trả lời có dấu hiệu tự động. Tới nửa đêm (GMT+7), khóa chỉ yêu cầu được tối đa 60 captcha mỗi phút.",
    numbers: (challenges, answers, solved, automated) =>
      `Hôm nay: ${challenges} captcha được yêu cầu, ${answers} được trả lời, ${solved} giải đúng, ${automated} tự động.`,
    prefetch: "Nguyên nhân thường gặp là lấy captcha trước khi cần. Hãy lấy captcha khi widget được hiển thị.",
    request: "Yêu cầu xem xét",
    requestHint: "Hãy cho quản trị viên biết website làm gì và bạn đã thay đổi gì. Mỗi lúc chỉ có một yêu cầu đang chờ.",
    messageLabel: "Lời nhắn cho quản trị viên",
    messagePlaceholder: "Ứng dụng một trang của chúng tôi lấy captcha mỗi lần tải trang. Nay đã chuyển sang lấy khi mở form.",
    submit: "Gửi yêu cầu",
    sent: "Đã gửi yêu cầu xem xét",
    pending: (date) => `Đã yêu cầu xem xét ngày ${date}. Quản trị viên sẽ xem xét.`,
    approved: (date) => `Yêu cầu xem xét được chấp thuận ngày ${date}.`,
    rejected: (date) => `Yêu cầu xem xét bị từ chối ngày ${date}.`,
    note: (note) => `Ghi chú của quản trị viên: ${note}`,
  },
};

export const keyProtection = { en, vi };

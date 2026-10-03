import type { Translation } from "../types";

/** Payment history, under Plans & billing: the list and the page of one payment. */
const en = {
  metaTitle: "Payment history",
  metaDescription: "Your WAU Captcha payments and what each one did to your plan.",
  statuses: {
    pending: "Awaiting payment",
    succeeded: "Paid",
    expired: "Expired",
  },
  periods: { month: "1 month", year: "1 year" },
  list: {
    title: "Payment history",
    description: "Your latest 50 payments, newest first. Open one to see what it did to your plan.",
    tableLabel: "Payments",
    date: "Date",
    plan: "Plan",
    period: "Period",
    amount: "Amount",
    status: "Status",
    paidAt: "Paid at",
    code: "Payment code",
    emptyTitle: "No payments yet",
    emptyDescription: "Payments for paid plans will show here.",
    emptyAction: "See plans",
  },
  detail: {
    metaTitle: "Payment",
    title: (plan: string, period: string) => `${plan}, ${period}`,
    created: (date: string) => `Created on ${date}`,
    back: "Payment history",
    pendingTitle: "Waiting for your payment",
    pending: (deadline: string) =>
      `SePay hasn't confirmed this payment yet. If you paid, this page updates by itself once it does. The checkout closes at ${deadline}; after that, start a new one from Plans.`,
    expiredTitle: "Not paid in time",
    expired: (deadline: string) =>
      `The checkout closed at ${deadline} without a payment, and your plan did not change. If you did pay, the payment still counts as soon as SePay reports it.`,
    paidTitle: "Payment received",
    outcome: {
      upgrade: (plan: string, start: string, end: string) => `${plan} started on ${start} and runs until ${end}.`,
      renew: (plan: string, start: string, end: string) => `${plan} was renewed: ${start} to ${end} was added after its previous end.`,
      extend: (paid: string, plan: string, start: string, end: string) =>
        `This payment was for ${paid}, below the ${plan} plan you had by then, so it bought time on ${plan} at its price: ${start} to ${end}.`,
      extendNoTime: (paid: string, plan: string) =>
        `This payment was for ${paid}, but your account was on ${plan}, which has no end date, so no time was added.`,
      unrecorded: (date: string) => `Your plan was updated on ${date}.`,
    },
    details: {
      title: "Payment",
      plan: "Plan",
      period: "Period",
      amount: "Amount",
      status: "Status",
      created: "Created",
      deadline: "Checkout closes",
      deadlinePassed: "Checkout closed",
      paidAt: "Paid at",
    },
    grant: {
      title: "What it did to your plan",
      change: "Change",
      kinds: { upgrade: "Upgrade", renew: "Renewal", extend: "Time added to your plan" },
      plan: "Plan",
      time: "Time added",
      span: (start: string, end: string) => `${start} – ${end}`,
      noTime: "None: the plan has no end date",
    },
    references: {
      title: "References",
      description: "Quote the payment code if you contact us about this payment.",
      code: "Payment code",
      id: "Transaction ID",
      sepay: "SePay transaction ID",
    },
    notFound: {
      title: "Payment not found",
      description: "It doesn't exist or belongs to another account.",
      back: "Payment history",
    },
  },
};

const vi: Translation<typeof en> = {
  metaTitle: "Lịch sử thanh toán",
  metaDescription: "Các lần thanh toán WAU Captcha của bạn và tác động của mỗi lần lên gói.",
  statuses: {
    pending: "Chờ thanh toán",
    succeeded: "Đã thanh toán",
    expired: "Hết hạn",
  },
  periods: { month: "1 tháng", year: "1 năm" },
  list: {
    title: "Lịch sử thanh toán",
    description: "50 giao dịch gần nhất, mới nhất trước. Mở một giao dịch để xem nó đã thay đổi gói của bạn thế nào.",
    tableLabel: "Giao dịch",
    date: "Ngày tạo",
    plan: "Gói",
    period: "Kỳ",
    amount: "Số tiền",
    status: "Trạng thái",
    paidAt: "Thanh toán lúc",
    code: "Mã thanh toán",
    emptyTitle: "Chưa có giao dịch",
    emptyDescription: "Các lần thanh toán gói trả phí sẽ hiện ở đây.",
    emptyAction: "Xem các gói",
  },
  detail: {
    metaTitle: "Giao dịch",
    title: (plan: string, period: string) => `${plan}, ${period}`,
    created: (date: string) => `Tạo lúc ${date}`,
    back: "Lịch sử thanh toán",
    pendingTitle: "Đang chờ thanh toán",
    pending: (deadline: string) =>
      `SePay chưa xác nhận giao dịch này. Nếu bạn đã thanh toán, trang này sẽ tự cập nhật khi SePay xác nhận. Phiên thanh toán đóng lúc ${deadline}; sau đó hãy tạo phiên mới ở mục Các gói.`,
    expiredTitle: "Không thanh toán kịp",
    expired: (deadline: string) =>
      `Phiên thanh toán đã đóng lúc ${deadline} mà chưa nhận được tiền, gói của bạn không thay đổi. Nếu bạn đã chuyển khoản, khoản tiền vẫn được tính ngay khi SePay báo về.`,
    paidTitle: "Đã nhận thanh toán",
    outcome: {
      upgrade: (plan: string, start: string, end: string) => `Gói ${plan} bắt đầu từ ${start} và kéo dài tới ${end}.`,
      renew: (plan: string, start: string, end: string) =>
        `Gói ${plan} đã được gia hạn: thêm khoảng ${start} – ${end} vào sau ngày hết hạn trước đó.`,
      extend: (paid: string, plan: string, start: string, end: string) =>
        `Giao dịch này mua gói ${paid}, thấp hơn gói ${plan} bạn đang dùng lúc đó, nên được đổi thành thời gian dùng gói ${plan} theo giá của gói này: ${start} – ${end}.`,
      extendNoTime: (paid: string, plan: string) =>
        `Giao dịch này mua gói ${paid}, nhưng tài khoản của bạn đang dùng gói ${plan} không có ngày hết hạn, nên không cộng thêm thời gian.`,
      unrecorded: (date: string) => `Gói của bạn đã được cập nhật lúc ${date}.`,
    },
    details: {
      title: "Giao dịch",
      plan: "Gói",
      period: "Kỳ",
      amount: "Số tiền",
      status: "Trạng thái",
      created: "Tạo lúc",
      deadline: "Phiên thanh toán đóng lúc",
      deadlinePassed: "Phiên thanh toán đã đóng lúc",
      paidAt: "Thanh toán lúc",
    },
    grant: {
      title: "Tác động lên gói",
      change: "Thay đổi",
      kinds: { upgrade: "Nâng cấp", renew: "Gia hạn", extend: "Cộng thêm thời gian vào gói" },
      plan: "Gói",
      time: "Thời gian được thêm",
      span: (start: string, end: string) => `${start} – ${end}`,
      noTime: "Không có: gói không có ngày hết hạn",
    },
    references: {
      title: "Mã tham chiếu",
      description: "Hãy gửi kèm mã thanh toán nếu bạn liên hệ với chúng tôi về giao dịch này.",
      code: "Mã thanh toán",
      id: "Mã giao dịch",
      sepay: "Mã giao dịch SePay",
    },
    notFound: {
      title: "Không tìm thấy giao dịch",
      description: "Giao dịch không tồn tại hoặc thuộc tài khoản khác.",
      back: "Lịch sử thanh toán",
    },
  },
};

export const payments = { en, vi };

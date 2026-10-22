import type { Translation } from "../types";

const en = {
  metaTitle: "Plans & billing",
  demo: {
    title: "This is a demo: please do not pay",
    body: "WAU Captcha is a demo website, not a commercial service. The payment below is real and goes through SePay, but nothing here needs it.",
  },
  metaDescription: "Your WAU Captcha plan, upgrades and payments.",
  title: "Plans & billing",
  description: "Buy a paid plan by the month or by the year with a bank transfer, and see your payments.",
  tabs: {
    label: "Plans & billing",
    plans: "Plans",
    history: "Payment history",
  },
  current: {
    title: "Current plan",
    plan: "Plan",
    ends: "Ends",
    never: "No end date",
    quota: "Daily quota",
    quotaValue: (count: string) => `${count} successful verifications a day, reset at 00:00 GMT+7 (17:00 UTC)`,
    endingSoon: (plan: string, date: string) =>
      `${plan} ends on ${date}. Renew it to keep its quota; otherwise the account goes back to Free.`,
  },
  plans: {
    title: "Plans",
    description: "Prices in VND, paid by scanning a bank transfer QR code on SePay.",
    tableLabel: "Plans compared",
    current: "Current",
    periodLabel: "Billing period",
    periods: { month: "Monthly", year: "Yearly" },
    per: { month: "per month", year: "per year" },
    perYearMonthly: (amount: string) => `per year, ${amount} a month`,
    save: (percent: string) => `Save ${percent}`,
    saveUpTo: (percent: string) => `Save up to ${percent} by paying yearly`,
    notSoldYearly: "Monthly only",
    rows: {
      quota: "Daily quota",
      quotaHint: "Successful verifications, all keys together; resets at 00:00 GMT+7 (17:00 UTC)",
      quotaValue: (count: string) => `${count} a day`,
      types: "Challenge types",
      payment: "Payment",
      paymentValue: "Bank transfer (QR)",
      noPayment: "None",
    },
    actions: {
      upgrade: "Upgrade",
      renew: { month: "Renew 1 month", year: "Renew 1 year" },
      current: "Current plan",
    },
    rules:
      "Plans are sold by the month or by the year. An upgrade starts as soon as it is paid and costs the full price: the time left on your current plan is not refunded. A renewal adds the period after your current end date. Plans cannot be downgraded; when a paid plan ends, the account goes back to Free.",
  },
  confirm: {
    demo: "This is a demo website: you do not need to pay, and the payment is real.",
    upgradeTitle: (plan: string) => `Upgrade to ${plan}?`,
    renewTitle: { month: (plan: string) => `Renew ${plan} for one month?`, year: (plan: string) => `Renew ${plan} for one year?` },
    pay: {
      month: (amount: string) => `You'll pay ${amount} for one month by bank transfer on SePay's payment page.`,
      year: (amount: string) => `You'll pay ${amount} for one year by bank transfer on SePay's payment page.`,
    },
    upgradeRuns: {
      month: (plan: string, date: string) =>
        `${plan} starts as soon as SePay confirms the payment and runs for one month, until about ${date}.`,
      year: (plan: string, date: string) =>
        `${plan} starts as soon as SePay confirms the payment and runs for one year, until about ${date}.`,
    },
    saving: (percent: string, amount: string) => `That is ${percent} less than 12 monthly payments (${amount}).`,
    dropped: (plan: string, days: number) => `The ${days} ${days === 1 ? "day" : "days"} left on ${plan} are not refunded.`,
    renewEnds: (plan: string, date: string) => `${plan} will then end on ${date}.`,
    continue: "Continue to payment",
  },
  result: {
    waitingTitle: "Waiting for your payment",
    waiting: "SePay hasn't confirmed the payment yet. This page updates by itself.",
    paidTitle: "Payment received",
    paid: "Your plan has been updated.",
    slowTitle: "Payment not confirmed yet",
    slow: "Your plan changes by itself as soon as SePay confirms the payment. You can leave this page.",
    cancelledTitle: "Payment cancelled",
    cancelled: "You cancelled the payment. Your plan did not change.",
    failedTitle: "Payment failed",
    failed: "The payment did not go through and your plan did not change. You can try again.",
    unknown: "This payment could not be found.",
    view: "View payment",
  },
};

const vi: Translation<typeof en> = {
  metaTitle: "Gói & thanh toán",
  demo: {
    title: "Đây là bản demo: xin đừng thanh toán",
    body: "WAU Captcha là website demo, không phải dịch vụ thương mại. Thanh toán bên dưới là thật và đi qua SePay, nhưng không có gì ở đây cần đến nó.",
  },
  metaDescription: "Gói WAU Captcha của bạn, nâng cấp và lịch sử thanh toán.",
  title: "Gói & thanh toán",
  description: "Mua gói trả phí theo tháng hoặc theo năm bằng chuyển khoản ngân hàng và xem các lần thanh toán.",
  tabs: {
    label: "Gói & thanh toán",
    plans: "Các gói",
    history: "Lịch sử thanh toán",
  },
  current: {
    title: "Gói hiện tại",
    plan: "Gói",
    ends: "Hết hạn",
    never: "Không có ngày hết hạn",
    quota: "Hạn mức mỗi ngày",
    quotaValue: (count: string) => `${count} lượt xác minh thành công mỗi ngày, đặt lại lúc 00:00 GMT+7 (17:00 UTC)`,
    endingSoon: (plan: string, date: string) =>
      `Gói ${plan} hết hạn ngày ${date}. Hãy gia hạn để giữ hạn mức; nếu không, tài khoản sẽ trở về gói Free.`,
  },
  plans: {
    title: "Các gói",
    description: "Giá tính bằng VND, thanh toán bằng cách quét mã QR chuyển khoản trên SePay.",
    tableLabel: "So sánh các gói",
    current: "Đang dùng",
    periodLabel: "Kỳ thanh toán",
    periods: { month: "Theo tháng", year: "Theo năm" },
    per: { month: "mỗi tháng", year: "mỗi năm" },
    perYearMonthly: (amount: string) => `mỗi năm, tương đương ${amount}/tháng`,
    save: (percent: string) => `Tiết kiệm ${percent}`,
    saveUpTo: (percent: string) => `Tiết kiệm tới ${percent} khi trả theo năm`,
    notSoldYearly: "Chỉ bán theo tháng",
    rows: {
      quota: "Hạn mức mỗi ngày",
      quotaHint: "Lượt xác minh thành công, cộng mọi khóa; đặt lại lúc 00:00 GMT+7 (17:00 UTC)",
      quotaValue: (count: string) => `${count} lượt/ngày`,
      types: "Loại challenge",
      payment: "Thanh toán",
      paymentValue: "Chuyển khoản (QR)",
      noPayment: "Không",
    },
    actions: {
      upgrade: "Nâng cấp",
      renew: { month: "Gia hạn 1 tháng", year: "Gia hạn 1 năm" },
      current: "Gói hiện tại",
    },
    rules:
      "Gói được bán theo tháng hoặc theo năm. Nâng cấp có hiệu lực ngay khi thanh toán xong và phải trả đủ giá: thời gian còn lại của gói hiện tại không được hoàn. Gia hạn cộng thêm kỳ đã mua vào sau ngày hết hạn hiện tại. Không thể hạ gói; khi gói trả phí hết hạn, tài khoản trở về gói Free.",
  },
  confirm: {
    demo: "Đây là website demo: bạn không cần thanh toán, và khoản thanh toán là thật.",
    upgradeTitle: (plan: string) => `Nâng cấp lên ${plan}?`,
    renewTitle: { month: (plan: string) => `Gia hạn ${plan} thêm một tháng?`, year: (plan: string) => `Gia hạn ${plan} thêm một năm?` },
    pay: {
      month: (amount: string) => `Bạn sẽ thanh toán ${amount} cho một tháng bằng chuyển khoản trên trang thanh toán của SePay.`,
      year: (amount: string) => `Bạn sẽ thanh toán ${amount} cho một năm bằng chuyển khoản trên trang thanh toán của SePay.`,
    },
    upgradeRuns: {
      month: (plan: string, date: string) =>
        `Gói ${plan} có hiệu lực ngay khi SePay xác nhận thanh toán và kéo dài một tháng, tới khoảng ${date}.`,
      year: (plan: string, date: string) =>
        `Gói ${plan} có hiệu lực ngay khi SePay xác nhận thanh toán và kéo dài một năm, tới khoảng ${date}.`,
    },
    saving: (percent: string, amount: string) => `Rẻ hơn ${percent} so với trả 12 tháng lẻ (${amount}).`,
    dropped: (plan: string, days: number) => `${days} ngày còn lại của gói ${plan} không được hoàn.`,
    renewEnds: (plan: string, date: string) => `Khi đó gói ${plan} sẽ hết hạn vào ${date}.`,
    continue: "Tiếp tục thanh toán",
  },
  result: {
    waitingTitle: "Đang chờ thanh toán",
    waiting: "SePay chưa xác nhận thanh toán. Trang này sẽ tự cập nhật.",
    paidTitle: "Đã nhận thanh toán",
    paid: "Gói của bạn đã được cập nhật.",
    slowTitle: "Chưa xác nhận được thanh toán",
    slow: "Gói sẽ tự thay đổi ngay khi SePay xác nhận thanh toán. Bạn có thể rời trang này.",
    cancelledTitle: "Đã hủy thanh toán",
    cancelled: "Bạn đã hủy thanh toán. Gói của bạn không thay đổi.",
    failedTitle: "Thanh toán không thành công",
    failed: "Thanh toán không thực hiện được và gói của bạn không thay đổi. Bạn có thể thử lại.",
    unknown: "Không tìm thấy giao dịch này.",
    view: "Xem giao dịch",
  },
};

export const billing = { en, vi };

import type { Translation } from "../types";

/** The public page of all captchas, the captcha section of the overview, and what they share. */
const en = {
  metaTitle: "Captchas",
  metaDescription: "The captcha types of WAU Captcha, what people do to solve each one, and the behaviour check behind all of them.",
  nav: "Captchas",
  learnMore: "Learn more",
  allCaptchas: "All captchas",
  index: {
    title: "Captchas people solve and scripts don't",
    description:
      "WAU Captcha has three kinds of challenge. Each one is drawn fresh for every request, and while it is on screen the way the person behaves is checked too.",
    typesTitle: "The challenges",
    compare: {
      title: "Side by side",
      tableLabel: "Captcha types compared",
      type: "Type",
      task: "What the person does",
      media: "Media",
      keyboard: "Keyboard only",
      bestFor: "Best for",
      yes: "Yes",
      no: "No",
    },
    behaviorTitle: "A behaviour check on every one",
    behaviorBody:
      "While a challenge is on screen, the SDK notes how the pointer moves and how the answer is typed, never what is typed. Answers a script clearly gave are refused even when right, and your server learns how human the rest looked.",
    behaviorLink: "How the behaviour check works",
    startTitle: "Add one to your site",
    startBody: "Create an API key, drop in the widget or <WauCaptcha />, and redeem the token on your server.",
    docs: "Read the docs",
    start: "Get an API key",
  },
  overview: {
    title: "Captchas",
    description: "The challenges your keys can ask for, and the behaviour check behind every one.",
    onPlan: "On your plan",
    notOnPlan: "Not on your plan",
    behaviorTitle: "Behaviour check",
    behaviorBody: "Pointer moves and typing rhythm are checked with every answer; your server gets the verdict.",
  },
};

const vi: Translation<typeof en> = {
  metaTitle: "Captcha",
  metaDescription: "Các loại captcha của WAU Captcha, người dùng làm gì để giải từng loại, và phần kiểm tra hành vi đứng sau tất cả.",
  nav: "Captcha",
  learnMore: "Tìm hiểu thêm",
  allCaptchas: "Tất cả captcha",
  index: {
    title: "Captcha người giải được, script thì không",
    description:
      "WAU Captcha có ba loại challenge. Mỗi challenge được vẽ mới cho từng yêu cầu, và trong lúc nó hiện trên màn hình, cách người dùng thao tác cũng được kiểm tra.",
    typesTitle: "Các loại challenge",
    compare: {
      title: "So sánh",
      tableLabel: "So sánh các loại captcha",
      type: "Loại",
      task: "Người dùng làm gì",
      media: "Định dạng",
      keyboard: "Chỉ dùng bàn phím",
      bestFor: "Phù hợp với",
      yes: "Được",
      no: "Không",
    },
    behaviorTitle: "Kiểm tra hành vi cho mọi loại",
    behaviorBody:
      "Trong lúc challenge hiện trên màn hình, SDK ghi lại cách con trỏ di chuyển và nhịp gõ câu trả lời, không bao giờ ghi nội dung gõ. Câu trả lời rõ ràng do script đưa ra bị từ chối kể cả khi đúng, và máy chủ của bạn biết phần còn lại trông giống người đến mức nào.",
    behaviorLink: "Cách kiểm tra hành vi hoạt động",
    startTitle: "Thêm vào trang của bạn",
    startBody: "Tạo khóa API, gắn widget hoặc <WauCaptcha />, rồi đổi token trên máy chủ của bạn.",
    docs: "Đọc tài liệu",
    start: "Lấy khóa API",
  },
  overview: {
    title: "Captcha",
    description: "Các challenge mà khóa của bạn dùng được, và phần kiểm tra hành vi đứng sau mỗi loại.",
    onPlan: "Có trong gói của bạn",
    notOnPlan: "Không có trong gói của bạn",
    behaviorTitle: "Kiểm tra hành vi",
    behaviorBody: "Chuyển động con trỏ và nhịp gõ được kiểm tra cùng mỗi câu trả lời; máy chủ của bạn nhận kết luận.",
  },
};

export const captchas = { en, vi };

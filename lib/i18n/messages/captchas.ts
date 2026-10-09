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
  samples: {
    metaTitle: "Sample challenges",
    metaDescription: "Real WAU Captcha challenges from the production generators, with their answers, for benchmarking.",
    title: "Sample challenges",
    description:
      "Real output of the generators behind /challenge/new, each with its answer, to test a solver, an accessibility tool or your own integration against.",
    live: "Live challenges are generated fresh for every request, and each one can be answered once: a sample says nothing about the next challenge.",
    download: "Download the manifest: file names, answers and, for slide_puzzle, the target and its tolerance",
    answer: (answer: string) => `Answer: ${answer}`,
    target: (x: string, tolerance: string) => `The piece ends at x = ${x} px, within ${tolerance} px`,
    play: "Play (3 MB)",
    alt: (type: string, index: string) => `${type}, sample ${index}`,
    playing: (type: string, index: string) => `${type}, sample ${index}, playing`,
    link: "Sample challenges with their answers",
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
  samples: {
    metaTitle: "Challenge mẫu",
    metaDescription: "Challenge thật của WAU Captcha do bộ sinh đang chạy tạo ra, kèm đáp án, để đo đạc và kiểm thử.",
    title: "Challenge mẫu",
    description:
      "Kết quả thật của các bộ sinh đứng sau /challenge/new, mỗi mẫu kèm đáp án, để thử một bộ giải, một công cụ hỗ trợ tiếp cận hay chính phần tích hợp của bạn.",
    live: "Challenge thật được sinh mới cho mỗi yêu cầu, và mỗi challenge chỉ trả lời được một lần: một mẫu không nói gì về challenge tiếp theo.",
    download: "Tải manifest: tên tệp, đáp án và, với slide_puzzle, vị trí đích cùng sai số cho phép",
    answer: (answer) => `Đáp án: ${answer}`,
    target: (x, tolerance) => `Mảnh ghép dừng ở x = ${x} px, sai lệch tối đa ${tolerance} px`,
    play: "Phát (3 MB)",
    alt: (type, index) => `${type}, mẫu ${index}`,
    playing: (type, index) => `${type}, mẫu ${index}, đang phát`,
    link: "Challenge mẫu kèm đáp án",
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

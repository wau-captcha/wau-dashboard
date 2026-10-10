import type { Translation } from "../types";

const en = {
  nav: {
    label: "Site navigation",
    home: "Home",
    docs: "Docs",
    pricing: "Pricing",
    dashboard: "Dashboard",
    signIn: "Sign in",
  },
  footer: {
    tagline: "Human checks for your forms and APIs.",
    product: "Product",
    company: "Company",
    changelog: "Changelog",
    status: "Status",
    about: "About",
    security: "Security",
    privacy: "Privacy",
    terms: "Terms",
    rights: (year: number) => `© ${year} WAU Captcha`,
  },
  landing: {
    metaTitle: "Captcha that keeps bots out",
    metaDescription: "WAU Captcha adds a human check to sign-ups, logins and APIs, with SDKs for the browser, React, Node.js and Java.",
    eyebrow: "Captcha as a service",
    title: "Keep bots out. Let people through.",
    description:
      "WAU Captcha puts a short human check in front of your sign-ups, logins and forms. Your page shows the challenge, your server redeems a one-time token, and the dashboard shows who is getting through.",
    start: "Get started free",
    docs: "Read the docs",
    how: {
      title: "How it works",
      steps: [
        {
          title: "Show a challenge",
          body: "Your page asks for a challenge with the public site key and shows it, or drops in the ready-made widget.",
        },
        {
          title: "The person answers",
          body: "A correct answer returns a one-time token, valid for two minutes. A wrong one simply gets a new challenge.",
        },
        {
          title: "Your server verifies",
          body: "Your backend redeems the token with the secret key. Each token works once, and only for your key.",
        },
      ],
    },
    challenges: {
      title: "Four kinds of challenge",
      description:
        "Pick per request. All four are generated fresh every time, so there is nothing to collect and replay. They slow down generic OCR and cheap scripts; the behaviour check and the server's own signals do most of the work, and no CAPTCHA stops a determined attacker on its own.",
      imageDistort: {
        name: "Distorted text",
        body: "Five characters, each turned, slanted and bent, crossed by thin strokes in the colours of the text. Quick for people, and a hurdle for generic OCR.",
      },
      motionNoise: {
        name: "Moving dots",
        body: "A looping animation of random dots. Any single frame is pure noise: the characters only appear through their motion.",
      },
      slidePuzzle: {
        name: "Slide puzzle",
        body: "Drag the piece into its hole in a freshly drawn picture; the drag itself is checked too, so it has to move like a human hand.",
      },
      animalJump: {
        name: "Jumping animals",
        body: "Five animal heads jump, and one jumps clearly higher than the rest: click it, in two short rounds. Both clicks must be right, and when they come is checked too.",
      },
    },
    features: {
      title: "Built for production",
      items: [
        { title: "One-time tokens", body: "Signed, short-lived, and tied to one API key and the website it was solved on, so a token cannot be reused or taken to another site." },
        { title: "Allowed domains and addresses", body: "Bind a key to your websites, and if you like to IP networks; other websites cannot use it in their visitors' browsers." },
        { title: "Secret key rotation", body: "Reset a secret without downtime: the previous one keeps working for 24 hours, or until you revoke it." },
        { title: "Scraping protection", body: "Keys that collect challenges without answering them are throttled for the day, and suspended only when the pattern is unmistakable; owners can ask for a review." },
        { title: "Usage and quotas", body: "Daily charts per key and per challenge type, and a meter of your plan's daily quota, which resets at 00:00 GMT+7 (17:00 UTC)." },
        { title: "SDKs", body: "A browser widget and client, a React component, and server SDKs for Node.js and Java; any other backend calls /siteverify directly." },
      ],
    },
    sdks: {
      title: "Integrate in minutes",
      description: "Install the SDK for your stack, then follow the docs for the full flow.",
      browser: "Browser",
      react: "React",
      node: "Node.js",
      java: "Java",
    },
    cta: {
      title: "Protect your first form today",
      body: "Create an API key in the dashboard; every captcha type is free for now.",
      button: "Create an API key",
    },
  },
};

const vi: Translation<typeof en> = {
  nav: {
    label: "Điều hướng trang",
    home: "Trang chủ",
    docs: "Tài liệu",
    pricing: "Bảng giá",
    dashboard: "Bảng điều khiển",
    signIn: "Đăng nhập",
  },
  footer: {
    tagline: "Kiểm tra con người cho form và API của bạn.",
    product: "Sản phẩm",
    company: "Về chúng tôi",
    changelog: "Nhật ký thay đổi",
    status: "Trạng thái",
    about: "Giới thiệu",
    security: "Bảo mật",
    privacy: "Quyền riêng tư",
    terms: "Điều khoản",
    rights: (year) => `© ${year} WAU Captcha`,
  },
  landing: {
    metaTitle: "Captcha chặn bot",
    metaDescription: "WAU Captcha thêm bước kiểm tra con người cho đăng ký, đăng nhập và API, kèm SDK cho trình duyệt, React, Node.js và Java.",
    eyebrow: "Captcha dạng dịch vụ",
    title: "Chặn bot. Mở cửa cho người thật.",
    description:
      "WAU Captcha đặt một bước kiểm tra ngắn trước form đăng ký, đăng nhập của bạn. Trang của bạn hiển thị challenge, máy chủ của bạn đổi token dùng một lần, còn bảng điều khiển cho bạn thấy ai đang vượt qua.",
    start: "Bắt đầu miễn phí",
    docs: "Đọc tài liệu",
    how: {
      title: "Cách hoạt động",
      steps: [
        {
          title: "Hiển thị challenge",
          body: "Trang của bạn lấy challenge bằng site key công khai rồi hiển thị, hoặc nhúng luôn widget dựng sẵn.",
        },
        {
          title: "Người dùng trả lời",
          body: "Trả lời đúng sẽ nhận token dùng một lần, có hiệu lực hai phút. Trả lời sai thì nhận challenge mới.",
        },
        {
          title: "Máy chủ xác minh",
          body: "Backend của bạn đổi token bằng secret key. Mỗi token chỉ dùng được một lần và chỉ cho khóa của bạn.",
        },
      ],
    },
    challenges: {
      title: "Bốn loại challenge",
      description:
        "Chọn theo từng lần gọi. Cả bốn đều được sinh mới mỗi lần, nên không có gì để thu thập rồi dùng lại. Chúng làm chậm OCR thông thường và script rẻ tiền; phần lớn công việc do kiểm tra hành vi và các tín hiệu của máy chủ đảm nhận, và không CAPTCHA nào tự mình chặn được kẻ tấn công quyết tâm.",
      imageDistort: {
        name: "Chữ méo",
        body: "Năm ký tự, mỗi ký tự xoay, nghiêng và uốn khác nhau, bị các nét mảnh cùng màu chữ cắt ngang. Nhanh với người, và là rào cản với OCR thông thường.",
      },
      motionNoise: {
        name: "Chấm chuyển động",
        body: "Một đoạn hoạt hình lặp lại gồm các chấm ngẫu nhiên. Từng khung hình chỉ là nhiễu: ký tự chỉ hiện ra nhờ chuyển động.",
      },
      slidePuzzle: {
        name: "Ghép hình trượt",
        body: "Kéo mảnh ghép vào đúng chỗ trống trên một bức ảnh vừa được vẽ; chính cú kéo cũng được kiểm tra, nên nó phải chuyển động như tay người.",
      },
      animalJump: {
        name: "Con vật nhảy cao",
        body: "Năm đầu con vật nhảy lên, một con nhảy cao hơn hẳn các con còn lại: bấm vào nó, qua hai lượt ngắn. Cả hai lần bấm phải đúng, và thời điểm bấm cũng được kiểm tra.",
      },
    },
    features: {
      title: "Sẵn sàng cho môi trường thật",
      items: [
        { title: "Token dùng một lần", body: "Có chữ ký, sống ngắn, gắn với một khóa API và website nơi challenge được giải, nên không thể dùng lại hay mang sang trang khác." },
        { title: "Tên miền và địa chỉ được phép", body: "Gắn khóa với website của bạn, và nếu muốn, với các dải IP; website khác không dùng được khóa trong trình duyệt của khách truy cập." },
        { title: "Xoay secret key", body: "Đặt lại secret không gián đoạn: secret cũ vẫn dùng được 24 giờ, hoặc tới khi bạn thu hồi." },
        { title: "Chống cào dữ liệu", body: "Khóa nào lấy challenge mà không trả lời sẽ bị giới hạn trong ngày, và chỉ bị đình chỉ khi dấu hiệu quá rõ ràng; chủ khóa có thể yêu cầu xem xét." },
        { title: "Lượt dùng và hạn mức", body: "Biểu đồ theo ngày cho từng khóa và từng loại challenge, kèm thanh hạn mức mỗi ngày của gói, đặt lại lúc 00:00 GMT+7 (17:00 UTC)." },
        { title: "SDK", body: "Widget và client cho trình duyệt, component React, cùng SDK máy chủ cho Node.js và Java; mọi backend khác gọi thẳng /siteverify." },
      ],
    },
    sdks: {
      title: "Tích hợp trong vài phút",
      description: "Cài SDK cho nền tảng của bạn, rồi làm theo tài liệu để có luồng đầy đủ.",
      browser: "Trình duyệt",
      react: "React",
      node: "Node.js",
      java: "Java",
    },
    cta: {
      title: "Bảo vệ form đầu tiên ngay hôm nay",
      body: "Tạo khóa API trong bảng điều khiển; mọi loại captcha hiện đang miễn phí.",
      button: "Tạo khóa API",
    },
  },
};

export const site = { en, vi };

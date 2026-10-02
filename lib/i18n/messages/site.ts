import type { Translation } from "../types";

const en = {
  nav: {
    label: "Site navigation",
    home: "Home",
    docs: "Docs",
    dashboard: "Dashboard",
    signIn: "Sign in",
  },
  footer: {
    tagline: "Human checks for your forms and APIs.",
    product: "Product",
    rights: (year: number) => `© ${year} WAU Captcha`,
  },
  landing: {
    metaTitle: "Captcha that keeps bots out",
    metaDescription: "WAU Captcha adds a human check to sign-ups, logins and APIs, with SDKs for JavaScript and Java.",
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
      title: "Three kinds of challenge",
      description: "Pick per request. All three are generated fresh every time, so there is nothing to collect and replay.",
      imageDistort: {
        name: "Distorted text",
        body: "Five characters, rotated, warped, crossed with curves and speckled with noise. Quick for people, costly for OCR.",
      },
      motionNoise: {
        name: "Moving dots",
        body: "A looping animation of random dots. Any single frame is pure noise: the characters only appear through their motion.",
      },
      slidePuzzle: {
        name: "Slide puzzle",
        body: "Drag the piece into its hole in a freshly drawn picture; the drag itself is checked too, so it has to move like a human hand.",
      },
    },
    features: {
      title: "Built for production",
      items: [
        { title: "One-time tokens", body: "Signed, short-lived, and tied to one API key, so a token cannot be reused or taken to another site." },
        { title: "Allowed IP addresses", body: "Limit a key to the addresses and networks you list; everything else is refused." },
        { title: "Secret key rotation", body: "Reset a secret without downtime: the previous one keeps working for 24 hours, or until you revoke it." },
        { title: "Scraping protection", body: "Keys that collect challenges without answering them are suspended automatically." },
        { title: "Usage and quotas", body: "Daily charts per key and per challenge type, and a quota meter for your plan." },
        { title: "SDKs", body: "A browser widget and client, a React component, plus server SDKs for Node.js and Java." },
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
    dashboard: "Bảng điều khiển",
    signIn: "Đăng nhập",
  },
  footer: {
    tagline: "Kiểm tra con người cho form và API của bạn.",
    product: "Sản phẩm",
    rights: (year) => `© ${year} WAU Captcha`,
  },
  landing: {
    metaTitle: "Captcha chặn bot",
    metaDescription: "WAU Captcha thêm bước kiểm tra con người cho đăng ký, đăng nhập và API, kèm SDK cho JavaScript và Java.",
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
      title: "Ba loại challenge",
      description: "Chọn theo từng lần gọi. Cả ba đều được sinh mới mỗi lần, nên không có gì để thu thập rồi dùng lại.",
      imageDistort: {
        name: "Chữ méo",
        body: "Năm ký tự bị xoay, bẻ cong, gạch đường cong và rắc nhiễu. Nhanh với người, tốn công với OCR.",
      },
      motionNoise: {
        name: "Chấm chuyển động",
        body: "Một đoạn hoạt hình lặp lại gồm các chấm ngẫu nhiên. Từng khung hình chỉ là nhiễu: ký tự chỉ hiện ra nhờ chuyển động.",
      },
      slidePuzzle: {
        name: "Ghép hình trượt",
        body: "Kéo mảnh ghép vào đúng chỗ trống trên một bức ảnh vừa được vẽ; chính cú kéo cũng được kiểm tra, nên nó phải chuyển động như tay người.",
      },
    },
    features: {
      title: "Sẵn sàng cho môi trường thật",
      items: [
        { title: "Token dùng một lần", body: "Có chữ ký, sống ngắn và gắn với một khóa API, nên không thể dùng lại hay mang sang trang khác." },
        { title: "Địa chỉ IP được phép", body: "Giới hạn khóa trong các địa chỉ và dải mạng bạn liệt kê; mọi địa chỉ khác bị từ chối." },
        { title: "Xoay secret key", body: "Đặt lại secret không gián đoạn: secret cũ vẫn dùng được 24 giờ, hoặc tới khi bạn thu hồi." },
        { title: "Chống cào dữ liệu", body: "Khóa nào lấy challenge mà không trả lời sẽ tự động bị đình chỉ." },
        { title: "Lượt dùng và hạn mức", body: "Biểu đồ theo ngày cho từng khóa và từng loại challenge, kèm thanh hạn mức của gói." },
        { title: "SDK", body: "Widget và client cho trình duyệt, component React, cùng SDK máy chủ cho Node.js và Java." },
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

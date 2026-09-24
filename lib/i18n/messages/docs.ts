import type { Translation } from "../types";

const en = {
  metaTitle: "Documentation",
  metaDescription: "Integrate WAU Captcha: the widget, the browser client, server verification in Node.js and Java, and the REST API.",
  title: "Documentation",
  description: "Everything you need to put WAU Captcha in front of a form or an API.",
  toc: "On this page",
  baseUrlNote: (url: string) => `Examples use this installation's address, ${url}. Replace it with yours if you run your own.`,
  sections: {
    overview: {
      title: "How it works",
      body: "A captcha check takes three calls. Your page fetches a challenge with the public site key, the person answers it and gets a one-time token, and your server redeems the token with the secret key before accepting the request.",
      keysTitle: "Your keys",
      siteKey: "Site key (pk_…) — public. Used in the browser to fetch challenges.",
      secretKey: "Secret key (sk_…) — private. Used by your server to redeem tokens. Never ship it to a browser.",
      keysWhere: "Create a key pair on the API keys page of the dashboard.",
    },
    quickStart: {
      title: "Quick start",
      step1: "Create an API key in the dashboard and copy its site key and secret key.",
      step2: "Add the widget to your form. Once solved, the form sends a hidden field named wau-captcha-token.",
      step3: "On your server, redeem that token with the secret key and reject the request when it fails.",
    },
    widget: {
      title: "Browser widget",
      body: "The widget shows the challenge, a text box and two buttons, and loads a new challenge after a wrong answer. With the script build, any element with data-wau-captcha renders by itself.",
      bundler: "With a bundler, render it yourself to get callbacks and your own labels:",
      attributes: "Attributes: data-site-key and data-base-url (required), data-challenge-type (image_distort or motion_noise) and data-input-name (default wau-captcha-token).",
    },
    client: {
      title: "Custom UI in the browser",
      body: "Use WauCaptchaClient to build your own interface. A challenge can be answered once: after a wrong answer, fetch a new one.",
    },
    node: {
      title: "Verify on a Node.js server",
      body: "Redeem the token with @wau-captcha/server (Node.js 18 or later). A thrown WauCaptchaError means the token could not be checked; treat it as a failure.",
    },
    java: {
      title: "Verify on a Java server",
      body: "Redeem the token with com.waucaptcha:wau-captcha-sdk (Java 17 or later, no dependencies). The client is immutable and safe to share between threads.",
    },
    api: {
      title: "REST API",
      body: "The SDKs call these endpoints; any HTTP client can call them too. Errors come back as JSON {code, reason, message, metadata}.",
      newChallenge: "Issues a challenge. Query: site_key (required), challenge_type (image_distort by default). image is base64; display it at width × height CSS pixels.",
      verifyAnswer: "Checks an answer. success is false after a wrong answer; the challenge is used up either way.",
      siteVerify: "Redeems a token, once. Send the secret key as a bearer token. success is false when the token is unknown, expired, already used or issued for another key.",
    },
    challengeTypes: {
      title: "Challenge types",
      imageDistort: "image_distort — five characters (letters and digits) distorted in a PNG. The default.",
      motionNoise: "motion_noise — five capital letters hidden in a five-second animated GIF of moving dots.",
      note: "Answers are not case-sensitive. The plan of your account decides which types a key may request.",
    },
    security: {
      title: "Limits and security",
      lifetimes: "Challenges and tokens expire after two minutes, and each works once.",
      origins: "Allowed IP addresses: on a key's page, list the addresses or networks (such as 203.0.113.0/24) that may request challenges. With none listed, every address may; 0.0.0.0 also allows everyone.",
      rotation: "Resetting a secret key keeps the previous one valid for 24 hours, or until you revoke it, so servers can switch without downtime.",
      quota: "Each account has a daily quota of successful verifications (1,000 on the free plan). Once it is used up, new challenges are refused until midnight (Asia/Ho_Chi_Minh).",
      scraping: "A key that fetches at least 200 challenges in a day but answers fewer than 30% of them is suspended automatically.",
    },
    errors: {
      title: "Errors",
      code: "Code",
      meaning: "Meaning",
      rows: [
        { code: "SITE_KEY_INVALID", meaning: "Unknown, paused or deleted site key." },
        { code: "SECRET_KEY_INVALID", meaning: "Unknown, paused or deleted key, or a wrong secret." },
        { code: "ORIGIN_NOT_ALLOWED", meaning: "The caller's IP address is not among the key's allowed addresses." },
        { code: "CHALLENGE_TYPE_NOT_ALLOWED", meaning: "The account's plan does not include this challenge type." },
        { code: "CHALLENGE_NOT_FOUND", meaning: "The challenge expired or was already answered." },
        { code: "API_KEY_SUSPENDED", meaning: "Suspended by an administrator or by the scraping check." },
        { code: "ACCOUNT_BANNED", meaning: "The owner of the key was banned." },
        { code: "DAILY_QUOTA_EXCEEDED", meaning: "The account used up today's successful verifications." },
        { code: "RATE_LIMITED", meaning: "Too many requests; try again shortly." },
        { code: "NETWORK_ERROR, TIMEOUT", meaning: "Reported by the SDKs when no reply arrived." },
      ],
    },
  },
};

const vi: Translation<typeof en> = {
  metaTitle: "Tài liệu",
  metaDescription: "Tích hợp WAU Captcha: widget, client trên trình duyệt, xác minh phía máy chủ bằng Node.js và Java, và REST API.",
  title: "Tài liệu",
  description: "Mọi thứ bạn cần để đặt WAU Captcha trước một form hay một API.",
  toc: "Trên trang này",
  baseUrlNote: (url) => `Các ví dụ dùng địa chỉ của bản cài đặt này, ${url}. Nếu bạn tự vận hành, hãy thay bằng địa chỉ của bạn.`,
  sections: {
    overview: {
      title: "Cách hoạt động",
      body: "Một lần kiểm tra captcha gồm ba lời gọi. Trang của bạn lấy challenge bằng site key công khai, người dùng trả lời và nhận token dùng một lần, rồi máy chủ của bạn đổi token bằng secret key trước khi chấp nhận yêu cầu.",
      keysTitle: "Khóa của bạn",
      siteKey: "Site key (pk_…) — công khai. Dùng ở trình duyệt để lấy challenge.",
      secretKey: "Secret key (sk_…) — bí mật. Dùng ở máy chủ để đổi token. Không bao giờ đưa lên trình duyệt.",
      keysWhere: "Tạo cặp khóa ở trang Khóa API của bảng điều khiển.",
    },
    quickStart: {
      title: "Bắt đầu nhanh",
      step1: "Tạo khóa API trong bảng điều khiển, sao chép site key và secret key.",
      step2: "Thêm widget vào form. Sau khi giải xong, form gửi kèm trường ẩn tên wau-captcha-token.",
      step3: "Ở máy chủ, đổi token đó bằng secret key và từ chối yêu cầu nếu không thành công.",
    },
    widget: {
      title: "Widget trên trình duyệt",
      body: "Widget hiển thị challenge, ô nhập và hai nút, tự lấy challenge mới sau khi trả lời sai. Với bản script, phần tử nào có data-wau-captcha sẽ tự hiển thị.",
      bundler: "Nếu dùng bundler, hãy tự render để có callback và nhãn riêng:",
      attributes: "Thuộc tính: data-site-key và data-base-url (bắt buộc), data-challenge-type (image_distort hoặc motion_noise) và data-input-name (mặc định wau-captcha-token).",
    },
    client: {
      title: "Giao diện riêng trên trình duyệt",
      body: "Dùng WauCaptchaClient để tự dựng giao diện. Mỗi challenge chỉ trả lời được một lần: trả lời sai thì lấy challenge mới.",
    },
    node: {
      title: "Xác minh trên máy chủ Node.js",
      body: "Đổi token bằng @wau-captcha/server (Node.js 18 trở lên). Nếu gặp WauCaptchaError tức là không kiểm tra được token; hãy coi đó là thất bại.",
    },
    java: {
      title: "Xác minh trên máy chủ Java",
      body: "Đổi token bằng com.waucaptcha:wau-captcha-sdk (Java 17 trở lên, không phụ thuộc thư viện ngoài). Client bất biến và dùng chung an toàn giữa nhiều luồng.",
    },
    api: {
      title: "REST API",
      body: "Các SDK gọi những endpoint này; mọi HTTP client đều gọi được. Lỗi trả về dạng JSON {code, reason, message, metadata}.",
      newChallenge: "Cấp một challenge. Query: site_key (bắt buộc), challenge_type (mặc định image_distort). image là base64; hiển thị ở kích thước width × height pixel CSS.",
      verifyAnswer: "Kiểm tra câu trả lời. success là false khi trả lời sai; challenge bị dùng hết trong cả hai trường hợp.",
      siteVerify: "Đổi token, một lần duy nhất. Gửi secret key dạng bearer token. success là false khi token không tồn tại, hết hạn, đã dùng hoặc thuộc khóa khác.",
    },
    challengeTypes: {
      title: "Loại challenge",
      imageDistort: "image_distort — năm ký tự (chữ và số) bị bóp méo trong ảnh PNG. Mặc định.",
      motionNoise: "motion_noise — năm chữ in hoa ẩn trong ảnh GIF động năm giây gồm các chấm chuyển động.",
      note: "Câu trả lời không phân biệt hoa thường. Gói của tài khoản quyết định khóa được dùng loại nào.",
    },
    security: {
      title: "Giới hạn và bảo mật",
      lifetimes: "Challenge và token hết hạn sau hai phút, và mỗi cái chỉ dùng được một lần.",
      origins: "Địa chỉ IP được phép: ở trang của khóa, liệt kê các địa chỉ hoặc dải mạng (như 203.0.113.0/24) được xin challenge. Không liệt kê gì thì mọi địa chỉ đều được; 0.0.0.0 cũng cho phép tất cả.",
      rotation: "Đặt lại secret key vẫn giữ secret cũ hiệu lực trong 24 giờ, hoặc tới khi bạn thu hồi, để máy chủ chuyển đổi không gián đoạn.",
      quota: "Mỗi tài khoản có hạn mức lượt xác minh thành công mỗi ngày (1.000 với gói miễn phí). Dùng hết thì challenge mới bị từ chối tới nửa đêm (giờ Asia/Ho_Chi_Minh).",
      scraping: "Khóa nào lấy ít nhất 200 challenge trong một ngày nhưng trả lời dưới 30% sẽ tự động bị đình chỉ.",
    },
    errors: {
      title: "Lỗi",
      code: "Mã",
      meaning: "Ý nghĩa",
      rows: [
        { code: "SITE_KEY_INVALID", meaning: "Site key không tồn tại, đang tạm dừng hoặc đã xóa." },
        { code: "SECRET_KEY_INVALID", meaning: "Khóa không tồn tại, đang tạm dừng, đã xóa hoặc sai secret." },
        { code: "ORIGIN_NOT_ALLOWED", meaning: "Địa chỉ IP của bên gọi không nằm trong danh sách được phép của khóa." },
        { code: "CHALLENGE_TYPE_NOT_ALLOWED", meaning: "Gói của tài khoản không có loại challenge này." },
        { code: "CHALLENGE_NOT_FOUND", meaning: "Challenge đã hết hạn hoặc đã được trả lời." },
        { code: "API_KEY_SUSPENDED", meaning: "Bị quản trị viên hoặc cơ chế chống cào đình chỉ." },
        { code: "ACCOUNT_BANNED", meaning: "Chủ khóa đã bị khóa tài khoản." },
        { code: "DAILY_QUOTA_EXCEEDED", meaning: "Tài khoản đã dùng hết lượt xác minh thành công của hôm nay." },
        { code: "RATE_LIMITED", meaning: "Gọi quá nhiều; hãy thử lại sau ít phút." },
        { code: "NETWORK_ERROR, TIMEOUT", meaning: "Do SDK báo khi không nhận được phản hồi." },
      ],
    },
  },
};

export const docs = { en, vi };

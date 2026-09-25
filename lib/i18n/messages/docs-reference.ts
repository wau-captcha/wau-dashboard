import type { Translation } from "../types";

/** The reference half of the docs: the REST API, challenge types, limits and error codes. */
const en = {
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
    note: "Answers are not case-sensitive. The plan of your account decides which types a key may request. In the JavaScript SDKs, name them with ChallengeType.IMAGE_DISTORT and ChallengeType.MOTION_NOISE.",
  },
  security: {
    title: "Limits and security",
    lifetimes: "Challenges and tokens expire after two minutes, and each works once.",
    origins: "Allowed IP addresses: on a key's page, list the addresses or networks (such as 203.0.113.0/24) that may request challenges. With none listed, every address may; 0.0.0.0 also allows everyone.",
    rotation: "Resetting a secret key keeps the previous one valid for 24 hours, or until you revoke it, so servers can switch without downtime.",
    quota: "Each account has a daily quota of successful verifications (1,000 on the free plan). Once it is used up, new challenges are refused until midnight (Asia/Ho_Chi_Minh).",
    scraping: "A key that fetches at least 200 challenges in a day but sends fewer than 20% of them to /challenge/verify ((/challenge/verify) ÷ (/challenge/new) under 20%) is taken for spam and suspended automatically.",
  },
  errors: {
    title: "Errors",
    sdkNote: "In the JavaScript SDKs, compare error.code with the ErrorCode constants, e.g. ErrorCode.SITE_KEY_INVALID.",
    code: "Code",
    meaning: "Meaning",
    rows: [
      { code: "SITE_KEY_INVALID", meaning: "Unknown, paused or deleted site key." },
      { code: "SECRET_KEY_INVALID", meaning: "Unknown, paused or deleted key, or a wrong secret." },
      { code: "ORIGIN_NOT_ALLOWED", meaning: "The caller's IP address is not among the key's allowed addresses." },
      { code: "CHALLENGE_TYPE_NOT_ALLOWED", meaning: "The account's plan does not include this challenge type." },
      { code: "CHALLENGE_TYPE_UNSUPPORTED", meaning: "challenge_type is not a known type." },
      { code: "CHALLENGE_NOT_FOUND", meaning: "The challenge expired or was already answered. The widget and <WauCaptcha /> load a new one by themselves." },
      { code: "API_KEY_SUSPENDED", meaning: "Suspended by an administrator or by the scraping check." },
      { code: "ACCOUNT_BANNED", meaning: "The owner of the key was banned." },
      { code: "DAILY_QUOTA_EXCEEDED", meaning: "The account used up today's successful verifications." },
      { code: "RATE_LIMITED", meaning: "Too many requests; try again shortly." },
      { code: "ROUTE_NOT_FOUND", meaning: "No service handles the path; check the base URL." },
      { code: "UPSTREAM_UNAVAILABLE", meaning: "A service behind the gateway is unavailable; try again later." },
      { code: "NETWORK_ERROR, TIMEOUT, INVALID_RESPONSE", meaning: "Reported by the SDKs when no usable reply arrived." },
    ],
  },
};

const vi: Translation<typeof en> = {
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
    note: "Câu trả lời không phân biệt hoa thường. Gói của tài khoản quyết định khóa được dùng loại nào. Trong các SDK JavaScript, dùng ChallengeType.IMAGE_DISTORT và ChallengeType.MOTION_NOISE.",
  },
  security: {
    title: "Giới hạn và bảo mật",
    lifetimes: "Challenge và token hết hạn sau hai phút, và mỗi cái chỉ dùng được một lần.",
    origins: "Địa chỉ IP được phép: ở trang của khóa, liệt kê các địa chỉ hoặc dải mạng (như 203.0.113.0/24) được xin challenge. Không liệt kê gì thì mọi địa chỉ đều được; 0.0.0.0 cũng cho phép tất cả.",
    rotation: "Đặt lại secret key vẫn giữ secret cũ hiệu lực trong 24 giờ, hoặc tới khi bạn thu hồi, để máy chủ chuyển đổi không gián đoạn.",
    quota: "Mỗi tài khoản có hạn mức lượt xác minh thành công mỗi ngày (1.000 với gói miễn phí). Dùng hết thì challenge mới bị từ chối tới nửa đêm (giờ Asia/Ho_Chi_Minh).",
    scraping: "Khóa nào lấy ít nhất 200 challenge trong một ngày mà tỉ lệ (/challenge/verify) ÷ (/challenge/new) dưới 20% bị coi là spam và tự động bị đình chỉ.",
  },
  errors: {
    title: "Lỗi",
    sdkNote: "Trong các SDK JavaScript, so error.code với các hằng ErrorCode, ví dụ ErrorCode.SITE_KEY_INVALID.",
    code: "Mã",
    meaning: "Ý nghĩa",
    rows: [
      { code: "SITE_KEY_INVALID", meaning: "Site key không tồn tại, đang tạm dừng hoặc đã xóa." },
      { code: "SECRET_KEY_INVALID", meaning: "Khóa không tồn tại, đang tạm dừng, đã xóa hoặc sai secret." },
      { code: "ORIGIN_NOT_ALLOWED", meaning: "Địa chỉ IP của bên gọi không nằm trong danh sách được phép của khóa." },
      { code: "CHALLENGE_TYPE_NOT_ALLOWED", meaning: "Gói của tài khoản không có loại challenge này." },
      { code: "CHALLENGE_TYPE_UNSUPPORTED", meaning: "challenge_type không phải loại đã biết." },
      { code: "CHALLENGE_NOT_FOUND", meaning: "Challenge đã hết hạn hoặc đã được trả lời. Widget và <WauCaptcha /> tự tải challenge mới." },
      { code: "API_KEY_SUSPENDED", meaning: "Bị quản trị viên hoặc cơ chế chống cào đình chỉ." },
      { code: "ACCOUNT_BANNED", meaning: "Chủ khóa đã bị khóa tài khoản." },
      { code: "DAILY_QUOTA_EXCEEDED", meaning: "Tài khoản đã dùng hết lượt xác minh thành công của hôm nay." },
      { code: "RATE_LIMITED", meaning: "Gọi quá nhiều; hãy thử lại sau ít phút." },
      { code: "ROUTE_NOT_FOUND", meaning: "Không service nào xử lý đường dẫn này; hãy kiểm tra base URL." },
      { code: "UPSTREAM_UNAVAILABLE", meaning: "Một service phía sau gateway đang không phản hồi; hãy thử lại sau." },
      { code: "NETWORK_ERROR, TIMEOUT, INVALID_RESPONSE", meaning: "Do SDK báo khi không nhận được phản hồi dùng được." },
    ],
  },
};

export const docsReference = { en, vi };

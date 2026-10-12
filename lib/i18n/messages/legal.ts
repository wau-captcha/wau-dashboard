import type { Translation } from "../types";

/**
 * The privacy policy and the terms of service. They state what the code does; the parts in
 * [BRACKETS] are placeholders the operator fills in, and the draft note stays while any is left.
 */
const en = {
  draft: {
    title: "Draft, under review",
    body: "This page describes what WAU Captcha does today. Parts in [brackets] are placeholders the operator still has to fill in.",
  },
  updated: "Last updated 12 October 2026",
  contact: "Contact",
  privacy: {
    metaTitle: "Privacy policy",
    metaDescription: "What WAU Captcha collects, why, where it is stored, for how long and who can see it.",
    title: "Privacy policy",
    description: "What we collect when you use the dashboard or a site shows a WAU Captcha challenge, and what happens to it.",
    sections: [
      {
        title: "Who runs WAU Captcha",
        paragraphs: [
          "WAU captcha runs waucaptcha.com, the website and dashboard, and api.waucaptcha.com, the captcha API. For any question about your data, write to wauchaptcha@gmail.com.",
        ],
      },
      {
        title: "Dashboard accounts",
        items: [
          "When you sign in with Google we receive, and keep in our database, the email address, the display name and the account id of your Google account, to know which account is yours. We never receive your Google password.",
          "With the account we keep its plan, when a paid plan ends, when the account was created and whether an administrator banned it.",
          "Your API keys: their names, site keys and secret keys, whether they are active or suspended, the IP addresses and domains you allow with the descriptions you give them, whether they require behaviour data, and an activity log of what was changed on them, when and by whom (you, an administrator or the system). Secret keys never appear in that log.",
          "If you ask for a review of a suspended or flagged key, the message you write and the administrator's answer.",
        ],
      },
      {
        title: "Each captcha challenge",
        items: [
          "For every challenge a site asks for, one row in our database: the API key, the challenge type, when it was issued, whether it was answered and answered right, and the verdict and score of the behaviour check. The row holds no IP address, no browser details and no behaviour data.",
          "While a challenge can be answered, 2 minutes at most, Redis keeps its answer, the visitor's IP address, the website it was asked for from (its origin) and a hash of the browser's User-Agent, to check that the answer comes from the same browser. Answering it, right or wrong, deletes it.",
          "A token earned by a right answer stays in Redis until the site's server redeems it, 2 minutes at most, with the API key, the challenge type, when it was solved, the website's host name and the behaviour verdict.",
          "Against abuse, Redis counts requests per IP address in one-minute windows, and wrong answers, automated verdicts and the automatic passes of auto_check per IP address over the last hour. Daily counters per account and per key (challenges, answers, right answers) live for 24 hours and hold no IP address.",
        ],
      },
      {
        title: "Behaviour data",
        items: [
          "While a challenge is on screen, the SDK records where the pointer moves relative to the widget, the time between key presses in the answer box (never the keys), how many input, paste and script-made events happened, how long the page was hidden, and a few hints the browser gives about itself: whether it reports automation, a headless browser or no languages.",
          "It is sent with the answer, judged in memory and dropped. Only the verdict (human, suspicious, automated or not measured), the score and short reason codes are kept: in the challenge's row and, until it is redeemed, with the token.",
        ],
      },
      {
        title: "Payments",
        paragraphs: [
          "For each purchase we keep the plan, the period, the amount, the payment code, its status, SePay's transaction id and when it was paid. You pay on SePay's page by bank transfer; we never see your bank or card details.",
        ],
      },
      {
        title: "Cookies and browser storage",
        items: [
          "wau_session keeps you signed in, for 24 hours.",
          "wau_admin_session does the same for administrators, and is sent to /admin only.",
          "wau_google_nonce ties a Google sign-in to your browser, for one hour.",
          "wau_locale remembers the language you chose, for one year.",
          "wau-theme, in local storage, remembers the light or dark theme.",
          "There are no analytics or advertising cookies and no tracking scripts. Google's sign-in script loads from accounts.google.com on the sign-in pages only, and on /demo, which shows the button.",
        ],
      },
      {
        title: "Server logs",
        paragraphs: [
          "The services write operational logs: errors, with challenge ids, API key ids or payment codes, and refused payment notifications with the address they came from. They stay on the server for [RETENTION: e.g. 14 days].",
        ],
      },
      {
        title: "Where it is stored",
        paragraphs: [
          "Everything is hosted by Amazon Web Services in the ap-southeast-1 region, Singapore: the server, the PostgreSQL database and Redis.",
        ],
      },
      {
        title: "How long we keep it",
        items: [
          "Challenges and tokens: 2 minutes at most.",
          "Counters per IP address: one minute, and one hour for the history of wrong answers and of automatic passes. Daily counters: 24 hours.",
          "Challenge rows, the usage history: there is no deletion rule yet. [RETENTION: e.g. 12 months]",
          "Accounts, API keys and their activity log: as long as the account exists. A deleted key stays, marked deleted, for its usage history. [RETENTION: e.g. erased 30 days after the account is closed]",
          "Payments: [RETENTION: e.g. 10 years, as Vietnamese accounting law requires]",
          "Server logs: [RETENTION: e.g. 14 days]",
        ],
      },
      {
        title: "Who can see it",
        paragraphs: [
          "You see your own account, keys, usage and activity. The administrators of WAU captcha see accounts, keys without their secret keys, usage, payments and reviews, to run and protect the service. The processors below handle data only to provide their part of the service. We do not sell data or share it for advertising.",
        ],
      },
      {
        title: "Processors",
        items: [
          "Amazon Web Services: hosting, in Singapore.",
          "Google: sign-in with your Google account.",
          "SePay: payments by bank transfer.",
        ],
      },
      {
        title: "Your choices",
        paragraphs: [
          "Write to wauchaptcha@gmail.com to get a copy of your data, to correct it or to have your account deleted. [RESPONSE TIME: e.g. within 30 days]",
        ],
      },
      {
        title: "Changes",
        paragraphs: ["Changes to this policy are announced here and on the changelog."],
      },
    ],
  },
  terms: {
    metaTitle: "Terms of service",
    metaDescription: "The terms of WAU Captcha: acceptable use, quotas and suspension, no SLA, payments, liability and the law that applies.",
    title: "Terms of service",
    description: "The rules for using WAU Captcha, its API and its dashboard.",
    sections: [
      {
        title: "The service",
        paragraphs: [
          "WAU captcha provides WAU Captcha: challenges your website shows to its visitors, an API that checks the answers, and a dashboard to manage your keys. Creating an account or using an API key means you accept these terms.",
        ],
      },
      {
        title: "Your account and keys",
        paragraphs: [
          "Keep your secret key on your server, never in a browser or a public repository. You are responsible for what is done with your keys. If you think a secret key leaked, reset it on the key's page.",
        ],
      },
      {
        title: "Acceptable use",
        items: [
          "Use the service to protect your own websites and APIs, or ones you are allowed to protect.",
          "Do not attack, overload or probe the service beyond what the security page allows.",
          "Bots that solve the captchas for research, testing or teaching are welcome with your own account and keys, within your plan's quota and rate limits; never aim them at another customer's website or key, and run large benchmarks on the published samples.",
          "Do not fetch challenges in bulk without answering them, resell challenges or their answers, or run a solving service for others.",
          "Do not try to get around rate limits, quotas, suspensions or the domains bound to a key.",
          "Do not use the service for anything illegal in Vietnam or where you operate.",
        ],
      },
      {
        title: "Quotas, limits and suspension",
        paragraphs: [
          "Each plan has a daily quota of successful verifications, which resets at 00:00 GMT+7 (17:00 UTC), and every key has rate limits; the documentation lists them. A key whose traffic looks like scraping is throttled first and may be suspended automatically; an administrator can also suspend a key, or ban an account, that breaks these terms. You can ask for a review on the key's page.",
        ],
      },
      {
        title: "No service level agreement",
        paragraphs: [
          "The service runs on one server in one region and is provided on a best-effort basis: there is no guaranteed uptime and no compensation for downtime. The status page shows whether it is up.",
        ],
      },
      {
        title: "Payments and refunds",
        paragraphs: [
          "Paid plans are priced in Vietnamese đồng, paid in full and in advance by bank transfer through SePay, and run for the month or the year bought. [REFUND POLICY: e.g. no refund once a plan has started, unless the law requires one]",
        ],
      },
      {
        title: "No CAPTCHA stops every bot",
        paragraphs: [
          "WAU Captcha makes automated abuse slower and costlier and tells your server what it observed. It cannot stop a determined attacker on its own; what to do with a verdict is your decision.",
        ],
      },
      {
        title: "Liability",
        paragraphs: [
          "The service is provided as is. As far as the law allows, WAU captcha is not liable for indirect or consequential damages, lost profits or lost data, and its total liability is limited to what you paid in the [LIABILITY PERIOD: e.g. 3] months before the claim.",
        ],
      },
      {
        title: "Changes and ending",
        paragraphs: [
          "We may change the service or these terms; changes are announced on the changelog. You may stop using the service at any time. We may close an account that breaks these terms.",
        ],
      },
      {
        title: "Governing law",
        paragraphs: [
          "These terms are governed by the law of Vietnam. Disputes go to the competent courts of Vietnam, [VENUE: e.g. Ho Chi Minh City].",
        ],
      },
    ],
  },
};

const vi: Translation<typeof en> = {
  draft: {
    title: "Bản nháp, đang được xem xét",
    body: "Trang này mô tả những gì WAU Captcha đang làm hiện nay. Các phần trong [ngoặc vuông] là chỗ trống mà bên vận hành còn phải điền.",
  },
  updated: "Cập nhật lần cuối ngày 12 tháng 10 năm 2026",
  contact: "Liên hệ",
  privacy: {
    metaTitle: "Chính sách quyền riêng tư",
    metaDescription: "WAU Captcha thu thập gì, vì sao, lưu ở đâu, trong bao lâu và ai được xem.",
    title: "Chính sách quyền riêng tư",
    description: "Những gì chúng tôi thu thập khi bạn dùng bảng điều khiển hoặc khi một trang web hiển thị challenge của WAU Captcha, và chúng được xử lý ra sao.",
    sections: [
      {
        title: "Ai vận hành WAU Captcha",
        paragraphs: [
          "WAU captcha vận hành waucaptcha.com, tức trang web và bảng điều khiển, và api.waucaptcha.com, tức API captcha. Mọi câu hỏi về dữ liệu của bạn, hãy gửi tới wauchaptcha@gmail.com.",
        ],
      },
      {
        title: "Tài khoản bảng điều khiển",
        items: [
          "Khi bạn đăng nhập bằng Google, chúng tôi nhận và lưu trong cơ sở dữ liệu địa chỉ email, tên hiển thị và mã tài khoản Google của bạn, để biết tài khoản nào là của bạn. Chúng tôi không bao giờ nhận mật khẩu Google của bạn.",
          "Cùng với tài khoản, chúng tôi lưu gói đang dùng, thời điểm gói trả phí kết thúc, ngày tạo tài khoản và việc tài khoản có bị quản trị viên khóa hay không.",
          "Các khóa API của bạn: tên, site key và secret key, trạng thái hoạt động hay bị đình chỉ, các địa chỉ IP và tên miền bạn cho phép kèm mô tả bạn đặt, việc khóa có bắt buộc dữ liệu hành vi hay không, và nhật ký hoạt động ghi lại thay đổi gì, lúc nào và do ai (bạn, quản trị viên hay hệ thống). Secret key không bao giờ xuất hiện trong nhật ký đó.",
          "Nếu bạn yêu cầu xem xét lại một khóa bị đình chỉ hoặc bị đánh dấu, chúng tôi lưu lời nhắn của bạn và câu trả lời của quản trị viên.",
        ],
      },
      {
        title: "Mỗi challenge captcha",
        items: [
          "Với mỗi challenge một trang web yêu cầu, có một dòng trong cơ sở dữ liệu: khóa API, loại challenge, thời điểm cấp, đã được trả lời và trả lời đúng hay chưa, cùng kết luận và điểm của phần kiểm tra hành vi. Dòng này không chứa địa chỉ IP, thông tin trình duyệt hay dữ liệu hành vi.",
          "Trong lúc challenge còn trả lời được, tối đa 2 phút, Redis giữ đáp án, địa chỉ IP của người truy cập, trang web đã yêu cầu nó (origin) và giá trị băm của User-Agent trình duyệt, để kiểm tra câu trả lời đến từ đúng trình duyệt đó. Trả lời, dù đúng hay sai, đều xóa nó.",
          "Token có được nhờ trả lời đúng nằm trong Redis tới khi máy chủ của trang web đổi nó, tối đa 2 phút, kèm khóa API, loại challenge, thời điểm giải, tên miền của trang web và kết luận hành vi.",
          "Để chống lạm dụng, Redis đếm số yêu cầu theo địa chỉ IP trong từng khung một phút, và số câu trả lời sai, số kết luận automated cùng số lượt qua tự động của auto_check theo địa chỉ IP trong một giờ gần nhất. Bộ đếm theo ngày của từng tài khoản và từng khóa (challenge, câu trả lời, câu trả lời đúng) tồn tại 24 giờ và không chứa địa chỉ IP.",
        ],
      },
      {
        title: "Dữ liệu hành vi",
        items: [
          "Khi challenge hiện trên màn hình, SDK ghi lại vị trí con trỏ so với widget, khoảng thời gian giữa các lần gõ phím trong ô trả lời (không bao giờ ghi phím), số sự kiện nhập, dán và sự kiện do script tạo ra, thời gian trang bị ẩn, cùng vài dấu hiệu trình duyệt tự cho biết: có báo đang bị điều khiển tự động, là trình duyệt headless hay không có ngôn ngữ nào.",
          "Dữ liệu này được gửi cùng câu trả lời, được đánh giá trong bộ nhớ rồi bỏ đi. Chỉ kết luận (human, suspicious, automated hoặc not measured), điểm và mã lý do ngắn được giữ lại: trong dòng của challenge và, cho tới khi được đổi, cùng với token.",
        ],
      },
      {
        title: "Thanh toán",
        paragraphs: [
          "Với mỗi lần mua, chúng tôi lưu gói, kỳ hạn, số tiền, mã thanh toán, trạng thái, mã giao dịch của SePay và thời điểm thanh toán. Bạn thanh toán bằng chuyển khoản trên trang của SePay; chúng tôi không bao giờ thấy thông tin ngân hàng hay thẻ của bạn.",
        ],
      },
      {
        title: "Cookie và bộ nhớ trình duyệt",
        items: [
          "wau_session giữ bạn đăng nhập, trong 24 giờ.",
          "wau_admin_session làm điều tương tự cho quản trị viên, và chỉ được gửi tới /admin.",
          "wau_google_nonce gắn lần đăng nhập Google với trình duyệt của bạn, trong một giờ.",
          "wau_locale ghi nhớ ngôn ngữ bạn chọn, trong một năm.",
          "wau-theme, trong local storage, ghi nhớ giao diện sáng hay tối.",
          "Không có cookie phân tích hay quảng cáo và không có script theo dõi. Script đăng nhập của Google chỉ tải từ accounts.google.com trên các trang đăng nhập, và trên /demo, nơi trình bày nút đó.",
        ],
      },
      {
        title: "Log máy chủ",
        paragraphs: [
          "Các service ghi log vận hành: lỗi, kèm mã challenge, mã khóa API hoặc mã thanh toán, và các thông báo thanh toán bị từ chối kèm địa chỉ gửi tới. Log được giữ trên máy chủ trong [THỜI HẠN LƯU: ví dụ 14 ngày].",
        ],
      },
      {
        title: "Nơi lưu trữ",
        paragraphs: [
          "Mọi thứ được lưu trên Amazon Web Services, vùng ap-southeast-1, Singapore: máy chủ, cơ sở dữ liệu PostgreSQL và Redis.",
        ],
      },
      {
        title: "Thời gian lưu",
        items: [
          "Challenge và token: tối đa 2 phút.",
          "Bộ đếm theo địa chỉ IP: một phút, và một giờ với lịch sử trả lời sai và lượt qua tự động. Bộ đếm theo ngày: 24 giờ.",
          "Các dòng challenge, tức lịch sử sử dụng: hiện chưa có quy tắc xóa. [THỜI HẠN LƯU: ví dụ 12 tháng]",
          "Tài khoản, khóa API và nhật ký hoạt động: chừng nào tài khoản còn tồn tại. Khóa đã xóa vẫn được giữ, có đánh dấu đã xóa, để giữ lịch sử sử dụng. [THỜI HẠN LƯU: ví dụ xóa hẳn 30 ngày sau khi đóng tài khoản]",
          "Thanh toán: [THỜI HẠN LƯU: ví dụ 10 năm, theo quy định kế toán của Việt Nam]",
          "Log máy chủ: [THỜI HẠN LƯU: ví dụ 14 ngày]",
        ],
      },
      {
        title: "Ai được xem",
        paragraphs: [
          "Bạn xem được tài khoản, khóa, lượt dùng và nhật ký hoạt động của chính mình. Quản trị viên của WAU captcha xem được tài khoản, khóa (không kèm secret key), lượt dùng, thanh toán và các yêu cầu xem xét, để vận hành và bảo vệ dịch vụ. Các bên xử lý dưới đây chỉ xử lý dữ liệu để cung cấp phần dịch vụ của họ. Chúng tôi không bán dữ liệu và không chia sẻ dữ liệu cho quảng cáo.",
        ],
      },
      {
        title: "Bên xử lý dữ liệu",
        items: [
          "Amazon Web Services: lưu trữ và vận hành, tại Singapore.",
          "Google: đăng nhập bằng tài khoản Google.",
          "SePay: thanh toán bằng chuyển khoản.",
        ],
      },
      {
        title: "Quyền của bạn",
        paragraphs: [
          "Gửi thư tới wauchaptcha@gmail.com để nhận bản sao dữ liệu, sửa dữ liệu hoặc yêu cầu xóa tài khoản. [THỜI GIAN PHẢN HỒI: ví dụ trong vòng 30 ngày]",
        ],
      },
      {
        title: "Thay đổi",
        paragraphs: ["Các thay đổi của chính sách này được thông báo tại đây và trên trang nhật ký thay đổi."],
      },
    ],
  },
  terms: {
    metaTitle: "Điều khoản dịch vụ",
    metaDescription: "Điều khoản của WAU Captcha: cách dùng được phép, hạn mức và đình chỉ, không có SLA, thanh toán, trách nhiệm và luật áp dụng.",
    title: "Điều khoản dịch vụ",
    description: "Các quy định khi dùng WAU Captcha, API và bảng điều khiển của nó.",
    sections: [
      {
        title: "Dịch vụ",
        paragraphs: [
          "WAU captcha cung cấp WAU Captcha: các challenge trang web của bạn hiển thị cho người truy cập, một API kiểm tra câu trả lời, và bảng điều khiển để quản lý khóa. Tạo tài khoản hoặc dùng một khóa API nghĩa là bạn chấp nhận các điều khoản này.",
        ],
      },
      {
        title: "Tài khoản và khóa của bạn",
        paragraphs: [
          "Hãy giữ secret key trên máy chủ của bạn, không bao giờ đưa vào trình duyệt hay kho mã công khai. Bạn chịu trách nhiệm về những gì được làm bằng khóa của mình. Nếu nghĩ secret key đã lộ, hãy đặt lại nó ở trang của khóa.",
        ],
      },
      {
        title: "Cách dùng được phép",
        items: [
          "Dùng dịch vụ để bảo vệ trang web và API của chính bạn, hoặc của nơi bạn được phép bảo vệ.",
          "Không tấn công, làm quá tải hay dò quét dịch vụ ngoài phạm vi trang bảo mật cho phép.",
          "Bot giải captcha để nghiên cứu, thử nghiệm hay giảng dạy được hoan nghênh khi dùng tài khoản và khóa của chính bạn, trong hạn mức và giới hạn tần suất của gói; không bao giờ nhắm chúng vào website hay khóa của khách hàng khác, và hãy chạy các bài đo lớn trên bộ mẫu đã công bố.",
          "Không lấy challenge hàng loạt mà không trả lời, không bán lại challenge hay đáp án của chúng, và không vận hành dịch vụ giải captcha cho người khác.",
          "Không tìm cách vượt qua giới hạn tần suất, hạn mức, việc đình chỉ hay tên miền đã gắn với khóa.",
          "Không dùng dịch vụ cho việc gì trái pháp luật Việt Nam hoặc nơi bạn hoạt động.",
        ],
      },
      {
        title: "Hạn mức, giới hạn và đình chỉ",
        paragraphs: [
          "Mỗi gói có hạn mức lượt xác minh thành công mỗi ngày, đặt lại lúc 00:00 GMT+7 (17:00 UTC), và mỗi khóa có giới hạn tần suất; tài liệu liệt kê các giới hạn này. Khóa có lưu lượng giống hành vi cào dữ liệu trước tiên bị giảm tốc độ và có thể bị tự động đình chỉ; quản trị viên cũng có thể đình chỉ khóa, hoặc khóa tài khoản, vi phạm các điều khoản này. Bạn có thể yêu cầu xem xét lại ở trang của khóa.",
        ],
      },
      {
        title: "Không có cam kết chất lượng dịch vụ (SLA)",
        paragraphs: [
          "Dịch vụ chạy trên một máy chủ ở một vùng và được cung cấp theo khả năng tốt nhất có thể: không cam kết thời gian hoạt động và không bồi thường khi gián đoạn. Trang trạng thái cho biết dịch vụ có đang chạy hay không.",
        ],
      },
      {
        title: "Thanh toán và hoàn tiền",
        paragraphs: [
          "Các gói trả phí được tính giá bằng đồng Việt Nam, thanh toán đủ và trước bằng chuyển khoản qua SePay, và có hiệu lực trong tháng hoặc năm đã mua. [CHÍNH SÁCH HOÀN TIỀN: ví dụ không hoàn tiền khi gói đã bắt đầu, trừ khi pháp luật yêu cầu]",
        ],
      },
      {
        title: "Không CAPTCHA nào chặn được mọi bot",
        paragraphs: [
          "WAU Captcha khiến việc lạm dụng tự động chậm hơn và tốn kém hơn, và cho máy chủ của bạn biết những gì nó quan sát được. Nó không thể tự mình chặn một kẻ tấn công quyết tâm; xử lý thế nào với một kết luận là quyết định của bạn.",
        ],
      },
      {
        title: "Trách nhiệm",
        paragraphs: [
          "Dịch vụ được cung cấp theo hiện trạng. Trong phạm vi pháp luật cho phép, WAU captcha không chịu trách nhiệm về thiệt hại gián tiếp hay hệ quả, lợi nhuận hoặc dữ liệu bị mất, và tổng trách nhiệm giới hạn ở số tiền bạn đã trả trong [THỜI GIAN TÍNH: ví dụ 3] tháng trước khi khiếu nại.",
        ],
      },
      {
        title: "Thay đổi và chấm dứt",
        paragraphs: [
          "Chúng tôi có thể thay đổi dịch vụ hoặc các điều khoản này; thay đổi được thông báo trên trang nhật ký thay đổi. Bạn có thể ngừng dùng dịch vụ bất cứ lúc nào. Chúng tôi có thể đóng tài khoản vi phạm các điều khoản này.",
        ],
      },
      {
        title: "Luật áp dụng",
        paragraphs: [
          "Các điều khoản này tuân theo pháp luật Việt Nam. Tranh chấp được giải quyết tại tòa án có thẩm quyền của Việt Nam, [NƠI GIẢI QUYẾT: ví dụ Thành phố Hồ Chí Minh].",
        ],
      },
    ],
  },
};

export const legal = { en, vi };

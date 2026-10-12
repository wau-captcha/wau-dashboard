import type { Translation } from "../types";

/** Docs sections about binding keys to websites, what each SDK version sends, what auto_check rests on, and what is not detected. */
const en = {
  siteBinding: {
    title: "Bind a key to your websites",
    body: "Add your domains on the key's page. Challenges are then issued only to pages on those websites, an answer must come from the website that fetched its challenge and name the same site key, and /siteverify returns the website as hostname.",
    compare: "On your server, compare hostname with your own domain and refuse the token when they differ:",
    forgeable:
      "The browser sets Origin, so domain binding stops other websites from using your key in their visitors' browsers. A script outside a browser can send any Origin it likes: bots are caught by the behaviour verdict and the service's own signals, not by the domain list.",
  },
  sdkVersions: {
    title: "What each SDK version sends",
    body: "Every request older SDKs send still works; what changes is how much the service can check.",
    columns: { sdk: "Version", siteKey: "site_key", behavior: "Behaviour data", pow: "Proof of work", hints: "Browser hints", siteverify: "Token to /siteverify" },
    yes: "Yes",
    no: "No",
    jsonBody: "JSON body",
    query: "Query string (deprecated)",
    rows: [
      { sdk: "client 1.3.0+, react 1.2.0+, server 1.3.0+", siteKey: true, behavior: true, pow: true, hints: true, body: true },
      { sdk: "Java 1.0.0+", siteKey: true, behavior: false, pow: true, hints: false, body: true },
      { sdk: "client 1.2.0, server 1.2.0", siteKey: false, behavior: true, pow: false, hints: false, body: false },
      { sdk: "client and server 1.1.x", siteKey: false, behavior: false, pow: false, hints: false, body: false },
    ],
    oldClients:
      "An older client keeps working: without a proof of work its verdict is at most suspicious, and one that sends no behaviour data gets not_measured. It is refused only by a key that requires behaviour data, as new keys do: update to 1.3.0, or turn that switch off on the key's page while you do. The Java SDK records no behaviour itself: it sends a Behavior only when you pass one, so its challenge calls suit tests and desktop apps.",
  },
  autoCheck: {
    title: "Auto check",
    body: "auto_check lets most visitors through without a puzzle, so be clear about what that rests on.",
    stopsTitle: "What it stops",
    stops: [
      "Plain HTTP scripts, headless browsers that do not hide themselves (navigator.webdriver, a HeadlessChrome User-Agent, no outer window size, WebGL drawn in software, notifications denied while the browser says it would ask) and stealth plugins that patch browser functions or rewrite the User-Agent or the language.",
      "Every pass costs the client a proof of work of 18 bits, about 8 times that of the other types, and one address gets at most 30 automatic passes an hour before it sees the fallback. The same browser asking again gets the same result.",
    ],
    limitsTitle: "What it does not stop",
    limits: [
      "A determined attacker who drives a real browser, with human-like mouse moves and many addresses, can pass the automatic part: every signal a browser gives can be faked. Cloudflare and Google have far more data to judge with.",
      "For sign-ups, logins and payments, check behavior.score on your backend against a threshold of your own, or use an interactive type for those forms.",
    ],
    sends:
      "The SDK sends the names of the checks that tripped (patched_natives, outer_zero, software_gl, notification_mismatch, touch_mismatch, no_hardware and no_plugins), navigator.userAgent and navigator.language, which every request carries in its headers already, and the behaviour it records for every type, here on the whole page. No fingerprint, canvas or WebGL output, fonts or plugins. Nothing is stored beyond what the other types store; Redis counts the automatic passes of each address for an hour.",
    fallback:
      "A visitor it is unsure of gets a challenge of the fallback type instead, slide_puzzle unless you name another, and is never told why. auto_check is as accessible as that fallback: choose image_distort where people use a keyboard alone.",
    integration:
      "Set data-challenge-type=\"auto_check\" with data-fallback-type and data-appearance (always, or interaction-only to show the captcha only for the fallback or an error), or the props challengeType, fallbackChallengeType and appearance of <WauCaptcha />. /siteverify reports challenge_type auto_check for an automatic pass, and the fallback's type for a visitor who solved the fallback:",
    usage: "In the usage charts, the success rate of auto_check is the share of visitors who passed without a puzzle.",
    more: "Read the auto_check guide",
  },
  limitations: {
    title: "Limitations",
    body: "What the service does not catch, so you can weigh it against your risk:",
    items: [
      "TLS (JA3, JA4) and HTTP/2 fingerprints: Traefik ends TLS in front of the services and does not pass them on.",
      "auto_check: a real browser driven with human-like input, from many addresses, passes the automatic check; for sign-ups, logins and payments, check behavior.score too or ask for an interactive type.",
      "Paid IP reputation feeds: the service only keeps its own short history of each address.",
      "slide_puzzle: image matching finds where the hole is; its value is in the drag, which must move like a hand.",
      "animal_jump: a script that analyses the frames can find the highest jump; a random click passes 1 time in 25, but most of its value lies in the behaviour and timing checks.",
      "object_rotate: a script trained on the 28 objects could learn which way each one faces; random presses pass about 1 time in 64, but most of its value lies in the behaviour and timing checks.",
      "motion_noise: a script that compares the frames can bring the characters out; it stops tools that read a single picture.",
      "Text challenges: a model trained on these images can read many of them. Each challenge can be answered once, so a code cannot be brute-forced, and the per-address limits slow down guessing across challenges.",
      "Origin and the browser hints can be forged by a script outside a browser.",
      "No CAPTCHA stops a determined attacker on its own: use it together with rate limits and checks of your own on the actions that matter.",
    ],
  },
};

const vi: Translation<typeof en> = {
  siteBinding: {
    title: "Gắn khóa với website của bạn",
    body: "Thêm tên miền ở trang của khóa. Khi đó challenge chỉ được cấp cho các trang thuộc những website đó, câu trả lời phải đến từ chính website đã lấy challenge và ghi đúng site key, và /siteverify trả về website đó trong hostname.",
    compare: "Ở máy chủ, so hostname với tên miền của bạn và từ chối token khi chúng khác nhau:",
    forgeable:
      "Origin do trình duyệt đặt, nên gắn tên miền ngăn website khác dùng khóa của bạn trong trình duyệt của khách truy cập. Script chạy ngoài trình duyệt gửi Origin nào cũng được: bot bị bắt nhờ kết luận hành vi và các tín hiệu do service tự thu thập, không phải nhờ danh sách tên miền.",
  },
  sdkVersions: {
    title: "Mỗi phiên bản SDK gửi gì",
    body: "Mọi yêu cầu do SDK cũ gửi vẫn dùng được; điều thay đổi là service kiểm tra được bao nhiêu.",
    columns: { sdk: "Phiên bản", siteKey: "site_key", behavior: "Dữ liệu hành vi", pow: "Proof of work", hints: "Gợi ý trình duyệt", siteverify: "Token gửi /siteverify" },
    yes: "Có",
    no: "Không",
    jsonBody: "Body JSON",
    query: "Query string (lỗi thời)",
    rows: [
      { sdk: "client 1.3.0+, react 1.2.0+, server 1.3.0+", siteKey: true, behavior: true, pow: true, hints: true, body: true },
      { sdk: "Java 1.0.0+", siteKey: true, behavior: false, pow: true, hints: false, body: true },
      { sdk: "client 1.2.0, server 1.2.0", siteKey: false, behavior: true, pow: false, hints: false, body: false },
      { sdk: "client và server 1.1.x", siteKey: false, behavior: false, pow: false, hints: false, body: false },
    ],
    oldClients:
      "Client cũ vẫn hoạt động: không có proof of work thì kết luận cao nhất là suspicious, còn client không gửi dữ liệu hành vi nhận not_measured. Nó chỉ bị từ chối bởi khóa bắt buộc dữ liệu hành vi, như các khóa mới: hãy cập nhật lên 1.3.0, hoặc tạm tắt công tắc đó ở trang của khóa trong lúc cập nhật. SDK Java không tự ghi dữ liệu hành vi: nó chỉ gửi Behavior khi bạn truyền vào, nên các lời gọi challenge của nó hợp với kiểm thử và ứng dụng desktop.",
  },
  autoCheck: {
    title: "Xác minh tự động",
    body: "auto_check cho phần lớn khách truy cập qua mà không phải giải câu đố nào, nên hãy hiểu rõ điều đó dựa trên những gì.",
    stopsTitle: "Những gì nó chặn được",
    stops: [
      "Script HTTP thuần, trình duyệt headless không che giấu bản thân (navigator.webdriver, User-Agent ghi HeadlessChrome, cửa sổ không có kích thước ngoài, WebGL vẽ bằng phần mềm, thông báo bị chặn trong khi trình duyệt nói nó sẽ hỏi) và plugin stealth vá các hàm của trình duyệt hay sửa User-Agent hoặc ngôn ngữ.",
      "Mỗi lượt qua tốn cho client một proof of work 18 bit, khoảng gấp 8 lần các loại khác, và một địa chỉ chỉ được tối đa 30 lượt qua tự động mỗi giờ trước khi nhận phần dự phòng. Cùng một trình duyệt hỏi lại sẽ nhận cùng kết quả.",
    ],
    limitsTitle: "Những gì nó không chặn được",
    limits: [
      "Kẻ tấn công quyết tâm điều khiển một trình duyệt thật, di chuột giống người và có nhiều địa chỉ thì có thể vượt qua phần tự động: mọi tín hiệu trình duyệt đưa ra đều giả được. Cloudflare và Google có nhiều dữ liệu để đánh giá hơn hẳn.",
      "Với đăng ký tài khoản, đăng nhập và thanh toán, hãy kiểm tra behavior.score ở backend theo một ngưỡng do bạn chọn, hoặc dùng một loại cần tương tác cho những form đó.",
    ],
    sends:
      "SDK gửi tên của các phép kiểm tra bị kích hoạt (patched_natives, outer_zero, software_gl, notification_mismatch, touch_mismatch, no_hardware và no_plugins), navigator.userAgent và navigator.language, vốn đã có trong header của mọi yêu cầu, cùng dữ liệu hành vi SDK ghi cho mọi loại, ở đây là trên toàn trang. Không có dấu vân tay, kết quả vẽ canvas hay WebGL, font hay plugin. Không lưu gì nhiều hơn các loại khác; Redis đếm số lượt qua tự động của từng địa chỉ trong một giờ.",
    fallback:
      "Khách truy cập mà nó chưa chắc chắn sẽ nhận một challenge thuộc loại dự phòng thay vào đó, là slide_puzzle trừ khi bạn chọn loại khác, và không bao giờ được cho biết lý do. auto_check dễ tiếp cận đúng bằng loại dự phòng đó: chọn image_distort ở nơi có người chỉ dùng bàn phím.",
    integration:
      "Đặt data-challenge-type=\"auto_check\" cùng data-fallback-type và data-appearance (always, hoặc interaction-only để chỉ hiện captcha khi có phần dự phòng hay lỗi), hoặc dùng các prop challengeType, fallbackChallengeType và appearance của <WauCaptcha />. /siteverify báo challenge_type là auto_check với lượt qua tự động, và là loại dự phòng với khách đã giải phần dự phòng:",
    usage: "Trong biểu đồ sử dụng, tỷ lệ thành công của auto_check là tỷ lệ khách truy cập qua được mà không phải giải câu đố nào.",
    more: "Đọc hướng dẫn về auto_check",
  },
  limitations: {
    title: "Hạn chế",
    body: "Những gì service không phát hiện được, để bạn cân nhắc với rủi ro của mình:",
    items: [
      "Dấu vân tay TLS (JA3, JA4) và HTTP/2: Traefik kết thúc TLS phía trước các service và không chuyển tiếp chúng.",
      "auto_check: một trình duyệt thật được điều khiển với thao tác giống người, từ nhiều địa chỉ, vượt qua được phần kiểm tra tự động; với đăng ký tài khoản, đăng nhập và thanh toán, hãy kiểm tra cả behavior.score hoặc dùng một loại cần tương tác.",
      "Nguồn dữ liệu uy tín IP trả phí: service chỉ giữ lịch sử ngắn của riêng mình cho từng địa chỉ.",
      "slide_puzzle: so khớp ảnh tìm được vị trí chỗ trống; giá trị của nó nằm ở cú kéo, vốn phải giống tay người.",
      "animal_jump: script phân tích các khung hình tìm được cú nhảy cao nhất; bấm ngẫu nhiên chỉ qua được 1 lần trong 25, nhưng phần lớn giá trị của loại này nằm ở phần kiểm tra hành vi và thời gian.",
      "object_rotate: script được huấn luyện trên 28 vật thể có thể học được mỗi vật hướng về đâu; bấm ngẫu nhiên chỉ qua được khoảng 1 lần trong 64, nhưng phần lớn giá trị của loại này nằm ở phần kiểm tra hành vi và thời gian.",
      "motion_noise: script so sánh các khung hình có thể làm lộ ký tự; loại này chặn được công cụ chỉ đọc một bức ảnh.",
      "Challenge dạng chữ: mô hình được huấn luyện trên chính các ảnh này đọc được nhiều ảnh. Mỗi challenge chỉ trả lời được một lần nên không thể dò mã, và giới hạn theo địa chỉ làm chậm việc đoán qua nhiều challenge.",
      "Origin và các gợi ý trình duyệt có thể bị script chạy ngoài trình duyệt giả mạo.",
      "Không CAPTCHA nào tự mình chặn được kẻ tấn công quyết tâm: hãy dùng kèm giới hạn tốc độ và các kiểm tra riêng của bạn ở những thao tác quan trọng.",
    ],
  },
};

export const docsProtection = { en, vi };

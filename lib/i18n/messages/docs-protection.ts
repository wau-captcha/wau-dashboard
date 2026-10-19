import type { Translation } from "../types";

/** Docs sections about binding keys to websites, what each SDK version sends, what auto_check rests on, and what is not detected. */
const en = {
  siteBinding: {
    title: "Bind a key to your websites",
    body: "Add your domains on the key's page. Challenges are then issued only to pages on those websites, an answer must come from the website that fetched its challenge and name the same site key, and /siteverify returns the website as hostname.",
    compare: "On your server, check hostname against your own domains and refuse the token when it is none of them. hostnameMatches (@waucaptcha-sdk/server 1.7.0 or later) and result.hostnameMatches (Java) do it: they take the domains as a list or as one string with commas between them, such as an environment variable, and read https://Shop.example.com/, shop.example.com:443 and shop.example.com as the same; *.example.com stands for the subdomains of example.com:",
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
    restsTitle: "What a pass rests on",
    restsBody:
      "Every signal inside the browser, from the probes to the behaviour and the proof of work, can be faked by a determined bot that drives a real browser. So an automatic pass leans on three things such a bot cannot fake from inside the browser:",
    rests: [
      "A puzzle this browser solved on your site before: the clearance, kept up to 7 days and good for at most 6 automatic passes an hour and 24 a day.",
      "An address that does not belong to a cloud or hosting provider: an answer from one never passes automatically, whatever its clearance and score, and gets the fallback.",
      "Caps per address: 30 automatic passes an hour, at most 5 of them without a clearance.",
    ],
    modesTitle: "Strict or balanced",
    modes: [
      "Strict: a visitor passes automatically only after solving one puzzle on your site in this browser. The strongest: the first visit always shows a puzzle.",
      "Balanced: a first visit from a home or mobile address may also pass on its signals alone, up to 5 an hour per address, with the reason first_visit.",
      "WAU Captcha runs in balanced mode.",
    ],
    stopsTitle: "What it stops",
    stops: [
      "Plain HTTP scripts, headless browsers that do not hide themselves (navigator.webdriver, a HeadlessChrome User-Agent, no outer window size, WebGL drawn in software, notifications denied while the browser says it would ask) and stealth plugins that patch browser functions or rewrite the User-Agent or the language.",
      "Bots in data centres, whatever they fake: they never pass automatically. Every pass also costs the client a proof of work of 18 bits, about 8 times that of the other types, and the same browser asking again is judged the same way.",
    ],
    limitsTitle: "What it does not stop",
    limits: [
      "A determined attacker who solves puzzles, or pays people to, earns clearances: each buys at most 6 automatic passes an hour and 24 a day, in the browser that solved it. In balanced mode, one behind home or mobile addresses also gets up to 5 first visits an hour per address. Cloudflare and Google have far more data to judge with.",
      "For sign-ups, logins and payments, refuse the reason first_visit on your backend, or use an interactive type for those forms.",
    ],
    costTitle: "What it costs real people",
    cost: [
      "People on a VPN or a cloud desktop always see a puzzle: their addresses belong to cloud and hosting providers.",
      "Clearing the site's data or a private window means one more puzzle, and so does a browser update: the clearance goes with the site's data and is tied to the browser's User-Agent.",
    ],
    sends:
      "The SDK sends the names of the checks that tripped (patched_natives, outer_zero, software_gl, notification_mismatch, touch_mismatch, no_hardware and no_plugins), navigator.userAgent and navigator.language, which every request carries in its headers already, the behaviour it records for every type, here on the whole page, and counts of how the mouse moves were made, never positions beyond what the behaviour check already sends. It stores one thing in the browser: the clearance, in localStorage under your site's origin, which goes back to WAU Captcha with auto_check answers and nowhere else. No fingerprint, canvas or WebGL output, fonts or plugins. On the service, Redis counts the automatic passes of each address for an hour, those without a clearance too, and the passes of each clearance for an hour and a day; the clearance itself is signed, not stored.",
    fallback:
      "A visitor it is unsure of gets a challenge of the fallback type instead, slide_puzzle unless you name another, and is never told why. auto_check is as accessible as that fallback: choose image_distort where people use a keyboard alone.",
    integration:
      "Set data-challenge-type=\"auto_check\" with data-fallback-type and data-appearance (always, or interaction-only to show the captcha only for the fallback or an error), or the props challengeType, fallbackChallengeType and appearance of <WauCaptcha />:",
    backendTitle: "What your backend can check",
    backend:
      "/siteverify reports challenge_type auto_check for an automatic pass, and the fallback's type for a visitor who solved the fallback. behavior.reasons says how an automatic pass was earned: cleared, by a browser that solved a puzzle on your site before, or first_visit, on its signals alone. Refusing first_visit for sign-ups, logins and payments makes balanced mode as strong as strict where it matters:",
    usage: "In the usage charts, the success rate of auto_check is the share of visitors who passed without a puzzle.",
    more: "Read the auto_check guide",
  },
  limitations: {
    title: "Limitations",
    body: "What the service does not catch, so you can weigh it against your risk:",
    items: [
      "TLS (JA3, JA4) and HTTP/2 fingerprints: Traefik ends TLS in front of the services and does not pass them on.",
      "auto_check: a real browser driven with human-like input passes the automatic check with a clearance earned by solving a puzzle, or in balanced mode as a first visit from a home or mobile address; for sign-ups, logins and payments, refuse first_visit or ask for an interactive type.",
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
    compare: "Ở máy chủ, đối chiếu hostname với các tên miền của bạn và từ chối token khi nó không thuộc tên miền nào. hostnameMatches (@waucaptcha-sdk/server 1.7.0 trở lên) và result.hostnameMatches (Java) làm việc này: chúng nhận các tên miền dạng danh sách hoặc một chuỗi cách nhau bằng dấu phẩy, như một biến môi trường, và coi https://Shop.example.com/, shop.example.com:443 và shop.example.com là một; *.example.com là mọi tên miền con của example.com:",
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
    restsTitle: "Lượt qua dựa vào đâu",
    restsBody:
      "Mọi tín hiệu bên trong trình duyệt, từ các phép kiểm tra tới dữ liệu hành vi và proof of work, đều có thể bị một bot quyết tâm điều khiển trình duyệt thật làm giả. Vì vậy lượt qua tự động dựa vào ba thứ mà bot đó không giả được từ bên trong trình duyệt:",
    rests: [
      "Một câu đố chính trình duyệt này đã giải trên trang của bạn trước đó: clearance, được giữ tối đa 7 ngày và cho tối đa 6 lượt qua tự động mỗi giờ, 24 lượt mỗi ngày.",
      "Một địa chỉ không thuộc nhà cung cấp cloud hay hosting: câu trả lời từ những địa chỉ đó không bao giờ qua tự động, bất kể clearance và điểm, mà nhận phần dự phòng.",
      "Giới hạn theo từng địa chỉ: 30 lượt qua tự động mỗi giờ, trong đó tối đa 5 lượt không có clearance.",
    ],
    modesTitle: "Strict hay balanced",
    modes: [
      "Strict (nghiêm ngặt): khách truy cập chỉ qua tự động sau khi đã giải một câu đố trên trang của bạn bằng chính trình duyệt này. Mạnh nhất: lần ghé thăm đầu tiên luôn hiện câu đố.",
      "Balanced (cân bằng): lần ghé thăm đầu tiên từ địa chỉ nhà riêng hay di động cũng có thể qua chỉ nhờ tín hiệu, tối đa 5 lượt mỗi giờ cho mỗi địa chỉ, kèm lý do first_visit.",
      "WAU Captcha chạy ở chế độ balanced.",
    ],
    stopsTitle: "Những gì nó chặn được",
    stops: [
      "Script HTTP thuần, trình duyệt headless không che giấu bản thân (navigator.webdriver, User-Agent ghi HeadlessChrome, cửa sổ không có kích thước ngoài, WebGL vẽ bằng phần mềm, thông báo bị chặn trong khi trình duyệt nói nó sẽ hỏi) và plugin stealth vá các hàm của trình duyệt hay sửa User-Agent hoặc ngôn ngữ.",
      "Bot chạy trong trung tâm dữ liệu, dù chúng giả mạo gì: chúng không bao giờ qua tự động. Mỗi lượt qua còn tốn cho client một proof of work 18 bit, khoảng gấp 8 lần các loại khác, và cùng một trình duyệt hỏi lại sẽ được đánh giá y như cũ.",
    ],
    limitsTitle: "Những gì nó không chặn được",
    limits: [
      "Kẻ tấn công quyết tâm tự giải câu đố, hoặc thuê người giải, sẽ có clearance: mỗi clearance chỉ đổi được tối đa 6 lượt qua tự động mỗi giờ và 24 lượt mỗi ngày, trong chính trình duyệt đã giải. Ở chế độ balanced, kẻ đứng sau địa chỉ nhà riêng hay di động còn có tối đa 5 lượt đầu mỗi giờ cho mỗi địa chỉ. Cloudflare và Google có nhiều dữ liệu để đánh giá hơn hẳn.",
      "Với đăng ký tài khoản, đăng nhập và thanh toán, hãy từ chối lý do first_visit ở backend, hoặc dùng một loại cần tương tác cho những form đó.",
    ],
    costTitle: "Người dùng thật chịu thiệt gì",
    cost: [
      "Người dùng VPN hay máy tính đám mây (cloud desktop) luôn thấy câu đố: địa chỉ của họ thuộc nhà cung cấp cloud và hosting.",
      "Xóa dữ liệu trang web hay dùng cửa sổ ẩn danh nghĩa là thêm một câu đố, cập nhật trình duyệt cũng vậy: clearance mất cùng dữ liệu của trang và gắn với User-Agent của trình duyệt.",
    ],
    sends:
      "SDK gửi tên của các phép kiểm tra bị kích hoạt (patched_natives, outer_zero, software_gl, notification_mismatch, touch_mismatch, no_hardware và no_plugins), navigator.userAgent và navigator.language, vốn đã có trong header của mọi yêu cầu, dữ liệu hành vi SDK ghi cho mọi loại, ở đây là trên toàn trang, cùng số đếm về cách chuột di chuyển, không bao giờ là vị trí nào ngoài những gì phần kiểm tra hành vi vốn đã gửi. Nó lưu đúng một thứ trong trình duyệt: clearance, trong localStorage dưới origin của trang bạn, chỉ được gửi lại cho WAU Captcha cùng câu trả lời auto_check và không đi đâu khác. Không có dấu vân tay, kết quả vẽ canvas hay WebGL, font hay plugin. Ở phía service, Redis đếm số lượt qua tự động của từng địa chỉ trong một giờ, kể cả số lượt không có clearance, cùng số lượt qua của từng clearance trong một giờ và một ngày; bản thân clearance được ký, không được lưu.",
    fallback:
      "Khách truy cập mà nó chưa chắc chắn sẽ nhận một challenge thuộc loại dự phòng thay vào đó, là slide_puzzle trừ khi bạn chọn loại khác, và không bao giờ được cho biết lý do. auto_check dễ tiếp cận đúng bằng loại dự phòng đó: chọn image_distort ở nơi có người chỉ dùng bàn phím.",
    integration:
      "Đặt data-challenge-type=\"auto_check\" cùng data-fallback-type và data-appearance (always, hoặc interaction-only để chỉ hiện captcha khi có phần dự phòng hay lỗi), hoặc dùng các prop challengeType, fallbackChallengeType và appearance của <WauCaptcha />:",
    backendTitle: "Backend của bạn kiểm tra được gì",
    backend:
      "/siteverify báo challenge_type là auto_check với lượt qua tự động, và là loại dự phòng với khách đã giải phần dự phòng. behavior.reasons cho biết lượt qua tự động có được nhờ đâu: cleared, với trình duyệt đã giải một câu đố trên trang của bạn trước đó, hoặc first_visit, chỉ nhờ tín hiệu. Từ chối first_visit ở đăng ký tài khoản, đăng nhập và thanh toán làm chế độ balanced mạnh ngang strict ở những chỗ quan trọng:",
    usage: "Trong biểu đồ sử dụng, tỷ lệ thành công của auto_check là tỷ lệ khách truy cập qua được mà không phải giải câu đố nào.",
    more: "Đọc hướng dẫn về auto_check",
  },
  limitations: {
    title: "Hạn chế",
    body: "Những gì service không phát hiện được, để bạn cân nhắc với rủi ro của mình:",
    items: [
      "Dấu vân tay TLS (JA3, JA4) và HTTP/2: Traefik kết thúc TLS phía trước các service và không chuyển tiếp chúng.",
      "auto_check: một trình duyệt thật được điều khiển với thao tác giống người vượt qua được phần kiểm tra tự động nhờ clearance có được khi giải một câu đố, hoặc ở chế độ balanced như một lượt đầu từ địa chỉ nhà riêng hay di động; với đăng ký tài khoản, đăng nhập và thanh toán, hãy từ chối first_visit hoặc dùng một loại cần tương tác.",
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

import type { Translation } from "../types";

/** Docs sections about binding keys to websites, what each SDK version sends, and what is not detected. */
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
      { sdk: "Java 1.0.0", siteKey: true, behavior: false, pow: true, hints: false, body: true },
      { sdk: "client 1.2.0, server 1.2.0", siteKey: false, behavior: true, pow: false, hints: false, body: false },
      { sdk: "client and server 1.1.x", siteKey: false, behavior: false, pow: false, hints: false, body: false },
    ],
    oldClients:
      "An older client keeps working: without a proof of work its verdict is at most suspicious, and one that sends no behaviour data gets not_measured. It is refused only by a key that requires behaviour data, as new keys do: update to 1.3.0, or turn that switch off on the key's page while you do. The Java SDK records no behaviour itself: it sends a Behavior only when you pass one, so its challenge calls suit tests and desktop apps.",
  },
  limitations: {
    title: "Limitations",
    body: "What the service does not catch, so you can weigh it against your risk:",
    items: [
      "TLS (JA3, JA4) and HTTP/2 fingerprints: Traefik ends TLS in front of the services and does not pass them on.",
      "Paid IP reputation feeds: the service only keeps its own short history of each address.",
      "slide_puzzle: image matching finds where the hole is; its value is in the drag, which must move like a hand.",
      "animal_jump: a script that analyses the frames can find the highest jump; a random click passes 1 time in 25, but most of its value lies in the behaviour and timing checks.",
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
      { sdk: "Java 1.0.0", siteKey: true, behavior: false, pow: true, hints: false, body: true },
      { sdk: "client 1.2.0, server 1.2.0", siteKey: false, behavior: true, pow: false, hints: false, body: false },
      { sdk: "client và server 1.1.x", siteKey: false, behavior: false, pow: false, hints: false, body: false },
    ],
    oldClients:
      "Client cũ vẫn hoạt động: không có proof of work thì kết luận cao nhất là suspicious, còn client không gửi dữ liệu hành vi nhận not_measured. Nó chỉ bị từ chối bởi khóa bắt buộc dữ liệu hành vi, như các khóa mới: hãy cập nhật lên 1.3.0, hoặc tạm tắt công tắc đó ở trang của khóa trong lúc cập nhật. SDK Java không tự ghi dữ liệu hành vi: nó chỉ gửi Behavior khi bạn truyền vào, nên các lời gọi challenge của nó hợp với kiểm thử và ứng dụng desktop.",
  },
  limitations: {
    title: "Hạn chế",
    body: "Những gì service không phát hiện được, để bạn cân nhắc với rủi ro của mình:",
    items: [
      "Dấu vân tay TLS (JA3, JA4) và HTTP/2: Traefik kết thúc TLS phía trước các service và không chuyển tiếp chúng.",
      "Nguồn dữ liệu uy tín IP trả phí: service chỉ giữ lịch sử ngắn của riêng mình cho từng địa chỉ.",
      "slide_puzzle: so khớp ảnh tìm được vị trí chỗ trống; giá trị của nó nằm ở cú kéo, vốn phải giống tay người.",
      "animal_jump: script phân tích các khung hình tìm được cú nhảy cao nhất; bấm ngẫu nhiên chỉ qua được 1 lần trong 25, nhưng phần lớn giá trị của loại này nằm ở phần kiểm tra hành vi và thời gian.",
      "motion_noise: script so sánh các khung hình có thể làm lộ ký tự; loại này chặn được công cụ chỉ đọc một bức ảnh.",
      "Challenge dạng chữ: mô hình được huấn luyện trên chính các ảnh này đọc được nhiều ảnh. Mỗi challenge chỉ trả lời được một lần nên không thể dò mã, và giới hạn theo địa chỉ làm chậm việc đoán qua nhiều challenge.",
      "Origin và các gợi ý trình duyệt có thể bị script chạy ngoài trình duyệt giả mạo.",
      "Không CAPTCHA nào tự mình chặn được kẻ tấn công quyết tâm: hãy dùng kèm giới hạn tốc độ và các kiểm tra riêng của bạn ở những thao tác quan trọng.",
    ],
  },
};

export const docsProtection = { en, vi };

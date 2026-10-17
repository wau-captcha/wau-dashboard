import type { Translation } from "../types";
import { docsProtection } from "./docs-protection";
import { docsReference } from "./docs-reference";

const en = {
  metaTitle: "Documentation",
  metaDescription: "Integrate WAU Captcha: the widget, the React component, the browser client, server verification in Node.js, Java or any language, and the REST API.",
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
      step2: "Add the widget, or <WauCaptcha /> in React, to your form. Once solved, the form sends a hidden field named wau-captcha-token.",
      step3: "On your server, redeem that token with the secret key and reject the request when it fails.",
    },
    widget: {
      title: "Browser widget",
      body: "The widget shows the challenge, a text box and two buttons (for slide_puzzle, a slider instead of the text box and Verify; for animal_jump, the two rounds and a Replay button; for object_rotate, the two rounds with Rotate left, Rotate right and Done, which the arrow keys and Enter work too; for auto_check, a compact box that checks the visitor in the background, with a challenge of its fallback type in its place only when the check is unsure), and loads a new challenge after a wrong answer. With the script build, any element with data-wau-captcha renders by itself.",
      bundler: "With a bundler, render it yourself to get callbacks and your own labels:",
      pinned: (version: string) =>
        `The snippet loads an exact release, ${version}, with its integrity hash: the browser refuses the file if it differs by a byte from the one published, so neither the CDN nor a later release can change what runs on your page. To move to another release, change the version in the URL and compute its hash:`,
      attributes: "Attributes: data-site-key and data-base-url (required), data-challenge-type (image_distort, motion_noise, slide_puzzle, animal_jump, object_rotate or auto_check), for auto_check data-fallback-type (slide_puzzle by default) and data-appearance (always or interaction-only), data-input-name (default wau-captcha-token) and data-lang (vi for Vietnamese texts).",
    },
    react: {
      title: "React component",
      body: "@waucaptcha-sdk/react gives you one component, <WauCaptcha />, for React 18 or later. Put it inside a form: once solved, the form sends the token in the hidden field wau-captcha-token.",
      nextTitle: "Next.js App Router",
      next: "It works straight from a Server Component page; the server action of the form redeems the token with @waucaptcha-sdk/server.",
      modalTitle: "Modal mode",
      modal: "WauCaptchaMode.MODAL shows a button that opens the challenge in a dialog, which closes by itself once the answer is right. The challenge only loads when the dialog opens. Callbacks such as onSuccess need a Client Component.",
      propsTitle: "Props",
      prop: "Prop",
      meaning: "Description",
      props: [
        { name: "siteKey, baseUrl", meaning: "Required: the site key of your API key and the address of the WAU Captcha API." },
        { name: "mode", meaning: "WauCaptchaMode.INLINE (default) shows the challenge in place; WauCaptchaMode.MODAL opens it from a button. ChallengeType.AUTO_CHECK always runs in place." },
        { name: "challengeType", meaning: "ChallengeType.IMAGE_DISTORT (default), ChallengeType.MOTION_NOISE, ChallengeType.SLIDE_PUZZLE, ChallengeType.ANIMAL_JUMP, ChallengeType.OBJECT_ROTATE or ChallengeType.AUTO_CHECK." },
        { name: "fallbackChallengeType", meaning: "AUTO_CHECK only: the type shown to a visitor the check is unsure of. ChallengeType.SLIDE_PUZZLE by default; IMAGE_DISTORT where people use a keyboard alone." },
        { name: "appearance", meaning: "AUTO_CHECK only: Appearance.ALWAYS (default) shows the box from the start; Appearance.INTERACTION_ONLY keeps the captcha hidden unless the fallback or an error must be shown." },
        { name: "theme", meaning: "WauCaptchaTheme.AUTO (default) follows the color-scheme of the page; LIGHT and DARK force one." },
        { name: "inputName", meaning: "Name of the hidden field that carries the token. Default wau-captcha-token." },
        { name: "labels", meaning: 'Texts to replace in your language, e.g. { open: "Verify you are human", verify: "Verify" }.' },
        { name: "onSuccess, onExpire, onError", meaning: "Called with the token of a right answer, when the token expires unused, and with a WauCaptchaError." },
      ],
      reset: "To start over, e.g. after the backend has redeemed the token, change the component's key. To match your brand, set --wau-captcha-primary, --wau-captcha-background or --wau-captcha-border on it or on an ancestor.",
    },
    client: {
      title: "Custom UI in the browser",
      body: "Use WauCaptchaClient to build your own interface. Fetch a challenge when it is shown, not ahead of time: from 1.3.0 the client solves its proof of work in the background meanwhile, and sends it and the site key with the answer. Pass what recordBehavior recorded as behavior, or keys that require behaviour data refuse the answer. For slide_puzzle, animal_jump and object_rotate, trackSlide, trackJump and trackRotate record the drag, the clicks and the presses the way the service checks them, and verifySlide, verifyJump and verifyRotate send them. For auto_check, fetch with newChallenge({ challengeType: ChallengeType.AUTO_CHECK, fallbackType }), record with recordBehavior({ root, page: true }), run probeBrowser(), and once workDone(challenge.id) has resolved and at least 1.5 s have passed since the challenge arrived, send the probe with verifyAuto; success false means a challenge of challenge.fallbackType must be solved instead. A challenge can be answered once: after a wrong answer, fetch a new one.",
    },
    node: {
      title: "Verify on a Node.js server",
      body: "Redeem the token with @waucaptcha-sdk/server (Node.js 18 or later), and check result.hostname, the website the challenge was solved on, against your own domain. A thrown WauCaptchaError means the token could not be checked; treat it as a failure.",
    },
    java: {
      title: "Verify on a Java server",
      body: "Redeem the token with com.waucaptcha:waucaptcha-sdk (Java 17 or later, no dependencies), and check result.hostname(), the website the challenge was solved on, against your own domain. result.challengeType() is auto_check for a visitor who passed without a puzzle. The client is immutable and safe to share between threads; a WauCaptchaException means the token could not be checked, so treat it as a failure.",
      challenges: "The same client fetches and answers challenges of every type but auto_check, whose answer only the browser SDK can give, with the site key, and sends the site key and the proof of work as the browser SDK does. Keys that require behaviour data, the default for new keys, refuse answers sent without a Behavior, so these calls suit tests and desktop apps; on a website, use the JavaScript widget and verify its token in Java.",
    },
    verifyPackage: {
      title: "Verify the package",
      body: "From 1.3.0 on, every release of the three packages is built and published by GitHub Actions with npm provenance: the package page on npmjs.com shows the commit and the workflow it came from. npm audit signatures checks the registry signatures and provenance attestations of what you installed. Releases before 1.3.0 were published by hand and carry no provenance.",
    },
    otherLanguages: {
      title: "Other languages",
      body: "There is no SDK for other languages yet, and none is needed: any backend redeems a token with one HTTPS call to /siteverify, the secret key as a bearer token and the token in a JSON body. Treat anything but a 200 reply with success true as a failed check.",
    },
    ...docsReference.en,
    ...docsProtection.en,
  },
};

const vi: Translation<typeof en> = {
  metaTitle: "Tài liệu",
  metaDescription: "Tích hợp WAU Captcha: widget, component React, client trên trình duyệt, xác minh phía máy chủ bằng Node.js, Java hoặc bất kỳ ngôn ngữ nào, và REST API.",
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
      step2: "Thêm widget, hoặc <WauCaptcha /> nếu dùng React, vào form. Sau khi giải xong, form gửi kèm trường ẩn tên wau-captcha-token.",
      step3: "Ở máy chủ, đổi token đó bằng secret key và từ chối yêu cầu nếu không thành công.",
    },
    widget: {
      title: "Widget trên trình duyệt",
      body: "Widget hiển thị challenge, ô nhập và hai nút (với slide_puzzle là thanh trượt thay cho ô nhập và nút Verify; với animal_jump là hai lượt kèm nút Xem lại; với object_rotate là hai lượt với các nút Xoay trái, Xoay phải và Xong, dùng được cả phím mũi tên và Enter; với auto_check là một ô gọn kiểm tra khách truy cập ở chế độ ngầm, và chỉ khi phép kiểm tra chưa chắc chắn mới có một challenge thuộc loại dự phòng thế chỗ), tự lấy challenge mới sau khi trả lời sai. Với bản script, phần tử nào có data-wau-captcha sẽ tự hiển thị.",
      bundler: "Nếu dùng bundler, hãy tự render để có callback và nhãn riêng:",
      pinned: (version) =>
        `Đoạn mã tải đúng một bản phát hành, ${version}, kèm mã integrity: trình duyệt từ chối tệp nếu nó khác dù chỉ một byte so với bản đã công bố, nên cả CDN lẫn bản phát hành sau đều không thể thay đổi thứ chạy trên trang của bạn. Muốn chuyển sang bản khác, hãy đổi phiên bản trong URL và tính lại mã:`,
      attributes: "Thuộc tính: data-site-key và data-base-url (bắt buộc), data-challenge-type (image_distort, motion_noise, slide_puzzle, animal_jump, object_rotate hoặc auto_check), với auto_check có thêm data-fallback-type (mặc định slide_puzzle) và data-appearance (always hoặc interaction-only), data-input-name (mặc định wau-captcha-token) và data-lang (vi để hiện tiếng Việt).",
    },
    react: {
      title: "Component React",
      body: "@waucaptcha-sdk/react cung cấp một component duy nhất, <WauCaptcha />, cho React 18 trở lên. Đặt nó trong form: giải xong, form gửi kèm token trong trường ẩn wau-captcha-token.",
      nextTitle: "Next.js App Router",
      next: "Dùng thẳng trong page là Server Component; server action của form đổi token bằng @waucaptcha-sdk/server.",
      modalTitle: "Chế độ modal",
      modal: "WauCaptchaMode.MODAL hiển thị một nút mở challenge trong hộp thoại, hộp thoại tự đóng khi trả lời đúng. Challenge chỉ được tải khi mở hộp thoại. Các callback như onSuccess cần đặt trong Client Component.",
      propsTitle: "Props",
      prop: "Prop",
      meaning: "Mô tả",
      props: [
        { name: "siteKey, baseUrl", meaning: "Bắt buộc: site key của khóa API và địa chỉ của WAU Captcha API." },
        { name: "mode", meaning: "WauCaptchaMode.INLINE (mặc định) hiển thị challenge tại chỗ; WauCaptchaMode.MODAL mở nó từ một nút. ChallengeType.AUTO_CHECK luôn chạy tại chỗ." },
        { name: "challengeType", meaning: "ChallengeType.IMAGE_DISTORT (mặc định), ChallengeType.MOTION_NOISE, ChallengeType.SLIDE_PUZZLE, ChallengeType.ANIMAL_JUMP, ChallengeType.OBJECT_ROTATE hoặc ChallengeType.AUTO_CHECK." },
        { name: "fallbackChallengeType", meaning: "Chỉ với AUTO_CHECK: loại hiện cho khách truy cập mà phép kiểm tra chưa chắc chắn. Mặc định ChallengeType.SLIDE_PUZZLE; chọn IMAGE_DISTORT ở nơi có người chỉ dùng bàn phím." },
        { name: "appearance", meaning: "Chỉ với AUTO_CHECK: Appearance.ALWAYS (mặc định) hiện ô kiểm tra ngay từ đầu; Appearance.INTERACTION_ONLY giữ captcha ẩn trừ khi phải hiện phần dự phòng hoặc một lỗi." },
        { name: "theme", meaning: "WauCaptchaTheme.AUTO (mặc định) theo color-scheme của trang; LIGHT và DARK ép một chế độ." },
        { name: "inputName", meaning: "Tên trường ẩn chứa token. Mặc định wau-captcha-token." },
        { name: "labels", meaning: 'Các chữ muốn thay bằng ngôn ngữ của bạn, ví dụ { open: "Xác minh bạn là người", verify: "Xác minh" }.' },
        { name: "onSuccess, onExpire, onError", meaning: "Được gọi với token khi trả lời đúng, khi token hết hạn mà chưa dùng, và với một WauCaptchaError." },
      ],
      reset: "Muốn bắt đầu lại, chẳng hạn sau khi backend đã đổi token, hãy đổi key của component. Để hợp với thương hiệu, đặt --wau-captcha-primary, --wau-captcha-background hoặc --wau-captcha-border trên component hoặc phần tử cha.",
    },
    client: {
      title: "Giao diện riêng trên trình duyệt",
      body: "Dùng WauCaptchaClient để tự dựng giao diện. Hãy lấy challenge khi nó được hiển thị, không lấy trước: từ 1.3.0, trong lúc đó client tự giải proof of work, rồi gửi nó cùng site key với câu trả lời. Hãy truyền dữ liệu recordBehavior ghi được vào behavior, nếu không khóa bắt buộc dữ liệu hành vi sẽ từ chối câu trả lời. Với slide_puzzle, animal_jump và object_rotate, trackSlide, trackJump và trackRotate ghi lại cú kéo, các lần bấm chuột và các lần bấm nút đúng như service kiểm tra, còn verifySlide, verifyJump và verifyRotate gửi chúng đi. Với auto_check, hãy lấy challenge bằng newChallenge({ challengeType: ChallengeType.AUTO_CHECK, fallbackType }), ghi hành vi bằng recordBehavior({ root, page: true }), chạy probeBrowser(), và khi workDone(challenge.id) đã xong và đã qua ít nhất 1,5 giây kể từ lúc nhận challenge, gửi kết quả bằng verifyAuto; success false nghĩa là phải giải một challenge thuộc loại challenge.fallbackType thay vào đó. Mỗi challenge chỉ trả lời được một lần: trả lời sai thì lấy challenge mới.",
    },
    node: {
      title: "Xác minh trên máy chủ Node.js",
      body: "Đổi token bằng @waucaptcha-sdk/server (Node.js 18 trở lên), và so result.hostname, website nơi challenge được giải, với tên miền của bạn. Nếu gặp WauCaptchaError tức là không kiểm tra được token; hãy coi đó là thất bại.",
    },
    java: {
      title: "Xác minh trên máy chủ Java",
      body: "Đổi token bằng com.waucaptcha:waucaptcha-sdk (Java 17 trở lên, không phụ thuộc thư viện ngoài), và so result.hostname(), website nơi challenge được giải, với tên miền của bạn. result.challengeType() là auto_check với khách qua mà không phải giải câu đố nào. Client bất biến và dùng chung an toàn giữa nhiều luồng; gặp WauCaptchaException tức là không kiểm tra được token, nên hãy coi đó là thất bại.",
      challenges: "Cũng client đó lấy và trả lời challenge của mọi loại trừ auto_check, loại mà chỉ SDK trình duyệt mới đưa ra được câu trả lời, bằng site key, gửi kèm site key và proof of work như SDK trình duyệt. Khóa bắt buộc dữ liệu hành vi, mặc định với khóa mới, từ chối câu trả lời gửi không kèm Behavior, nên các lời gọi này hợp với kiểm thử và ứng dụng desktop; trên website, hãy dùng widget JavaScript rồi xác minh token bằng Java.",
    },
    verifyPackage: {
      title: "Kiểm chứng gói",
      body: "Từ bản 1.3.0, mọi bản phát hành của ba gói đều được GitHub Actions build và công bố kèm npm provenance: trang của gói trên npmjs.com cho biết commit và workflow đã tạo ra nó. npm audit signatures kiểm tra chữ ký của registry và chứng thực provenance của những gì bạn đã cài. Các bản trước 1.3.0 được công bố thủ công và không có provenance.",
    },
    otherLanguages: {
      title: "Ngôn ngữ khác",
      body: "Hiện chưa có SDK cho ngôn ngữ khác, và cũng không cần: mọi backend đều đổi token bằng một lời gọi HTTPS tới /siteverify, với secret key dạng bearer token và token trong body JSON. Mọi phản hồi khác 200 kèm success true đều phải coi là kiểm tra thất bại.",
    },
    ...docsReference.vi,
    ...docsProtection.vi,
  },
};

export const docs = { en, vi };

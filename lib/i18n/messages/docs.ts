import type { Translation } from "../types";
import { docsReference } from "./docs-reference";

const en = {
  metaTitle: "Documentation",
  metaDescription: "Integrate WAU Captcha: the widget, the React component, the browser client, server verification in Node.js and Java, and the REST API.",
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
      body: "The widget shows the challenge, a text box and two buttons, and loads a new challenge after a wrong answer. With the script build, any element with data-wau-captcha renders by itself.",
      bundler: "With a bundler, render it yourself to get callbacks and your own labels:",
      attributes: "Attributes: data-site-key and data-base-url (required), data-challenge-type (image_distort or motion_noise) and data-input-name (default wau-captcha-token).",
    },
    react: {
      title: "React component",
      body: "@wau-captcha/react gives you one component, <WauCaptcha />, for React 18 or later. Put it inside a form: once solved, the form sends the token in the hidden field wau-captcha-token.",
      nextTitle: "Next.js App Router",
      next: "It works straight from a Server Component page; the server action of the form redeems the token with @wau-captcha/server.",
      modalTitle: "Modal mode",
      modal: "WauCaptchaMode.MODAL shows a button that opens the challenge in a dialog, which closes by itself once the answer is right. The challenge only loads when the dialog opens. Callbacks such as onSuccess need a Client Component.",
      propsTitle: "Props",
      prop: "Prop",
      meaning: "Description",
      props: [
        { name: "siteKey, baseUrl", meaning: "Required: the site key of your API key and the address of the WAU Captcha API." },
        { name: "mode", meaning: "WauCaptchaMode.INLINE (default) shows the challenge in place; WauCaptchaMode.MODAL opens it from a button." },
        { name: "challengeType", meaning: "ChallengeType.IMAGE_DISTORT (default) or ChallengeType.MOTION_NOISE." },
        { name: "theme", meaning: "WauCaptchaTheme.AUTO (default) follows the color-scheme of the page; LIGHT and DARK force one." },
        { name: "inputName", meaning: "Name of the hidden field that carries the token. Default wau-captcha-token." },
        { name: "labels", meaning: 'Texts to replace in your language, e.g. { open: "Verify you are human", verify: "Verify" }.' },
        { name: "onSuccess, onExpire, onError", meaning: "Called with the token of a right answer, when the token expires unused, and with a WauCaptchaError." },
      ],
      reset: "To start over, e.g. after the backend has redeemed the token, change the component's key. To match your brand, set --wau-captcha-primary, --wau-captcha-background or --wau-captcha-border on it or on an ancestor.",
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
    ...docsReference.en,
  },
};

const vi: Translation<typeof en> = {
  metaTitle: "Tài liệu",
  metaDescription: "Tích hợp WAU Captcha: widget, component React, client trên trình duyệt, xác minh phía máy chủ bằng Node.js và Java, và REST API.",
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
      body: "Widget hiển thị challenge, ô nhập và hai nút, tự lấy challenge mới sau khi trả lời sai. Với bản script, phần tử nào có data-wau-captcha sẽ tự hiển thị.",
      bundler: "Nếu dùng bundler, hãy tự render để có callback và nhãn riêng:",
      attributes: "Thuộc tính: data-site-key và data-base-url (bắt buộc), data-challenge-type (image_distort hoặc motion_noise) và data-input-name (mặc định wau-captcha-token).",
    },
    react: {
      title: "Component React",
      body: "@wau-captcha/react cung cấp một component duy nhất, <WauCaptcha />, cho React 18 trở lên. Đặt nó trong form: giải xong, form gửi kèm token trong trường ẩn wau-captcha-token.",
      nextTitle: "Next.js App Router",
      next: "Dùng thẳng trong page là Server Component; server action của form đổi token bằng @wau-captcha/server.",
      modalTitle: "Chế độ modal",
      modal: "WauCaptchaMode.MODAL hiển thị một nút mở challenge trong hộp thoại, hộp thoại tự đóng khi trả lời đúng. Challenge chỉ được tải khi mở hộp thoại. Các callback như onSuccess cần đặt trong Client Component.",
      propsTitle: "Props",
      prop: "Prop",
      meaning: "Mô tả",
      props: [
        { name: "siteKey, baseUrl", meaning: "Bắt buộc: site key của khóa API và địa chỉ của WAU Captcha API." },
        { name: "mode", meaning: "WauCaptchaMode.INLINE (mặc định) hiển thị challenge tại chỗ; WauCaptchaMode.MODAL mở nó từ một nút." },
        { name: "challengeType", meaning: "ChallengeType.IMAGE_DISTORT (mặc định) hoặc ChallengeType.MOTION_NOISE." },
        { name: "theme", meaning: "WauCaptchaTheme.AUTO (mặc định) theo color-scheme của trang; LIGHT và DARK ép một chế độ." },
        { name: "inputName", meaning: "Tên trường ẩn chứa token. Mặc định wau-captcha-token." },
        { name: "labels", meaning: 'Các chữ muốn thay bằng ngôn ngữ của bạn, ví dụ { open: "Xác minh bạn là người", verify: "Xác minh" }.' },
        { name: "onSuccess, onExpire, onError", meaning: "Được gọi với token khi trả lời đúng, khi token hết hạn mà chưa dùng, và với một WauCaptchaError." },
      ],
      reset: "Muốn bắt đầu lại, chẳng hạn sau khi backend đã đổi token, hãy đổi key của component. Để hợp với thương hiệu, đặt --wau-captcha-primary, --wau-captcha-background hoặc --wau-captcha-border trên component hoặc phần tử cha.",
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
    ...docsReference.vi,
  },
};

export const docs = { en, vi };

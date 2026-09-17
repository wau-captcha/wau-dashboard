@AGENTS.md

# wau-dashboard

Next 16 (App Router) cho người dùng cuối của WAU Captcha: đăng ký, thuê và quản lý khóa API, xem lượt dùng. Giao diện hai ngôn ngữ, **tiếng Anh mặc định**, tiếng Việt chọn bằng `LanguageSwitcher`. Toàn bộ dữ liệu đi qua **wau-gateway** (`GATEWAY_URL`, mặc định `http://127.0.0.1:8080`).

## Giao diện
- Tuân theo `DESIGN.md` (phong cách openrouter.ai). Đọc trước khi làm UI; dùng component trong `components/ui/` và token trong `app/globals.css`, không viết style/màu thô trong trang.
- `/demo` (`app/demo`) trưng bày toàn bộ component; thêm/sửa component thì cập nhật trang này.
- Trang chỉ **ghép** component với class bố cục (`grid`, `flex`, `gap`, `max-w`). Mẫu lặp lại ≥ 2 lần → tách vào `components/ui/`. File trong `app/**/_components` chỉ nối component UI với Server Action/state.
- `CardHeader` xếp hai đầu: khi có cả `CardTitle` và `CardDescription`, bọc chúng trong `<div className="min-w-0">`.
- **Không viết chữ hiển thị thẳng trong code** (kể cả `aria-label`, placeholder, toast): thêm khóa vào `lib/i18n/messages/*.ts` (cả `en` và `vi`) hoặc `components/ui/ui-text.ts` cho component. Quy tắc đầy đủ ở `DESIGN.md` §17.

## Cấu trúc
```
app/(auth)/           /login, /register — form + Server Action, không có khung dashboard
app/(dashboard)/      /overview, /keys, /keys/[id], /account — layout kiểm tra phiên
app/demo/             trang trưng bày component
lib/api/              client gọi gateway (server-only): client, auth, api-keys, usage, types, errors; failure.ts dùng được ở client
lib/i18n/             config, từ điển (messages/), getI18n (server), useI18n (client), setLocaleAction
lib/form-message.ts   thông báo form trung lập, dịch lúc render
lib/session.ts        cookie phiên; lib/dal.ts: getCurrentUser / getOptionalUser
lib/usage-view.ts     helper thuần cho màn hình lượt dùng (dùng được ở cả server và client)
proxy.ts              chặn trang dashboard khi chưa có cookie
```

## Phiên đăng nhập
- Token JWT của tenant nằm trong cookie **httpOnly** `wau_session` (`secure` ở production, `sameSite: lax`), chỉ server đọc; trình duyệt không bao giờ gọi thẳng gateway.
- `proxy.ts` chỉ kiểm tra **có cookie hay không** (chuyển hướng lạc quan). Token còn hiệu lực hay không do `lib/dal.ts` quyết định khi render; token hỏng → trang `/login` hiện form (không lặp chuyển hướng).
- Mọi Server Action tự lấy phiên (`getCurrentUser()`), không tin dữ liệu client gửi lên.
- Đăng xuất chỉ xoá cookie; tenant không thu hồi token.

## Quy ước dữ liệu
- Module nào chạm cookie hoặc gateway đều `import "server-only"`. Hằng tên cookie để ở `lib/session-cookie.ts` vì `proxy.ts` không import được code server-only.
- Hàm dùng chung giữa Server Component và Client Component phải nằm ngoài file `"use client"` (nếu không Next báo "Attempted to call … from the server").
- `int64` của proto về dạng chuỗi → `lib/api/usage.ts` đổi sang số.
- FieldMask gửi lên tenant viết camelCase: `update_mask: "name,isActive"`.
- Lỗi API được dịch theo `reason` (từ điển `errors`); lỗi kèm `metadata.field` hiện ngay dưới input.
- Server Action dùng với `useActionState` trả `FormMessage` (không trả chuỗi đã dịch) vì state của form sống qua lần đổi ngôn ngữ; action trả kết quả cho toast thì dịch sẵn bằng `getI18n()` được.
- Ngôn ngữ nằm trong cookie `wau_locale`, nên layout gốc đọc cookie và mọi route render động.

## Chạy và kiểm tra
- Cần hạ tầng + challenge/verify/tenant/gateway (xem `wau-services/CLAUDE.md`). `pnpm dev` (cổng 3000) hoặc `PORT=3100 GATEWAY_URL=http://127.0.0.1:8180 pnpm start` khi test trên stack cổng tạm.
- `PUBLIC_GATEWAY_URL` chỉ dùng để in trong hướng dẫn tích hợp ở trang chi tiết khóa.
- Sau khi sửa: `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, và kiểm tra trực quan ở cả hai theme, cả hai ngôn ngữ, bề ngang 400px.

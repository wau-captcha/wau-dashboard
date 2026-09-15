@AGENTS.md

# wau-dashboard

- Giao diện tuân theo `DESIGN.md` (phong cách openrouter.ai). Đọc trước khi làm UI; dùng component trong `components/ui/` và token trong `app/globals.css`, không viết style/màu thô trong trang.
- `/demo` (`app/demo`) trưng bày toàn bộ component; thêm/sửa component thì cập nhật trang này. Các trang nghiệp vụ chỉ tạo khi người dùng yêu cầu.
- Kiểm tra sau khi sửa: `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`.

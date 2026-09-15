# DESIGN.md — Chuẩn thiết kế WAU Dashboard

Tài liệu này là **nguồn chuẩn duy nhất** về giao diện của `wau-dashboard`. Mọi màn hình mới phải dùng token và component mô tả ở đây; nếu cần thứ chưa có, bổ sung vào hệ thống (token/component + cập nhật tài liệu) chứ không viết style riêng trong trang.

- **Phong cách gốc:** [openrouter.ai](https://openrouter.ai) — bộ nhận diện hiện hành (ink `#03080A`, cloud `#FCFCFE`, grape `#7624F4`, volt `#C8FF00`).
- **Cách lấy chuẩn:** trích trực tiếp từ CSS production của openrouter.ai (khối `:root` / `.dark`, các class component trong HTML và JS bundle), không phỏng đoán bằng mắt. Mọi con số dưới đây khớp với nguồn, trừ các điểm ghi rõ ở mục [Khác biệt có chủ đích](#15-khác-biệt-có-chủ-đích-so-với-openrouter).
- **Nền tảng kỹ thuật:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · [Base UI](https://base-ui.com) 1.8 (headless, cũng là thư viện OpenRouter dùng) · lucide-react · clsx + tailwind-merge.

---

## 1. Nguyên tắc

1. **Tối giản, phẳng.** Nền gần trắng/đen tuyệt đối, phân tách bằng viền mảnh có độ trong suốt (7,8%), không gradient, không bóng đổ trên bề mặt tĩnh. Bóng chỉ dành cho lớp nổi (popup, dialog, toast).
2. **Màu thương hiệu dùng tiết kiệm.** Grape (sáng) / Volt (tối) chỉ cho hành động chính, trạng thái đang chọn, liên kết và focus. Phần còn lại là thang xám sinh ra từ màu chữ với alpha.
3. **Mật độ thông tin cao, chữ 14px.** Chữ thân 14px, nhãn phụ 12px; điều khiển cao 32–40px; bảng padding 10×16px.
4. **Trạng thái rõ ràng nhưng tinh tế.** Hover là lớp phủ 2–3%; focus là viền 30% + quầng 3px; lỗi là viền đỏ + quầng đỏ 10%.
5. **Hai giao diện ngang hàng.** Mọi thứ phải đúng ở cả sáng và tối; chỉ dùng token ngữ nghĩa nên đổi theme là tự động.
6. **Tiếp cận được.** Base UI lo ARIA/bàn phím; ta giữ focus nhìn thấy được, nhãn cho nút chỉ có icon, không truyền đạt thông tin chỉ bằng màu.

---

## 2. Theme

- Theme theo class: `<html class="dark">`. Script `theme-init` trong `app/layout.tsx` đặt class **trước khi vẽ** (không nháy), đọc `localStorage["wau-theme"]` = `light | dark` (không có = theo hệ thống).
- Đổi theme bằng `ThemeToggle` hoặc hook `useTheme()` (`components/theme/theme-toggle.tsx`); đồng bộ giữa các tab.
- Có thể bọc một vùng bằng `class="dark"` để ép giao diện tối cục bộ (token định nghĩa trên `.dark`).
- Token khai báo ở `app/globals.css` (`:root` và `.dark`) và được ánh xạ sang Tailwind qua `@theme inline`, nên dùng thẳng: `bg-background`, `text-muted-foreground`, `border-border`…

---

## 3. Màu sắc

> Quy tắc: **chỉ dùng token ngữ nghĩa**. Cấm `bg-zinc-100`, `text-[#333]`, `bg-violet-600`… trong component và trang.

### 3.1 Bề mặt & chữ

| Token (utility) | Sáng | Tối | Dùng cho |
|---|---|---|---|
| `background` | `hsl(240 50% 99.2%)` ≈ #FCFCFE | `hsl(197.1 53.8% 2.5%)` ≈ #03080A | Nền trang |
| `foreground` | #03080A | #FCFCFE | Chữ chính, tiêu đề |
| `card` / `card-foreground` | #FFFFFF | `hsl(197 30% 4.5%)` | Card, khối nội dung |
| `popover` / `popover-foreground` | #FFFFFF | `hsl(197 30% 4.5%)` | Popup, menu, dialog, toast, tooltip |
| `table` | #FFFFFF | `hsl(197 30% 4.5%)` | Nền bảng |
| `muted` | ink 3,1% | cloud 3,1% | Nền phụ rất nhạt (checkbox, skeleton, footer bảng, segmented) |
| `muted-foreground` | ink 69% | cloud 62,7% | Chữ phụ, mô tả, nội dung ô bảng, icon |
| `faint-foreground` | #03080A70 | #FCFCFE70 | Chữ mờ nhất: ngày bị vô hiệu, ô trống "—" |
| `card-hover` | #03080A05 | #FCFCFE08 | Hover dòng bảng, item menu, card bấm được |
| `selected` | #03080A08 | #FCFCFE0A | Dòng bảng đang chọn |
| `inverse` / `inverse-foreground` | ink / cloud | cloud / ink | Khối đảo màu (hiếm dùng) |

### 3.2 Thương hiệu

| Token | Sáng | Tối | Dùng cho |
|---|---|---|---|
| `primary` | **#7624F4** (grape) | **#C8FF00** (volt) | Nút chính, checkbox/switch bật, tab đang chọn, ngày được chọn |
| `primary-foreground` | #FCFCFE | #03080A | Chữ trên nền `primary` |
| `primary-hover` | grape 88% | volt 88% | Hover nút chính |
| `accent` / `secondary` | primary 7,8% | primary 7,8% | Nền badge premium, nút secondary, dải ngày trong khoảng |
| `accent-foreground` / `secondary-foreground` | primary | primary | Chữ nhấn: item đang highlight, link hover, badge premium |
| `accent-subtle` | grape 3% | volt 3% | Hover của nút ghost |
| `accent-border` | primary 12,5% | primary 12,5% | Viền badge premium, hover nút secondary |
| `link` / `link-hover` | grape / grape tối 10% | volt / volt tối 10% | Liên kết nổi bật |
| `ring` | primary | primary | Dự phòng cho `ring-*` |

### 3.3 Viền, input, focus

| Token | Sáng | Tối | Dùng cho |
|---|---|---|---|
| `border` | ink 7,8% | cloud 7,8% | Mọi đường viền, đường kẻ bảng, separator (mặc định cho `border`) |
| `input` | ink 7,8% | cloud 7,8% | Viền control |
| `input-bg` | #FFFFFF | cloud 4% | Nền control |
| `focus-border` | ink 30% | cloud 30% | Viền khi focus |
| `--focus-shadow` → `shadow-focus` | `0 0 0 3px` ink 6% | `0 0 0 3px` cloud 6% | Quầng focus |
| `error-border` | #FF2D55 | #FF2D55 | Viền control không hợp lệ |
| `--error-shadow` → `shadow-error` | `0 0 0 3px` #FF2D55 10% | như sáng | Quầng focus khi không hợp lệ |

### 3.4 Trạng thái

Mỗi trạng thái có 3 sắc: **màu gốc** (icon/viền/nền pha loãng), **`-text`** (chữ, đủ tương phản) và **`-bg`** (nền 8%).

| Trạng thái | Gốc | `-text` sáng / tối | `-bg` | Dùng cho |
|---|---|---|---|---|
| `positive` | #00BF6F | #007544 / #34DFAA | 8% | Hoạt động, thành công, xác minh đúng |
| `warning` | #E5A000 | #8A6000 / #FFAB00 | 8% | Tạm dừng, sắp hết hạn mức |
| `negative` | #FF2D55 | #BF0024 / #FF2D55 | 8% | Lỗi, đã xóa, xác minh sai |
| `info` | #035ADE | #0352C9 / #4D8DFF | 8% | Thông tin, gợi ý |
| `destructive` | `hsl(346.8 77.2% 49.8%)` | — | — | Nền nút hành động phá hủy |

Badge dùng công thức OpenRouter: `bg-{tone}/12 text-{tone}-text border-{tone}/14`. Alert: `bg-{tone}-bg border-{tone}/30`.

### 3.5 Biểu đồ

`chart-1…8`: #0088FE, #00C49F, #FFBB28, #FF8042, #FF6347, #4682B4, #9ACD32, #DA70D6 (bảng màu biểu đồ của OpenRouter). Dùng theo thứ tự cho các chuỗi dữ liệu; không dùng cho UI thường.

---

## 4. Typography

### 4.1 Font

| Vai trò | Font | Biến | Ghi chú |
|---|---|---|---|
| Sans (mặc định) | **Plus Jakarta Sans** (variable 200–800) | `--font-jakarta` → `font-sans` | Subset `latin`, `latin-ext`, `vietnamese` |
| Brand (tiêu đề lớn, số liệu) | Plus Jakarta Sans | `font-brand` | OpenRouter dùng Gordita Bold (font thương mại) → thay bằng Jakarta đậm |
| Mono | **Geist Mono** | `--font-geist-mono` → `font-mono` | Khóa API, token, mã lỗi, phím tắt |

- Độ đậm chữ thân **450** (`font-normal` đã được đặt = 450), `font-medium` 500, `font-semibold` 600, `font-bold` 700.
- `body` bật `tabular-nums` (số thẳng cột) và `font-feature-settings: "rlig" 1, "calt" 1`.

### 4.2 Thang chữ ngữ nghĩa

Luôn dùng các utility này thay vì `text-sm/base/lg` (OpenRouter định nghĩa lại cả thang Tailwind; ta giữ thang mặc định nhưng **không dùng** cho UI).

| Utility | Cỡ | Line-height | Độ đậm dùng kèm | Dùng cho |
|---|---|---|---|---|
| `text-hero` | 36px | 1.2 | `font-brand font-bold tracking-tight` | Tiêu đề trang chào mừng |
| `text-display` | 24px | 1.2 | `font-brand font-semibold tracking-tight` | Tiêu đề trang, giá trị StatCard |
| `text-title` | 20px | 1.2 | `font-semibold` | Tiêu đề dialog, khối lớn |
| `text-section` | 16px | 1.35 | `font-medium` | Tiêu đề section |
| `text-heading` | 16px | 1.35 | `font-medium` | Tiêu đề card, empty state |
| `text-prose` | 16px | 1.7 | `font-normal` | Đoạn văn dài (tài liệu) |
| `text-body` | 14px | 1.625 | `font-normal` / `font-medium` | Chữ thân, input, ô bảng, item menu, nhãn |
| `text-button` | 14px | 1.25 | `font-medium` | Chữ nút |
| `text-overline` | 12px | 1.34 | `font-medium` | Badge, mô tả field, lỗi field, tooltip, kbd, nhãn nhóm |

Màu chữ: tiêu đề/giá trị `text-foreground`; mô tả/nhãn phụ/ô bảng `text-muted-foreground`; ghi chú mờ `text-faint-foreground`.

---

## 5. Khoảng cách & bố cục

- Lưới 4px của Tailwind (`--spacing: 0.25rem`). Chỉ dùng bậc: 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16.
- **Chiều cao điều khiển:**

| Kích thước | Chiều cao | Dùng cho |
|---|---|---|
| `xs` | 28px (`h-7`) | Nút trong toast, hàng dày đặc |
| `sm` | 32px (`h-8`) | Toolbar, bộ lọc, phân trang, nút điều hướng (giống nav OpenRouter) |
| `md` (mặc định) | 40px (`h-10`) | Form: input, select, date, nút |
| `lg` | 44px (`h-11`) | CTA lớn |

- Nút và control cùng `size` luôn cao bằng nhau để xếp chung một hàng.
- Khoảng cách chuẩn: nhãn ↔ control `gap-1.5` (6px); giữa các field `gap-4`; giữa các section `gap-8`–`gap-10`; padding card `px-5 py-5`; padding popup `p-1` (list) hoặc `p-4` (nội dung); dialog `p-6`.
- Chiều rộng nội dung trang gợi ý `max-w-7xl` (80rem) cho bảng dữ liệu, `max-w-3xl` cho form cài đặt.
- Breakpoint của OpenRouter: `md` 48rem, `lg` 64rem, `xl` 80rem — thiết kế mobile-first, bảng cuộn ngang trong khung.

---

## 6. Bo góc, viền, độ nổi

| Token | Giá trị | Dùng cho |
|---|---|---|
| `rounded-sm` | 4px | Checkbox, item trong popup, tab segmented, kbd, nút icon nhỏ trong control |
| `rounded-md` | 6px | Nút, input, select, popup list, menu, tooltip |
| `rounded-lg` | 8px | Card, bảng, dialog, popover nội dung, alert, toast |
| `rounded-xl` | 12px | Khối minh họa lớn (hiếm) |
| `rounded-full` | 9999px | Badge, switch, avatar, chấm trạng thái |

- Viền luôn 1px `border-border` (hoặc `border-input` cho control). Switch dùng viền 2px trong suốt để chứa quầng focus.
- **Bóng đổ:** `shadow-sm` — tab segmented đang chọn, thumb switch; `shadow-md` — select/combobox/menu/popover/tooltip; `shadow-lg` — dialog, toast. Không đặt bóng cho card/bảng.
- Lớp phủ modal: `bg-black/50`.

---

## 7. Trạng thái tương tác

| Trạng thái | Quy tắc |
|---|---|
| Hover | Nút chính → `primary-hover`; outline → `bg-muted` + chữ `accent-foreground`; ghost → `bg-accent-subtle` + chữ `accent-foreground`; dòng/item → `bg-card-hover`; control trigger → `bg-muted/30` |
| Active (nhấn) | Nền hiện tại 80% (`active:bg-primary/80`, `active:bg-muted/80`…) |
| Focus | `focus-visible:border-focus-border focus-visible:shadow-focus`; control dạng hộp dùng `focus-within`. Không bao giờ `outline-none` mà không có thay thế |
| Highlight trong list | `data-[highlighted]:bg-card-hover data-[highlighted]:text-accent-foreground` |
| Đang chọn | Tab underline: `border-primary text-primary`; tab segmented: `bg-background text-accent-foreground shadow-sm`; item: dấu ✓ màu `accent-foreground`; dòng bảng: `bg-selected` |
| Disabled | `opacity-50` + `pointer-events-none` (nút) hoặc `cursor-not-allowed` (control) |
| Không hợp lệ | Viền `error-border`, focus `shadow-error`, thông báo `text-overline font-medium text-negative-text` dưới control |
| Đang tải | Nút: `loading` (spinner thay icon, tự disable); bảng: skeleton khi chưa có dữ liệu, làm mờ 60% khi tải lại; combobox: spinner trong ô tìm kiếm |
| Placeholder | Input `text-muted-foreground/50`; trigger select/date `text-muted-foreground` |

---

## 8. Chuyển động

| Loại | Thời lượng | Easing | Hiệu ứng |
|---|---|---|---|
| Đổi màu (hover/focus) | 150ms | `ease-in-out` mặc định | `transition-colors` |
| Popup neo (select, menu, popover, tooltip) | vào 150ms / ra 100ms | `ease-smooth-out` = `cubic-bezier(.22,1,.36,1)` | opacity 0→1, scale .98→1, gốc `--transform-origin` |
| Dialog | vào 200ms / ra 150ms | `ease-smooth-out` | opacity + scale .96→1 |
| Lớp phủ modal | vào 300ms / ra 200ms | `ease-drawer` = `cubic-bezier(.32,.72,0,1)` | opacity |
| Toast | 200ms | `ease-smooth-out` | trượt lên 8px + opacity; vuốt để đóng |
| Switch thumb | 150ms | `ease-smooth-out` | translate |

- Base UI gắn `data-starting-style` / `data-ending-style`; hiệu ứng viết bằng CSS transition (có thể hủy giữa chừng). Chuỗi dùng chung: `popupMotion` trong `components/ui/control.ts`.
- `prefers-reduced-motion: reduce` → mọi animation/transition rút về 1ms (đặt trong `globals.css`).

---

## 9. Lớp (z-index)

| Utility | Giá trị | Dùng cho |
|---|---|---|
| `z-sticky` | 49 | Header bảng dính, thanh điều hướng dính |
| `z-overlay` | 50 | Thanh bên, lớp phủ không modal |
| `z-modal` | 100 | Lớp phủ dialog |
| `z-alert` | 105 | Hộp dialog |
| `z-popover` | 1000 | Select, combobox, menu, popover, tooltip (nổi trên dialog) |
| `z-toast` | 1100 | Toast |

Nội dung app được bọc trong `div.isolate` ở `layout.tsx` để popup render qua portal luôn nằm trên. **Không dùng `z-10/z-50` tùy tiện**.

---

## 10. Icon

- Bộ icon: **lucide-react** (giống OpenRouter). Stroke mặc định 2.
- Kích thước: 16px (`size-4`) trong nút/control/menu; 14px (`size-3.5`) trong nút `xs`, stepper, nút xóa; 12px trong badge; 20px trong empty state.
- Nút, control, menu tự đặt cỡ cho `svg` không có class `size-*` → thường không cần ghi `className` cho icon.
- Nút chỉ có icon **bắt buộc** có `aria-label` (và nên có `Tooltip`).

---

## 11. Thư viện component

Nằm ở `components/ui/`, import từng file: `import { Button } from "@/components/ui/button"`.

**Xem trực quan tại trang `/demo`** (`app/demo`): mọi component, biến thể và trạng thái, ở cả hai giao diện. Thêm hoặc sửa component thì cập nhật trang này cùng lúc.
Component không có trạng thái (Button, Badge, Card, Alert, Table, Skeleton, Separator, Kbd, EmptyState, Spinner) dùng được trong Server Component; còn lại là Client Component (`"use client"`).

Quy ước chung cho mọi component:
- Nhận `className` và gộp bằng `cn()` → class truyền vào **thắng** class mặc định.
- `className` áp lên phần tử **ngoài cùng** (để chỉnh độ rộng/lề); phần tử bên trong có prop riêng (`inputClassName`, `popupClassName`, `containerClassName`…).
- Có `data-slot="…"` để nhắm CSS/test.
- Hỗ trợ cả controlled (`value` + `onValueChange`) và uncontrolled (`defaultValue`).
- Chuỗi mặc định bằng tiếng Việt, đều ghi đè được qua prop.

### 11.1 Hành động

**`Button`** (`button.tsx`)
- `variant`: `primary` (mặc định) · `secondary` · `outline` · `ghost` · `destructive` · `destructive-outline` · `link`
- `size`: `xs` · `sm` · `md` (mặc định) · `lg` · `icon-xs` · `icon-sm` · `icon`
- `loading`, `startIcon`, `endIcon`; mặc định `type="button"` (form submit phải ghi `type="submit"`).
- Cho phần tử không phải `<button>` (vd. `Link`): `className={buttonVariants({ variant: "outline", size: "sm" })}`.
- Mỗi vùng chỉ **một** nút `primary`; hành động phụ dùng `outline`/`ghost`; xóa/thu hồi dùng `destructive-outline` (mở `ConfirmDialog`) rồi `destructive` trong dialog.

**`CopyButton`** (`copy-button.tsx`) — sao chép `value`, đổi icon ✓ trong 1,5s, có tooltip "Đã sao chép". Hoạt động cả trên origin không bảo mật.

### 11.2 Form

Mọi control đặt trong **`Field`** (`field.tsx`) để có nhãn, mô tả, lỗi và liên kết ARIA:

```tsx
<Field label="Email" description="Dùng để đăng nhập." error={errors.email} required>
  <TextInput type="email" name="email" required />
</Field>
```

- `error` có giá trị → field không hợp lệ, hiện thông báo; không có → hiện thông báo kiểm tra native (vd. `required`).
- Control dạng **nút** (`Select`, `Combobox`, `DateRangeInput`) → thêm `nativeLabel={false}` cho `Field`.
- `labelAction` đặt link/nút nhỏ bên phải nhãn.

| Component | File | Điểm chính |
|---|---|---|
| `TextInput` | `text-input.tsx` | `size`, `startAdornment`/`endAdornment` (icon hoặc chữ), `clearable` + `onClear`, `type="password"` có nút hiện/ẩn, `invalid` |
| `Textarea` | `textarea.tsx` | `rows`, `autoResize` (co giãn theo nội dung tới 20rem) |
| `NumberInput` | `number-input.tsx` | `min`/`max`/`step`/`largeStep` (Shift)/`smallStep` (Alt), `format` (Intl, vd. tiền VND), `endAdornment` đơn vị, `hideStepper`; `onValueChange(number \| null)` |
| `DateInput` | `date-input.tsx` | Gõ `dd/mm/yyyy` hoặc chọn lịch (nút lịch / Alt+↓); `min`, `max`, `isDateDisabled`; `name` gửi dạng `yyyy-mm-dd`; giá trị không hợp lệ tự khôi phục khi blur |
| `DateRangeInput` | `date-input.tsx` | `presets={dateRangePresets}` (Hôm nay, 7/30 ngày qua, Tháng này, Tháng trước), `numberOfMonths` 1\|2; trả `{ from, to }` |
| `Calendar` | `calendar.tsx` | Lịch dùng riêng: `mode="single" \| "range"`, bàn phím đầy đủ (mũi tên, Home/End, PageUp/Down, Shift = năm), tuần bắt đầu thứ Hai |
| `Select` | `select.tsx` | Danh sách ngắn không tìm kiếm; `multiple`, `clearable`, nhóm qua `option.group`, `renderOption` |
| `Combobox` | `combobox.tsx` | Như `Select` + ô tìm kiếm. `searchable`: `"auto"` (mặc định, bật khi > 8 lựa chọn) · `true` · `false`. Tìm từ server: `onSearchChange(query)` + `loading`, truyền kết quả vào `options` |
| `Checkbox` | `checkbox.tsx` | `label`, `description`, `indeterminate` |
| `Switch` | `switch.tsx` | `label`, `description`, `labelPosition="start"` cho hàng cài đặt |

Lựa chọn cho `Select`/`Combobox` có dạng:

```ts
type SelectOption<V extends string | number> = {
  value: V; label: string; description?: ReactNode; icon?: ReactNode; disabled?: boolean; group?: string;
};
```

Quy tắc chọn control: ≤ 5 lựa chọn cố định, luôn thấy hết → `Tabs` segmented hoặc radio; danh sách ngắn → `Select`; danh sách dài/động hoặc cần tìm → `Combobox`; bật/tắt có hiệu lực ngay → `Switch`; đồng ý/chọn nhiều trong form → `Checkbox`.

### 11.3 Dữ liệu

**`DataTable`** (`data-table.tsx`) — bảng chuẩn cho mọi danh sách:

```tsx
<DataTable
  aria-label="Danh sách khóa API"
  columns={columns}
  data={keys}
  getRowId={(key) => key.api_key_id}
  loading={isLoading}
  sort={sort}
  onSortChange={setSort}
  manualSorting
  selectable
  footer={<Pagination page={page} pageSize={size} total={total} onPageChange={setPage} onPageSizeChange={setSize} />}
/>
```

- Cột: `id`, `header`, `cell(row)`, `accessor(row)` (giá trị để sắp xếp/hiển thị mặc định), `sortable`, `align`, `width`.
- Mặc định định dạng: số → `1.234.567`, `Date` → `15/09/2026 14:05:09`, boolean → Có/Không, rỗng → "—".
- Sắp xếp vòng: tăng → giảm → bỏ; giá trị rỗng luôn ở cuối. Dữ liệu phân trang từ server → `manualSorting`.
- Trạng thái: không dữ liệu + `loading` → skeleton; có dữ liệu + `loading` → mờ 60%; rỗng → `emptyState` (mặc định "Không có dữ liệu").
- `density`: `compact` (6×10px) · `regular` (10×16px, mặc định) · `expanded` (14×16px). `stickyHeader` cần giới hạn chiều cao khung.
- Căn phải cột số và tiền; cột đầu (định danh) có thể `className="text-foreground font-medium"`; cột thao tác cuối dùng `DropdownMenu` với nút `ghost icon-sm` (icon `Ellipsis`).

**`Table`…`TableCell`** (`table.tsx`) — primitive khi cần bố cục đặc biệt. **`Pagination`** (`pagination.tsx`) — trang bắt đầu từ 1, số nút cố định 7 để không nhảy.

**`StatCard`** (`card.tsx`) — ô chỉ số: `label`, `value` (chữ `display` brand), `hint` (badge xu hướng/ghi chú), `icon`.

**`SecretValue`** (`secret-value.tsx`) — hiển thị khóa: site key `<SecretValue value={siteKey} />`; secret key `<SecretValue value={secretKey} masked />` (giữ tiền tố `sk_` và 4 ký tự cuối).

### 11.4 Hiển thị

| Component | Điểm chính |
|---|---|
| `Badge` | `tone`: `neutral` · `primary` · `info` · `positive` · `warning` · `negative` · `outline`; `size` `sm`/`md`; `dot` |
| `Alert` | Thông báo trong trang: `tone`, `title`, `action`; icon theo tone (ẩn bằng `icon={null}`) |
| `Card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`; `interactive` cho card bấm được |
| `EmptyState` | `title`, `description`, `icon`, `action` |
| `Skeleton` | Khối chờ, đặt kích thước bằng class |
| `Separator`, `Kbd`, `Spinner` | Đường kẻ; phím tắt; vòng tải (`label` khi đứng riêng) |
| `Tabs` | `variant="underline"` (điều hướng trong trang) · `"segmented"` (chuyển chế độ xem/khoảng thời gian); `TabsList`, `TabsTab`, `TabsPanel` |

### 11.5 Lớp nổi

| Component | Khi nào dùng |
|---|---|
| `Dialog` + `DialogContent` (`size` sm/md/lg/xl) + `DialogHeader/Title/Description/Footer` | Tác vụ phụ cần tập trung (tạo/sửa) |
| `ConfirmDialog` | Xác nhận hành động khó hoàn tác; `tone="destructive"`; `onConfirm` async tự hiện spinner và đóng khi xong, lỗi thì giữ mở; không đóng khi bấm ra ngoài |
| `DropdownMenu` + `Content/Item/CheckboxItem/Label/Separator/Shortcut` | Danh sách hành động; `variant="destructive"` cho item nguy hiểm |
| `Popover` + `PopoverContent` | Nội dung tương tác nhỏ neo theo nút |
| `Tooltip` | Gợi ý ngắn khi hover/focus, cho nút chỉ có icon. Không chứa thông tin bắt buộc |
| `toast` (`toast.tsx`) | Phản hồi tạm thời sau hành động: `toast.success("Đã lưu")`, `toast.error(title, { description })`, `toast.promise(p, { loading, success, error })`, `toast.dismiss(id)` |

`Providers` (`components/providers.tsx`) đã gắn `TooltipProvider` và `ToastProvider` ở root layout.

### 11.6 Tiện ích

| File | Nội dung |
|---|---|
| `lib/utils.ts` | `cn()` = clsx + tailwind-merge **đã cấu hình token riêng** (`text-body`, `shadow-focus`, `z-popover`…). Thêm token mới → thêm vào cấu hình này, nếu không class sẽ bị gộp sai |
| `lib/format.ts` | `DEFAULT_LOCALE = "vi-VN"`, `DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh"`, `formatNumber`, `formatCompactNumber`, `formatPercent`, `formatDate`, `formatDateTime` |
| `lib/date.ts` | Hàm ngày theo lịch địa phương: `addDays`, `addMonths`, `startOfMonth`, `isSameDay`, `toISODate`, `parseDisplayDate`… |
| `components/ui/control.ts` | Chuỗi class dùng chung: `controlBox`, `controlTrigger`, `controlInput`, `controlHeight`, `popupSurface`, `popupItem`, `popupMotion`. Component control mới **phải** dùng các chuỗi này |

---

## 12. Nội dung & định dạng

- Ngôn ngữ giao diện: **tiếng Việt**, viết hoa chữ đầu câu ("Tạo khóa API", không "Tạo Khóa API"). Dấu thanh kiểu phổ thông: *xóa, khóa, hủy, hòa*.
- Nhãn nút là động từ ngắn, không dấu chấm cuối. Mô tả/thông báo là câu đầy đủ, có dấu chấm. Placeholder gợi ý dạng dữ liệu ("shop.example.com", "dd/mm/yyyy"), kết thúc bằng "…" khi là lời mời hành động ("Chọn…", "Tìm kiếm…").
- Giữ nguyên thuật ngữ kỹ thuật của hệ thống: *site key, secret key, token, challenge*; tên loại challenge hiển thị đúng id (`image_distort`, `motion_noise`…) kèm mô tả tiếng Việt.
- Số: `1.234.567`, thập phân `12,5`, phần trăm `12,3%`, rút gọn `3,4 Tr`. Tiền: `NumberInput format={{ style: "currency", currency: "VND" }}` → `1.500.000 ₫`.
- Ngày: `15/09/2026`; thời điểm: `15/09/2026 14:05:09` (múi giờ Việt Nam, cố định để server và client hiển thị giống nhau). Khoảng ngày: `01/09/2026 – 15/09/2026`.
- Luôn định dạng qua `lib/format.ts`, không gọi `toLocaleString()` rải rác (lệch giữa server/client).

---

## 13. Ánh xạ dữ liệu WAU Captcha

Để mọi màn hình biểu diễn dữ liệu của `wau-services` thống nhất:

| Dữ liệu | Hiển thị |
|---|---|
| `tiers.tier_id` | `premium` → `<Badge tone="primary">Premium</Badge>`; `free` → `<Badge>Free</Badge>` |
| `api_keys.is_active` / `is_deleted` | Hoạt động → `positive` + `dot`; tạm dừng (`is_active=false`) → `warning` + `dot`; đã xóa → `negative` |
| `api_keys.site_key` / `secret_key` | `SecretValue` (secret luôn `masked`); trong bảng rút gọn `font-mono` + `…` |
| `usage_logs.success` | `true` → `positive` "Thành công"; `false` → `negative` "Thất bại" |
| `usage_logs.timestamp`, `create_date` | `formatDateTime` |
| `challenge_types` | `Select`/`Combobox` với `label` = id, `description` = mô tả; loại không có trong gói → `disabled` |
| Lượt xác minh, tỉ lệ | `StatCard` + `formatNumber` / `formatPercent`; cột số căn phải |
| Mã lỗi API (`SITE_KEY_INVALID`, `SECRET_KEY_INVALID`, `CHALLENGE_TYPE_NOT_ALLOWED`…) | Thông báo tiếng Việt cho người dùng qua `toast.error`/`Alert`; mã gốc đặt ở `description` bằng `font-mono` khi hữu ích cho debug |
| Thu hồi/xóa khóa | Item `destructive` trong menu → `ConfirmDialog tone="destructive"` → `toast.success` |

---

## 14. Tiếp cận (checklist)

- [ ] Mọi control nằm trong `Field` hoặc có `aria-label`.
- [ ] Nút chỉ có icon có `aria-label` (+ `Tooltip`).
- [ ] Không bỏ focus ring; thử toàn bộ luồng bằng Tab/Enter/Esc/mũi tên.
- [ ] Trạng thái không chỉ bằng màu: badge có chữ, lỗi có thông báo, dòng chọn có checkbox.
- [ ] Bảng có `aria-label`; cột sắp xếp dùng nút có `aria-sort` (DataTable tự làm).
- [ ] Hành động phá hủy luôn qua `ConfirmDialog`.
- [ ] Tương phản chữ: dùng `*-text` cho chữ trạng thái, không dùng màu gốc (`positive`, `warning`…) làm màu chữ trên nền sáng.
- [ ] Kiểm tra cả giao diện sáng và tối.

---

## 15. Khác biệt có chủ đích so với OpenRouter

| Điểm | OpenRouter | WAU Dashboard | Lý do |
|---|---|---|---|
| Font brand | Gordita Bold | Plus Jakarta Sans đậm | Gordita là font thương mại |
| Thang `text-xs/sm/base` | Ghi đè (xs = 14px) | Giữ mặc định Tailwind, dùng thang ngữ nghĩa | Tránh nhầm lẫn cho dev |
| Viền focus của nút | Chỉ quầng 3px | Thêm viền `focus-border` (mọi nút có viền 1px trong suốt) | Quầng 6% quá mờ, tăng khả năng nhìn thấy focus |
| Tooltip | Không xác định được từ nguồn | Kiểu popover (nền `popover`, viền, `shadow-md`, chữ 12px) | Đồng nhất với các lớp nổi khác |
| Thứ tự ngày giờ | — | `dd/MM/yyyy HH:mm:ss` | vi-VN mặc định đặt giờ trước ngày, khó dò theo cột |
| Ngôn ngữ | Tiếng Anh | Tiếng Việt | Đối tượng người dùng |

---

## 16. Quy tắc mở rộng

1. **Token trước, class sau.** Màu/cỡ mới → thêm biến ở `:root` và `.dark` + `@theme inline` trong `globals.css` → cập nhật `lib/utils.ts` (tailwind-merge) → ghi vào tài liệu này.
2. **Component trước, trang sau.** Mẫu UI lặp lại ≥ 2 lần → tách vào `components/ui/`, dùng Base UI cho mọi thứ có tương tác (menu, popup, focus trap…), không tự viết lại hành vi bàn phím.
3. Trang không được chứa chuỗi class dài lặp lại hoặc màu thô; chỉ bố cục (`grid`, `flex`, `gap`, `max-w`).
4. Chỉ thêm `"use client"` cho file cần state/effect/sự kiện; ưu tiên Server Component cho trang và bố cục.
5. Sau khi sửa component: `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, và kiểm tra trực quan ở cả hai theme.

import { cn } from "@/lib/utils";
import { DemoBlock, DemoSection } from "../demo-shell";

const colorGroups = [
  {
    title: "Bề mặt & chữ",
    swatches: [
      { token: "background", className: "bg-background" },
      { token: "card", className: "bg-card" },
      { token: "muted", className: "bg-muted" },
      { token: "card-hover", className: "bg-card-hover" },
      { token: "foreground", className: "bg-foreground" },
      { token: "muted-foreground", className: "bg-muted-foreground" },
      { token: "faint-foreground", className: "bg-faint-foreground" },
      { token: "border", className: "bg-border" },
    ],
  },
  {
    title: "Thương hiệu",
    swatches: [
      { token: "primary", className: "bg-primary" },
      { token: "primary-hover", className: "bg-primary-hover" },
      { token: "accent", className: "bg-accent" },
      { token: "accent-subtle", className: "bg-accent-subtle" },
      { token: "accent-border", className: "bg-accent-border" },
      { token: "destructive", className: "bg-destructive" },
    ],
  },
  {
    title: "Trạng thái",
    swatches: [
      { token: "positive", className: "bg-positive" },
      { token: "positive-bg", className: "bg-positive-bg" },
      { token: "warning", className: "bg-warning" },
      { token: "warning-bg", className: "bg-warning-bg" },
      { token: "negative", className: "bg-negative" },
      { token: "negative-bg", className: "bg-negative-bg" },
      { token: "info", className: "bg-info" },
      { token: "info-bg", className: "bg-info-bg" },
    ],
  },
  {
    title: "Biểu đồ",
    swatches: [
      { token: "chart-1", className: "bg-chart-1" },
      { token: "chart-2", className: "bg-chart-2" },
      { token: "chart-3", className: "bg-chart-3" },
      { token: "chart-4", className: "bg-chart-4" },
      { token: "chart-5", className: "bg-chart-5" },
      { token: "chart-6", className: "bg-chart-6" },
      { token: "chart-7", className: "bg-chart-7" },
      { token: "chart-8", className: "bg-chart-8" },
    ],
  },
];

const typeScale = [
  { token: "text-hero", spec: "36px · 1.2 · 700 · brand", className: "font-brand text-hero font-bold tracking-tight", sample: "Xác minh người thật" },
  { token: "text-display", spec: "24px · 1.2 · 600 · brand", className: "font-brand text-display font-semibold tracking-tight", sample: "Tổng quan lượt xác minh" },
  { token: "text-title", spec: "20px · 1.2 · 600", className: "text-title font-semibold", sample: "Tạo khóa API" },
  { token: "text-section", spec: "16px · 1.35 · 500", className: "text-section font-medium", sample: "Cài đặt bảo mật" },
  { token: "text-heading", spec: "16px · 1.35 · 500", className: "text-heading font-medium", sample: "Khóa đang hoạt động" },
  { token: "text-prose", spec: "16px · 1.7 · 450", className: "text-prose", sample: "Mỗi challenge chỉ được thử một lần và hết hạn sau 120 giây." },
  { token: "text-body", spec: "14px · 1.625 · 450", className: "text-body", sample: "Site key dùng ở frontend, secret key dùng ở backend." },
  { token: "text-button", spec: "14px · 1.25 · 500", className: "text-button font-medium", sample: "Lưu thay đổi" },
  { token: "text-overline", spec: "12px · 1.34 · 500", className: "text-overline font-medium", sample: "Cập nhật 2 phút trước" },
  { token: "font-mono", spec: "Geist Mono · 14px", className: "font-mono text-body", sample: "pk_26b842dfa84e187d45bfe736" },
];

const radii = [
  { token: "rounded-sm", value: "4px", className: "rounded-sm" },
  { token: "rounded-md", value: "6px", className: "rounded-md" },
  { token: "rounded-lg", value: "8px", className: "rounded-lg" },
  { token: "rounded-xl", value: "12px", className: "rounded-xl" },
  { token: "rounded-full", value: "9999px", className: "rounded-full" },
];

const elevations = [
  { token: "shadow-sm", note: "Tab segmented, thumb switch", className: "shadow-sm" },
  { token: "shadow-md", note: "Popup, menu, tooltip", className: "shadow-md" },
  { token: "shadow-lg", note: "Dialog, toast", className: "shadow-lg" },
  { token: "shadow-focus", note: "Focus: viền 30% + quầng 3px", className: "border-focus-border shadow-focus" },
  { token: "shadow-error", note: "Focus khi không hợp lệ", className: "border-error-border shadow-error" },
];

export function FoundationsSection() {
  return (
    <DemoSection
      id="foundations"
      title="Nền tảng"
      description="Token màu, chữ, bo góc và độ nổi. Mọi component chỉ dùng các token này, nên đổi giao diện sáng/tối là tự động."
    >
      <DemoBlock title="Màu sắc">
        <div className="grid gap-6">
          {colorGroups.map((group) => (
            <div key={group.title} className="grid gap-3">
              <p className="text-overline font-medium text-muted-foreground">{group.title}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
                {group.swatches.map((swatch) => (
                  <div key={swatch.token} className="grid gap-1.5">
                    <div className={cn("h-12 rounded-md border border-border", swatch.className)} />
                    <code className="truncate font-mono text-overline text-foreground">{swatch.token}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="Typography" description="Plus Jakarta Sans (chữ thân 450) và Geist Mono. Luôn dùng thang ngữ nghĩa thay cho text-sm/base/lg.">
        <div className="divide-y divide-border">
          {typeScale.map((row) => (
            <div key={row.token} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-6">
              <div className="grid">
                <code className="font-mono text-overline text-foreground">{row.token}</code>
                <span className="text-overline text-muted-foreground">{row.spec}</span>
              </div>
              <p className={cn("truncate text-foreground", row.className)}>{row.sample}</p>
            </div>
          ))}
        </div>
      </DemoBlock>

      <div className="grid gap-8 lg:grid-cols-2">
        <DemoBlock title="Bo góc">
          <div className="flex flex-wrap gap-5">
            {radii.map((radius) => (
              <div key={radius.token} className="grid justify-items-center gap-2">
                <div className={cn("size-16 border border-accent-border bg-accent", radius.className)} />
                <code className="font-mono text-overline text-foreground">{radius.token}</code>
                <span className="-mt-2 text-overline text-muted-foreground">{radius.value}</span>
              </div>
            ))}
          </div>
        </DemoBlock>
        <DemoBlock title="Độ nổi & focus">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {elevations.map((item) => (
              <div
                key={item.token}
                className={cn("grid gap-0.5 rounded-lg border border-border bg-popover p-3", item.className)}
              >
                <code className="font-mono text-overline text-foreground">{item.token}</code>
                <span className="text-overline text-muted-foreground">{item.note}</span>
              </div>
            ))}
          </div>
        </DemoBlock>
      </div>
    </DemoSection>
  );
}

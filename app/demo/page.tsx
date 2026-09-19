import type { Metadata } from "next";
import { AppShellSection } from "./_components/sections/app-shell";
import { AuthSection } from "./_components/sections/auth";
import { DemoShell, type DemoNavItem } from "./_components/demo-shell";
import { ButtonsSection } from "./_components/sections/buttons";
import { DatesSection } from "./_components/sections/dates";
import { DisplaySection } from "./_components/sections/display";
import { FeedbackSection } from "./_components/sections/feedback";
import { FormExampleSection } from "./_components/sections/form-example";
import { FoundationsSection } from "./_components/sections/foundations";
import { InputsSection } from "./_components/sections/inputs";
import { NavigationSection } from "./_components/sections/navigation";
import { OverlaysSection } from "./_components/sections/overlays";
import { SelectionSection } from "./_components/sections/selection";
import { TablesSection } from "./_components/sections/tables";

export const metadata: Metadata = {
  title: "Component demo",
  description: "Trưng bày toàn bộ component giao diện của WAU Dashboard.",
};

const nav: DemoNavItem[] = [
  { id: "foundations", label: "Nền tảng" },
  { id: "app-shell", label: "Khung ứng dụng" },
  { id: "auth", label: "Đăng nhập" },
  { id: "buttons", label: "Nút" },
  { id: "inputs", label: "Nhập liệu" },
  { id: "dates", label: "Ngày tháng" },
  { id: "selection", label: "Lựa chọn" },
  { id: "form", label: "Form mẫu" },
  { id: "display", label: "Hiển thị" },
  { id: "navigation", label: "Tabs & phân trang" },
  { id: "tables", label: "Bảng dữ liệu" },
  { id: "overlays", label: "Lớp nổi" },
  { id: "toast", label: "Thông báo" },
];

/** Living style guide: every component in components/ui. Keep it in sync when components change. */
export default function DemoPage() {
  return (
    <DemoShell nav={nav}>
      <div className="grid gap-3 pb-4">
        <h1 className="font-brand text-hero font-bold tracking-tight text-foreground">Bộ component giao diện</h1>
        <p className="max-w-2xl text-prose text-muted-foreground">
          Toàn bộ component trong <code className="font-mono text-body text-foreground">components/ui</code>, dựng theo{" "}
          <code className="font-mono text-body text-foreground">DESIGN.md</code> (phong cách openrouter.ai). Đổi giao diện
          sáng/tối ở góc trên bên phải; mọi ví dụ đều tương tác được.
        </p>
      </div>
      <FoundationsSection />
      <AppShellSection />
      <AuthSection />
      <ButtonsSection />
      <InputsSection />
      <DatesSection />
      <SelectionSection />
      <FormExampleSection />
      <DisplaySection />
      <NavigationSection />
      <TablesSection />
      <OverlaysSection />
      <FeedbackSection />
    </DemoShell>
  );
}

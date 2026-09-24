import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AppHeader } from "@/components/ui/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DescriptionList } from "@/components/ui/description-list";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { PageHeader } from "@/components/ui/page-header";
import { formatDateTime } from "@/lib/format";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";

const snippet = `const response = await fetch(
  "http://127.0.0.1:8080/challenge/new?site_key=pk_2f1c…",
);
const challenge = await response.json();`;

export function AppShellSection() {
  return (
    <DemoSection
      id="app-shell"
      title="Khung ứng dụng"
      description="Thanh điều hướng, tiêu đề trang, danh sách thông tin và khối mã dùng chung cho mọi trang nghiệp vụ."
    >
      <DemoBlock
        title="AppHeader + Logo + NavLink"
        description="Luôn một hàng. Dưới lg, điều hướng và phần cài đặt (settings) chuyển vào menu mở từ nút ☰; actions luôn ở trên thanh."
        contentClassName="p-0 overflow-hidden"
      >
        <AppHeader
          className="static"
          brand={<Logo href="/demo" />}
          nav={
            <>
              <NavLink href="/overview">Tổng quan</NavLink>
              <NavLink href="/keys">Khóa API</NavLink>
              <NavLink href="/demo">Demo</NavLink>
            </>
          }
          settings={<ThemeToggle />}
        />
      </DemoBlock>

      <DemoBlock title="PageHeader" description="Tiêu đề, mô tả, badge trạng thái và hành động chính.">
        <PageHeader
          title="Khóa API"
          description="Tạo và quản lý khóa dùng cho trang của bạn."
          actions={<Button startIcon={<Plus />}>Tạo khóa API</Button>}
        >
          <Badge tone="positive" dot>
            Hoạt động
          </Badge>
        </PageHeader>
      </DemoBlock>

      <div className="grid gap-8 lg:grid-cols-2">
        <DemoBlock title="DescriptionList" description="Cặp nhãn – giá trị cho trang chi tiết.">
          <DemoLabel>columns=2</DemoLabel>
          <DescriptionList
            items={[
              { label: "Tên hiển thị", value: "John Doe" },
              { label: "Email", value: "john@example.com" },
              { label: "Gói", value: <Badge>Free</Badge> },
              { label: "Ngày tạo", value: formatDateTime(new Date("2026-09-01T09:12:00+07:00")) },
            ]}
          />
        </DemoBlock>

        <DemoBlock title="CodeBlock" description="Đoạn mã tích hợp, cuộn ngang và sao chép được.">
          <CodeBlock code={snippet} language="javascript" />
        </DemoBlock>
      </div>
    </DemoSection>
  );
}

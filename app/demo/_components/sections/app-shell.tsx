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

/** The sample of the reference screenshot the CodeBlock look is taken from, to compare the two. */
const snippet = `import React from 'react';

export default function Movie({
  title,
  genre,
  description,
  price,
  onBuy
}) {
  return (
    <div className="movie">
      <div className="details">
        <h1>
          {title}
          <span className="price">{price}</span>
        </h1>
        <p className="description">{description}</p>
        <span className="genre">{genre}</span>
      </div>
      <div>
        <button onClick={onBuy}>Buy!</button>
      </div>
    </div>
  );
}`;

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

      {/* Full width, and the window as wide as its code, as in the reference screenshot. */}
      <DemoBlock
        title="CodeBlock"
        description="Cửa sổ mã: tô màu cú pháp theo language (tên ngôn ngữ hoặc tên file), số dòng, cuộn ngang và sao chép được."
      >
        <CodeBlock code={snippet} language="tsx" className="w-fit max-w-full" />
      </DemoBlock>
    </DemoSection>
  );
}

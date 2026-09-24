"use client";

import { ChartColumn, KeyRound, Settings } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useFormatter } from "@/components/ui/locale";
import { Pagination } from "@/components/ui/pagination";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";

const ranges = [
  { value: "24h", label: "24 giờ", requests: 4812 },
  { value: "7d", label: "7 ngày", requests: 33210 },
  { value: "30d", label: "30 ngày", requests: 142871 },
  { value: "90d", label: "90 ngày", requests: 402118 },
];

type Density = "compact" | "regular" | "expanded";

const densityOptions: SegmentedOption<Density>[] = [
  { value: "compact", label: "Gọn" },
  { value: "regular", label: "Vừa" },
  { value: "expanded", label: "Rộng" },
];

export function NavigationSection() {
  const format = useFormatter();
  const [density, setDensity] = useState<Density>("regular");
  const [range, setRange] = useState("7d");
  const [page, setPage] = useState(4);
  const [pageSize, setPageSize] = useState(20);
  const [smallPage, setSmallPage] = useState(1);
  const current = ranges.find((item) => item.value === range) ?? ranges[1];

  return (
    <DemoSection id="navigation" title="Tabs & phân trang">
      <DemoBlock title="Tabs underline" description="Điều hướng giữa các phần của một trang. Dùng ← → để chuyển tab.">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTab value="overview">
              <ChartColumn />
              Tổng quan
            </TabsTab>
            <TabsTab value="keys">
              <KeyRound />
              Khóa API
            </TabsTab>
            <TabsTab value="settings">
              <Settings />
              Cài đặt
            </TabsTab>
            <TabsTab value="billing" disabled>
              Thanh toán
            </TabsTab>
          </TabsList>
          <TabsPanel value="overview" className="text-body text-muted-foreground">
            Biểu đồ lượt xác minh và tỉ lệ thành công theo thời gian.
          </TabsPanel>
          <TabsPanel value="keys" className="text-body text-muted-foreground">
            Danh sách site key / secret key của tài khoản.
          </TabsPanel>
          <TabsPanel value="settings" className="text-body text-muted-foreground">
            TTL challenge, loại challenge mặc định và thông báo.
          </TabsPanel>
        </Tabs>
      </DemoBlock>

      <DemoBlock title="Tabs segmented" description="Chuyển chế độ xem hoặc khoảng thời gian gọn trong thanh công cụ.">
        <div className="flex flex-wrap items-center gap-4">
          <Tabs variant="segmented" value={range} onValueChange={setRange}>
            <TabsList>
              {ranges.map((item) => (
                <TabsTab key={item.value} value={item.value}>
                  {item.label}
                </TabsTab>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-body text-muted-foreground">
            {current.label}: <span className="font-medium text-foreground">{format.number(current.requests)}</span> lượt xác
            minh
          </p>
        </div>
      </DemoBlock>

      <DemoBlock
        title="SegmentedControl"
        description="Một lựa chọn trong vài lựa chọn luôn hiển thị; ThemeToggle và LanguageSwitcher dựng trên nó. Mũi tên để di chuyển."
      >
        <div className="flex flex-wrap items-start gap-6">
          <div>
            <DemoLabel>Chữ · {density}</DemoLabel>
            <SegmentedControl aria-label="Mật độ bảng" options={densityOptions} value={density} onValueChange={setDensity} />
          </div>
          <div>
            <DemoLabel>ThemeToggle</DemoLabel>
            <ThemeToggle />
          </div>
          <div>
            <DemoLabel>LanguageSwitcher (đổi ngôn ngữ thật)</DemoLabel>
            <LanguageSwitcher />
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="Pagination" description="Số nút trang cố định để thanh không nhảy khi chuyển trang." contentClassName="grid gap-5">
        <div>
          <DemoLabel>1.234 bản ghi · có chọn số dòng</DemoLabel>
          <div className="rounded-lg border border-border">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={1234}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div>
          <DemoLabel>45 bản ghi · ít trang</DemoLabel>
          <div className="rounded-lg border border-border">
            <Pagination page={smallPage} pageSize={10} total={45} onPageChange={setSmallPage} />
          </div>
        </div>
      </DemoBlock>

      <DemoBlock
        title="Table of contents"
        description="Liên kết tới các phần của trang, tô sáng phần đang đọc khi cuộn. Dưới lg thu gọn sau một nút. Cột bên trái của trang này cũng là nó."
      >
        <TableOfContents
          label="Trên trang này"
          items={[
            { id: "foundations", title: "Nền tảng" },
            { id: "buttons", title: "Nút" },
            { id: "navigation", title: "Tabs & phân trang" },
            { id: "tables", title: "Bảng dữ liệu" },
          ]}
        />
      </DemoBlock>
    </DemoSection>
  );
}

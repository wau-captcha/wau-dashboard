"use client";

import { ChartColumn, KeyRound, Settings } from "lucide-react";
import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/format";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";

const ranges = [
  { value: "24h", label: "24 giờ", requests: 4812 },
  { value: "7d", label: "7 ngày", requests: 33210 },
  { value: "30d", label: "30 ngày", requests: 142871 },
  { value: "90d", label: "90 ngày", requests: 402118 },
];

export function NavigationSection() {
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
            {current.label}: <span className="font-medium text-foreground">{formatNumber(current.requests)}</span> lượt xác
            minh
          </p>
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
    </DemoSection>
  );
}

"use client";

import { Bell, Download, Ellipsis, ExternalLink, Plus, RefreshCw, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Tooltip } from "@/components/ui/tooltip";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";

export function ButtonsSection() {
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  }

  return (
    <DemoSection
      id="buttons"
      title="Nút"
      description="Mỗi vùng chỉ một nút primary; hành động phụ dùng outline/ghost; hành động phá hủy dùng destructive-outline rồi xác nhận."
    >
      <DemoBlock title="Kiểu (variant)">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="destructive-outline">Destructive outline</Button>
          <Button variant="link">Link</Button>
        </div>
      </DemoBlock>

      <DemoBlock title="Kích thước" description="Cùng size với control nên xếp chung một hàng luôn thẳng.">
        <div className="grid gap-5">
          <div>
            <DemoLabel>xs 28px · sm 32px · md 40px · lg 44px</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          <div>
            <DemoLabel>Chỉ có icon · icon-xs · icon-sm · icon (luôn kèm aria-label và Tooltip)</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip content="Thông báo">
                <Button variant="outline" size="icon-xs" aria-label="Thông báo">
                  <Bell />
                </Button>
              </Tooltip>
              <Tooltip content="Cài đặt">
                <Button variant="outline" size="icon-sm" aria-label="Cài đặt">
                  <Settings />
                </Button>
              </Tooltip>
              <Tooltip content="Tạo mới">
                <Button size="icon" aria-label="Tạo mới">
                  <Plus />
                </Button>
              </Tooltip>
              <Tooltip content="Thao tác khác">
                <Button variant="ghost" size="icon-sm" aria-label="Thao tác khác">
                  <Ellipsis />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="Icon, trạng thái và liên kết">
        <div className="grid gap-5">
          <div>
            <DemoLabel>startIcon / endIcon</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Button startIcon={<Plus />}>Tạo khóa API</Button>
              <Button variant="outline" startIcon={<Download />}>
                Xuất CSV
              </Button>
              <Button variant="destructive-outline" startIcon={<Trash2 />}>
                Thu hồi khóa
              </Button>
              <Button variant="ghost" endIcon={<ExternalLink />}>
                Tài liệu API
              </Button>
            </div>
          </div>
          <div>
            <DemoLabel>loading (bấm để thử) · disabled</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Button loading={saving} onClick={save}>
                {saving ? "Đang lưu…" : "Lưu thay đổi"}
              </Button>
              <Button variant="outline" loading={saving} startIcon={<RefreshCw />} onClick={save}>
                Làm mới
              </Button>
              <Button variant="outline" size="icon" aria-label="Làm mới" loading={saving} onClick={save}>
                <RefreshCw />
              </Button>
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
            </div>
          </div>
          <div>
            <DemoLabel>buttonVariants() cho thẻ không phải &lt;button&gt; · CopyButton</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <a href="#buttons" className={buttonVariants({ variant: "outline" })}>
                Liên kết dạng nút
              </a>
              <a href="#buttons" className={buttonVariants({ variant: "link" })}>
                Liên kết văn bản
              </a>
              <CopyButton value="pk_26b842dfa84e187d45bfe73655182748471351d8ecb93b36" variant="outline" size="icon" />
              <CopyButton value="pk_26b842dfa84e187d45bfe73655182748471351d8ecb93b36" variant="outline" size="md">
                Sao chép site key
              </CopyButton>
            </div>
          </div>
        </div>
      </DemoBlock>
    </DemoSection>
  );
}

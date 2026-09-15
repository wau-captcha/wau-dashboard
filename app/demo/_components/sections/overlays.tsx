"use client";

import {
  Bell,
  Copy,
  Download,
  Ellipsis,
  Info,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  Settings,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  ConfirmDialog,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SecretValue } from "@/components/ui/secret-value";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";
import { apiKeys, challengeTypeOptions, delay } from "../mock-data";

const terms = [
  "WAU Captcha cung cấp dịch vụ phân biệt người thật và bot cho website của bạn thông qua site key và secret key.",
  "Site key được nhúng công khai ở frontend; secret key chỉ được dùng ở backend và không được chia sẻ.",
  "Mỗi challenge chỉ được thử một lần và hết hạn sau 120 giây kể từ khi tạo.",
  "Token xác minh chỉ dùng được một lần, gắn với đúng khóa API đã tạo ra challenge.",
  "Gói Free dùng loại image_distort; gói Premium mở khóa motion_noise và các loại nâng cao.",
  "Nhật ký sử dụng được lưu để thống kê lượt xác minh và phát hiện lạm dụng.",
  "Bạn chịu trách nhiệm bảo mật secret key; hãy tạo lại ngay khi nghi ngờ bị lộ.",
  "Khóa bị thu hồi sẽ ngừng hoạt động ngay lập tức và không thể khôi phục.",
  "Chúng tôi có thể tạm dừng khóa có dấu hiệu gửi yêu cầu bất thường với số lượng lớn.",
  "Hạn mức hằng tháng được tính theo số lần kiểm tra đáp án, không tính số challenge được tạo.",
  "Thay đổi điều khoản sẽ được thông báo qua email ít nhất 30 ngày trước khi áp dụng.",
  "Tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các điều khoản trên.",
];

export function OverlaysSection() {
  const [createOpen, setCreateOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({ owner: true, tier: true, createdAt: false });
  const key = apiKeys[0];

  const columnLabels: Record<keyof typeof visibleColumns, string> = {
    owner: "Chủ sở hữu",
    tier: "Gói",
    createdAt: "Ngày tạo",
  };

  return (
    <DemoSection
      id="overlays"
      title="Lớp nổi"
      description="Dialog, xác nhận, menu, popover và tooltip. Đều giữ focus bên trong, đóng bằng Esc và điều khiển được bằng bàn phím."
    >
      <DemoBlock title="Dialog" description="size sm · md · lg; nội dung dài tự cuộn bên trong hộp thoại.">
        <div className="flex flex-wrap gap-2">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button startIcon={<Plus />} />}>Tạo khóa API</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo khóa API</DialogTitle>
                <DialogDescription>Khóa mới dùng gói hiện tại của tài khoản. Secret key chỉ hiển thị một lần.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <Field label="Tên website">
                  <TextInput placeholder="shop.example.com" />
                </Field>
                <Field label="Loại challenge mặc định" nativeLabel={false}>
                  <Select options={challengeTypeOptions} defaultValue="image_distort" />
                </Field>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
                <Button
                  onClick={() => {
                    setCreateOpen(false);
                    toast.success("Đã tạo khóa API");
                  }}
                >
                  Tạo khóa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger render={<Button variant="outline" startIcon={<KeyRound />} />}>Chi tiết khóa (sm)</DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>{key.name}</DialogTitle>
                <DialogDescription>Gói Premium · đang hoạt động.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <span className="text-overline font-medium text-muted-foreground">Site key</span>
                  <SecretValue value={key.siteKey} />
                </div>
                <div className="grid gap-1.5">
                  <span className="text-overline font-medium text-muted-foreground">Secret key</span>
                  <SecretValue value={key.secretKey} masked />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Điều khoản (lg, cuộn)</DialogTrigger>
            <DialogContent size="lg">
              <DialogHeader>
                <DialogTitle>Điều khoản sử dụng</DialogTitle>
                <DialogDescription>Cập nhật lần cuối ngày 15/09/2026.</DialogDescription>
              </DialogHeader>
              <ol className="grid list-decimal gap-3 pl-5 text-body text-muted-foreground">
                {terms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ol>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Đóng</DialogClose>
                <DialogClose render={<Button />}>Tôi đồng ý</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DemoBlock>

      <DemoBlock
        title="ConfirmDialog"
        description="Nút xác nhận hiện spinner trong lúc xử lý và đóng khi xong; không đóng khi bấm ra ngoài."
      >
        <div className="flex flex-wrap gap-2">
          <ConfirmDialog
            trigger={
              <Button variant="destructive-outline" startIcon={<Trash2 />}>
                Thu hồi khóa
              </Button>
            }
            title="Thu hồi khóa API?"
            description={`Website ${key.name} sẽ không xác minh được captcha nữa. Không thể hoàn tác.`}
            confirmLabel="Thu hồi"
            tone="destructive"
            onConfirm={async () => {
              await delay(1000);
              toast.success("Đã thu hồi khóa API");
            }}
          />
          <ConfirmDialog
            trigger={<Button variant="outline">Tạo lại secret key</Button>}
            title="Tạo lại secret key?"
            description="Secret key cũ ngừng hoạt động ngay. Hãy chuẩn bị cập nhật backend trước khi xác nhận."
            confirmLabel="Tạo lại"
            onConfirm={async () => {
              await delay(800);
              toast.success("Đã tạo secret key mới");
            }}
          >
            <Alert tone="warning" title="Ảnh hưởng tới backend">
              Các yêu cầu /siteverify dùng secret key cũ sẽ trả về SECRET_KEY_INVALID.
            </Alert>
          </ConfirmDialog>
        </div>
      </DemoBlock>

      <DemoBlock title="DropdownMenu" description="Mũi tên để di chuyển, gõ chữ cái đầu để nhảy tới mục, Enter để chọn.">
        <div className="flex flex-wrap items-start gap-6">
          <div>
            <DemoLabel>Menu tài khoản</DemoLabel>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" startIcon={<User />} />}>john_doe</DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => toast("Mở hồ sơ")}>
                    <User /> Hồ sơ
                    <DropdownMenuShortcut>Ctrl P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Mở khóa API")}>
                    <KeyRound /> Khóa API
                    <DropdownMenuShortcut>Ctrl K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Mở cài đặt")}>
                    <Settings /> Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Bell /> Thanh toán (sắp có)
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => toast("Đã đăng xuất")}>
                  <LogOut /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <DemoLabel>Checkbox item</DemoLabel>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>Cột hiển thị</DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel inset>Hiển thị cột</DropdownMenuLabel>
                  {(Object.keys(columnLabels) as (keyof typeof visibleColumns)[]).map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column}
                      checked={visibleColumns[column]}
                      onCheckedChange={(checked) => setVisibleColumns((current) => ({ ...current, [column]: checked }))}
                    >
                      {columnLabels[column]}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="mt-2 text-overline text-muted-foreground">
              Đang hiện:{" "}
              {(Object.keys(columnLabels) as (keyof typeof visibleColumns)[])
                .filter((column) => visibleColumns[column])
                .map((column) => columnLabels[column])
                .join(", ") || "không cột nào"}
            </p>
          </div>

          <div>
            <DemoLabel>Thao tác cuối dòng</DemoLabel>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Thao tác" />}>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => toast("Sửa khóa")}>
                  <Pencil /> Sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Đã sao chép site key")}>
                  <Copy /> Sao chép site key
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Đang tải cấu hình")}>
                  <Download /> Tải cấu hình
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => toast.success("Đã thu hồi khóa")}>
                  <Trash2 /> Thu hồi khóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DemoBlock>

      <div className="grid gap-8 lg:grid-cols-2">
        <DemoBlock title="Popover" description="Nội dung tương tác nhỏ neo theo nút.">
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger render={<Button variant="outline" startIcon={<Users />} />}>Mời thành viên</PopoverTrigger>
              <PopoverContent align="start" className="w-80">
                <PopoverHeader>
                  <PopoverTitle>Mời thành viên</PopoverTitle>
                  <PopoverDescription>Thành viên được xem khóa API và nhật ký sử dụng.</PopoverDescription>
                </PopoverHeader>
                <div className="grid gap-3">
                  <Field label="Email">
                    <TextInput type="email" placeholder="ban@congty.vn" />
                  </Field>
                  <div className="flex justify-end gap-2">
                    <PopoverClose render={<Button size="sm" variant="ghost" />}>Hủy</PopoverClose>
                    <PopoverClose render={<Button size="sm" onClick={() => toast.success("Đã gửi lời mời")} />}>
                      Gửi lời mời
                    </PopoverClose>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <span className="inline-flex items-center gap-1 text-body text-muted-foreground">
              TTL challenge
              <Popover>
                <PopoverTrigger render={<Button variant="ghost" size="icon-xs" aria-label="TTL là gì?" />}>
                  <Info />
                </PopoverTrigger>
                <PopoverContent side="top" className="w-64">
                  <p className="text-body text-muted-foreground">
                    <span className="font-medium text-foreground">TTL</span> là thời gian challenge còn hiệu lực. Hết TTL,
                    người dùng phải tải challenge mới.
                  </p>
                </PopoverContent>
              </Popover>
            </span>
          </div>
        </DemoBlock>

        <DemoBlock title="Tooltip" description="Gợi ý ngắn khi hover hoặc focus bằng bàn phím.">
          <div className="flex flex-wrap items-center gap-2">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <Tooltip key={side} side={side} content={`Tooltip phía ${side}`}>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </Tooltip>
            ))}
            <Tooltip content="Thông báo mới">
              <Button variant="ghost" size="icon-sm" aria-label="Thông báo">
                <Bell />
              </Button>
            </Tooltip>
            <CopyButton value={key.siteKey} label="Sao chép site key" />
          </div>
        </DemoBlock>
      </div>
    </DemoSection>
  );
}

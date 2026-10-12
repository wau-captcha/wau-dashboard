import { Activity, Clock, KeyRound, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  StatCard,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Kbd } from "@/components/ui/kbd";
import { SecretValue } from "@/components/ui/secret-value";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { getI18n } from "@/lib/i18n/server";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";
import { apiKeys, keyStatusMeta } from "../mock-data";

const challengeCards = [
  { id: "image_distort", description: "Ảnh chữ bị bóp méo, xoay và nhiễu. Nhẹ, phù hợp mọi trang.", tier: "Free" },
  { id: "motion_noise", description: "GIF lặp lại, chữ chỉ hiện ra nhờ chuyển động của các chấm.", tier: "Premium" },
  { id: "slide_puzzle", description: "Kéo mảnh ghép vào đúng vị trí trên ảnh nền.", tier: "Premium" },
  { id: "animal_jump", description: "Bấm vào con vật nhảy cao nhất, qua hai lượt.", tier: "Free" },
  { id: "object_rotate", description: "Xoay vật thể cho mặt trước hướng theo mũi tên, qua hai lượt.", tier: "Free" },
];

export async function DisplaySection() {
  const { format } = await getI18n();
  const key = apiKeys[0];

  return (
    <DemoSection id="display" title="Hiển thị" description="Badge, Alert, Card, chỉ số, khóa bí mật, trạng thái rỗng và trạng thái chờ.">
      <DemoBlock title="Badge">
        <div className="grid gap-5">
          <div>
            <DemoLabel>tone</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Neutral</Badge>
              <Badge tone="primary">Primary</Badge>
              <Badge tone="info">Info</Badge>
              <Badge tone="positive">Positive</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="negative">Negative</Badge>
              <Badge tone="outline">Outline</Badge>
            </div>
          </div>
          <div>
            <DemoLabel>size sm · dot · icon</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm" tone="info">
                MỚI
              </Badge>
              <Badge size="sm" tone="positive">
                +12,4%
              </Badge>
              <Badge tone="positive" dot>
                Trực tuyến
              </Badge>
              <Badge tone="primary">
                <Zap />
                Premium
              </Badge>
              <Badge tone="outline">
                <Clock />
                120 giây
              </Badge>
            </div>
          </div>
          <div>
            <DemoLabel>Quy ước dữ liệu WAU (DESIGN.md §13)</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">Premium</Badge>
              <Badge>Free</Badge>
              {Object.values(keyStatusMeta).map((meta) => (
                <Badge key={meta.label} tone={meta.tone} dot>
                  {meta.label}
                </Badge>
              ))}
              <Badge tone="positive">Thành công</Badge>
              <Badge tone="negative">Thất bại</Badge>
            </div>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="Alert" description="Thông báo nằm trong nội dung trang. Phản hồi tạm thời sau hành động dùng toast.">
        <div className="grid gap-3">
          <Alert title="Secret key chỉ hiển thị một lần">Hãy lưu lại trước khi đóng hộp thoại.</Alert>
          <Alert tone="positive" title="Đã tạo khóa API" />
          <Alert
            tone="warning"
            title="Sắp hết hạn mức"
            action={
              <Button size="sm" variant="outline">
                Nâng cấp
              </Button>
            }
          >
            Đã dùng 92% lượt xác minh trong tháng.
          </Alert>
          <Alert tone="negative" title="Không xác minh được token">
            Mã lỗi <code className="font-mono text-foreground">SECRET_KEY_INVALID</code> — kiểm tra secret key ở backend.
          </Alert>
          <Alert tone="neutral" icon={null} title="Không có icon">
            Dùng icon={"{null}"} khi thông báo đã có ngữ cảnh rõ ràng.
          </Alert>
        </div>
      </DemoBlock>

      <DemoBlock title="StatCard" contentClassName="bg-background">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Lượt xác minh (30 ngày)"
            value={format.number(142871)}
            icon={<Activity />}
            hint={
              <Badge tone="positive" size="sm">
                +12,4% so với kỳ trước
              </Badge>
            }
          />
          <StatCard label="Tỉ lệ thành công" value={format.percent(0.972)} icon={<ShieldCheck />} hint="Trung bình 30 ngày" />
          <StatCard label="Khóa đang hoạt động" value="5" icon={<KeyRound />} hint="trên 8 khóa" />
          <StatCard
            label="Thời gian phản hồi"
            value="84 ms"
            icon={<Clock />}
            hint={
              <Badge tone="negative" size="sm">
                +6 ms
              </Badge>
            }
          />
        </div>
      </DemoBlock>

      <DemoBlock title="Card" contentClassName="bg-background">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="min-w-0">
                <CardTitle>{key.name}</CardTitle>
                <CardDescription>Site key dùng ở frontend, secret key dùng ở backend.</CardDescription>
              </div>
              <Badge tone={keyStatusMeta[key.status].tone} dot>
                {keyStatusMeta[key.status].label}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-1.5">
                <span className="text-overline font-medium text-muted-foreground">Site key</span>
                <SecretValue value={key.siteKey} aria-label="Site key" />
              </div>
              <div className="grid gap-1.5">
                <span className="text-overline font-medium text-muted-foreground">Secret key</span>
                <SecretValue value={key.secretKey} masked aria-label="Secret key" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button size="sm" variant="ghost">
                Nhật ký
              </Button>
              <Button size="sm" variant="outline">
                Cài đặt
              </Button>
            </CardFooter>
          </Card>
          <div className="grid gap-3">
            {challengeCards.map((challenge) => (
              <Card key={challenge.id} interactive className="flex-row items-start gap-3 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                  <Sparkles className="size-4" />
                </span>
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <code className="font-mono text-body font-medium text-foreground">{challenge.id}</code>
                    <Badge size="sm" tone={challenge.tier === "Premium" ? "primary" : "neutral"}>
                      {challenge.tier}
                    </Badge>
                  </div>
                  <p className="text-body text-muted-foreground">{challenge.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DemoBlock>

      <div className="grid gap-8 lg:grid-cols-2">
        <DemoBlock title="EmptyState" contentClassName="p-0">
          <EmptyState
            icon={<KeyRound />}
            title="Chưa có khóa API"
            description="Tạo khóa đầu tiên để tích hợp WAU Captcha vào website."
            action={
              <>
                <Button size="sm">Tạo khóa API</Button>
                <Button size="sm" variant="outline">
                  Xem hướng dẫn
                </Button>
              </>
            }
          />
        </DemoBlock>
        <DemoBlock title="Skeleton">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-9 w-full" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        </DemoBlock>
      </div>

      <DemoBlock title="Spinner · Kbd · Separator">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Spinner className="size-3.5" />
            <Spinner />
            <Spinner className="size-6 text-accent-foreground" />
            <span className="inline-flex items-center gap-2 text-body">
              <Spinner label="Đang tải dữ liệu" /> Đang tải dữ liệu…
            </span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1 text-body text-muted-foreground">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
            <span className="ml-2">mở tìm kiếm</span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1 text-body text-muted-foreground">
            <Kbd>Alt</Kbd>
            <Kbd>↓</Kbd>
            <span className="ml-2">mở lịch</span>
          </div>
        </div>
        <Separator className="my-4" />
        <p className="text-body text-muted-foreground">Separator ngang ở trên, dọc giữa các nhóm.</p>
      </DemoBlock>
    </DemoSection>
  );
}

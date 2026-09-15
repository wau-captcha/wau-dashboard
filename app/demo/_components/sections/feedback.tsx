"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";
import { delay } from "../mock-data";

function showLoadingThenSuccess() {
  const id = toast.loading("Đang tạo khóa API…");
  setTimeout(() => toast.success("Đã tạo khóa API", { id, description: "shop.example.com" }), 1800);
}

function showPromise(succeed: boolean) {
  const task = delay(1500).then(() => {
    if (!succeed) throw new Error("503 Service Unavailable");
    return "shop.example.com";
  });
  toast
    .promise(task, {
      loading: "Đang lưu cấu hình…",
      success: (site) => `Đã lưu cấu hình cho ${site}`,
      error: (error) => `Không thể lưu: ${error instanceof Error ? error.message : "lỗi không xác định"}`,
    })
    .catch(() => {
      // Already reported by the error toast.
    });
}

export function FeedbackSection() {
  return (
    <DemoSection
      id="toast"
      title="Thông báo"
      description="toast cho phản hồi tạm thời sau hành động; hiện ở góc dưới bên phải, vuốt hoặc bấm × để đóng."
    >
      <DemoBlock title="Theo loại">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast.success("Đã lưu thay đổi", { description: "Cấu hình challenge đã được áp dụng." })}
          >
            Success
          </Button>
          <Button variant="outline" onClick={() => toast.error("Không thể thu hồi khóa", { description: "SECRET_KEY_INVALID" })}>
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.warning("Sắp hết hạn mức", { description: "Đã dùng 92% lượt xác minh trong tháng." })}
          >
            Warning
          </Button>
          <Button variant="outline" onClick={() => toast.info("Có phiên bản API mới", { description: "Xem hướng dẫn nâng cấp." })}>
            Info
          </Button>
          <Button variant="outline" onClick={() => toast("Đã sao chép site key")}>
            Mặc định
          </Button>
        </div>
      </DemoBlock>

      <DemoBlock title="Hành động, thời gian và tiến trình" contentClassName="grid gap-5">
        <div>
          <DemoLabel>Nút hành động · không tự đóng</DemoLabel>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                toast("Đã thu hồi khóa API", {
                  description: "shop.johndoe.vn",
                  action: { label: "Hoàn tác", onClick: () => toast.success("Đã khôi phục khóa") },
                })
              }
            >
              Có nút Hoàn tác
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.warning("Thông báo cố định", { description: "Chỉ đóng khi bấm ×.", timeout: 0 })}
            >
              Không tự đóng
            </Button>
          </div>
        </div>
        <div>
          <DemoLabel>Loading → kết quả · toast.promise</DemoLabel>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={showLoadingThenSuccess}>
              Loading rồi thành công
            </Button>
            <Button variant="outline" onClick={() => showPromise(true)}>
              Promise thành công
            </Button>
            <Button variant="outline" onClick={() => showPromise(false)}>
              Promise thất bại
            </Button>
            <Button variant="ghost" onClick={() => toast.dismiss()}>
              Đóng tất cả
            </Button>
          </div>
        </div>
      </DemoBlock>
    </DemoSection>
  );
}

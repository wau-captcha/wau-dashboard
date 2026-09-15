"use client";

import { Globe, Mail, Search } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { NumberInput } from "@/components/ui/number-input";
import { TextInput } from "@/components/ui/text-input";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/lib/format";
import { DemoBlock, DemoSection } from "../demo-shell";

export function InputsSection() {
  const [username, setUsername] = useState("john_doe");
  const [ttl, setTtl] = useState<number | null>(120);
  const [quota, setQuota] = useState<number | null>(1500000);

  return (
    <DemoSection
      id="inputs"
      title="Nhập liệu"
      description="TextInput, Textarea và NumberInput luôn đặt trong Field để có nhãn, mô tả, thông báo lỗi và liên kết trợ năng."
    >
      <DemoBlock title="TextInput" description="Icon hoặc chữ hai bên, nút xóa, hiện/ẩn mật khẩu, hai kích thước.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên đăng nhập" description={`Giá trị hiện tại: "${username}"`}>
            <TextInput value={username} onValueChange={setUsername} clearable placeholder="john_doe" />
          </Field>
          <Field label="Tìm kiếm">
            <TextInput startAdornment={<Search />} placeholder="Tìm theo site key…" clearable />
          </Field>
          <Field label="Email">
            <TextInput type="email" startAdornment={<Mail />} placeholder="ban@congty.vn" />
          </Field>
          <Field label="Tên miền">
            <TextInput startAdornment="https://" endAdornment={<Globe />} placeholder="shop.example.com" />
          </Field>
          <Field
            label="Mật khẩu"
            labelAction={
              <a href="#inputs" className={buttonVariants({ variant: "link", size: "xs" })}>
                Quên mật khẩu?
              </a>
            }
          >
            <TextInput type="password" defaultValue="wau-captcha-2026" />
          </Field>
          <Field label="Kích thước sm" description="Cao 32px, dùng trong thanh công cụ và bộ lọc.">
            <TextInput size="sm" placeholder="Lọc nhanh…" />
          </Field>
        </div>
      </DemoBlock>

      <DemoBlock title="Trạng thái của Field">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Không hợp lệ" error="Email không đúng định dạng.">
            <TextInput type="email" defaultValue="john@" />
          </Field>
          <Field label="Bắt buộc" required description="Dấu * chỉ là hiển thị; kiểm tra dữ liệu ở form.">
            <TextInput placeholder="Nhập tên website" />
          </Field>
          <Field label="Vô hiệu" disabled>
            <TextInput defaultValue="Không thể chỉnh sửa" />
          </Field>
          <Field label="Chỉ đọc">
            <TextInput readOnly defaultValue="pk_26b842dfa84e187d45bfe73655182748471351d8ecb93b36" />
          </Field>
        </div>
      </DemoBlock>

      <DemoBlock title="Textarea">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ghi chú" description="Tối đa 500 ký tự.">
            <Textarea placeholder="Mục đích sử dụng khóa…" maxLength={500} />
          </Field>
          <Field label="Tự giãn theo nội dung" description="autoResize, tối đa 20rem.">
            <Textarea
              autoResize
              defaultValue={"Dòng 1: tích hợp vào trang đăng ký.\nDòng 2: bật motion_noise cho khách nghi vấn.\nDòng 3: gõ thêm để thấy ô giãn ra."}
            />
          </Field>
          <Field label="Không hợp lệ" error="Nội dung quá ngắn." className="sm:col-span-2">
            <Textarea defaultValue="Ok" rows={2} />
          </Field>
        </div>
      </DemoBlock>

      <DemoBlock title="NumberInput" description="Định dạng vi-VN, giới hạn min/max, bước nhảy bằng nút hoặc phím ↑/↓ (Shift ×10, Alt ×0,1).">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="TTL challenge" description={`30–600 giây · giá trị: ${ttl ?? "trống"}`}>
            <NumberInput value={ttl} onValueChange={setTtl} min={30} max={600} step={10} endAdornment="giây" />
          </Field>
          <Field label="Hạn mức tháng" description={`Giá trị thô: ${quota === null ? "trống" : formatNumber(quota)}`}>
            <NumberInput
              value={quota}
              onValueChange={setQuota}
              min={0}
              step={100000}
              format={{ style: "currency", currency: "VND" }}
            />
          </Field>
          <Field label="Ngưỡng cảnh báo">
            <NumberInput defaultValue={0.8} min={0} max={1} step={0.05} format={{ style: "percent" }} />
          </Field>
          <Field label="Không có nút tăng/giảm">
            <NumberInput defaultValue={42} hideStepper />
          </Field>
          <Field label="Kích thước sm">
            <NumberInput size="sm" defaultValue={5} min={1} max={10} />
          </Field>
          <Field label="Vô hiệu" disabled>
            <NumberInput defaultValue={10} />
          </Field>
        </div>
      </DemoBlock>
    </DemoSection>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { DateInput } from "@/components/ui/date-input";
import { Field } from "@/components/ui/field";
import { NumberInput } from "@/components/ui/number-input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TextInput } from "@/components/ui/text-input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { DemoBlock, DemoSection } from "../demo-shell";
import { challengeTypeOptions, delay, userOptions } from "../mock-data";

type FormErrors = Partial<Record<"name" | "owner" | "challengeTypes" | "agree", string>>;

export function FormExampleSection() {
  const [formKey, setFormKey] = useState(0);
  const [owner, setOwner] = useState<string | null>(null);
  const [challengeTypes, setChallengeTypes] = useState<string[]>(["image_distort"]);
  const [ttl, setTtl] = useState<number | null>(120);
  const [active, setActive] = useState(true);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function clearError(field: keyof FormErrors) {
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  function reset() {
    setFormKey((key) => key + 1);
    setOwner(null);
    setChallengeTypes(["image_distort"]);
    setTtl(120);
    setActive(true);
    setAgree(false);
    setErrors({});
    setResult(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();

    const nextErrors: FormErrors = {};
    if (!name) nextErrors.name = "Vui lòng nhập tên website.";
    if (!owner) nextErrors.owner = "Vui lòng chọn chủ sở hữu.";
    if (challengeTypes.length === 0) nextErrors.challengeTypes = "Chọn ít nhất một loại challenge.";
    if (!agree) nextErrors.agree = "Bạn cần đồng ý với điều khoản.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Form chưa hợp lệ", { description: "Kiểm tra các trường được đánh dấu đỏ." });
      return;
    }

    setSubmitting(true);
    await delay(900);
    setSubmitting(false);
    setResult(
      JSON.stringify(
        {
          name,
          domain: data.get("domain") || null,
          owner,
          challenge_types: challengeTypes,
          ttl,
          expires_at: data.get("expires_at") || null,
          note: data.get("note") || null,
          is_active: active,
        },
        null,
        2,
      ),
    );
    toast.success("Đã tạo khóa API", { description: name });
  }

  return (
    <DemoSection
      id="form"
      title="Form mẫu"
      description="Kết hợp các control trong một form thật: kiểm tra khi gửi, lỗi hiển thị dưới từng trường và tự xóa khi sửa."
    >
      <DemoBlock title="Tạo khóa API">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <form key={formKey} noValidate onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tên website" required error={errors.name}>
                <TextInput name="name" placeholder="Cửa hàng của tôi" onValueChange={() => clearError("name")} />
              </Field>
              <Field label="Tên miền" description="Không bắt buộc.">
                <TextInput name="domain" startAdornment="https://" placeholder="shop.example.com" />
              </Field>
              <Field label="Chủ sở hữu" required nativeLabel={false} error={errors.owner}>
                <Combobox
                  options={userOptions}
                  value={owner}
                  onValueChange={(value: string | null) => {
                    setOwner(value);
                    clearError("owner");
                  }}
                  placeholder="Chọn người dùng"
                />
              </Field>
              <Field label="Loại challenge" required nativeLabel={false} error={errors.challengeTypes}>
                <Select
                  multiple
                  options={challengeTypeOptions}
                  value={challengeTypes}
                  onValueChange={(value: string[]) => {
                    setChallengeTypes(value);
                    clearError("challengeTypes");
                  }}
                  placeholder="Chọn loại challenge"
                />
              </Field>
              <Field label="TTL challenge">
                <NumberInput value={ttl} onValueChange={setTtl} min={30} max={600} step={10} endAdornment="giây" />
              </Field>
              <Field label="Ngày hết hạn" description="Để trống nếu không hết hạn.">
                <DateInput name="expires_at" />
              </Field>
            </div>
            <Field label="Ghi chú">
              <Textarea name="note" placeholder="Mục đích sử dụng khóa…" autoResize />
            </Field>
            <Switch label="Kích hoạt ngay sau khi tạo" checked={active} onCheckedChange={setActive} />
            <Field error={errors.agree}>
              <Checkbox
                label="Tôi đồng ý với điều khoản sử dụng WAU Captcha"
                checked={agree}
                onCheckedChange={(checked) => {
                  setAgree(checked);
                  clearError("agree");
                }}
              />
            </Field>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" loading={submitting}>
                Tạo khóa API
              </Button>
              <Button variant="outline" onClick={reset} disabled={submitting}>
                Đặt lại
              </Button>
            </div>
          </form>
          <div className="grid content-start gap-2">
            <p className="text-overline font-medium text-muted-foreground">Dữ liệu gửi đi</p>
            <pre className="min-h-40 overflow-auto rounded-md border border-border bg-muted p-3 font-mono text-overline text-foreground scrollbar-thin">
              {result ?? "Chưa gửi form."}
            </pre>
          </div>
        </div>
      </DemoBlock>
    </DemoSection>
  );
}

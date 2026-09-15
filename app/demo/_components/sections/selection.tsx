"use client";

import { useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import type { SelectOption } from "@/components/ui/options";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";
import { challengeTypeOptions, intervalOptions, searchUsers, tierOptions, userOptions } from "../mock-data";

const channels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "webhook", label: "Webhook" },
];

const settings = [
  { label: "Ghi nhật ký sử dụng", description: "Lưu mỗi lần kiểm tra đáp án vào usage_logs.", defaultChecked: true },
  { label: "Chặn IP đáng ngờ", description: "Tự động chuyển sang motion_noise.", defaultChecked: false },
  { label: "Cho phép token dùng lại", description: "Không khuyến nghị cho môi trường thật.", defaultChecked: false, disabled: true },
];

export function SelectionSection() {
  const [challengeType, setChallengeType] = useState<string | null>("image_distort");
  const [types, setTypes] = useState<string[]>(["image_distort", "motion_noise"]);
  const [owner, setOwner] = useState<string | null>("nguyen_van_a");
  const [members, setMembers] = useState<string[]>(["john_doe", "jane_smith", "tran_thi_b"]);
  const [remoteOptions, setRemoteOptions] = useState<SelectOption[]>(() => searchUsers(""));
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteUser, setRemoteUser] = useState<string | null>(null);
  const [enabledChannels, setEnabledChannels] = useState<string[]>(["email"]);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function searchRemote(query: string) {
    setRemoteLoading(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setRemoteOptions(searchUsers(query));
      setRemoteLoading(false);
    }, 500);
  }

  const allChannels = enabledChannels.length === channels.length;

  return (
    <DemoSection
      id="selection"
      title="Lựa chọn"
      description="Select cho danh sách ngắn; Combobox thêm ô tìm kiếm cho danh sách dài hoặc dữ liệu từ server; Checkbox và Switch cho giá trị bật/tắt."
    >
      <DemoBlock title="Select" description="Không có ô tìm kiếm; gõ ký tự đầu để nhảy tới lựa chọn.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Loại challenge" nativeLabel={false} description={`Giá trị: ${challengeType ?? "null"}`}>
            <Select options={challengeTypeOptions} value={challengeType} onValueChange={setChallengeType} clearable />
          </Field>
          <Field label="Nhiều lựa chọn" nativeLabel={false} description={`Giá trị: [${types.join(", ")}]`}>
            <Select
              multiple
              options={challengeTypeOptions}
              value={types}
              onValueChange={setTypes}
              placeholder="Chọn loại challenge"
              clearable
            />
          </Field>
          <Field label="Nhóm lựa chọn" nativeLabel={false}>
            <Select options={intervalOptions} defaultValue="24h" />
          </Field>
          <Field label="Không hợp lệ" nativeLabel={false} error="Vui lòng chọn gói.">
            <Select options={tierOptions} placeholder="Chọn gói" />
          </Field>
          <Field label="Kích thước sm" nativeLabel={false}>
            <Select size="sm" options={tierOptions} defaultValue="free" />
          </Field>
          <Field label="Vô hiệu" nativeLabel={false} disabled>
            <Select options={tierOptions} defaultValue="premium" disabled />
          </Field>
        </div>
      </DemoBlock>

      <DemoBlock title="Combobox" description={`Tự bật ô tìm kiếm khi có hơn 8 lựa chọn (danh sách mẫu có ${userOptions.length} người dùng, chia nhóm theo gói).`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Chủ sở hữu" nativeLabel={false} description={`Giá trị: ${owner ?? "null"}`}>
            <Combobox options={userOptions} value={owner} onValueChange={setOwner} clearable placeholder="Chọn người dùng" />
          </Field>
          <Field label="Thành viên (nhiều lựa chọn)" nativeLabel={false} description={`Đã chọn ${members.length} người`}>
            <Combobox multiple options={userOptions} value={members} onValueChange={setMembers} clearable />
          </Field>
          <Field
            label="Tìm từ server"
            nativeLabel={false}
            description="Mô phỏng API trễ 500ms, trả tối đa 8 kết quả."
          >
            <Combobox
              options={remoteOptions}
              value={remoteUser}
              onValueChange={setRemoteUser}
              onSearchChange={searchRemote}
              loading={remoteLoading}
              placeholder="Tìm người dùng…"
              searchPlaceholder="Gõ tên người dùng…"
              clearable
            />
          </Field>
          <Field label="Luôn có ô tìm kiếm" nativeLabel={false} description="searchable dù chỉ có 4 lựa chọn.">
            <Combobox searchable options={challengeTypeOptions} defaultValue="motion_noise" />
          </Field>
        </div>
      </DemoBlock>

      <div className="grid gap-8 lg:grid-cols-2">
        <DemoBlock title="Checkbox">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid content-start gap-3">
              <DemoLabel>Cơ bản</DemoLabel>
              <Checkbox label="Kích hoạt khóa ngay" defaultChecked />
              <Checkbox label="Báo cáo hằng tuần" description="Gửi vào mỗi thứ Hai." />
              <Checkbox label="Không khả dụng" disabled />
              <Checkbox label="Bật, không sửa được" disabled defaultChecked />
            </div>
            <div className="grid content-start gap-3">
              <DemoLabel>Chọn tất cả (indeterminate)</DemoLabel>
              <Checkbox
                label="Tất cả kênh"
                checked={allChannels}
                indeterminate={enabledChannels.length > 0 && !allChannels}
                onCheckedChange={(checked) => setEnabledChannels(checked ? channels.map((c) => c.value) : [])}
              />
              <div className="grid gap-3 pl-6">
                {channels.map((channel) => (
                  <Checkbox
                    key={channel.value}
                    label={channel.label}
                    checked={enabledChannels.includes(channel.value)}
                    onCheckedChange={(checked) =>
                      setEnabledChannels((current) =>
                        checked ? [...current, channel.value] : current.filter((value) => value !== channel.value),
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </DemoBlock>

        <DemoBlock title="Switch">
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Switch label="Hoạt động" defaultChecked />
              <Switch label="Bảo trì" />
              <Switch label="Vô hiệu" disabled />
              <Switch aria-label="Không có nhãn" defaultChecked />
            </div>
            <div>
              <DemoLabel>Hàng cài đặt · labelPosition=&quot;start&quot;</DemoLabel>
              <div className="divide-y divide-border rounded-lg border border-border">
                {settings.map((setting) => (
                  <Switch
                    key={setting.label}
                    labelPosition="start"
                    label={setting.label}
                    description={setting.description}
                    defaultChecked={setting.defaultChecked}
                    disabled={setting.disabled}
                    className="flex w-full px-4 py-3"
                  />
                ))}
              </div>
            </div>
          </div>
        </DemoBlock>
      </div>
    </DemoSection>
  );
}

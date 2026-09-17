"use client";

import { useState } from "react";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { DateInput, DateRangeInput, useDateRangePresets } from "@/components/ui/date-input";
import { Field } from "@/components/ui/field";
import { formatDate } from "@/lib/format";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";

const MIN_DATE = new Date(2026, 0, 1);
const MAX_DATE = new Date(2026, 11, 31);

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const describeRange = (range: DateRange) =>
  range.from ? `${formatDate(range.from)} – ${range.to ? formatDate(range.to) : "…"}` : "chưa chọn";

export function DatesSection() {
  const presets = useDateRangePresets();
  const [expiresAt, setExpiresAt] = useState<Date | null>(new Date(2026, 8, 30));
  const [reportRange, setReportRange] = useState<DateRange>({ from: new Date(2026, 8, 1), to: new Date(2026, 8, 15) });
  const [day, setDay] = useState<Date | null>(new Date(2026, 8, 15));
  const [calendarRange, setCalendarRange] = useState<DateRange>({
    from: new Date(2026, 8, 24),
    to: new Date(2026, 9, 6),
  });

  return (
    <DemoSection
      id="dates"
      title="Ngày tháng"
      description="Ngày theo lịch địa phương, định dạng dd/mm/yyyy, tuần bắt đầu thứ Hai."
    >
      <DemoBlock
        title="DateInput"
        description="Gõ dd/mm/yyyy hoặc bấm biểu tượng lịch (Alt + ↓). Ngày sai hoặc ngoài giới hạn tự khôi phục khi rời ô."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Ngày hết hạn"
            description={`Trong năm 2026 · giá trị: ${expiresAt ? formatDate(expiresAt) : "trống"}`}
          >
            <DateInput value={expiresAt} onValueChange={setExpiresAt} min={MIN_DATE} max={MAX_DATE} />
          </Field>
          <Field label="Chỉ ngày làm việc" description="Thứ Bảy và Chủ Nhật bị vô hiệu.">
            <DateInput isDateDisabled={isWeekend} defaultValue={new Date(2026, 8, 16)} />
          </Field>
          <Field label="Kích thước sm">
            <DateInput size="sm" />
          </Field>
          <Field label="Vô hiệu" disabled>
            <DateInput defaultValue={new Date(2026, 0, 1)} disabled />
          </Field>
        </div>
      </DemoBlock>

      <DemoBlock title="DateRangeInput" description="Chọn đủ hai đầu hoặc bấm một lựa chọn nhanh thì popup tự đóng.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kỳ báo cáo" nativeLabel={false} description={`Giá trị: ${describeRange(reportRange)}`}>
            <DateRangeInput value={reportRange} onValueChange={setReportRange} presets={presets} />
          </Field>
          <Field label="Hai tháng, không có lựa chọn nhanh" nativeLabel={false}>
            <DateRangeInput numberOfMonths={2} />
          </Field>
        </div>
      </DemoBlock>

      <DemoBlock
        title="Calendar"
        description="Đặt thẳng trong trang. Bàn phím: mũi tên, Home/End, PageUp/PageDown (Shift: theo năm)."
      >
        <div className="flex flex-wrap gap-8">
          <div>
            <DemoLabel>Một ngày · {day ? formatDate(day) : "—"}</DemoLabel>
            <div className="w-fit rounded-lg border border-border">
              <Calendar value={day} onValueChange={setDay} min={MIN_DATE} max={MAX_DATE} />
            </div>
          </div>
          <div className="min-w-0">
            <DemoLabel>Khoảng ngày, hai tháng · {describeRange(calendarRange)}</DemoLabel>
            <div className="w-fit max-w-full overflow-x-auto rounded-lg border border-border">
              <Calendar mode="range" value={calendarRange} onValueChange={setCalendarRange} numberOfMonths={2} />
            </div>
          </div>
        </div>
      </DemoBlock>
    </DemoSection>
  );
}

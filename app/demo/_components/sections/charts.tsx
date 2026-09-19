"use client";

import { BarChart } from "@/components/ui/bar-chart";
import { ChartCard } from "@/components/ui/chart-card";
import type { ChartColumn, ChartSeries } from "@/components/ui/chart-parts";
import { LineChart } from "@/components/ui/line-chart";
import { useFormatter } from "@/components/ui/locale";
import { Meter } from "@/components/ui/meter";
import { SeriesTable, seriesStats } from "@/components/ui/series-table";
import { DemoBlock, DemoLabel, DemoSection } from "../demo-shell";

/** Fixed demo data: deterministic, so server and client render the same chart. */
const keys: ChartSeries[] = [
  { id: "shop", label: "Web shop", color: 1 },
  { id: "blog", label: "Blog", color: 2 },
  { id: "app", label: "Mobile app", color: 3 },
  { id: "other", label: "Khóa khác", color: "other" },
];

const columns: ChartColumn[] = Array.from({ length: 14 }, (_, i) => {
  const day = String(i + 6).padStart(2, "0");
  return {
    label: `${i + 6} thg 9`,
    title: `${day}/09/2026`,
    values: {
      shop: 120 + ((i * 37) % 90),
      blog: 40 + ((i * 23) % 50),
      app: i < 5 ? 0 : 15 + ((i * 13) % 40),
      other: (i * 7) % 12,
    },
  };
});

const single: ChartColumn[] = columns.map((column) => ({
  ...column,
  values: { solves: Object.values(column.values).reduce((sum, value) => sum + value, 0) },
}));

const rows = keys.map((key) => ({ ...key, ...seriesStats(columns.map((column) => column.values[key.id] ?? 0)) }));
const total = rows.reduce((sum, row) => sum + row.total, 0);

export function ChartsSection() {
  const format = useFormatter();
  const number = (value: number) => format.number(value);

  return (
    <DemoSection
      id="charts"
      title="Biểu đồ & thanh mức dùng"
      description="Đường theo ngày kiểu OpenRouter (nét 2 px, không lưới, trục y bỏ số 0) và cột chồng (≤ 24 px, bo 4 px, khe 2 px), cùng bảng màu phân loại đã kiểm tra mù màu; thanh mức dùng kiểu Claude."
    >
      <DemoBlock
        title="ChartCard + LineChart + SeriesTable"
        description="Nhãn mờ, con số lớn, biểu đồ đường trải hết chiều ngang, rồi bảng Min/Max/Avg/Tổng (tính trên các ngày có lượt giải) làm luôn chú giải. Rê chuột hoặc Tab rồi ←/→."
      >
        <ChartCard
          label="Lượt giải theo khóa API trong 14 ngày qua"
          value={number(total)}
          caption="5 khóa API"
          footer={<SeriesTable rows={rows} nameHeader="Khóa API" formatValue={number} aria-label="Lượt giải theo khóa API" />}
        >
          <LineChart aria-label="Lượt giải mỗi ngày của từng khóa API" columns={columns} series={keys} formatValue={number} totalLabel="Tổng" />
        </ChartCard>
      </DemoBlock>
      <div className="grid gap-8 xl:grid-cols-2">
        <DemoBlock title="LineChart — một series" description="Một đường thì tô nền nhạt bên dưới.">
          <LineChart aria-label="Lượt giải mỗi ngày" columns={single} series={[{ id: "solves", label: "Lượt giải", color: 1 }]} formatValue={number} height={160} />
        </DemoBlock>
        <DemoBlock title="LineChart — legend, trống" description="legend khi không có bảng đi kèm; mọi giá trị bằng 0.">
          <LineChart
            aria-label="Chưa có dữ liệu"
            columns={columns.map((column) => ({ ...column, values: {} }))}
            series={keys}
            formatValue={number}
            emptyLabel="Chưa có lượt giải nào trong khoảng này."
            height={160}
            legend
          />
        </DemoBlock>
      </div>
      <div className="grid gap-8 xl:grid-cols-2">
        <DemoBlock title="BarChart — nhiều series" description="Legend khi ≥ 2 series; rê chuột hoặc Tab rồi ←/→ để xem từng ngày.">
          <BarChart aria-label="Lượt giải theo khóa API" columns={columns} series={keys} formatValue={number} totalLabel="Tổng" />
        </DemoBlock>
        <DemoBlock title="BarChart — một series" description="Không legend: tiêu đề đã nói chart vẽ gì.">
          <BarChart aria-label="Lượt giải mỗi ngày" columns={single} series={[{ id: "solves", label: "Lượt giải", color: 1 }]} formatValue={number} />
        </DemoBlock>
      </div>
      <DemoBlock title="BarChart — trống" description="Mọi giá trị bằng 0.">
        <BarChart
          aria-label="Chưa có dữ liệu"
          columns={columns.map((column) => ({ ...column, values: {} }))}
          series={keys}
          formatValue={number}
          emptyLabel="Chưa có lượt giải nào trong khoảng này."
        />
      </DemoBlock>
      <DemoBlock title="Meter" description="Xanh tới 80 %, vàng từ 80 %, đỏ khi chạm giới hạn.">
        <div className="grid gap-6">
          <DemoLabel>35 %</DemoLabel>
          <Meter label="Lượt xác minh hôm nay" description="Đặt lại sau 5 giờ 12 phút" value={350} max={1000} valueLabel="Đã dùng 35%" caption="350/1.000 lượt" />
          <DemoLabel>85 %</DemoLabel>
          <Meter label="Lượt xác minh hôm nay" description="Đặt lại sau 47 phút" value={850} max={1000} valueLabel="Đã dùng 85%" caption="850/1.000 lượt" />
          <DemoLabel>100 %</DemoLabel>
          <Meter label="Lượt xác minh hôm nay" description="Đặt lại sau 3 phút" value={1000} max={1000} valueLabel="Đã dùng 100%" caption="1.000/1.000 lượt" />
        </div>
      </DemoBlock>
    </DemoSection>
  );
}

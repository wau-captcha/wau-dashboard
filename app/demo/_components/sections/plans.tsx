"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanTable, type PlanColumn, type PlanRow } from "@/components/ui/plan-table";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toast } from "@/components/ui/toast";
import { DemoBlock, DemoSection } from "../demo-shell";

type Period = "month" | "year";

const tiers = [
  { id: "free", name: "Free", monthly: 0, yearly: 0, quota: "5.000 lượt/ngày" },
  { id: "plus", name: "Plus", monthly: 10000, yearly: 100000, quota: "100.000 lượt/ngày" },
  { id: "pro", name: "Pro", monthly: 30000, yearly: 300000, quota: "1.000.000 lượt/ngày" },
];

const rows: PlanRow[] = [
  {
    id: "quota",
    label: "Hạn mức mỗi ngày",
    hint: "Lượt xác minh thành công, cộng mọi khóa",
    values: Object.fromEntries(tiers.map((tier) => [tier.id, tier.quota])),
  },
  { id: "types", label: "Loại challenge", values: { free: "Chữ méo", plus: "Chữ méo, chữ chuyển động", pro: "Chữ méo, chữ chuyển động" } },
  { id: "support", label: "Hỗ trợ ưu tiên", values: { free: false, plus: false, pro: true } },
  { id: "payment", label: "Thanh toán", values: { free: "Không", plus: "Chuyển khoản (QR)", pro: "Chuyển khoản (QR)" } },
];

const vnd = (amount: number) => `${amount.toLocaleString("vi-VN")} ₫`;

export function PlansSection() {
  const [current, setCurrent] = useState("plus");
  const [period, setPeriod] = useState<Period>("month");
  const rank = (id: string) => tiers.findIndex((tier) => tier.id === id);

  const plans: PlanColumn[] = tiers.map((tier) => {
    const isCurrent = tier.id === current;
    const upgrade = rank(tier.id) > rank(current);
    const yearly = period === "year" && tier.monthly > 0;
    const saving = 1 - tier.yearly / (tier.monthly * 12);
    return {
      id: tier.id,
      name: tier.name,
      highlighted: isCurrent,
      badge: isCurrent ? (
        <Badge tone="primary" size="sm">
          Đang dùng
        </Badge>
      ) : undefined,
      price: vnd(yearly ? tier.yearly : tier.monthly),
      priceNote: yearly ? `mỗi năm, tương đương ${vnd(Math.round(tier.yearly / 12))}/tháng` : period === "year" ? "mỗi năm" : "mỗi tháng",
      priceBadge: yearly ? (
        <Badge tone="positive" size="sm">
          Tiết kiệm {Math.round(saving * 1000) / 10}%
        </Badge>
      ) : undefined,
      action:
        isCurrent && tier.monthly === 0 ? (
          <Button variant="outline" size="sm" disabled startIcon={<Check />}>
            Gói hiện tại
          </Button>
        ) : upgrade || (isCurrent && tier.monthly > 0) ? (
          <Button
            variant={upgrade ? "primary" : "outline"}
            size="sm"
            onClick={() => {
              setCurrent(tier.id);
              toast.success(upgrade ? `Đã nâng cấp lên ${tier.name}` : `Đã gia hạn ${tier.name}`);
            }}
          >
            {upgrade ? "Nâng cấp" : period === "year" ? "Gia hạn 1 năm" : "Gia hạn 1 tháng"}
          </Button>
        ) : null,
    };
  });

  return (
    <DemoSection
      id="plans"
      title="Bảng gói"
      description="PlanTable: các gói xếp cạnh nhau, mỗi cột có giá, badge cạnh giá (priceBadge) và nút riêng, tính năng theo hàng; true/false hiện dấu tích/gạch. Trên điện thoại chỉ hiện một gói, chọn bằng SegmentedControl."
    >
      <DemoBlock
        title="So sánh gói, theo tháng hoặc theo năm"
        description="Gói đang dùng tô màu nhấn và gắn badge. Chọn Theo năm để thấy giá năm và phần trăm tiết kiệm so với trả 12 tháng; không có nút cho gói thấp hơn."
        contentClassName="grid gap-4 bg-background"
      >
        <SegmentedControl
          aria-label="Kỳ thanh toán"
          options={[
            { value: "month", label: "Theo tháng" },
            { value: "year", label: "Theo năm" },
          ]}
          value={period}
          onValueChange={setPeriod}
          className="justify-self-start"
        />
        <PlanTable aria-label="So sánh các gói" plans={plans} rows={rows} />
      </DemoBlock>
    </DemoSection>
  );
}

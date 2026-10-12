"use client";

import { Copy, Ellipsis, Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn, type SortState } from "@/components/ui/data-table";
import { ConfirmDialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableDensity,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { TextInput } from "@/components/ui/text-input";
import { toast } from "@/components/ui/toast";
import { useFormatter } from "@/components/ui/locale";
import { formatDate, formatDateTime } from "@/lib/format";
import { DemoBlock, DemoSection } from "../demo-shell";
import { apiKeys, delay, keyStatusMeta, usageLogs, type DemoApiKey, type DemoUsageLog } from "../mock-data";

const statusFilterOptions = [
  { value: "all", label: "Mọi trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "paused", label: "Tạm dừng" },
  { value: "deleted", label: "Đã xóa" },
];

const logColumns: DataTableColumn<DemoUsageLog>[] = [
  { id: "id", header: "ID", sortable: true, width: 96, cell: (log) => <code className="font-mono text-foreground">#{log.id}</code> },
  { id: "site", header: "Website", cell: (log) => log.siteName },
  {
    id: "challengeType",
    header: "Loại challenge",
    sortable: true,
    cell: (log) => <code className="font-mono">{log.challengeType}</code>,
  },
  {
    id: "success",
    header: "Kết quả",
    sortable: true,
    cell: (log) => <Badge tone={log.success ? "positive" : "negative"}>{log.success ? "Thành công" : "Thất bại"}</Badge>,
  },
  { id: "timestamp", header: "Thời gian", sortable: true, align: "right", cell: (log) => formatDateTime(log.timestamp) },
];

// Server-side sorting stand-in: the table only reports sort changes (manualSorting).
function sortLogs(logs: DemoUsageLog[], sort: SortState) {
  if (!sort) return logs;
  const direction = sort.direction === "asc" ? 1 : -1;
  const compare: Record<string, (a: DemoUsageLog, b: DemoUsageLog) => number> = {
    id: (a, b) => a.id - b.id,
    challengeType: (a, b) => a.challengeType.localeCompare(b.challengeType),
    success: (a, b) => Number(a.success) - Number(b.success),
    timestamp: (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  };
  const byColumn = compare[sort.columnId];
  return byColumn ? [...logs].sort((a, b) => byColumn(a, b) * direction) : logs;
}

const monthlySummary = [
  { type: "image_distort", total: 98214, success: 94102 },
  { type: "motion_noise", total: 31877, success: 30011 },
  { type: "slide_puzzle", total: 12780, success: 12004 },
  { type: "animal_jump", total: 6410, success: 6013 },
  { type: "object_rotate", total: 4127, success: 3884 },
  { type: "auto_check", total: 9318, success: 8236 },
];

function ApiKeysTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>("all");
  const [density, setDensity] = useState<TableDensity>("regular");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const needle = query.trim().toLowerCase();
  const rows = apiKeys.filter(
    (key) =>
      (status === "all" || status === null || key.status === status) &&
      (!needle || `${key.name} ${key.owner} ${key.siteKey}`.toLowerCase().includes(needle)),
  );

  const columns: DataTableColumn<DemoApiKey>[] = [
    {
      id: "name",
      header: "Website",
      accessor: (key) => key.name,
      sortable: true,
      cell: (key) => (
        <div className="grid">
          <span className="font-medium text-foreground">{key.name}</span>
          <code className="font-mono text-overline text-muted-foreground">{key.siteKey.slice(0, 14)}…</code>
        </div>
      ),
    },
    { id: "owner", header: "Chủ sở hữu", accessor: (key) => key.owner, sortable: true },
    {
      id: "tier",
      header: "Gói",
      accessor: (key) => key.tier,
      sortable: true,
      cell: (key) => (
        <Badge tone={key.tier === "premium" ? "primary" : "neutral"}>{key.tier === "premium" ? "Premium" : "Free"}</Badge>
      ),
    },
    {
      id: "status",
      header: "Trạng thái",
      accessor: (key) => key.status,
      sortable: true,
      cell: (key) => (
        <Badge tone={keyStatusMeta[key.status].tone} dot>
          {keyStatusMeta[key.status].label}
        </Badge>
      ),
    },
    { id: "requests", header: "Lượt xác minh", accessor: (key) => key.requests, sortable: true, align: "right" },
    {
      id: "createdAt",
      header: "Ngày tạo",
      accessor: (key) => key.createdAt,
      sortable: true,
      cell: (key) => formatDate(key.createdAt),
    },
    {
      id: "actions",
      header: <span className="sr-only">Thao tác</span>,
      width: 56,
      align: "right",
      cell: (key) => (
        // Keeps menu clicks (which bubble through the portal) from triggering the row click.
        <div onClick={(event) => event.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Thao tác cho ${key.name}`} />}>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => toast.info(`Sửa ${key.name}`)}>
                <Pencil /> Sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  void navigator.clipboard?.writeText(key.siteKey);
                  toast.success("Đã sao chép site key");
                }}
              >
                <Copy /> Sao chép site key
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={key.status === "deleted"}
                onClick={() => toast.success(`Đã thu hồi ${key.name}`)}
              >
                <Trash2 /> Thu hồi khóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <TextInput
          size="sm"
          className="w-full sm:w-72"
          startAdornment={<Search />}
          placeholder="Tìm website, người dùng, site key…"
          aria-label="Tìm khóa API"
          value={query}
          onValueChange={setQuery}
          clearable
        />
        <Select
          size="sm"
          className="w-44"
          aria-label="Lọc theo trạng thái"
          options={statusFilterOptions}
          value={status}
          onValueChange={setStatus}
        />
        <div className="flex flex-wrap items-center gap-4 sm:ml-auto">
          <Switch label="Mô phỏng đang tải" checked={loading} onCheckedChange={setLoading} />
          <Tabs variant="segmented" value={density} onValueChange={setDensity}>
            <TabsList aria-label="Mật độ bảng">
              <TabsTab value="compact">Gọn</TabsTab>
              <TabsTab value="regular">Vừa</TabsTab>
              <TabsTab value="expanded">Rộng</TabsTab>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-accent-border bg-accent px-3 py-2 text-body text-accent-foreground">
          <span className="font-medium">Đã chọn {selected.length} khóa</span>
          <div className="flex gap-2">
            <Button size="xs" variant="ghost" onClick={() => setSelected([])}>
              Bỏ chọn
            </Button>
            <ConfirmDialog
              trigger={
                <Button size="xs" variant="destructive" startIcon={<Trash2 />}>
                  Thu hồi
                </Button>
              }
              title={`Thu hồi ${selected.length} khóa API?`}
              description="Các website đang dùng những khóa này sẽ không xác minh được captcha nữa."
              confirmLabel="Thu hồi"
              tone="destructive"
              onConfirm={async () => {
                await delay(900);
                toast.success(`Đã thu hồi ${selected.length} khóa API`);
                setSelected([]);
              }}
            />
          </div>
        </div>
      )}

      <DataTable
        aria-label="Danh sách khóa API"
        columns={columns}
        data={loading ? [] : rows}
        loading={loading}
        loadingRows={4}
        getRowId={(key) => key.id}
        selectable
        isRowSelectable={(key) => key.status !== "deleted"}
        selectedRowIds={selected}
        onSelectedRowIdsChange={setSelected}
        defaultSort={{ columnId: "requests", direction: "desc" }}
        density={density}
        onRowClick={(key) => toast.info(key.name, { description: `Mở chi tiết khóa ${key.siteKey.slice(0, 14)}…` })}
        emptyState={
          <EmptyState
            icon={<Search />}
            title="Không tìm thấy khóa phù hợp"
            description="Thử từ khóa khác hoặc bỏ bộ lọc trạng thái."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        }
      />
    </div>
  );
}

function UsageLogsTable() {
  const [sort, setSort] = useState<SortState>({ columnId: "timestamp", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const sorted = useMemo(() => sortLogs(usageLogs, sort), [sort]);
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DataTable
      aria-label="Nhật ký sử dụng"
      columns={logColumns}
      data={pageRows}
      getRowId={(log) => String(log.id)}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        setPage(1);
      }}
      manualSorting
      density="compact"
      footer={
        <Pagination
          page={page}
          pageSize={pageSize}
          total={usageLogs.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      }
    />
  );
}

export function TablesSection() {
  const format = useFormatter();
  const totals = monthlySummary.reduce(
    (sum, row) => ({ total: sum.total + row.total, success: sum.success + row.success }),
    { total: 0, success: 0 },
  );

  return (
    <DemoSection
      id="tables"
      title="Bảng dữ liệu"
      description="DataTable cho mọi danh sách: sắp xếp, chọn dòng, trạng thái tải, trạng thái rỗng, phân trang. Table là primitive cho bố cục đặc biệt."
    >
      <DemoBlock
        title="Khóa API"
        description="Sắp xếp phía client, chọn nhiều dòng (khóa đã xóa không chọn được), bấm dòng để mở chi tiết, menu thao tác cuối dòng. Tìm “zzz” để thấy trạng thái rỗng."
        contentClassName="bg-background"
      >
        <ApiKeysTable />
      </DemoBlock>

      <DemoBlock
        title="Nhật ký sử dụng"
        description={`${usageLogs.length} bản ghi, sắp xếp và phân trang kiểu server (manualSorting), mật độ compact.`}
        contentClassName="bg-background"
      >
        <UsageLogsTable />
      </DemoBlock>

      <div className="grid gap-8">
        <DemoBlock title="Header dính" description="stickyHeader + giới hạn chiều cao khung." contentClassName="bg-background">
          <DataTable
            aria-label="Nhật ký gần nhất"
            className="max-h-72"
            stickyHeader
            density="compact"
            columns={logColumns.filter((column) => column.id !== "site")}
            data={usageLogs.slice(0, 30)}
            getRowId={(log) => String(log.id)}
          />
        </DemoBlock>
        <DemoBlock title="Table primitive" description="Có footer tổng và caption." contentClassName="bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại challenge</TableHead>
                <TableHead className="text-right">Lượt xác minh</TableHead>
                <TableHead className="text-right">Thành công</TableHead>
                <TableHead className="text-right">Tỉ lệ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlySummary.map((row) => (
                <TableRow key={row.type}>
                  <TableCell className="font-mono text-foreground">{row.type}</TableCell>
                  <TableCell className="text-right">{format.number(row.total)}</TableCell>
                  <TableCell className="text-right">{format.number(row.success)}</TableCell>
                  <TableCell className="text-right">{format.percent(row.success / row.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Tổng</TableCell>
                <TableCell className="text-right">{format.number(totals.total)}</TableCell>
                <TableCell className="text-right">{format.number(totals.success)}</TableCell>
                <TableCell className="text-right">{format.percent(totals.success / totals.total)}</TableCell>
              </TableRow>
            </TableFooter>
            <TableCaption className="py-3">Tổng hợp tháng 9/2026</TableCaption>
          </Table>
        </DemoBlock>
      </div>
    </DemoSection>
  );
}

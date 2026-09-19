import type { Locale } from "@/lib/i18n/config";
import type { Translation } from "@/lib/i18n/types";

/** Default strings of the component library. Every one can still be overridden through props. */
const en = {
  theme: {
    group: "Theme",
    light: "Light theme",
    dark: "Dark theme",
    system: "System theme",
  },
  language: {
    group: "Language",
  },
  calendar: {
    previousYear: "Previous year",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    nextYear: "Next year",
  },
  select: {
    placeholder: "Select…",
    searchPlaceholder: "Search…",
    noResults: "No results found",
    noOptions: "No options",
    clear: "Clear selection",
  },
  copy: {
    copy: "Copy",
    copied: "Copied",
  },
  table: {
    yes: "Yes",
    no: "No",
    selectAll: "Select all rows",
    selectRow: "Select row",
    emptyTitle: "No data",
    emptyDescription: "There are no records to show yet.",
  },
  seriesTable: {
    min: "Min",
    max: "Max",
    avg: "Avg",
    total: "Total",
  },
  dateInput: {
    openCalendar: "Open calendar",
    clearDate: "Clear date",
    rangePlaceholder: "Select a date range",
    clearRange: "Clear date range",
    presets: {
      today: "Today",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      thisMonth: "This month",
      lastMonth: "Last month",
    },
  },
  dialog: {
    close: "Close",
    confirm: "Confirm",
    cancel: "Cancel",
  },
  numberInput: {
    increment: "Increase",
    decrement: "Decrease",
  },
  pagination: {
    empty: "No records",
    showing: "Showing",
    of: "of",
    pageSize: "Rows",
    pageSizeLabel: "Rows per page",
    navigation: "Pagination",
    previous: "Previous page",
    next: "Next page",
    page: (page: number) => `Page ${page}`,
  },
  secret: {
    hide: "Hide",
    show: "Show",
    hideValue: "Hide value",
    showValue: "Show value",
  },
  textInput: {
    clear: "Clear",
    hidePassword: "Hide password",
    showPassword: "Show password",
  },
  toast: {
    close: "Close notification",
  },
};

export type UIText = typeof en;

const vi: Translation<UIText> = {
  theme: {
    group: "Giao diện",
    light: "Giao diện sáng",
    dark: "Giao diện tối",
    system: "Theo hệ thống",
  },
  language: {
    group: "Ngôn ngữ",
  },
  calendar: {
    previousYear: "Năm trước",
    previousMonth: "Tháng trước",
    nextMonth: "Tháng sau",
    nextYear: "Năm sau",
  },
  select: {
    placeholder: "Chọn…",
    searchPlaceholder: "Tìm kiếm…",
    noResults: "Không tìm thấy kết quả",
    noOptions: "Không có lựa chọn",
    clear: "Xóa lựa chọn",
  },
  copy: {
    copy: "Sao chép",
    copied: "Đã sao chép",
  },
  table: {
    yes: "Có",
    no: "Không",
    selectAll: "Chọn tất cả",
    selectRow: "Chọn dòng",
    emptyTitle: "Không có dữ liệu",
    emptyDescription: "Chưa có bản ghi nào để hiển thị.",
  },
  seriesTable: {
    min: "Thấp nhất",
    max: "Cao nhất",
    avg: "Trung bình",
    total: "Tổng",
  },
  dateInput: {
    openCalendar: "Mở lịch",
    clearDate: "Xóa ngày",
    rangePlaceholder: "Chọn khoảng ngày",
    clearRange: "Xóa khoảng ngày",
    presets: {
      today: "Hôm nay",
      last7Days: "7 ngày qua",
      last30Days: "30 ngày qua",
      thisMonth: "Tháng này",
      lastMonth: "Tháng trước",
    },
  },
  dialog: {
    close: "Đóng",
    confirm: "Xác nhận",
    cancel: "Hủy",
  },
  numberInput: {
    increment: "Tăng",
    decrement: "Giảm",
  },
  pagination: {
    empty: "Không có bản ghi",
    showing: "Hiển thị",
    of: "trong",
    pageSize: "Số dòng",
    pageSizeLabel: "Số dòng mỗi trang",
    navigation: "Phân trang",
    previous: "Trang trước",
    next: "Trang sau",
    page: (page) => `Trang ${page}`,
  },
  secret: {
    hide: "Ẩn",
    show: "Hiện",
    hideValue: "Ẩn giá trị",
    showValue: "Hiện giá trị",
  },
  textInput: {
    clear: "Xóa nội dung",
    hidePassword: "Ẩn mật khẩu",
    showPassword: "Hiện mật khẩu",
  },
  toast: {
    close: "Đóng thông báo",
  },
};

export const uiText: Record<Locale, UIText> = { en, vi };

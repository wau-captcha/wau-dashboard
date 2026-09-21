import type { Translation } from "../types";

const en = {
  list: {
    metaTitle: "API keys",
    metaDescription: "Create, pause and delete your captcha keys.",
    title: "API keys",
    description: (used: number, limit: number) =>
      `Each key pairs a site key for the browser with a secret key for your server. Using ${used} of ${limit} keys.`,
    emptyTitle: "No API keys yet",
    emptyDescription: "Create your first key to embed a captcha on your site.",
    tableLabel: "API keys",
  },
  create: {
    button: "Create API key",
    limitReached: (limit: number) => `You've used all ${limit} keys. Delete an old key to create a new one.`,
    title: "Create API key",
    description: "Name the key so you can recognise it, for example after the site that uses it.",
    name: "Key name",
    cancel: "Cancel",
    submit: "Create key",
  },
  columns: {
    name: "Name",
    siteKey: "Site key",
    status: "Status",
    created: "Created",
  },
  rowActions: {
    label: (name: string) => `Actions for key ${name}`,
    view: "View details",
    pause: "Pause",
    activate: "Activate",
    delete: "Delete key",
  },
  toast: {
    paused: "Key paused",
    activated: "Key activated",
    deleted: "API key deleted",
    rotated: "New secret key created",
    revoked: "Previous secret key revoked",
  },
  deleteDialog: {
    title: "Delete API key?",
    description: (name: string) => `Every integration using "${name}" stops working immediately. This can't be undone.`,
    confirm: "Delete key",
  },
  validation: {
    nameRequired: "Enter a name so you can recognise this key.",
    nameEmpty: "The key name can't be empty.",
  },
};

const vi: Translation<typeof en> = {
  list: {
    metaTitle: "Khóa API",
    metaDescription: "Tạo, tạm dừng và xóa khóa captcha của bạn.",
    title: "Khóa API",
    description: (used, limit) =>
      `Mỗi khóa gồm site key dùng ở trình duyệt và secret key dùng ở máy chủ. Đang dùng ${used}/${limit} khóa.`,
    emptyTitle: "Chưa có khóa API",
    emptyDescription: "Tạo khóa đầu tiên để nhúng captcha vào trang của bạn.",
    tableLabel: "Danh sách khóa API",
  },
  create: {
    button: "Tạo khóa API",
    limitReached: (limit) => `Bạn đã dùng hết ${limit} khóa. Xóa bớt khóa cũ để tạo khóa mới.`,
    title: "Tạo khóa API",
    description: "Đặt tên để nhận ra khóa này, ví dụ tên trang web dùng nó.",
    name: "Tên khóa",
    cancel: "Hủy",
    submit: "Tạo khóa",
  },
  columns: {
    name: "Tên khóa",
    siteKey: "Site key",
    status: "Trạng thái",
    created: "Ngày tạo",
  },
  rowActions: {
    label: (name) => `Thao tác với khóa ${name}`,
    view: "Xem chi tiết",
    pause: "Tạm dừng",
    activate: "Kích hoạt",
    delete: "Xóa khóa",
  },
  toast: {
    paused: "Đã tạm dừng khóa",
    activated: "Đã kích hoạt khóa",
    deleted: "Đã xóa khóa API",
    rotated: "Đã tạo secret key mới",
    revoked: "Đã thu hồi secret key cũ",
  },
  deleteDialog: {
    title: "Xóa khóa API?",
    description: (name) => `Mọi tích hợp đang dùng "${name}" sẽ ngừng hoạt động ngay lập tức. Không thể hoàn tác.`,
    confirm: "Xóa khóa",
  },
  validation: {
    nameRequired: "Nhập tên để nhận ra khóa này.",
    nameEmpty: "Tên khóa không được để trống.",
  },
};

export const keys = { en, vi };

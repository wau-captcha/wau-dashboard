import type { Translation } from "../types";

const en = {
  nav: "Appeals",
  metaTitle: "Appeals",
  title: "Appeals",
  description: "Reviews owners asked for, of keys that were suspended or throttled. Approving lifts the suspension and the flag, and resets today's counters.",
  filterLabel: "Show appeals",
  statuses: { pending: "Pending", approved: "Approved", rejected: "Rejected", all: "All" },
  tableLabel: "Appeals",
  empty: "No appeals here.",
  columns: { key: "Key", owner: "Owner", today: "Today", message: "Message", requested: "Requested", status: "Status" },
  today: (challenges: string, answers: string, solved: string, automated: string) =>
    `${challenges} requested · ${answers} answered · ${solved} solved · ${automated} automated`,
  flagged: "Throttled today",
  approve: "Approve",
  reject: "Reject",
  approveTitle: "Approve this appeal?",
  approveDescription: (name: string) => `${name} is unsuspended, its flag is cleared and today's counters start over.`,
  rejectTitle: "Reject this appeal?",
  rejectDescription: (name: string) => `${name} stays as it is. The owner sees your note.`,
  noteLabel: "Note to the owner (optional)",
  approved: "Appeal approved",
  rejected: "Appeal rejected",
  note: (note: string) => `Note: ${note}`,
};

const vi: Translation<typeof en> = {
  nav: "Yêu cầu xem xét",
  metaTitle: "Yêu cầu xem xét",
  title: "Yêu cầu xem xét",
  description:
    "Các yêu cầu chủ khóa gửi để xem xét khóa bị đình chỉ hoặc bị giới hạn. Chấp thuận sẽ gỡ đình chỉ, bỏ cờ và đặt lại bộ đếm hôm nay.",
  filterLabel: "Hiển thị yêu cầu",
  statuses: { pending: "Đang chờ", approved: "Đã chấp thuận", rejected: "Đã từ chối", all: "Tất cả" },
  tableLabel: "Yêu cầu xem xét",
  empty: "Không có yêu cầu nào.",
  columns: { key: "Khóa", owner: "Chủ khóa", today: "Hôm nay", message: "Lời nhắn", requested: "Ngày gửi", status: "Trạng thái" },
  today: (challenges, answers, solved, automated) =>
    `${challenges} yêu cầu · ${answers} trả lời · ${solved} đúng · ${automated} tự động`,
  flagged: "Bị giới hạn hôm nay",
  approve: "Chấp thuận",
  reject: "Từ chối",
  approveTitle: "Chấp thuận yêu cầu này?",
  approveDescription: (name) => `${name} được gỡ đình chỉ, bỏ cờ và bộ đếm hôm nay bắt đầu lại.`,
  rejectTitle: "Từ chối yêu cầu này?",
  rejectDescription: (name) => `${name} giữ nguyên trạng thái. Chủ khóa sẽ thấy ghi chú của bạn.`,
  noteLabel: "Ghi chú cho chủ khóa (không bắt buộc)",
  approved: "Đã chấp thuận yêu cầu",
  rejected: "Đã từ chối yêu cầu",
  note: (note) => `Ghi chú: ${note}`,
};

export const appeals = { en, vi };

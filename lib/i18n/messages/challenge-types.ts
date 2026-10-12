import type { Translation } from "../types";

/** Keyed by `challenge_types.challenge_type_id`. */
const en = {
  types: {
    image_distort: {
      label: "Distorted text",
      description: "A still image with warped, rotated and noisy text. Lightweight and suits any site.",
    },
    motion_noise: {
      label: "Text in moving noise",
      description: "An animation where the text only appears as the noise dots move, so bots reading single frames see nothing.",
    },
    slide_puzzle: {
      label: "Slide puzzle",
      description: "Drag the piece into the right spot on the background image; the movement is checked too.",
    },
    animal_jump: {
      label: "Jumping animals",
      description: "Two short rounds of jumping animal heads: click the one that jumps highest in each.",
    },
    object_rotate: {
      label: "Rotate to arrow",
      description: "Two rounds: turn an object a step at a time until it faces the arrow on the ground.",
    },
    behavioral_advanced: {
      label: "Behaviour analysis",
      description: "Scores mouse and keyboard activity; most people never have to solve anything.",
    },
  },
  fallbackDescription: "A challenge type provided by the server.",
};

const vi: Translation<typeof en> = {
  types: {
    image_distort: {
      label: "Ảnh chữ méo",
      description: "Ảnh tĩnh với chữ bị bóp méo, xoay và thêm nhiễu. Nhẹ, hợp với mọi trang.",
    },
    motion_noise: {
      label: "Chữ chuyển động trong nhiễu",
      description: "Ảnh động: chữ chỉ hiện ra khi các chấm nhiễu chuyển động, khó cho bot đọc ảnh tĩnh.",
    },
    slide_puzzle: {
      label: "Ghép hình trượt",
      description: "Kéo mảnh ghép vào đúng vị trí trên ảnh nền; chuyển động cũng được kiểm tra.",
    },
    animal_jump: {
      label: "Con vật nhảy cao",
      description: "Hai lượt ngắn, các đầu con vật nhảy lên: bấm vào con vật nhảy cao nhất ở mỗi lượt.",
    },
    object_rotate: {
      label: "Xoay vật theo mũi tên",
      description: "Hai lượt: xoay vật thể từng nấc cho tới khi mặt trước hướng theo mũi tên trên mặt đất.",
    },
    behavioral_advanced: {
      label: "Phân tích hành vi",
      description: "Chấm điểm thao tác chuột và bàn phím, người dùng thường không phải giải gì.",
    },
  },
  fallbackDescription: "Loại challenge do máy chủ cung cấp.",
};

export const challengeTypes = { en, vi };

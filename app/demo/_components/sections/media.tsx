import { ScanEye } from "lucide-react";
import Image from "next/image";
import { AnimatedImage } from "@/components/ui/animated-image";
import { AutoCheckPreview } from "@/components/ui/auto-check-preview";
import { Diagram } from "@/components/ui/diagram";
import { Figure } from "@/components/ui/figure";
import { JumpPreview } from "@/components/ui/jump-preview";
import { MediaCard } from "@/components/ui/media-card";
import { RotatePreview } from "@/components/ui/rotate-preview";
import { SlidePreview } from "@/components/ui/slide-preview";
import { SAMPLES } from "@/lib/captchas";
import { DemoBlock, DemoSection } from "../demo-shell";

const slide = SAMPLES.slidePuzzle;
const jump = SAMPLES.animalJump;
const rotate = SAMPLES.objectRotate;

export function MediaSection() {
  return (
    <DemoSection id="media" title="Minh họa">
      <DemoBlock title="Figure" description="Khung minh họa trên nền muted, chú thích nằm dưới. frameClassName để đặt tỉ lệ hoặc nền khác.">
        <Figure caption="Hai challenge image_distort thật, mỗi yêu cầu một mã và một ảnh mới." className="max-w-xl">
          {SAMPLES.imageDistort.map((src) => (
            <Image key={src} src={src} alt="Challenge image_distort mẫu" width={200} height={70} unoptimized className="h-auto w-full max-w-[300px] rounded-md" />
          ))}
        </Figure>
      </DemoBlock>

      <DemoBlock title="Diagram" description="Sơ đồ rộng, một bản vẽ cho giao diện sáng và một cho giao diện tối. Không thu nhỏ dưới 48rem: trên điện thoại khung cuộn ngang; liên kết dưới khung mở kích thước đầy đủ.">
        <Diagram
          light="/diagrams/wau-flow-vi-light.svg"
          dark="/diagrams/wau-flow-vi-dark.svg"
          width={1460}
          height={1158}
          alt="Sơ đồ một lần xác minh gồm 12 bước, giữa website, wau-challenge, wau-verify và Redis"
          caption="Một lần xác minh diễn ra thế nào."
          openLabel="Mở kích thước đầy đủ"
          className="max-w-4xl"
        />
      </DemoBlock>

      <DemoBlock title="AnimatedImage" description="Khung tĩnh có nút phát; ảnh động nặng chỉ tải khi người xem bấm.">
        <AnimatedImage
          poster={SAMPLES.motionNoiseFrame}
          src={SAMPLES.motionNoise}
          width={300}
          height={150}
          alt="Một khung hình motion_noise: chỉ toàn chấm"
          playingAlt="Challenge motion_noise đang chạy"
          playLabel="Phát ảnh động (3 MB)"
        />
      </DemoBlock>

      <DemoBlock title="SlidePreview" description="Mảnh ghép tự trượt vào chỗ trống rồi về, lặp lại; giảm chuyển động thì đứng yên ở đầu. still giữ mảnh ghép ở đầu, như lúc challenge vừa hiện.">
        <div className="grid max-w-3xl items-start gap-6 sm:grid-cols-2">
          <SlidePreview
            background={slide.background}
            piece={slide.piece}
            width={300}
            height={150}
            pieceWidth={slide.width}
            pieceHeight={slide.height}
            targetX={slide.x}
            pieceY={slide.y}
            alt="Challenge slide_puzzle mẫu"
          />
          <SlidePreview
            background={slide.background}
            piece={slide.piece}
            width={300}
            height={150}
            pieceWidth={slide.width}
            pieceHeight={slide.height}
            targetX={slide.x}
            pieceY={slide.y}
            alt="Challenge slide_puzzle mẫu, mảnh ghép ở vị trí đầu"
            still
          />
        </div>
      </DemoBlock>

      <DemoBlock
        title="AutoCheckPreview"
        description="Ô auto_check như trong widget, lặp lại: biểu tượng xoay và chữ đang kiểm tra, rồi Đã xác minh; nút chuyển hiện nhánh dự phòng, với một slide_puzzle đứng yên và chữ yêu cầu giải thêm. still chỉ hiện ô đang kiểm tra, cho thẻ."
      >
        <div className="grid max-w-3xl items-start gap-6 sm:grid-cols-2">
          <AutoCheckPreview
            alt="Ô auto_check: đang kiểm tra, rồi Đã xác minh"
            fallback={{ background: slide.background, piece: slide.piece, width: 300, height: 150, pieceWidth: slide.width, pieceHeight: slide.height, targetX: slide.x, pieceY: slide.y }}
          />
          <AutoCheckPreview
            alt="Ô auto_check đang kiểm tra"
            fallback={{ background: slide.background, piece: slide.piece, width: 300, height: 150, pieceWidth: slide.width, pieceHeight: slide.height, targetX: slide.x, pieceY: slide.y }}
            still
          />
        </div>
      </DemoBlock>

      <DemoBlock title="JumpPreview" description="Hai lượt animal_jump phát nối nhau như trong widget, có bộ đếm lượt; mỗi lần phát dùng URL riêng nên GIF luôn chạy từ đầu.">
        <JumpPreview
          poster={jump.poster}
          rounds={jump.rounds}
          width={300}
          height={150}
          alt="Khung hình đầu của một challenge animal_jump"
          playingAlt="Challenge animal_jump đang phát"
          playLabel="Phát cả hai lượt (240 KB)"
          replayLabel="Xem lại"
        />
      </DemoBlock>

      <DemoBlock
        title="RotatePreview"
        description="Xoay vật thể như trong widget: nút Xoay trái, Xoay phải hoặc phím mũi tên trên ảnh, và chuyển giữa hai lượt; mỗi lượt bắt đầu từ khung 0. still chỉ hiện khung 0 của lượt 1, cho thẻ."
      >
        <div className="grid max-w-3xl items-start gap-6 sm:grid-cols-2">
          <RotatePreview rounds={rotate.rounds} frames={rotate.frames} width={300} height={150} alt="Challenge object_rotate mẫu" />
          <RotatePreview rounds={rotate.rounds} frames={rotate.frames} width={300} height={150} alt="Khung 0 của challenge object_rotate mẫu" still />
        </div>
      </DemoBlock>

      <DemoBlock title="MediaCard" description="Cả thẻ là một link: minh họa, tiêu đề, meta (mã, badge), mô tả và lời mời ở cuối.">
        <ul className="grid max-w-3xl gap-4 sm:grid-cols-2">
          <li>
            <MediaCard
              href="/captchas/slide-puzzle"
              title="Ghép hình trượt"
              meta={<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-overline text-muted-foreground">slide_puzzle</code>}
              description="Kéo mảnh ghép vào đúng chỗ; chuyển động cũng được kiểm tra."
              media={<Image src={slide.background} alt="" width={300} height={150} unoptimized className="h-auto w-full max-w-[450px] rounded-md" />}
              action="Tìm hiểu thêm"
            />
          </li>
          <li>
            <MediaCard
              href="/captchas/behavior"
              title="Kiểm tra hành vi"
              description="Thẻ không có ảnh dùng icon làm minh họa."
              media={<ScanEye aria-hidden className="size-10 text-accent-foreground" />}
              action="Tìm hiểu thêm"
            />
          </li>
        </ul>
      </DemoBlock>
    </DemoSection>
  );
}

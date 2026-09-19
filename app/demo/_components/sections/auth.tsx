import { Alert } from "@/components/ui/alert";
import { getGoogleClientId } from "@/lib/google";
import { DemoBlock, DemoSection } from "../demo-shell";
import { GoogleButtonDemo } from "./google-button-demo";

export function AuthSection() {
  const clientId = getGoogleClientId();

  return (
    <DemoSection
      id="auth"
      title="Đăng nhập"
      description="Nút Sign in with Google do Google Identity Services vẽ: theo giao diện sáng/tối, ngôn ngữ đang chọn và bề rộng khung (tối đa 400 px)."
    >
      {clientId ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <DemoBlock
            title="GoogleSignInButton"
            description="Chọn tài khoản để nhận ID token; token chỉ hiện trong thông báo, không gửi đi đâu."
          >
            <GoogleButtonDemo clientId={clientId} />
          </DemoBlock>
          <DemoBlock title="GoogleSignInButton pending" description="Đang đổi ID token lấy phiên đăng nhập.">
            <GoogleButtonDemo clientId={clientId} pending />
          </DemoBlock>
        </div>
      ) : (
        <DemoBlock title="GoogleSignInButton">
          <Alert tone="warning" title="Chưa có GOOGLE_CLIENT_ID">
            Đặt biến này trong môi trường của dashboard để xem nút thật.
          </Alert>
        </DemoBlock>
      )}
    </DemoSection>
  );
}

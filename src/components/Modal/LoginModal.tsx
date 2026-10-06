import { Button } from "../Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Kakao } from "../../assets/image";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

export default function LoginModal() {
  const { t } = useTranslation();
  const handleKakaoLogin = () => {
    try {
      const clientId = String(import.meta.env.VITE_KAKAO_CLIENT_ID);
      const redirectUri = String(import.meta.env.VITE_KAKAO_REDIRECT_URI);

      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

      window.location.href = kakaoAuthUrl;
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
    }
  };

  return (
    <Dialog>
      <DialogPortal />
      <DialogTrigger asChild>
        <Button variant="gray">{t("header.login")}</Button>
      </DialogTrigger>
      <DialogContent className="w-150">
        <div className="px-20 py-22.5 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="text-4xl font-bold text-scale-600">로그인</div>
            <div className="text-lg text-scale-400">
              처음이면 자동 회원가입 후 이용할 수 있어요.
            </div>
          </div>
          <Button
            variant="kakao"
            onClick={handleKakaoLogin}
            className="flex items-center justify-center gap-2"
          >
            <img src={Kakao} className="w-8 h-8" />
            카카오로 시작하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useKakaoLogin } from "@/hooks/useAuthQuery";
import { useUserInfo } from "@/contexts/UserInfoProvider";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useUserInfo();
  const { mutateAsync } = useKakaoLogin();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        console.error("카카오 code 없음");
        navigate("/");
        return;
      }
      try {
        const userProfile = await mutateAsync(code);
        if (!userProfile) {
          console.error("카카오 로그인 실패");
          navigate("/");
          return;
        }
        if (!userProfile.nickname || !userProfile.profilepic_id) {
          console.log("→ Navigating to profile setup");
          // User needs to set up profile
          navigate("/profile/setup");
        } else {
          console.log("→ Navigating to home");
          // User already has profile, go to home
          navigate("/");
        }
        login(userProfile);
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        navigate("/");
        return;
      }
    };
    handleKakaoCallback();
  }, []);

  return null;
}

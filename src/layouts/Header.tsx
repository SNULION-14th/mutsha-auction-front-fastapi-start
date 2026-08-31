import { Link } from "react-router-dom";
import { Logo } from "../assets/image";

import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import LoginModal from "@/components/Modal/LoginModal";
import ProfileModal from "@/components/Modal/ProfileModal";
import { useUserInfo } from "@/contexts/UserInfoProvider";
import { useState } from "react";
import ProfileSettingModal from "@/components/Modal/ProfileSettingModal";

export default function Header() {
  const { t } = useTranslation();
  const { isLoggedIn, nickname } = useUserInfo();
  const [isProfileSettingModalOpen, setIsProfileSettingModalOpen] = useState(
    () => isLoggedIn && !nickname,
  );

  return (
    <header className="w-full h-22 fixed flex justify-center bg-bg-white mx-auto z-50 shadow-lg">
      <div className="w-full max-w-[1680px] flex justify-between px-8 pc:px-17.5 py-5">
        <Link to="/" className="cursor-pointer flex gap-4.5 items-center">
          <img src={Logo} className="w-9 h-9" />
          <div className="text-3xl text-brand-primary font-bold max-pc:hidden">
            {t("header.title")}
          </div>
        </Link>
        <div className="flex gap-10 items-center">
          <Link to="/auction" className="cursor-pointer">
            <div className="text-lg pc:text-xl text-scale-500">
              {t("header.auction")}
            </div>
          </Link>
          <Link to="/create" className="cursor-pointer">
            <div className="text-lg pc:text-xl text-scale-500">
              {t("header.auction.register")}
            </div>
          </Link>
          <Link to="/history" className="cursor-pointer">
            <div className="text-lg pc:text-xl text-scale-500">
              {t("header.auction.history")}
            </div>
          </Link>
          <LanguageSwitcher />
          {isLoggedIn ? <ProfileModal /> : <LoginModal />}
          <ProfileSettingModal
            isOpen={isProfileSettingModalOpen}
            onOpenChange={setIsProfileSettingModalOpen}
          />
        </div>
      </div>
    </header>
  );
}

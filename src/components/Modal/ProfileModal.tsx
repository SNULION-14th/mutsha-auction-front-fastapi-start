import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Button";
import { Cup } from "@/assets/image";
import { ROUTES } from "@/constants/router";
import { useUserInfo } from "@/contexts/UserInfoProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ProfileSettingModal from "./ProfileSettingModal";
import PointChargeModal from "./PointChargeModal";

export default function ProfileModal() {
  const navigate = useNavigate();
  const { nickname, profileImage, points, logout } = useUserInfo();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME.ROOT);
  };

  const [isProfileSettingModalOpen, setIsProfileSettingModalOpen] =
    useState(false);
  const [isPointChargeModalOpen, setIsPointChargeModalOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="gray">{"프로필"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="p-6 flex flex-col gap-5 w-55 border border-brand-secondary rounded-xl bg-white"
      >
        <ProfileSettingModal
          isOpen={isProfileSettingModalOpen}
          onOpenChange={setIsProfileSettingModalOpen}
        >
          <div className="flex items-center gap-2">
            <img
              src={profileImage ?? "https://via.placeholder.com/80"}
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="text-lg font-bold text-scale-600">{nickname}</div>
          </div>
        </ProfileSettingModal>

        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-1">
            <img src={Cup} className="w-8.5" />
            <div className="text-lg font-bold text-scale-500">포인트</div>
          </div>
          <div className="text-lg font-bold text-scale-600">
            <Link to="/payment/history" className="text-brand-primary">
              {points.toLocaleString()}
            </Link>
            잔
          </div>
        </div>
        <PointChargeModal
          open={isPointChargeModalOpen}
          onOpenChange={setIsPointChargeModalOpen}
        >
          <Button variant="primary" size="small" isRounded={true}>
            충전하기
          </Button>
        </PointChargeModal>
        <button
          onClick={handleLogout}
          className="flex items-center text-base text-scale-400 underline underline-offset-1 cursor-pointer"
        >
          로그아웃
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

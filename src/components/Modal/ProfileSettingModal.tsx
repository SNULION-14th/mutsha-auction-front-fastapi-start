import { Button } from "../Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Edit,
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
} from "../../assets/image";
import { useState } from "react";
import { useUpdateUserProfile } from "@/hooks/useAuthQuery";
import { useUserInfo } from "@/contexts/UserInfoProvider";
import ProfileImageModal from "./ProfileImageModal";
import { DialogPortal } from "@radix-ui/react-dialog";

const PROFILE_IMAGES = [
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
];

export default function ProfileSettingModal({
  isOpen,
  onOpenChange,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children?: React.ReactNode;
}) {
  const { nickname: userNickname } = useUserInfo();
  const [nickname, setNickname] = useState(userNickname);

  const { isPending, mutateAsync } = useUpdateUserProfile();

  const { profileImage } = useUserInfo();

  const [selectedProfileImage, setSelectedProfileImage] = useState<string>(
    profileImage ?? PROFILE_IMAGES[0],
  );

  const onlyAllowed = /^[0-9A-Za-z\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]+$/u;
  const tooLong = nickname.length > 10;
  const invalidChars = !onlyAllowed.test(nickname);
  const empty = nickname.length === 0;

  const showWarning = !empty && (tooLong || invalidChars);
  const canSubmit = !empty && !tooLong && !invalidChars && !isPending;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    await mutateAsync({
      nickname,
      profilepic_id: PROFILE_IMAGES.indexOf(selectedProfileImage) + 1,
    });
    onOpenChange(false);
  };

  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogPortal />
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-180">
          <div className="px-20 py-22.5 flex flex-col gap-20">
            <div className="text-4xl font-bold text-scale-600">프로필 설정</div>
            <div className="flex flex-col gap-12.5">
              <div className="mx-auto relative w-28 h-28">
                <img
                  src={selectedProfileImage}
                  className="w-28 h-28 rounded-full object-cover"
                />

                <ProfileImageModal
                  isOpen={isProfileImageModalOpen}
                  onOpenChange={setIsProfileImageModalOpen}
                  onSave={(selected) => setSelectedProfileImage(selected)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <input
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                  placeholder="닉네임(최대 10자)"
                  className="w-full h-14 rounded-xl border border-black/10 px-5 outline-none focus:border-brand-primary"
                />
                {showWarning && (
                  <p className="text-sm text-red-500">
                    *10자 이내의 한글, 숫자, 영문자를 입력해주세요.
                  </p>
                )}
              </div>
              <Button
                variant={canSubmit ? "primary" : "disabled"}
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="h-14"
              >
                {isPending ? "저장 중..." : "멋시장 시작하기"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

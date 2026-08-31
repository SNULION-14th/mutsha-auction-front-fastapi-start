import { Button } from "../Button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
  Edit,
} from "../../assets/image";
import { useState, useEffect } from "react";
import { useUserInfo } from "@/contexts/UserInfoProvider";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";

const CANDIDATES = [
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
] as const;

export default function ProfileImageModal({
  onSave,
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (selected: string) => void;
}) {
  const { profileImage } = useUserInfo();
  const [selected, setSelected] = useState<string>(
    profileImage ?? CANDIDATES[0],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal />
      <DialogTrigger asChild>
        <button
          className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
          aria-label="edit profile image"
        >
          <img src={Edit} className="w-9 h-9" />
        </button>
      </DialogTrigger>
      <DialogContent className="w-105">
        <div className="px-8.5 pt-20 pb-5 flex flex-col gap-15 items-center">
          <div className="text-2xl font-bold text-scale-600">
            프로필 이미지 고르기
          </div>
          <div className="grid grid-cols-3 px-10 gap-8">
            {CANDIDATES.map((candidate) => {
              const isSel = selected === candidate;
              return (
                <button
                  key={candidate}
                  onClick={() => {
                    setSelected(candidate);
                  }}
                  className={`group relative w-20 h-20 rounded-full overflow-hidden ${isSel ? "ring-4 ring-brand-primary" : "ring-0"}`}
                >
                  <img src={candidate} className="w-full h-full object-cover" />
                  <span
                    className={`absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity ${isSel ? "opacity-100" : ""}`}
                  />
                </button>
              );
            })}
          </div>
          <Button
            variant="primary"
            onClick={() => {
              onSave(selected);
              onOpenChange(false);
            }}
            className="w-90 h-14"
          >
            저장하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

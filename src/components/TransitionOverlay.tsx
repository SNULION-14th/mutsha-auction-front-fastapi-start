import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LionCanvas } from "./LionModel";

export type TransitionScenario = "not-highest" | "highest" | "win" | "lose";

type Props = {
  open: boolean;
  scenario: TransitionScenario;
  onDone: () => void;
};

const MESSAGE: Record<TransitionScenario, string> = {
  "not-highest":
    "아쉽지만 다른 분이 더 높은 금액을 제시했어요.\n다시 도전해보시겠어요?",
  highest: "멋져요! 현재 최고 입찰자예요 🎉\n모두가 당신을 따라오고 있어요.",
  win: "축하합니다! 경매에서 최종 승자가 되셨어요 🏆\n멋진 선택이에요.",
  lose: "아쉽네요... 이번에는 다른 분이 낙찰을 가져갔어요.\n다음 경매에서는 꼭 성공하실 거예요!",
};

const STEP: Record<TransitionScenario, 0 | 1 | 2> = {
  "not-highest": 0,
  lose: 1,
  highest: 2,
  win: 2,
};

export default function TransitionOverlay({ open, scenario, onDone }: Props) {
  const [durationMs, setDurationMs] = useState(2200);
  const step = STEP[scenario];

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onDone, durationMs + 300);
    return () => clearTimeout(t);
  }, [open, durationMs, onDone]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center">
        <LionCanvas
          step={step}
          onPlay={(sec) => setDurationMs(Math.max(1200, sec * 1000))}
        />
        <div className="whitespace-pre-line text-center text-bg-white text-2xl pc:text-4xl font-bold">
          {MESSAGE[scenario]}
        </div>
      </div>
    </div>,
    document.body,
  );
}

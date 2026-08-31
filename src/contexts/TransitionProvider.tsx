import TransitionOverlay from "@/components/TransitionOverlay";
import { TransitionScenario } from "@/components/TransitionOverlay";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type PlayArgs = { scenario: TransitionScenario; to?: string };

type Ctx = {
  playing: boolean;
  playTransition: (args: PlayArgs) => void;
};

const TransitionCtx = createContext<Ctx | null>(null);

export function TransitionProvider({ children }: PropsWithChildren) {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [scenario, setScenario] = useState<TransitionScenario>("highest");
  const [target, setTarget] = useState<string | undefined>(undefined);

  const playTransition = useCallback(({ scenario, to }: PlayArgs) => {
    setScenario(scenario);
    setTarget(to);
    setOpen(true);
  }, []);

  return (
    <TransitionCtx.Provider value={{ playing: open, playTransition }}>
      {children}
      <TransitionOverlay
        open={open}
        scenario={scenario}
        onDone={() => {
          const t = target;
          setOpen(false);
          setTarget(undefined);
          if (t) nav(t);
        }}
      />
    </TransitionCtx.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionCtx);
  if (!ctx)
    throw new Error("useTransition must be used within TransitionProvider");
  return ctx;
}

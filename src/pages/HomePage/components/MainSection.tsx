import { useTranslation } from "react-i18next";
import {
  BlackRect,
  Card1,
  Card2,
  Card3,
  GradientBg,
  LandingBg,
  LionCoin1,
  LionCoin2,
  LionCoin3,
  LionCoin4,
  LionCoin5,
  MutSaja,
  LogoWhite,
} from "../../../assets/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function MainSection() {
  const { t } = useTranslation();

  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const gradientBgRef = useRef<HTMLImageElement | null>(null);
  const section1GroupRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const card1Ref = useRef<HTMLImageElement | null>(null);
  const card2Ref = useRef<HTMLImageElement | null>(null);
  const card3Ref = useRef<HTMLImageElement | null>(null);
  const mutSajaRef = useRef<HTMLImageElement | null>(null);
  const darkOverlayRef = useRef<HTMLDivElement | null>(null);

  const landingBgRef = useRef<HTMLImageElement | null>(null);
  const section2TextGroupRef = useRef<HTMLDivElement | null>(null);
  const blackRectRef = useRef<HTMLImageElement | null>(null);
  const coinsGroupRef = useRef<HTMLDivElement | null>(null);

  const sectionTopRef = useRef(0);

  const maxScroll = typeof window !== "undefined" ? window.innerHeight * 4 : 1;

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

  const rangeProgress = (p: number, start: number, end: number) =>
    clamp01((p - start) / (end - start || 1));

  useEffect(() => {
    if (!outerRef.current) return;

    sectionTopRef.current = outerRef.current.offsetTop;

    updateAnimations(0);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const relative = scrollY - sectionTopRef.current;
      const progress = clamp01(relative / maxScroll);
      updateAnimations(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateAnimations = (progress: number) => {
    const P1_END = 0.25;
    const P2_END = 0.4;
    const P3_END = 0.6;
    const P4_END = 0.75;

    const phase1 = rangeProgress(progress, 0, P1_END);
    const phase2 = rangeProgress(progress, P1_END, P2_END);
    const phase3 = rangeProgress(progress, P2_END, P3_END);
    const phase4 = rangeProgress(progress, P3_END, P4_END);
    const phase5 = rangeProgress(progress, P4_END, 1);

    // === PHASE 1: 카드 들어오기 ===
    if (gradientBgRef.current) {
      gsap.to(gradientBgRef.current, { opacity: 1, duration: 0, ease: "none" });
    }
    if (section1GroupRef.current) {
      gsap.to(section1GroupRef.current, {
        opacity: 1,
        y: 0,
        duration: 0,
        ease: "none",
      });
    }

    const segment = 1 / 3;
    const speedCurve = (v: number) => Math.pow(v, 0.6);
    const START_Y = 140;

    const rawCard1 = clamp01(phase1 / segment);
    const rawCard2 = clamp01((phase1 - segment) / segment);
    const rawCard3 = clamp01((phase1 - 2 * segment) / segment);

    const card1Phase = speedCurve(rawCard1);
    const card2Phase = speedCurve(rawCard2);
    const card3Phase = speedCurve(rawCard3);

    if (card1Ref.current) {
      gsap.to(card1Ref.current, {
        opacity: card1Phase,
        y: START_Y * (1 - card1Phase),
        duration: 0,
        ease: "none",
      });
    }
    if (card2Ref.current) {
      gsap.to(card2Ref.current, {
        opacity: card2Phase,
        y: START_Y * (1 - card2Phase),
        duration: 0,
        ease: "none",
      });
    }
    if (card3Ref.current) {
      gsap.to(card3Ref.current, {
        opacity: card3Phase,
        y: START_Y * (1 - card3Phase),
        duration: 0,
        ease: "none",
      });
    }

    // === PHASE 2: 카드 회전 + 사자 들어오기 ===
    if (card1Ref.current) {
      gsap.to(card1Ref.current, {
        rotate: -30 * phase2,
        x: -20 * phase2,
        duration: 0,
        ease: "none",
      });
    }
    if (card3Ref.current) {
      gsap.to(card3Ref.current, {
        rotate: 30 * phase2,
        x: 20 * phase2,
        duration: 0,
        ease: "none",
      });
    }
    if (mutSajaRef.current) {
      gsap.to(mutSajaRef.current, {
        opacity: phase2,
        y: 80 * (1 - phase2),
        duration: 0,
        ease: "none",
      });
    }

    let overlayOpacity = 0;
    if (progress >= P1_END && progress <= P2_END) {
      overlayOpacity = 0.4 * phase2;
    } else if (progress > P2_END && progress <= P3_END) {
      overlayOpacity = 0.4 * (1 - phase3);
    } else {
      overlayOpacity = 0;
    }
    if (darkOverlayRef.current) {
      gsap.to(darkOverlayRef.current, {
        opacity: overlayOpacity,
        duration: 0,
        ease: "none",
      });
    }

    // === PHASE 3: 섹션 변경 ===
    if (section1GroupRef.current) {
      gsap.to(section1GroupRef.current, {
        opacity: 1 - phase3,
        y: -180 * phase3,
        duration: 0,
        ease: "none",
      });
    }
    if (gradientBgRef.current) {
      gsap.to(gradientBgRef.current, {
        opacity: 1 - phase3,
        duration: 0,
        ease: "none",
      });
    }

    if (landingBgRef.current) {
      gsap.to(landingBgRef.current, {
        opacity: phase3,
        duration: 0,
        ease: "none",
      });
    }

    const sec2In = phase3;
    const sec2Out = phase4;
    const sec2Opacity = sec2In * (1 - sec2Out);
    const sec2Y = -120 * sec2Out;

    // === PHASE 3-4: 텍스트 들어오기 + 나가기 ===
    if (section2TextGroupRef.current) {
      gsap.to(section2TextGroupRef.current, {
        opacity: sec2Opacity,
        y: sec2Y,
        duration: 0,
        ease: "none",
      });
    }
    if (blackRectRef.current) {
      gsap.to(blackRectRef.current, {
        opacity: sec2Opacity,
        duration: 0,
        ease: "none",
      });
    }

    // === PHASE 5: 코인 ===
    const coinsInPhase = Math.min(phase5 / 0.3, 1);
    const coinsSpeed = Math.pow(coinsInPhase, 0.6);

    if (coinsGroupRef.current) {
      gsap.to(coinsGroupRef.current, {
        opacity: coinsSpeed,
        y: 200 * (1 - coinsSpeed),
        duration: 0,
        ease: "none",
      });
    }
  };

  return (
    <div ref={outerRef} className="w-full">
      <div className="h-[400vh] flex items-start">
        <div
          ref={innerRef}
          className="sticky top-[88px] h-[calc(100vh-88px)] w-full"
        >
          <div className="relative w-full h-full overflow-hidden">
            <img
              ref={gradientBgRef}
              src={GradientBg}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <img
              ref={landingBgRef}
              src={LandingBg}
              className="absolute inset-0 w-full h-full object-cover opacity-0"
            />
            <img
              ref={blackRectRef}
              src={BlackRect}
              className="absolute inset-0 w-full h-full object-cover opacity-0"
            />
            <div
              ref={darkOverlayRef}
              className="absolute inset-0 bg-black opacity-0 pointer-events-none"
            />
            <div
              ref={section1GroupRef}
              className="relative z-10 w-full h-full flex flex-col justify-center items-center py-60 gap-12 text-bg-white"
            >
              <div ref={titleRef} className="text-center">
                <div className="text-5xl pc:text-[60px] font-bold">
                  {t("main.intro")}
                </div>
              </div>
              <div className="flex gap-9 mt-6 w-full h-full items-center justify-center relative">
                <img
                  ref={card1Ref}
                  src={Card1}
                  className="w-40 pc:w-60 opacity-0 origin-top-right"
                />
                <img
                  ref={card2Ref}
                  src={Card2}
                  className="w-40 pc:w-60 opacity-0 origin-top"
                />
                <img
                  ref={card3Ref}
                  src={Card3}
                  className="w-40 pc:w-60 opacity-0 origin-top-left"
                />
                <img
                  ref={mutSajaRef}
                  src={MutSaja}
                  className="absolute left-1/2 -translate-x-1/2 bottom-[-280px] w-100 opacity-0 z-20"
                />
              </div>
            </div>
            <div className="absolute w-full inset-0 z-20 flex items-center justify-between px-30 pc:px-50">
              <div
                ref={section2TextGroupRef}
                className="flex flex-col gap-6 text-bg-white opacity-0 translate-y-10"
              >
                <img src={LogoWhite} className="w-12 h-12 pc:w-18 pc:h-18" />
                <div className="text-5xl pc:text-6xl font-bold">
                  {t("main.great")}
                  <br />
                  {t("main.likemarket")}
                </div>
                <div className="text-2xl pc:text-3xl">
                  {t("main.description")}
                </div>
              </div>
            </div>
            <div className="absolute w-full h-screen inset-0 z-30 flex items-center justify-center px-6 pc:px-10">
              <div
                ref={coinsGroupRef}
                className="relative w-full h-screen translate-y-10"
              >
                <img
                  src={LionCoin1}
                  className="absolute top-[15%] right-[12%] w-30 pc:w-40"
                />
                <img
                  src={LionCoin2}
                  className="absolute top-[5%] left-[40%] w-35 pc:w-50"
                />
                <img
                  src={LionCoin3}
                  className="absolute bottom-[32%] left-[20%] w-35 pc:w-50"
                />
                <img
                  src={LionCoin4}
                  className="absolute bottom-[20%] right-[15%] w-35 pc:w-50"
                />
                <img
                  src={LionCoin5}
                  className="absolute top-[24%] left-[12%] w-35 pc:w-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

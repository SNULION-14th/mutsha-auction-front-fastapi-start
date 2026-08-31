import { useNavigate } from "react-router-dom";
import { Phone, Cup, Heart, Hand } from "../../../assets/image";
import { Button } from "../../../components/Button";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type InfoCardProps = {
  image: string;
  title: string;
  description: string;
  detail: string;
};

function InfoCardFront({
  image,
  title,
  description,
  isHovered,
  onHoverChange,
}: InfoCardProps & {
  isHovered: boolean;
  onHoverChange: (v: boolean) => void;
}) {
  return (
    <div
      className="w-full flex max-pc:flex-col items-center rounded-xl p-5 gap-5 shadow-lg [backface-visibility:hidden]"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      style={{
        boxShadow: isHovered
          ? "0 0 18px rgba(223, 102, 33, 0.45)"
          : "0 5px 16px rgba(8, 15, 52, 0.06)",
        backdropFilter: isHovered ? "blur(10px)" : "none",
        WebkitBackdropFilter: isHovered ? "blur(10px)" : "none",
        background: isHovered
          ? "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(223,102,33,0.10))"
          : "rgba(255,255,255,1)",
        transition:
          "box-shadow 200ms ease, background 200ms ease, backdrop-filter 200ms ease, -webkit-backdrop-filter 200ms ease",
      }}
    >
      <div className="w-25 h-25 shrink-0">
        <img src={image} className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0 max-pc:w-full">
        <div className="text-xl text-scale-600 font-bold">{title}</div>
        <div className="text-base text-scale-400 flex-1 truncate">
          {description}
        </div>
      </div>
    </div>
  );
}

function InfoCardBack({ detail }: InfoCardProps) {
  return (
    <div
      className="absolute inset-0 w-full flex items-center justify-center rounded-xl p-12 gap-5 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
      style={{
        background: "linear-gradient(145deg, #EDDACE, #DF6621)",
        color: "#2b1a10",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="text-base leading-relaxed break-keep">{detail}</div>
    </div>
  );
}

function InfoCard({ image, title, description, detail }: InfoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => setIsFlipped((prev) => !prev);

  return (
    <div className="w-full [perspective:1000px]">
      <div
        className={`
          relative w-full
          rounded-xl
          transition-transform duration-700
          [transform-style:preserve-3d]
          cursor-pointer
          ${isFlipped ? "[transform:rotateY(180deg)]" : ""}
        `}
        onClick={flipCard}
      >
        <InfoCardFront
          image={image}
          title={title}
          description={description}
          detail={detail}
          isHovered={isHovered}
          onHoverChange={setIsHovered}
        />
        <InfoCardBack
          image={image}
          title={title}
          description={description}
          detail={detail}
        />
      </div>
    </div>
  );
}

export function InfoSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const InfoCards: InfoCardProps[] = [
    {
      image: Phone,
      title: t("info.upload.title"),
      description: t("info.upload.description"),
      detail: t("info.upload.detail"),
    },
    {
      image: Cup,
      title: t("info.alcohol.title"),
      description: t("info.alcohol.description"),
      detail: t("info.alcohol.detail"),
    },
    {
      image: Heart,
      title: t("info.registerComplete.title"),
      description: t("info.registerComplete.description"),
      detail: t("info.registerComplete.detail"),
    },
    {
      image: Hand,
      title: t("info.auctionSettle.title"),
      description: t("info.auctionSettle.description"),
      detail: t("info.auctionSettle.detail"),
    },
  ];

  return (
    <div className="w-full px-36 pc:px-50 pt-25">
      <div className="max-w-[1160px] mx-auto flex flex-col gap-15">
        <div className="w-full max-pc:flex-col flex justify-between items-center max-pc:space-y-10">
          <div className="flex flex-col gap-5 max-pc:items-center">
            <div className="text-3xl pc:text-5xl font-bold text-scale-600">
              {t("info.section.title")}
            </div>
            <div className="text-lg pc:text-2xl text-scale-400">
              {t("info.section.description")}
            </div>
          </div>
          <Button
            variant="primary"
            isRounded={true}
            className="w-62.5"
            onClick={() => navigate("/create")}
          >
            {t("info.section.goToRegister")}
          </Button>
        </div>
        <div className="flex flex-col gap-10">
          <div className="w-full text-center text-xl text-scale-400">
            {t("info.section.howToRegister")}
          </div>
          <div className="w-full grid grid-cols-1 pc:grid-cols-2 gap-10 pb-25 border-b border-b-scale-200">
            {InfoCards.map((card) => (
              <InfoCard
                key={card.title}
                image={card.image}
                title={card.title}
                description={card.description}
                detail={card.detail}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

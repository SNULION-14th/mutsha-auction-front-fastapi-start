import { useNavigate } from "react-router-dom";
import { YhFashion } from "@/assets/dummy";
import { Button } from "@/components/Button";
import { useState, useEffect } from "react";
import { type AuctionListItem, getRecommendedAuctions } from "@/apis/api";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/Skeleton";

type CardProps = {
  image: string;
  title: string;
  description: string;
  auctionId: number;
  onCardClick: (auctionId: number) => void;
};

function RecommendCard({
  image,
  title,
  description,
  auctionId,
  onCardClick,
}: CardProps) {
  return (
    <div
      className="w-full flex flex-col items-start bg-bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={() => onCardClick(auctionId)}
    >
      <div className="h-56 pc:h-72 w-full flex justify-center overflow-hidden">
        <img
          src={image}
          className="h-full w-full object-cover rounded-t-xl"
          alt={title}
          onError={(e) => {
            e.currentTarget.src = YhFashion;
          }}
        />
      </div>
      <div className="flex flex-col gap-1.5 w-full px-6 py-5">
        <div className="text-xl text-scale-600 font-bold">{title}</div>
        <div className="text-base text-scale-400 w-full truncate">
          {description}
        </div>
      </div>
    </div>
  );
}

export function RecommendSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [recommendedAuctions, setRecommendedAuctions] = useState<
    AuctionListItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const auctions = await getRecommendedAuctions();
        setRecommendedAuctions(Array.isArray(auctions) ? auctions : []);
      } catch {
        setRecommendedAuctions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCardClick = (auctionId: number) => {
    navigate(`/auction/${auctionId}`);
  };

  return (
    <div className="w-full px-36 pc:px-50 pt-25">
      <div className="max-w-[1160px] mx-auto flex flex-col gap-15">
        <div className="w-full max-pc:flex-col flex justify-between items-center max-pc:space-y-10">
          <div className="flex flex-col gap-5 max-pc:items-center">
            <div className="text-3xl pc:text-5xl font-bold text-scale-600">
              {t("recommend.title")}
            </div>
            <div className="text-lg pc:text-2xl text-scale-400">
              {t("recommend.description")}
            </div>
          </div>
          <Button
            variant="primary"
            isRounded
            className="w-62.5"
            onClick={() => navigate("/auction")}
          >
            {t("recommend.button")}
          </Button>
        </div>

        <div className="w-full grid grid-cols-1 pc:grid-cols-2 gap-10 pb-25 border-b border-b-scale-200">
          {loading ? (
            <>
              <div className="w-full flex flex-col items-start bg-bg-white rounded-xl shadow-lg">
                <Skeleton
                  className="h-56 pc:h-72 w-full flex justify-center rounded-t-xl"
                  rounded="none"
                />
                <div className="flex flex-col gap-1.5 w-full px-6 py-5">
                  <Skeleton className="h-6 w-30" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
              <div className="w-full flex flex-col items-start bg-bg-white rounded-xl shadow-lg">
                <Skeleton
                  className="h-72 w-full flex justify-center rounded-t-xl"
                  rounded="none"
                />
                <div className="flex flex-col gap-1.5 w-full px-6 py-5">
                  <Skeleton className="h-6 w-30" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </>
          ) : Array.isArray(recommendedAuctions) &&
            recommendedAuctions.length > 0 ? (
            recommendedAuctions.map((auction) => (
              <RecommendCard
                key={auction.id}
                image={auction.image_file_url || auction.image_url || YhFashion}
                title={auction.title}
                description={auction.description}
                auctionId={auction.id}
                onCardClick={handleCardClick}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-20">
              <div className="text-xl text-scale-500">
                {t("recommend.no_recommend")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

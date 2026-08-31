import { Cup, LogoWhite } from "@/assets/image";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router-dom";

export type CardProps = {
  id: number;
  img: string;
  title: string;
  description: string;
  current_price: number;
};

export function AuctionCard({
  id,
  img,
  title,
  description,
  current_price,
}: CardProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-109 flex flex-col bg-white shadow-lg rounded-xl">
      <img src={img} className="w-full h-68 object-cover rounded-t-xl" />
      <div className="w-full flex flex-col gap-1.5 px-6 py-5">
        <div className="text-lg font-bold text-scale-600">{title}</div>
        <div className="text-base text-scale-400 truncate max-w-70">
          {description}
        </div>
      </div>
      <div className="w-full flex px-6 justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="text-base font-bold text-scale-400">현재 입찰가</div>
          <div className="flex gap-1 items-center">
            <img src={Cup} className="w-6" />
            <div className="text-xl font-bold text-brand-primary">
              {current_price}잔
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          className="flex gap-2.5 p-2.5 w-16 pc:w-27.5 h-9.5 items-center justify-center"
          onClick={() => navigate(`/auction/${id}`)}
        >
          <img src={LogoWhite} className="w-4" />
          <div className="text-base font-bold text-bg-white max-pc:hidden">
            입찰
          </div>
        </Button>
      </div>
    </div>
  );
}

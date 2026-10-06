import { Cup } from "@/assets/image";
import { digitsOnly } from "@/utils/auction";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "./type";

export function StartPriceField({ control }: Pick<FormFieldProps, "control">) {
  return (
    <Controller
      name="startPrice"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-scale-600">시작가</label>
          <div className="flex items-center gap-6">
            <img src={Cup} className="w-10" />
            <input
              inputMode="numeric"
              value={value || ""}
              onChange={(e) => {
                const digits = digitsOnly(e.target.value);
                onChange(digits ? Number(digits) : 0);
              }}
              className="w-24 text-2xl pc:text-3xl font-bold text-brand-primary bg-transparent border-b-2 border-scale-300 focus:border-brand-primary outline-none text-center"
            />
            <span className="text-2xl pc:text-3xl font-bold text-scale-500">
              잔
            </span>
          </div>
          {error && (
            <p className="text-point-warning text-base mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

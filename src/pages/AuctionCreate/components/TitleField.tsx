import { memo } from "react";
import { FormFieldProps } from "./type";

export const TitleField = memo(
  ({
    register,
    formState: { errors },
  }: Pick<FormFieldProps, "register" | "formState">) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold text-scale-600">상품명</label>
        <input
          {...register("title")}
          placeholder="예: 빈티지 가죽 자켓"
          className="w-full h-14 rounded-md border border-scale-200 focus:border-brand-primary outline-none px-4 text-base text-scale-500 placeholder:text-scale-300"
        />
        {errors.title && (
          <p className="text-point-warning text-base mt-1">
            {errors.title.message}
          </p>
        )}
      </div>
    );
  },
);

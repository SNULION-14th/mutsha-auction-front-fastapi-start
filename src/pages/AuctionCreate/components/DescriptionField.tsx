import { FormFieldProps } from "./type";
import { memo } from "react";

export const DescriptionField = memo(
  ({
    register,
    formState: { errors },
  }: Pick<FormFieldProps, "register" | "formState">) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold text-scale-600">상품 설명</label>
        <textarea
          {...register("description")}
          placeholder="상품의 상태, 사용 이력, 특징 등을 작성해주세요."
          className="w-full min-h-36 rounded-md border border-scale-200 focus:border-brand-primary outline-none p-4 text-base text-scale-500 placeholder:text-scale-300"
        />
        {errors.description && (
          <p className="text-point-warning text-base mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
    );
  },
);

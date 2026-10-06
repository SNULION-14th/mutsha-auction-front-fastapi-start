import { digitsOnly } from "@/utils/auction";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "./type";

export function DurationField({
  control,
  formState: { errors },
}: Pick<FormFieldProps, "control" | "formState">) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-bold text-scale-600">경매 기간</label>
      <div className="flex items-center gap-5 text-scale-500">
        <Controller
          name="duration.days"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-2">
              <input
                inputMode="numeric"
                value={value}
                onChange={(e) => {
                  const digits = digitsOnly(e.target.value);
                  onChange(digits ? Number(digits) : 0);
                }}
                className="w-16 text-2xl pc:text-3xl font-bold bg-transparent border-b-2 border-scale-300 focus:border-brand-primary outline-none text-center"
              />
              <span className="text-2xl pc:text-3xl pb-1">d</span>
            </div>
          )}
        />
        <Controller
          name="duration.hours"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-2">
              <input
                inputMode="numeric"
                value={String(value).padStart(2, "0")}
                onChange={(e) => {
                  const digits = digitsOnly(e.target.value);
                  const num = digits ? Number(digits) : 0;
                  onChange(Math.min(num, 23));
                }}
                className="w-16 text-2xl pc:text-3xl font-bold bg-transparent border-b-2 border-scale-300 focus:border-brand-primary outline-none text-center"
              />
              <span className="text-2xl pc:text-3xl pb-1">h</span>
            </div>
          )}
        />
        <Controller
          name="duration.minutes"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-2">
              <input
                inputMode="numeric"
                value={String(value).padStart(2, "0")}
                onChange={(e) => {
                  const digits = digitsOnly(e.target.value);
                  const num = digits ? Number(digits) : 0;
                  onChange(Math.min(num, 59));
                }}
                className="w-16 text-2xl pc:text-3xl font-bold bg-transparent border-b-2 border-scale-300 focus:border-brand-primary outline-none text-center"
              />
              <span className="text-2xl pc:text-3xl pb-1">m</span>
            </div>
          )}
        />
      </div>
      {errors.duration && (
        <p className="text-point-warning text-base mt-1">
          {errors.duration.message}
        </p>
      )}
    </div>
  );
}

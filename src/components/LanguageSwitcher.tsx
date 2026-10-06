"use client";

import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Language } from "@/assets/image";

const LANGUAGE_MAP = {
  ko: "🇰🇷 한국어",
  en: "🇺🇸 English",
  ja: "🇯🇵 日本語",
} as const;

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: "ko" | "en" | "ja") => {
    i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
        <img src={Language} className="w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] border-transparent bg-white shadow-sm shadow-amber-50"
      >
        {Object.keys(LANGUAGE_MAP).map((lang) => (
          <LanguageSwitcherItem
            key={lang}
            language={lang as "ko" | "en" | "ja"}
            onClick={() => changeLanguage(lang as "ko" | "en" | "ja")}
            className={cn(currentLang === lang && "bg-amber-100")}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LanguageSwitcherItem = ({
  language,
  onClick,
  className,
}: {
  language: keyof typeof LANGUAGE_MAP;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn("cursor-pointer", className)}
    >
      {LANGUAGE_MAP[language]}
    </DropdownMenuItem>
  );
};

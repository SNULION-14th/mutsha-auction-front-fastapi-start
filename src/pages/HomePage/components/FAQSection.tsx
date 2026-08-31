import { useState } from "react";
import { useTranslation } from "react-i18next";

function FAQAccordion({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex flex-col justify-center rounded-xl px-12.5 py-10 shadow-lg w-full bg-bg-white ${isOpen ? "border-2 border-brand-primary ring-4 ring-brand-primary/15" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold truncate">{question}</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg
            className={`transition-transform transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="text-lg text-left mt-4">{answer}</div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const { t } = useTranslation();
  const FQAs = [
    {
      question: t("faq.question1"),
      answer: t("faq.answer1"),
    },
    {
      question: t("faq.question2"),
      answer: t("faq.answer2"),
    },
    {
      question: t("faq.question3"),
      answer: t("faq.answer3"),
    },
    {
      question: t("faq.question4"),
      answer: t("faq.answer4"),
    },
  ];

  return (
    <div className="w-full px-30 pc:px-50 py-25">
      <div className="max-w-[1160px] mx-auto flex flex-col gap-15">
        <div className="text-5xl font-bold text-scale-600">FAQs</div>
        <div className="w-full flex flex-col gap-7.5">
          {FQAs.map((fqa) => (
            <FAQAccordion
              key={fqa.question}
              question={fqa.question}
              answer={fqa.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

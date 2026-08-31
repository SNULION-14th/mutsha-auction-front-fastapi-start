import { useEffect, useRef } from "react";
import { FAQSection } from "./components/FAQSection";
import { InfoSection } from "./components/InfoSection";
import { MainSection } from "./components/MainSection";
import { RecommendSection } from "./components/RecommendSection";

function HomePage() {
  const recommendSectionRef = useRef(null);
  const infoSectionRef = useRef(null);
  const faqSectionRef = useRef(null);

  const sections = [recommendSectionRef, infoSectionRef, faqSectionRef];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0");
          } else {
            entry.target.classList.add("opacity-0");
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    sections.forEach((section) => {
      if (section.current) {
        observer.observe(section.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.current) {
          observer.unobserve(section.current);
        }
      });
    };
  }, []);

  return (
    <div className="w-full relative flex flex-col items-center">
      <div className="w-full transition duration-1000">
        <MainSection />
      </div>
      <div
        ref={recommendSectionRef}
        className="w-full transition duration-1000"
      >
        <RecommendSection />
      </div>
      <div ref={infoSectionRef} className="w-full transition duration-1000">
        <InfoSection />
      </div>
      <div ref={faqSectionRef} className="w-full transition duration-1000">
        <FAQSection />
      </div>
    </div>
  );
}

export default HomePage;

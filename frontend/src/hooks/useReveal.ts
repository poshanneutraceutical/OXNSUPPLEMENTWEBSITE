import { useEffect } from "react";

export default function useReveal() {
  useEffect(() => {
    const elements =
      document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            target.classList.add("active");
          } else {
            target.classList.remove("active");
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    elements.forEach((element, index) => {
      const delay =
        element.dataset.delay ??
        String(index * 40);

      element.style.transitionDelay = `${delay}ms`;

      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);
}
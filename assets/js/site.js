(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  try {
    const individualTargets = document.querySelectorAll(
      ".section-head, .persona, .device-card, .ui-block, .phone-figure, .notes li, .brand-mark-stage, .brand-copy"
    );
    // Greeny chapters enter as a unit, keeping headings and their content in
    // the same reading sequence. Other pages retain their existing targets.
    const revealTargets = [
      ...document.querySelectorAll('.greeny-case-study > .section'),
      ...Array.from(individualTargets).filter(el => !el.closest('.greeny-case-study')),
    ];

    if (!reduceMotion.matches && "IntersectionObserver" in window) {
      revealTargets.forEach((el) => el.classList.add("reveal"));

      const reveal = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            reveal.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );

      revealTargets.forEach((el) => reveal.observe(el));
    }

    const navLinks = Array.from(document.querySelectorAll(".site-nav a")).filter(
      (link) => (link.getAttribute("href") || "").startsWith("#")
    );
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
      const nav = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => link.removeAttribute("aria-current"));
            const active = navLinks.find(
              (link) => link.getAttribute("href") === "#" + entry.target.id
            );
            if (active) active.setAttribute("aria-current", "true");
          });
        },
        { rootMargin: "-42% 0px -52% 0px" }
      );

      sections.forEach((section) => nav.observe(section));
    }
  } catch (error) {
    // Never leave content hidden if an observer fails.
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }
})();

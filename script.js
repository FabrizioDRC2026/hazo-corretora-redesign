const body = document.body;
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const moreToggle = document.querySelector("[data-more-toggle]");
const navMore = document.querySelector(".nav-more");

const closeNav = () => {
  body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Abrir menu");
};

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

nav?.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a") : null;
  if (link) {
    closeNav();
  }
});

moreToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  navMore?.classList.toggle("is-open");
});

document.addEventListener("click", (event) => {
  if (navMore && !navMore.contains(event.target)) {
    navMore.classList.remove("is-open");
  }

  if (
    body.classList.contains("nav-open") &&
    nav &&
    navToggle &&
    event.target instanceof Node &&
    !nav.contains(event.target) &&
    !navToggle.contains(event.target)
  ) {
    closeNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
    navMore?.classList.remove("is-open");
  }
});

document.querySelectorAll("[data-lead-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const topic = form.getAttribute("data-topic") || "Atendimento";
    const fields = [];

    for (const [key, value] of data.entries()) {
      const text = String(value).trim();
      if (!text) continue;
      const label = {
        name: "Nome",
        phone: "Telefone",
        email: "E-mail",
        interest: "Interesse",
        vehicle: "Veículo",
        amount: "Valor",
        downpayment: "Entrada",
        term: "Prazo",
        time: "Melhor horário",
        notes: "Observações",
      }[key] || key;
      fields.push(`${label}: ${text}`);
    }

    const message = [`Olá, Hazo! Quero atendimento sobre ${topic}.`, ...fields].join("\n");
    window.open(`https://wa.me/5517991341441?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
});

document.querySelectorAll("[data-feedback-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const cards = Array.from(carousel.querySelectorAll(".review-card"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let active = 0;

  if (!track || cards.length === 0) return;

  const visibleCards = () => {
    if (window.matchMedia("(max-width: 700px)").matches) return 1;
    if (window.matchMedia("(max-width: 1060px)").matches) return 2;
    return 3;
  };

  const updateCarousel = () => {
    const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 0;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const maxActive = Math.max(0, cards.length - visibleCards());
    active = Math.min(active, maxActive);
    track.style.transform = `translateX(${-active * (cardWidth + gap)}px)`;
    prev?.toggleAttribute("disabled", active === 0);
    next?.toggleAttribute("disabled", active === maxActive);
  };

  prev?.addEventListener("click", () => {
    active = Math.max(0, active - 1);
    updateCarousel();
  });

  next?.addEventListener("click", () => {
    active += 1;
    updateCarousel();
  });

  window.addEventListener("resize", updateCarousel);
  updateCarousel();
});

const revealItems = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

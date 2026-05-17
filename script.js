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
  if (event.target instanceof HTMLAnchorElement) {
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

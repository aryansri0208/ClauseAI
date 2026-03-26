function smoothScrollTo(hash) {
  var target = document.querySelector(hash);
  if (!target) return;
  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });
}

function setupScrollLinks() {
  var links = document.querySelectorAll("[data-scroll-to]");
  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var target = link.getAttribute("data-scroll-to");
      if (!target) return;
      smoothScrollTo(target);
    });
  });
}

function setupYear() {
  var el = document.getElementById("year");
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}

function setupArchTabs() {
  var tabs = document.querySelectorAll("[data-arch-tab]");
  var views = document.querySelectorAll("[data-arch-view]");
  if (!tabs.length || !views.length) return;

  function activate(view) {
    tabs.forEach(function (tab) {
      var key = tab.getAttribute("data-arch-tab");
      var isActive = key === view;
      tab.classList.toggle("arch-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    views.forEach(function (panel) {
      var key = panel.getAttribute("data-arch-view");
      var visible = key === view;
      panel.classList.toggle("hidden", !visible);
      if (visible) animateArchNodes(panel);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var view = tab.getAttribute("data-arch-tab");
      if (!view) return;
      activate(view);
    });
  });

  var initial = document.querySelector("[data-arch-tab].arch-active");
  var initialView =
    (initial && initial.getAttribute("data-arch-tab")) || "decision";
  activate(initialView);
}

function setupSectionTabs() {
  var tabs = document.querySelectorAll("[data-section-tab]");
  var panels = document.querySelectorAll("[data-section-view]");
  if (!tabs.length || !panels.length) return;

  function activate(view) {
    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-section-tab") === view;
      tab.classList.toggle("section-tab-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    panels.forEach(function (panel) {
      panel.classList.toggle("hidden", panel.getAttribute("data-section-view") !== view);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activate(tab.getAttribute("data-section-tab"));
    });
  });

  // "Watch demo" button: activate tab AND scroll to section
  document.querySelectorAll("[data-scroll-to-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activate(btn.getAttribute("data-scroll-to-tab"));
      smoothScrollTo("#how-it-works");
    });
  });

  // Activate default tab
  var initial = document.querySelector("[data-section-tab].section-tab-active");
  activate((initial && initial.getAttribute("data-section-tab")) || "overview");
}

function animateArchNodes(view) {
  if (!view) return;
  var layers = Array.from(view.querySelectorAll(".arch-layer, .arch-flow-row"));
  layers.forEach(function (layer, i) {
    layer.style.transition = "none";
    layer.style.opacity = "0";
    layer.style.transform = "translateY(12px)";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        layer.style.transition =
          "opacity 0.4s ease " + i * 0.1 + "s, transform 0.4s ease " + i * 0.1 + "s";
        layer.style.opacity = "1";
        layer.style.transform = "translateY(0)";
      });
    });
  });
}

function setupAnimations() {
  if (!window.IntersectionObserver) return;
  var cards = Array.from(document.querySelectorAll(".how-card"));
  cards.forEach(function (card) {
    card.style.opacity = "0";
    card.style.transform = "translateY(18px)";
  });
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      var i = cards.indexOf(card);
      var delay = i * 0.12;
      card.style.transition =
        "opacity 0.5s ease " + delay + "s, transform 0.5s ease " + delay + "s";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
      setTimeout(function () { card.style.transition = ""; }, (delay + 0.6) * 1000);
      obs.unobserve(card);
    });
  }, { threshold: 0.1 });
  cards.forEach(function (card) { obs.observe(card); });
}

function setupStakeholderCards() {
  var cards = document.querySelectorAll('[data-sc]');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('sc-active');
    });
  });
}

function setupCalendlyModal() {
  var openButtons = document.querySelectorAll("[data-open-calendly]");
  var modal = document.getElementById("calendly-modal");
  var closeBtn = document.getElementById("calendly-close");

  if (!modal || !openButtons.length) return;

  function openModal() {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeModal();
    });
  }

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupScrollLinks();
  setupYear();
  setupAnimations();
  setupArchTabs();
  setupStakeholderCards();
  setupCalendlyModal();
});


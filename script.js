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
  setupArchTabs();
  setupCalendlyModal();
});


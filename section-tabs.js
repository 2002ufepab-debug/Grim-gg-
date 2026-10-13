"use strict";

/* Grim_gg: show one database section at a time while keeping hash navigation. */
(() => {
  const sectionIds = ["home", "heroes", "tierlist", "items", "builds", "favorites", "guides", "counterpicks"];

  function activateSection(requestedId) {
    const activeId = sectionIds.includes(requestedId) ? requestedId : "home";

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) section.hidden = id !== activeId;
    });

    const banner = document.querySelector(".join-banner");
    if (banner) banner.hidden = activeId !== "home";

    const nav = document.getElementById("nav");
    if (nav) {
      nav.querySelectorAll("a[href^='#']").forEach(link => {
        const id = link.getAttribute("href").slice(1);
        if (!sectionIds.includes(id)) return;
        if (id === activeId) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
      nav.classList.remove("open");
    }

    const toggle = document.getElementById("menuToggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
  }

  function syncFromUrl() {
    activateSection(window.location.hash.slice(1));
  }

  document.addEventListener("click", event => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    if (!sectionIds.includes(id)) return;
    event.preventDefault();
    if (window.location.hash !== "#" + id) history.pushState({ section: id }, "", "#" + id);
    activateSection(id);
  });

  window.addEventListener("hashchange", syncFromUrl);
  window.addEventListener("popstate", syncFromUrl);
  document.addEventListener("DOMContentLoaded", syncFromUrl);
})();

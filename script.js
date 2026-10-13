
const DATA_URL = "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/hero.json";
const IMAGE_BASE = "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/images-hero/";

const $ = (id) => document.getElementById(id);
let heroes = [];
let activeRole = "Все";
let searchText = "";

const roleNames = {
  assassin: "Убийца",
  mage: "Маг",
  marksman: "Стрелок",
  fighter: "Боец",
  tank: "Танк",
  support: "Поддержка"
};

const laneMap = {
  assassin: "Лес",
  mage: "Мид",
  marksman: "Голд",
  fighter: "EXP",
  tank: "Роум",
  support: "Роум"
};

const advice = {
  Fanny: "Следи за энергией и маршрутами тросов. Ищи момент, когда контроль врагов уже потрачен.",
  Vexana: "Держись за передней линией и используй контроль, чтобы помогать команде начинать бой.",
  Claude: "Накапливай ресурсы, следи за позициями врагов и выбирай безопасный момент для ультимейта.",
  Belerick: "Прикрывай союзников и старайся принимать на себя атаки противников.",
  Khufra: "Сохраняй навыки контроля для мобильных врагов и согласовывай атаки с командой.",
  Gusion: "Тренируй комбинации навыков и не трать все способности до начала командного боя."
};

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[char]);
}

function getRoles(hero) {
  return Array.isArray(hero.role) ? hero.role : [];
}

function getLanes(hero) {
  return [...new Set(getRoles(hero).map(role => laneMap[role]).filter(Boolean))];
}

function getImage(hero) {
  return IMAGE_BASE + encodeURIComponent(hero["images-hero"] || "");
}

function getAdvice(hero) {
  return advice[hero.name_hero] ||
    "Изучай дальность навыков, следи за мини-картой и подстраивай тактику под состав соперника.";
}

function addSearch() {
  const filters = $("roleFilters");
  if (!filters || $("heroSearch")) return;

  const search = document.createElement("input");
  search.id = "heroSearch";
  search.type = "search";
  search.placeholder = "Поиск героя...";
  search.setAttribute("aria-label", "Поиск героя");
  search.autocomplete = "off";
  search.addEventListener("input", event => {
    searchText = event.target.value.trim().toLocaleLowerCase();
    renderHeroes();
  });

  filters.insertAdjacentElement("afterend", search);
}

function renderHeroes() {
  const grid = $("heroGrid");
  if (!grid) return;

  const filtered = heroes.filter(hero => {
    const name = hero.name_hero.toLocaleLowerCase();
    const roleMatch = activeRole === "Все" || getLanes(hero).includes(activeRole);
    const searchMatch = name.includes(searchText);
    return roleMatch && searchMatch;
  });

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">Герои не найдены. Попробуй другой запрос.</p>';
    return;
  }

  grid.innerHTML = filtered.map(hero => {
    const name = escapeHTML(hero.name_hero);
    const roles = getRoles(hero).map(role => roleNames[role] || role);
    const lanes = getLanes(hero);
    const image = escapeHTML(getImage(hero));
    const tip = escapeHTML(getAdvice(hero));
    const initials = escapeHTML(hero.name_hero.slice(0, 1).toUpperCase());

    return `
      <article class="hero-card">
        <div class="hero-image-wrap">
          <img class="hero-image" src="${image}" alt="${name}"
               loading="lazy" decoding="async"
               onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
          <div class="hero-image-fallback" style="display:none">${initials}</div>
          <span class="hero-id">HERO / ${String(hero.id_hero).padStart(3, "0")}</span>
        </div>
        <div class="hero-card-content">
          <h3>${name}</h3>
          <p class="hero-role">${escapeHTML(roles.join(" / "))}</p>
          <div class="hero-tags">
            ${lanes.map(lane => `<span>${escapeHTML(lane)}</span>`).join("")}
          </div>
          <details class="hero-details">
            <summary>Игровой совет <span>↗</span></summary>
            <p>${tip}</p>
          </details>
        </div>
      </article>`;
  }).join("");

  const count = $("heroCount");
  if (count) count.textContent = `Найдено героев: ${filtered.length}`;
}

function setupFilters() {
  const filters = $("roleFilters");
  if (!filters) return;

  filters.addEventListener("click", event => {
    const button = event.target.closest("[data-role]");
    if (!button) return;

    activeRole = button.dataset.role;
    filters.querySelectorAll("[data-role]").forEach(item => {
      item.classList.toggle("active", item === button);
    });
    renderHeroes();
  });
}

function setupCounterpicks() {
  const select = $("enemySelect");
  const button = $("counterBtn");
  const result = $("counterResult");
  if (!select || !button || !result) return;

  button.addEventListener("click", () => {
    const enemy = select.value;
    if (!enemy) {
      result.innerHTML = "<div class='result-icon'>!</div><div><strong>Выбери героя</strong><p>Сначала укажи героя соперника.</p></div>";
      return;
    }

    const picks = {
      Fanny: ["Khufra", "Minsitthar", "Kaja"],
      Claude: ["Kaja", "Franco", "Saber"],
      Gusion: ["Khufra", "Franco", "Kaja"],
      Ling: ["Khufra", "Minsitthar", "Kaja"],
      Miya: ["Lolita", "Saber", "Natalia"],
      Layla: ["Lolita", "Saber", "Natalia"],
      Hanzo: ["Natalia", "Saber", "Franco"]
    };

    const suggestions = picks[enemy] || ["Khufra", "Franco", "Kaja"];
    result.innerHTML = `
      <div class="result-icon">↗</div>
      <div><strong>Кого рассмотреть против ${escapeHTML(enemy)}?</strong>
      <p>${suggestions.map(escapeHTML).join(" · ")}</p>
      <p>Это ориентир, а не гарантированный контрпик. Учитывай роли, навыки игроков и состав команд.</p></div>`;
  });

  select.addEventListener("change", () => {
    const chosen = select.value;
    if (chosen) {
      const hero = heroes.find(item => item.name_hero === chosen);
      if (hero) select.dataset.selectedHero = hero.name_hero;
    }
  });
}

function setupBuilds() {
  const grid = $("buildGrid");
  if (!grid) return;

  const builds = [
    { name: "Фанни", role: "Лес · Убийца", items: "Урон · Пробивание · Ситуативная защита", tip: "Следи за энергией и выбирай удобные маршруты входа и отхода." },
    { name: "Вексана", role: "Мид · Маг", items: "Магическая сила · Пробивание · Сокращение перезарядки", tip: "Держи дистанцию и помогай команде контролем." },
    { name: "Клод", role: "Голд · Стрелок", items: "Скорость атаки · Критический урон · Защита по ситуации", tip: "Фарми безопасно и выбирай момент для командного боя." },
    { name: "Белерик", role: "Роум · Танк", items: "Защита · Устойчивость · Предметы против состава врага", tip: "Защищай союзников и принимай атаки в подходящий момент." }
  ];

  grid.innerHTML = builds.map(build => `
    <article class="build-card">
      <span class="build-label">BUILD LAB</span>
      <h3>${escapeHTML(build.name)}</h3>
      <p class="build-role">${escapeHTML(build.role)}</p>
      <p>${escapeHTML(build.items)}</p>
      <p class="build-tip">${escapeHTML(build.tip)}</p>
    </article>`).join("");
}

function setupGuides() {
  const detail = $("guideDetail");
  if (!detail) return;

  const guides = {
    team: ["Баланс команды", "Сочетай переднюю линию, магический и физический урон, контроль и героя, который наносит урон по целям. Обсуждай выбор с командой."],
    items: ["Выбор предметов", "Против сильного физического урона рассматривай физическую защиту, против магического — магическую. Учитывай лечение и особенности соперников."],
    map: ["Контроль карты", "Проверяй мини-карту, помогай с важными целями и не начинай бой, если союзники далеко."]
  };

  document.querySelectorAll(".guide-open").forEach(button => {
    button.addEventListener("click", () => {
      const guide = guides[button.dataset.guide];
      if (!guide) return;
      detail.hidden = false;
      detail.innerHTML = `<h3>${escapeHTML(guide[0])}</h3><p>${escapeHTML(guide[1])}</p>`;
      detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

function setupMenu() {
  const toggle = $("menuToggle");
  const nav = $("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

async function loadHeroes() {
  const grid = $("heroGrid");
  if (grid) grid.innerHTML = "<p>Загружаем каталог героев...</p>";

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error("Не удалось загрузить каталог");

    const data = await response.json();
    if (!Array.isArray(data) || !data.length) throw new Error("Каталог пуст");

    heroes = data
      .filter(hero => hero.name_hero && hero["images-hero"])
      .sort((a, b) => a.name_hero.localeCompare(b.name_hero));

    const select = $("enemySelect");
    if (select) {
      select.innerHTML = '<option value="">Выбери героя...</option>' +
        heroes.map(hero =>
          `<option value="${escapeHTML(hero.name_hero)}">${escapeHTML(hero.name_hero)}</option>`
        ).join("");
    }

    const filters = $("roleFilters");
    if (filters) {
      filters.querySelectorAll("[data-role]").forEach(button => {
        button.classList.toggle("active", button.dataset.role === "Все");
      });
    }

    const count = $("heroCount");
    if (count) count.textContent = `Всего героев: ${heroes.length}`;

    renderHeroes();
  } catch (error) {
    if (grid) {
      grid.innerHTML = `<p class="empty-state">Не удалось загрузить каталог героев. Проверь интернет-соединение и обнови страницу.</p>`;
    }
    console.error("Grim_gg:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const year = $("year");
  if (year) year.textContent = new Date().getFullYear();

  const heading = $("heroGrid");
  if (heading && ! $("heroCount")) {
    const count = document.createElement("p");
    count.id = "heroCount";
    count.className = "hero-count";
    heading.insertAdjacentElement("beforebegin", count);
  }

  addSearch();
  setupFilters();
  setupCounterpicks();
  setupBuilds();
  setupGuides();
  setupMenu();
  loadHeroes();
});

"use strict";
(() => {
  const recommendations = {
    "Стрелок": {
      "Агрессивно": [
        ["Стрельба","Swift","Помогает чаще проводить обычные атаки; подходит героям, которым важна скорость атаки."],
        ["Специализация","Weapon Master","Усиливает ценность атакующих характеристик от экипировки и эмблем."],
        ["Темп боя","Quantum Charge","Поддерживает темп перестрелок и помогает менять позицию после атак."]
      ],
      "Командные бои": [
        ["Стрельба","Swift","Вариант для героев, которым нужна стабильная скорость атак."],
        ["Специализация","Weapon Master","Полезен при сборке с заметной долей атакующих характеристик."],
        ["Темп боя","Quantum Charge","Попадания базовыми атаками дают ускорение и восстанавливают здоровье; талант подходит героям, которые часто атакуют обычными атаками."]
      ],
      "Выживаемость": [
        ["Гибкость","Agility","Дополнительная мобильность может помочь держать безопасную дистанцию."],
        ["Специализация","Weapon Master","Оставляет акцент на атакующих характеристиках."],
        ["Выживаемость","Quantum Charge","Может помочь поддерживать дистанцию и темп после атак."]
      ]
    },
    "Убийца": {
      "Агрессивно": [
        ["Пробивание","Rupture","Подходит для атакующего направления с упором на пробивание."],
        ["Охота за целью","Master Assassin","Ориентирован на давление на отдельную цель в подходящей ситуации."],
        ["Взрывной урон","Lethal Ignition","Вариант для комбинаций с быстрым уроном."]
      ],
      "Командные бои": [
        ["Пробивание","Rupture","Атакующее начало сборки; оцени защиту соперников."],
        ["Охота за целью","Master Assassin","Подходит для давления на одиночную цель. Если ты играешь лесником и приоритет — Черепаха и Лорд, оцени Seasoned Hunter вместо него."],
        ["Взрывной урон","Lethal Ignition","Помогает усилить атакующий стиль при подходящих условиях."]
      ],
      "Выживаемость": [
        ["Мобильность","Agility","Может помочь быстрее менять позицию."],
        ["Гибкость","Wilderness Blessing","Рассматривай для перемещений по карте, если талант доступен в текущей версии."],
        ["Серия устранений","Killing Spree","После участия в устранении помогает восстановить здоровье и ускориться."]
      ]
    },
    "Маг": {
      "Агрессивно": [
        ["Пробивание","Rupture","Атакующий выбор против подходящих целей."],
        ["Экономика","Bargain Hunter","Может ускорить выход на ключевые предметы при соблюдении условий таланта."],
        ["Взрывной урон","Lethal Ignition","Для магов, которым важно усилить комбинацию урона."]
      ],
      "Командные бои": [
        ["Пробивание","Rupture","Помогает направить сборку в сторону магического или адаптивного пробивания."],
        ["Экономика","Bargain Hunter","Помогает экономить на предметах и раньше приблизиться к ключевым слотам; оцени пользу скидки в конкретном матче."],
        ["Командный урон","Impure Rage","Рассматривай для героев, которым подходит эффект таланта и его условия."]
      ],
      "Выживаемость": [
        ["Мобильность","Agility","Может помочь занять безопасную позицию."],
        ["Экономика","Bargain Hunter","Помогает планировать ранние покупки, если талант доступен."],
        ["Защита","Brave Smite","Рассматривай только если герой может регулярно активировать его условие."]
      ]
    },
    "Боец": {
      "Агрессивно": [
        ["Пробивание","Rupture","Атакующее направление для раннего давления."],
        ["Дуэль","Festival of Blood","Подходит некоторым бойцам для усиления восстановления в затяжных стычках."],
        ["Давление","Brave Smite","Проверь, насколько часто герой активирует эффект таланта."]
      ],
      "Командные бои": [
        ["Стойкость","Firmness","Защитный вариант против физического давления."],
        ["Восстановление","Festival of Blood","Может быть полезен бойцам, которые долго находятся в бою."],
        ["Командный бой","Brave Smite","Рассматривай для героя с частыми подходящими попаданиями."]
      ],
      "Выживаемость": [
        ["Стойкость","Firmness","Помогает выбрать более защитное направление."],
        ["Выносливость","Tenacity","Проверь условие активации и подходит ли оно твоему герою."],
        ["Восстановление","Brave Smite","Может поддерживать выживаемость при выполнении условий таланта."]
      ]
    },
    "Танк": {
      "Агрессивно": [
        ["Здоровье","Vitality","Защитная основа для героя передней линии."],
        ["Стойкость","Tenacity","Может быть полезен при выполнении условий активации."],
        ["Ответный урон","Concussive Blast","Рассматривай для танков, которым подходит условие эффекта."]
      ],
      "Командные бои": [
        ["Здоровье","Vitality","Помогает выстроить более выносливый профиль."],
        ["Снижение давления","Brave Smite","Проверь применимость эффекта к навыкам героя."],
        ["Ответный урон","Concussive Blast","Вариант для подходящего стиля игры в гуще сражения."]
      ],
      "Выживаемость": [
        ["Стойкость","Firmness","Защитное направление против физического урона."],
        ["Выносливость","Tenacity","Учитывай условие срабатывания таланта."],
        ["Здоровье","Concussive Blast","Сочетай с подходящими защитными характеристиками и проверяй эффект в игре."]
      ]
    },
    "Поддержка": {
      "Агрессивно": [
        ["Мобильность","Agility","Помогает перемещаться и занимать удобную позицию."],
        ["Командная поддержка","Pull Yourself Together","Проверь применимость к выбранному герою и заклинанию."],
        ["Помощь команде","Focusing Mark","Рассматривай, если можешь надёжно помогать команде усиливать фокус по цели."]
      ],
      "Командные бои": [
        ["Мобильность","Agility","Помогает занимать позицию рядом с союзниками."],
        ["Командная поддержка","Pull Yourself Together","Может быть полезен при подходящем наборе заклинаний."],
        ["Помощь команде","Focusing Mark","Направлен на командное давление по отмеченной цели."]
      ],
      "Выживаемость": [
        ["Выносливость","Vitality","Более защитное направление для роли поддержки."],
        ["Командная поддержка","Pull Yourself Together","Проверь, соответствует ли эффект твоему стилю и заклинаниям."],
        ["Защита команды","Focusing Mark","Командный вариант, если условия эффекта подходят герою."]
      ]
    }
  };

  // Shared read-only presets let each hero profile display the same talent choices as the Talent Lab.
  window.GrimGGTalentData = { recommendations, emblemNames: null };

  const emblemNames = {
    "Стрелок":"Эмблема стрелка", "Убийца":"Эмблема убийцы", "Маг":"Эмблема мага",
    "Боец":"Эмблема бойца", "Танк":"Эмблема танка", "Поддержка":"Эмблема поддержки"
  };

  window.GrimGGTalentData.emblemNames = emblemNames;

  const heroesByRole = {
    "Стрелок":["Клинт","Лесли","Кэрри","Клод","Броуди","Мия","Лейла","Беатрис","Мелисса","Иксия","Москов","Ванван","Ханаби","Бруно"],
    "Убийца":["Фанни","Госсен","Линг","Сейбер","Ланселот","Хаябуса","Аамон","Наталья","Хелкарт","Ли Сун Син"],
    "Маг":["Кадита","Вексана","Кагура","Лилия","Люнокс","Сесилион","Ксавьер","Фарса","Аврора","Одэтт","Нана","Эудора","Ло Йи"],
    "Боец":["Руби","Теризла","Сан","Эсмеральда","Юй Чжун","Диррот","Чу","Пакито","Альфа","Джулиан","Икс Борг"],
    "Танк":["Белерик","Хуфра","Тигрил","Атлас","Лолита","Франко","Хилос","Грок","Джонсон","Акай","Фредринн"],
    "Поддержка":["Ангела","Эстес","Флорин","Дигги","Матильда","Рафаэль"]
  };


  const heroEnglishNames = {
    "Клинт":"Clint","Лесли":"Lesley","Кэрри":"Karrie","Клод":"Claude","Броуди":"Brody","Мия":"Miya","Лейла":"Layla","Беатрис":"Beatrix","Мелисса":"Melissa","Иксия":"Ixia","Москов":"Moskov","Ванван":"Wanwan","Ханаби":"Hanabi","Бруно":"Bruno",
    "Фанни":"Fanny","Госсен":"Gusion","Линг":"Ling","Сейбер":"Saber","Ланселот":"Lancelot","Хаябуса":"Hayabusa","Аамон":"Aamon","Наталья":"Natalia","Хелкарт":"Helcurt","Ли Сун Син":"Yi Sun-shin",
    "Кадита":"Kadita","Вексана":"Vexana","Кагура":"Kagura","Лилия":"Lylia","Люнокс":"Lunox","Сесилион":"Cecilion","Ксавьер":"Xavier","Фарса":"Pharsa","Аврора":"Aurora","Одэтт":"Odette","Нана":"Nana","Эудора":"Eudora","Ло Йи":"Luo Yi",
    "Руби":"Ruby","Теризла":"Terizla","Сан":"Sun","Эсмеральда":"Esmeralda","Юй Чжун":"Yu Zhong","Диррот":"Dyrroth","Чу":"Chou","Пакито":"Paquito","Альфа":"Alpha","Джулиан":"Julian","Икс Борг":"X.Borg",
    "Белерик":"Belerick","Хуфра":"Khufra","Тигрил":"Tigreal","Атлас":"Atlas","Лолита":"Lolita","Франко":"Franco","Хилос":"Hylos","Грок":"Grock","Джонсон":"Johnson","Акай":"Akai","Фредринн":"Fredrinn",
    "Ангела":"Angela","Эстес":"Estes","Флорин":"Floryn","Дигги":"Diggie","Матильда":"Mathilda","Рафаэль":"Rafaela"
  };
  const heroArtByName = new Map();
  let heroArtLoaded = false;
  async function loadHeroArt() {
    if (heroArtLoaded) return;
    heroArtLoaded = true;
    try {
      const response = await fetch("https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/hero.json", {cache:"force-cache"});
      if (!response.ok) throw new Error("hero catalog unavailable");
      const rows = await response.json();
      rows.forEach(row => {
        const english = String(row.name_hero || row.name || "").trim().toLowerCase();
        const file = String(row["images-hero"] || "").trim().replace(/^images-hero\//, "");
        if (english && file) heroArtByName.set(english, "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/images-hero/" + file.split("/").map(part => encodeURIComponent(part)).join("/"));
      });
    } catch (_) {
      // The planner remains usable when the optional portrait catalog is offline.
    }
    renderHeroPortrait();
  }
  function renderHeroPortrait() {
    const portrait = document.getElementById("talentHeroPortrait");
    const select = document.getElementById("talentHero");
    if (!portrait || !select) return;
    const english = heroEnglishNames[select.value];
    const url = english ? heroArtByName.get(english.toLowerCase()) : "";
    if (!url) {
      portrait.innerHTML = '<span class="talent-portrait-placeholder" aria-hidden="true">GG</span>';
      portrait.setAttribute("aria-label", "Портрет героя временно недоступен");
      return;
    }
    const img = document.createElement("img");
    img.src = url;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
      portrait.innerHTML = '<span class="talent-portrait-placeholder" aria-hidden="true">GG</span>';
      portrait.setAttribute("aria-label", "Портрет героя временно недоступен");
    }, {once:true});
    portrait.replaceChildren(img);
    portrait.setAttribute("aria-label", "Портрет героя " + select.value);
  }

  function talentIconMarkup(name,index) {
    const key = String(name).toLowerCase();
    const glyph = /swift|agility|quantum|speed|мобиль|стрельб/.test(key) ? "↗"
      : /rupture|master assassin|lethal|ignition|пробив|урон|weapon/.test(key) ? "✦"
      : /firmness|tenacity|vitality|smite|защит|стойк|здоров/.test(key) ? "⬡"
      : /hunter|bargain|seasoned|эконом/.test(key) ? "◈"
      : /festival|blood|rage|восстанов/.test(key) ? "✚"
      : /focusing|pull yourself|support|команд|помощ/.test(key) ? "◎" : ["✦","⬡","◈"][index];
    return '<span class="talent-icon talent-icon-art" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M32 4 54 17v30L32 60 10 47V17Z" fill="#21131d" stroke="#ff8795" stroke-width="2"/><path d="M32 11 48 20v24L32 53 16 44V20Z" fill="none" stroke="#ff8795" stroke-opacity=".4"/><text x="32" y="40" text-anchor="middle" font-size="27" font-family="Arial,sans-serif" font-weight="700" fill="#ffe6eb">' + glyph + '</text></svg></span>';
  }

  // Share the same talent icon renderer with hero profiles and build modals.
  window.GrimGGTalentData.iconMarkup = talentIconMarkup;

  function init() {
    const perks = document.getElementById("perks");
    if (!perks || document.getElementById("talentLab")) return;
    const section = document.createElement("section");
    section.className = "talent-lab";
    section.id = "talentLab";
    section.innerHTML = `
      <div class="section-heading">
        <div><div class="eyebrow">06 / EMBLEM & TALENT LAB</div><h2>ЛАБОРАТОРИЯ <span class="red">ТАЛАНТОВ</span></h2></div>
        <p>Подбирай пример эмблем и талантов под героя и стиль игры.</p>
      </div>
      <p class="talent-intro">Выбери роль, героя и стиль — получишь стартовую комбинацию. Сверено со справочником талантов патча 2.2.16; это ориентир, а не персональная мета-сборка и не официальная рекомендация MOONTON.</p>
      <div class="talent-controls">
        <div class="talent-control"><label for="talentRole">Роль</label><select id="talentRole"><option>Стрелок</option><option>Убийца</option><option>Маг</option><option>Боец</option><option>Танк</option><option>Поддержка</option></select></div>
        <div class="talent-control"><label for="talentHero">Герой</label><select id="talentHero"></select></div>
        <div class="talent-control"><label for="talentStyle">Стиль игры</label><select id="talentStyle"><option>Агрессивно</option><option>Командные бои</option><option>Выживаемость</option></select></div>
      </div>
      <div class="talent-result" aria-live="polite">
        <div class="talent-result-head"><div class="talent-hero-heading"><div class="talent-hero-portrait" id="talentHeroPortrait" role="img" aria-label="Портрет героя"><span class="talent-portrait-placeholder">GG</span></div><div><h3 id="talentResultTitle">Таланты для Клинта</h3><p id="talentResultDesc" class="talent-intro">Рекомендуемая стартовая комбинация.</p></div></div><span class="talent-chip" id="talentRoleChip">СТРЕЛОК</span></div>
        <div class="talent-slots" id="talentSlots"></div>
        <p class="talent-note" id="talentNote">Ориентир по системе талантов патча 2.2.16. Перед матчем сверь эффекты в клиенте MLBB и адаптируй выбор под соперников.</p>
        <div class="talent-actions"><button type="button" id="talentCopy">Копировать комбинацию</button><button type="button" class="secondary" id="talentReset">Сбросить выбор</button></div>
        <p class="talent-status" id="talentStatus" role="status"></p>
      </div>`;
    perks.insertAdjacentElement("afterend", section);

    // The main router runs before this dynamically-created section exists.
    // Match the initial URL so the talent page never leaks into another page.
    const requestedPage = new URLSearchParams(window.location.search).get("page");
    const knownPages = ["home", "heroes", "tierlist", "items", "perks", "builds", "favorites", "guides", "counterpicks", "esports", "hero"];
    if (knownPages.includes(requestedPage)) section.classList.add("page-hidden");

    const roleSelect = section.querySelector("#talentRole");
    const heroSelect = section.querySelector("#talentHero");
    const styleSelect = section.querySelector("#talentStyle");
    function fillHeroes(preferred) {
      const role = roleSelect.value;
      heroSelect.innerHTML = heroesByRole[role].map(name => `<option>${name}</option>`).join("");
      if (preferred && heroesByRole[role].includes(preferred)) heroSelect.value = preferred;
    }
    function render() {
      const role = roleSelect.value, hero = heroSelect.value, style = styleSelect.value;
      const list = recommendations[role][style];
      section.querySelector("#talentResultTitle").textContent = "Таланты: " + hero;
      section.querySelector("#talentResultDesc").textContent = emblemNames[role] + " · стиль: " + style.toLowerCase() + ". Пример комбинации для дальнейшей настройки.";
      section.querySelector("#talentRoleChip").textContent = role.toUpperCase();
      section.querySelector("#talentSlots").innerHTML = list.map((t,i) => `
        <article class="talent-slot"><span class="talent-slot-num">${["ТАЛАНТ I","ТАЛАНТ II","КЛЮЧЕВОЙ"][i]}</span>${talentIconMarkup(t[1],i)}<div><h4>${t[1]}</h4><p>${t[2]}</p></div></article>`).join("");
      section.querySelector("#talentNote").textContent = "Проверяй названия, уровни и эффекты талантов в актуальном клиенте. Подбор примерный: он не учитывает патч, ранг, состав соперника и конкретные игровые условия.";
      section.querySelector("#talentStatus").textContent = "";
      renderHeroPortrait();
    }
    roleSelect.addEventListener("change", () => { fillHeroes(); render(); });
    heroSelect.addEventListener("change", render);
    styleSelect.addEventListener("change", render);
    section.querySelector("#talentReset").addEventListener("click", () => {
      roleSelect.value = "Стрелок"; styleSelect.value = "Агрессивно"; fillHeroes("Клинт"); render();
    });
    section.querySelector("#talentCopy").addEventListener("click", async () => {
      const role = roleSelect.value, hero = heroSelect.value, style = styleSelect.value;
      const list = recommendations[role][style].map((t,i) => (i+1)+". "+t[1]+" — "+t[2]).join("\n");
      const value = "Grim_gg — таланты для "+hero+"\nРоль: "+role+"\nСтиль: "+style+"\n"+list+"\nПримечание: пример; проверь актуальность в клиенте MLBB.";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(value);
        else { const area=document.createElement("textarea"); area.value=value; area.style.position="fixed"; area.style.opacity="0"; document.body.appendChild(area); area.select(); const ok=document.execCommand("copy"); area.remove(); if(!ok) throw new Error("copy"); }
        section.querySelector("#talentStatus").textContent = "Комбинация скопирована.";
      } catch (_) { section.querySelector("#talentStatus").textContent = "Не удалось скопировать автоматически. Выбери комбинацию и перепиши названия вручную."; }
    });
    fillHeroes("Клинт");
    render();
    loadHeroArt();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

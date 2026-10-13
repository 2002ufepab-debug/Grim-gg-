"use strict";
(() => {
  const recommendations = {
    "Стрелок": {
      "Агрессивно": [
        ["Стрельба","Swift","Помогает чаще проводить обычные атаки; подходит героям, которым важна скорость атаки."],
        ["Специализация","Weapons Master","Усиливает ценность атакующих характеристик от экипировки и эмблем."],
        ["Темп боя","Quantum Charge","Поддерживает темп перестрелок и помогает менять позицию после атак."]
      ],
      "Командные бои": [
        ["Стрельба","Swift","Вариант для героев, которым нужна стабильная скорость атак."],
        ["Специализация","Weapons Master","Полезен при сборке с заметной долей атакующих характеристик."],
        ["Выживаемость","Weakness Finder","Может помогать сдерживать противника обычными атаками; проверь доступность и эффект в текущем патче."]
      ],
      "Выживаемость": [
        ["Гибкость","Agility","Дополнительная мобильность может помочь держать безопасную дистанцию."],
        ["Специализация","Weapons Master","Оставляет акцент на атакующих характеристиках."],
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
        ["Экономика","Seasoned Hunter","Рассматривай этот выбор, если он соответствует твоей роли и задачам на карте."],
        ["Взрывной урон","Lethal Ignition","Помогает усилить атакующий стиль при подходящих условиях."]
      ],
      "Выживаемость": [
        ["Мобильность","Agility","Может помочь быстрее менять позицию."],
        ["Гибкость","Wilderness Blessing","Рассматривай для перемещений по карте, если талант доступен в текущей версии."],
        ["Безопасный выход","Temporal Reign","Проверь условия срабатывания и доступность в актуальном наборе талантов."]
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
        ["Командная экономика","Seasoned Hunter","Проверь применимость к выбранной роли и текущим правилам таланта."],
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

  const emblemNames = {
    "Стрелок":"Эмблема стрелка", "Убийца":"Эмблема убийцы", "Маг":"Эмблема мага",
    "Боец":"Эмблема бойца", "Танк":"Эмблема танка", "Поддержка":"Эмблема поддержки"
  };

  const heroesByRole = {
    "Стрелок":["Клинт","Лесли","Кэрри","Клод","Броуди","Мия","Лейла","Беатрис","Мелисса","Иксия","Москов","Ванван","Ханаби","Бруно"],
    "Убийца":["Фанни","Госсен","Линг","Сейбер","Ланселот","Хаябуса","Аамон","Наталья","Хелкарт","Ли Сун Син"],
    "Маг":["Кадита","Вексана","Кагура","Лилия","Люнокс","Сесилион","Ксавьер","Фарса","Аврора","Одэтт","Нана","Эудора","Ло Йи"],
    "Боец":["Руби","Теризла","Сан","Эсмеральда","Юй Чжун","Диррот","Чу","Пакито","Альфа","Джулиан","Икс Борг"],
    "Танк":["Белерик","Хуфра","Тигрил","Атлас","Лолита","Франко","Хилос","Грок","Джонсон","Акай","Фредринн"],
    "Поддержка":["Ангела","Эстес","Флорин","Дигги","Матильда","Рафаэль"]
  };

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
      <p class="talent-intro">Выбери роль, героя и стиль — получишь стартовую рекомендацию с пояснениями. Это справочник-помощник, а не автоматическая проверка текущего патча: названия, доступность и эффекты талантов могут меняться.</p>
      <div class="talent-controls">
        <div class="talent-control"><label for="talentRole">Роль</label><select id="talentRole"><option>Стрелок</option><option>Убийца</option><option>Маг</option><option>Боец</option><option>Танк</option><option>Поддержка</option></select></div>
        <div class="talent-control"><label for="talentHero">Герой</label><select id="talentHero"></select></div>
        <div class="talent-control"><label for="talentStyle">Стиль игры</label><select id="talentStyle"><option>Агрессивно</option><option>Командные бои</option><option>Выживаемость</option></select></div>
      </div>
      <div class="talent-result" aria-live="polite">
        <div class="talent-result-head"><div><h3 id="talentResultTitle">Таланты для Клинта</h3><p id="talentResultDesc" class="talent-intro">Рекомендуемая стартовая комбинация.</p></div><span class="talent-chip" id="talentRoleChip">СТРЕЛОК</span></div>
        <div class="talent-slots" id="talentSlots"></div>
        <p class="talent-note" id="talentNote">Проверь доступность и эффекты в текущем клиенте MLBB перед использованием.</p>
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
        <article class="talent-slot"><span class="talent-slot-num">${["ТАЛАНТ I","ТАЛАНТ II","КЛЮЧЕВОЙ"][i]}</span><span class="talent-icon" aria-hidden="true">${["I","II","III"][i]}</span><div><h4>${t[1]}</h4><p>${t[2]}</p></div></article>`).join("");
      section.querySelector("#talentNote").textContent = "Проверяй названия, уровни и эффекты талантов в актуальном клиенте. Подбор примерный: он не учитывает патч, ранг, состав соперника и конкретные игровые условия.";
      section.querySelector("#talentStatus").textContent = "";
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
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

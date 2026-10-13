
"use strict";

/*
 * GRIM_GG — CLIENT-SIDE DATABASE
 * Предметы и советы встроены в файл.
 * Внешний каталог героев используется только при успешной загрузке.
 * Точные числа характеристик намеренно не приводятся без проверки патча.
 */

const $ = id => document.getElementById(id);

const HERO_SOURCE =
  "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/hero.json";

const HERO_IMAGE_BASE =
  "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/images-hero/";
const ITEM_IMAGE_BASE =
  "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/logo-equipment/";

const roleTranslations = {
  assassin:"Убийца", mage:"Маг", marksman:"Стрелок",
  fighter:"Боец", tank:"Танк", support:"Поддержка"
};

const fallbackHeroes = [
  ["Fanny","Лес","Убийца"],["Vexana","Мид","Маг"],
  ["Claude","Голд","Стрелок"],["Belerick","Роум","Танк"],
  ["Khufra","Роум","Танк"],["Gusion","Лес","Убийца"],
  ["Ling","Лес","Убийца"],["Miya","Голд","Стрелок"],
  ["Layla","Голд","Стрелок"],["Tigreal","Роум","Танк"],
  ["Saber","Лес","Убийца"],["Lancelot","Лес","Убийца"],
  ["Hayabusa","Лес","Убийца"],["Alucard","Лес","Боец"],
  ["Balmond","Лес","Боец"],["Chou","EXP","Боец"],
  ["Terizla","EXP","Боец"],["Yu Zhong","EXP","Боец"],
  ["Dyrroth","EXP","Боец"],["Ruby","EXP","Боец"],
  ["X.Borg","EXP","Боец"],["Paquito","EXP","Боец"],
  ["Alpha","Лес","Боец"],["Fredrinn","Лес","Танк"],
  ["Aamon","Лес","Убийца"],["Julian","Лес","Боец"],
  ["Lunox","Мид","Маг"],["Kagura","Мид","Маг"],
  ["Lylia","Мид","Маг"],["Cecilion","Мид","Маг"],
  ["Luo Yi","Мид","Маг"],["Xavier","Мид","Маг"],
  ["Pharsa","Мид","Маг"],["Aurora","Мид","Маг"],
  ["Odette","Мид","Маг"],["Eudora","Мид","Маг"],
  ["Nana","Мид","Маг"],["Cyclops","Мид","Маг"],
  ["Harith","Мид","Маг"],["Bruno","Голд","Стрелок"],
  ["Brody","Голд","Стрелок"],["Beatrix","Голд","Стрелок"],
  ["Melissa","Голд","Стрелок"],["Ixia","Голд","Стрелок"],
  ["Moskov","Голд","Стрелок"],["Karrie","Голд","Стрелок"],
  ["Wanwan","Голд","Стрелок"],["Hanabi","Голд","Стрелок"],
  ["Lolita","Роум","Танк"],["Atlas","Роум","Танк"],
  ["Minotaur","Роум","Танк"],["Angela","Роум","Поддержка"],
  ["Estes","Роум","Поддержка"],["Floryn","Роум","Поддержка"],
  ["Diggie","Роум","Поддержка"],["Mathilda","Роум","Поддержка"],
  ["Johnson","Роум","Танк"],["Akai","Роум","Танк"],
  ["Franco","Роум","Танк"],["Hylos","Роум","Танк"],
  ["Grock","Роум","Танк"]
].map((h,i)=>({
  id:"local-"+i,
  name:h[0],
  lane:h[1],
  role:h[2],
  roles:[h[2]],
  image:""
}));

const heroTips = {
  Fanny:"Следи за энергией и маршрутами тросов. Выбирай момент, когда опасные навыки контроля соперников уже потрачены.",
  Vexana:"Держись за передней линией, используй контроль и помогай команде начинать бой.",
  Claude:"Фарми безопасно и выбирай момент для ультимейта, когда противники не могут быстро остановить тебя.",
  Belerick:"Прикрывай союзников и учитывай, кто из соперников наносит основной урон.",
  Khufra:"Сохраняй контроль против мобильных противников и согласовывай начало боя с союзниками.",
  Gusion:"Тренируй комбинации навыков и сохраняй возможность отступить после атаки.",
  Ling:"Следи за ресурсами и позициями врагов, особенно перед командными боями.",
  Fanny:"Следи за энергией и маршрутами тросов.",
  Claude:"Не вступай в бой без плана отхода."
};

const items = [
{
 id:"bod",name:"Blade of Despair",ru:"Клинок отчаяния",cat:"Attack",
 stats:"Физический урон",
 desc:"Атакующий предмет для усиления физического урона.",
 tip:"Рассматривай, когда герою требуется больше физического урона. Проверяй условия пассивного эффекта в игре."
},
{
 id:"bf",name:"Berserker's Fury",ru:"Ярость берсерка",cat:"Attack",
 stats:"Критические атаки",
 desc:"Предмет для сборок, основанных на критических ударах.",
 tip:"Покупай только тогда, когда критические характеристики подходят выбранному герою."
},
{
 id:"dhs",name:"Demon Hunter Sword",ru:"Меч охотника на демонов",cat:"Attack",
 stats:"Скорость атаки · Урон по здоровью",
 desc:"Помогает некоторым героям наносить урон противникам с большим запасом здоровья.",
 tip:"Сравни с другими вариантами скорости атаки и проверь текущую механику пассивного эффекта."
},
{
 id:"mr",name:"Malefic Roar",ru:"Рёв злобы",cat:"Attack",
 stats:"Физическое пробивание",
 desc:"Атакующий предмет, предназначенный для борьбы с физической защитой противников.",
 tip:"Рассматривай против выносливых целей с физической защитой."
},
{
 id:"hepta",name:"Blade of the Heptaseas",ru:"Клинок гептасисов",cat:"Attack",
 stats:"Физический урон · Внезапная атака",
 desc:"Атакующий предмет, который может подходить героям, рассчитывающим на сильную первую атаку.",
 tip:"Проверь, соответствует ли его пассивный эффект стилю твоего героя."
},
{
 id:"cs",name:"Corrosion Scythe",ru:"Коса коррозии",cat:"Attack",
 stats:"Скорость атаки · Замедление",
 desc:"Предмет для героев, которым важно часто атаковать и затруднять отход противника.",
 tip:"Рассматривай для героев, зависящих от обычных атак."
},
{
 id:"eb",name:"Endless Battle",ru:"Бесконечная битва",cat:"Attack",
 stats:"Смешанные атакующие характеристики",
 desc:"Сочетает несколько характеристик для определённых физических сборок.",
 tip:"Проверь взаимодействие пассивного эффекта с навыками выбранного героя."
},
{
 id:"sc",name:"Sea Halberd",ru:"Морская алебарда",cat:"Attack",
 stats:"Физический урон · Противодействие лечению",
 desc:"Атакующий предмет, который может помочь против восстановления здоровья и щитов.",
 tip:"Рассматривай, если противники сильно зависят от лечения или щитов. Проверь актуальное действие эффекта."
},
{
 id:"hc",name:"Holy Crystal",ru:"Священный кристалл",cat:"Magic",
 stats:"Магическая сила",
 desc:"Предмет для усиления магического урона.",
 tip:"Рассматривай для магов, которым важна магическая мощь."
},
{
 id:"dg",name:"Divine Glaive",ru:"Божественный меч",cat:"Magic",
 stats:"Магическое пробивание",
 desc:"Помогает магическому урону эффективнее проходить через магическую защиту.",
 tip:"Особенно стоит рассмотреть, если соперники собирают магическую защиту."
},
{
 id:"gw",name:"Genius Wand",ru:"Жезл гения",cat:"Magic",
 stats:"Магический урон · Пробивание",
 desc:"Атакующий предмет для определённых магических сборок.",
 tip:"Проверь, насколько часто герой наносит магический урон и как работает пассивный эффект в текущем патче."
},
{
 id:"glow",name:"Glowing Wand",ru:"Светящийся жезл",cat:"Magic",
 stats:"Магический урон · Эффекты",
 desc:"Может помогать героям, которые регулярно наносят магический урон.",
 tip:"Сравни эффект предмета с другими магическими вариантами и механикой выбранного героя."
},
{
 id:"foh",name:"Feather of Heaven",ru:"Перо небес",cat:"Magic",
 stats:"Магическая сила · Скорость атаки",
 desc:"Сочетает магические характеристики и скорость обычных атак.",
 tip:"Рассматривай для героев, у которых обычные атаки взаимодействуют с магическим уроном."
},
{
 id:"bw",name:"Blood Wings",ru:"Кровавые крылья",cat:"Magic",
 stats:"Магическая сила · Выживаемость",
 desc:"Магический предмет, который также может повышать выживаемость.",
 tip:"Подходит не каждой сборке. Сравни с защитными альтернативами."
},
{
 id:"as",name:"Athena's Shield",ru:"Щит Афины",cat:"Defense",
 stats:"Магическая защита",
 desc:"Защитный предмет для противодействия опасному магическому урону.",
 tip:"Рассматривай против магов с сильным взрывным уроном; сверяй текущий пассивный эффект."
},
{
 id:"ra",name:"Radiant Armor",ru:"Сияющая броня",cat:"Defense",
 stats:"Магическая защита",
 desc:"Защитный вариант против определённых типов повторяющегося магического урона.",
 tip:"Выбирай по типу урона противника, а не только по его роли."
},
{
 id:"ac",name:"Antique Cuirass",ru:"Старинная кираса",cat:"Defense",
 stats:"Физическая защита · Здоровье",
 desc:"Защитный предмет против некоторых источников физического урона.",
 tip:"Проверь, подходит ли его эффект против основных угроз вражеской команды."
},
{
 id:"di",name:"Dominance Ice",ru:"Ледяное господство",cat:"Defense",
 stats:"Защита · Противодействие некоторым эффектам",
 desc:"Защитный предмет, который может быть полезен против героев, зависящих от скорости атак или восстановления.",
 tip:"Проверь актуальные параметры пассивного эффекта перед покупкой."
},
{
 id:"imm",name:"Immortality",ru:"Бессмертие",cat:"Defense",
 stats:"Защита · Возможность вернуться в бой",
 desc:"Защитный предмет с эффектом возвращения после поражения, если механика доступна и готова.",
 tip:"Может быть полезен для поздних командных боёв. Учитывай время перезарядки эффекта."
},
{
 id:"orc",name:"Oracle",ru:"Оракул",cat:"Defense",
 stats:"Защита · Восстановление",
 desc:"Защитный предмет, который может усиливать подходящие эффекты восстановления и щитов.",
 tip:"Особенно внимательно проверь совместимость с навыками выбранного героя."
},
{
 id:"wb",name:"Warrior Boots",ru:"Ботинки воина",cat:"Movement",
 stats:"Передвижение · Физическая защита",
 desc:"Вариант обуви с уклоном в защиту от физического урона.",
 tip:"Рассматривай против физических угроз, если его свойства подходят ситуации."
},
{
 id:"tb",name:"Tough Boots",ru:"Прочные ботинки",cat:"Movement",
 stats:"Передвижение · Магическая защита",
 desc:"Вариант обуви для выживаемости против магического урона и некоторых эффектов контроля.",
 tip:"Выбирай, учитывая состав врага и актуальные свойства обуви."
},
{
 id:"ms",name:"Magic Shoes",ru:"Магические ботинки",cat:"Movement",
 stats:"Передвижение · Перезарядка",
 desc:"Обувь, которую рассматривают, когда важна более частая доступность навыков.",
 tip:"Сравни пользу сокращения перезарядки с защитными вариантами обуви."
},
{
 id:"sb",name:"Swift Boots",ru:"Ботинки стремительности",cat:"Movement",
 stats:"Передвижение · Скорость атаки",
 desc:"Обувь с уклоном в скорость атаки.",
 tip:"Может подойти героям, чья эффективность зависит от обычных атак."
},
{
 id:"arc",name:"Arcane Boots",ru:"Мистические ботинки",cat:"Movement",
 stats:"Передвижение · Магическое пробивание",
 desc:"Обувь для магических сборок с акцентом на пробивание.",
 tip:"Сравни с обувью, дающей защиту или сокращение перезарядки."
},
{
 id:"jungler",name:"Retribution",ru:"Возмездие",cat:"Jungle",
 stats:"Заклинание боевой подготовки",
 desc:"Заклинание для роли лесника, используемое для фарма лесных монстров и борьбы за цели.",
 tip:"Выбирай вариант заклинания с учётом своей задачи и актуальных правил игры. Это заклинание, а не обычный предмет магазина."
},
{
 id:"roam",name:"Roaming Blessing",ru:"Благословение роумера",cat:"Roam",
 stats:"Командная роль · Эффект роумера",
 desc:"Обозначает систему роум-экипировки и командных эффектов; доступные варианты зависят от текущей версии игры.",
 tip:"Проверь доступные эффекты роумера в клиенте. Не путай это название с отдельным универсальным предметом."
}
];

const categories = {
  Attack:"Физический урон",
  Magic:"Магия",
  Defense:"Защита",
  Movement:"Передвижение",
  Jungle:"Лес",
  Roam:"Роум"
};

const builds = [
{
 hero:"Фанни",role:"Лес · Убийца",
goal:"Мобильность и физический урон",
items:["Blade of the Heptaseas","Malefic Roar","Immortality"],
note:"Это пример направления сборки, а не универсальная последовательность покупок. Выбирай предметы по составу противника и состоянию матча."
},
{
 hero:"Вексана",role:"Мид · Маг",
goal:"Магический урон и пробивание",
items:["Holy Crystal","Divine Glaive","Immortality"],
note:"Сравни магические предметы с защитой и сокращением перезарядки. Конкретный порядок зависит от матча."
},
{
 hero:"Клод",role:"Голд · Стрелок",
goal:"Скорость атаки и урон по выносливым целям",
items:["Demon Hunter Sword","Corrosion Scythe","Immortality"],
note:"Это пример направления сборки. Проверяй актуальную совместимость предметов и адаптируй защиту под соперника."
},
{
 hero:"Белерик",role:"Роум · Танк",
goal:"Выживаемость и защита команды",
items:["Dominance Ice","Athena's Shield","Immortality"],
note:"Подбирай защиту под главный источник урона врагов. Не покупай все предметы без оценки состава команды."
}
];

const counters = {
  Fanny:{
    picks:["Khufra","Minsitthar","Kaja"],
    reason:"Контроль и ограничения мобильности могут осложнить перемещения Фанни. Учитывай тайминги навыков и опыт игроков."
  },
  Claude:{
    picks:["Kaja","Franco","Saber"],
    reason:"Надёжный контроль может ограничить свободу действий Клода. Важно не расходовать контроль до его входа."
  },
  Ling:{
    picks:["Khufra","Minsitthar","Kaja"],
    reason:"Контроль перемещений и своевременная реакция команды могут ограничить мобильность Линга."
  },
  Miya:{
    picks:["Lolita","Saber","Franco"],
    reason:"Рассматривай защиту от атак или надёжный контроль. Результат зависит от позиции и состава команд."
  },
  Layla:{
    picks:["Saber","Franco","Lolita"],
    reason:"Герои с надёжным сближением или контролем могут создавать давление на Лейлу, если команда помогает реализовать атаку."
  },
  Gusion:{
    picks:["Khufra","Franco","Kaja"],
    reason:"Контроль может прервать удобный для Гусена вход. Следи за тем, когда он потратил навыки."
  }
};

let heroes = fallbackHeroes.map(h=>({...h}));
let heroDataSource = "fallback";
let heroQuery = "";
let activeRole = "Все";
let itemQuery = "";
let itemCategory = "Все";
let buildFilter = "Все";
let favoriteTab = "heroes";
let favoriteHeroes = new Set();
let favoriteItems = new Set();
let toastTimer;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
}

function safeRead(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function safeWrite(key, values) {
  try {
    localStorage.setItem(key, JSON.stringify([...values]));
    return true;
  } catch {
    showToast("Браузер не разрешил сохранить изменения.");
    return false;
  }
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"),2600);
}

function getHeroClasses(hero) {
  const roles = Array.isArray(hero.roles) && hero.roles.length
    ? hero.roles
    : String(hero.role || "").split("/");
  const translated = roles
    .map(role => roleTranslations[String(role).trim().toLowerCase()] || String(role).trim())
    .filter(Boolean);
  return [...new Set(translated.length ? translated : ["Роль не указана"])];
}

function itemIconSlug(name) {
  return String(name)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeRemoteHero(hero,index) {
  const name = hero.name_hero || hero.name || hero.nameHero || hero.hero_name;
  if (!name) return null;

  const roles = Array.isArray(hero.role)
    ? hero.role
    : Array.isArray(hero.roles) ? hero.roles
    : typeof hero.role === "string" ? [hero.role] : [];

  const roleText = roles.map(r=>String(r).toLowerCase());
  const translatedRoles = roleText.map(role=>roleTranslations[role] || role);
  const fallbackMatch = fallbackHeroes.find(h=>h.name.toLowerCase()===String(name).toLowerCase());
  const filename = hero["images-hero"] || hero.image || hero.image_url || "";

  return {
    id:fallbackMatch ? String(fallbackMatch.id) : String(hero.id_hero ?? hero.id ?? "remote-"+index),
    name:String(name),
    role:translatedRoles.join(" / ") || "Роль не указана",
    image:filename && /^https?:\/\//i.test(filename)
      ? filename
      : filename ? HERO_IMAGE_BASE + encodeURIComponent(filename) : "",
    roles:roleText
  };
}

function heroImageMarkup(hero) {
  const initial = escapeHTML((hero.name || "?").slice(0,1).toUpperCase());
  if (!hero.image) {
    return `<div class="hero-image-fallback" aria-label="Изображение героя недоступно">${initial}</div>`;
  }
  return `<img class="hero-image" src="${escapeHTML(hero.image)}" alt="${escapeHTML(hero.name)}" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'hero-image-fallback',textContent:${JSON.stringify(initial)}}))">`;
}

function favoriteButton(type,id,saved) {
  return `<button type="button" class="favorite-btn ${saved?"saved":""}" data-favorite-type="${type}" data-favorite-id="${escapeHTML(id)}" aria-pressed="${saved}">${saved?"★ В избранном":"☆ В избранное"}</button>`;
}

function renderHeroes() {
  const grid = $("heroGrid");
  if (!grid) return;

  const filtered = heroes.filter(hero=>
    (activeRole==="Все" || getHeroClasses(hero).includes(activeRole)) &&
    hero.name.toLocaleLowerCase().includes(heroQuery)
  );

  $("heroCount").textContent = `Показано: ${filtered.length}. ${heroDataSource === "fallback" ? "Показан сокращённый встроенный список: он не является полным каталогом." : "Роли взяты из стороннего каталога сообщества; это не данные о рекомендуемой линии."}`;

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">Герои не найдены. Попробуй другой поиск или роль.</p>';
    return;
  }

  grid.innerHTML = filtered.map(hero=>{
    const id = String(hero.id);
    const saved = favoriteHeroes.has(id);
    const heroClasses = getHeroClasses(hero);
    const tip = heroTips[hero.name] ||
      "Изучай дальность навыков, следи за мини-картой и подстраивай тактику под состав соперника.";

    return `<article class="hero-card">
      <div class="hero-image-wrap">
        ${heroImageMarkup(hero)}
        <span class="hero-id">HERO / ${escapeHTML(id)}</span>
      </div>
      <div class="hero-card-content">
        <h3>${escapeHTML(hero.name)}</h3>
        <p class="hero-role">${escapeHTML(hero.role || getHeroClasses(hero).join(" / "))}</p>
        <div class="hero-tags">${heroClasses.map(role=>`<span>${escapeHTML(role)}</span>`).join("")}</div>
        <button type="button" class="btn btn-red hero-build-btn" data-open-build="${escapeHTML(hero.name)}" data-build-roles="${escapeHTML(heroClasses.join(","))}">Сборка героя ↗</button>
        <details><summary>Игровой совет ↗</summary><p>${escapeHTML(tip)}</p></details>
        ${favoriteButton("hero",id,saved)}
      </div>
    </article>`;
  }).join("");
}

function renderItems() {
  const grid = $("itemGrid");
  if (!grid) return;

  const filtered = items.filter(item=>{
    const matchesCategory = itemCategory==="Все" || item.cat===itemCategory;
    const haystack = `${item.name} ${item.ru} ${item.desc} ${item.stats} ${item.tip}`.toLocaleLowerCase();
    return matchesCategory && haystack.includes(itemQuery);
  });

  $("itemCount").textContent = `Предметов в справочнике: ${filtered.length}`;

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">Предметы не найдены.</p>';
    return;
  }

  grid.innerHTML = filtered.map(item=>{
    const saved = favoriteItems.has(item.id);
    const symbol = escapeHTML(item.ru.slice(0,1).toUpperCase());
    const iconUrl = ITEM_IMAGE_BASE + itemIconSlug(item.name) + ".png";

    return `<article class="item-card">
      <div class="item-image-wrap"><img class="item-image" src="${escapeHTML(iconUrl)}" alt="" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'item-symbol',textContent:${JSON.stringify(symbol)}}))"></div>
      <div class="item-content">
        <span class="item-category">${escapeHTML(categories[item.cat] || item.cat)}</span>
        <h3>${escapeHTML(item.ru)}</h3>
        <p class="item-description">${escapeHTML(item.name)}</p>
        <p class="item-stats">${escapeHTML(item.stats)}</p>
        <p class="item-description">${escapeHTML(item.desc)}</p>
        <details><summary>Когда покупать?</summary><p class="item-tip">${escapeHTML(item.tip)}</p><p class="fine-print">Сверяй точные характеристики, цену и пассивные эффекты с текущей версией игры.</p></details>
        ${favoriteButton("item",item.id,saved)}
      </div>
    </article>`;
  }).join("");
}


const roleBuildTemplates = {
  "Убийца": {role:"Убийца", goal:"Быстрый урон по приоритетной цели", items:["Blade of the Heptaseas","Malefic Roar","Blade of Despair","Immortality"], emblem:"Эмблема убийцы — как отправная точка; подстрой таланты под героя.", spell:"Возмездие для леса или Вспышка для подходящего лайнера.", note:"Шаблон по классу, а не проверенная мета-сборка именно этого героя."},
  "Маг": {role:"Маг", goal:"Магический урон и пробивание", items:["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Immortality"], emblem:"Эмблема мага; таланты выбирай под урон или сокращение перезарядки.", spell:"Вспышка — частый универсальный вариант, если она подходит герою.", note:"Шаблон по классу. Меняй предметы в зависимости от магической защиты и состава врага."},
  "Стрелок": {role:"Стрелок", goal:"Стабильный урон обычными атаками", items:["Swift Boots","Demon Hunter Sword","Corrosion Scythe","Berserker's Fury","Malefic Roar","Immortality"], emblem:"Эмблема стрелка; выбирай таланты под скорость атаки или критический урон.", spell:"Вдохновение или Вспышка — в зависимости от героя и угроз.", note:"Не каждый стрелок играет через скорость атаки: проверь механику персонажа."},
  "Боец": {role:"Боец", goal:"Баланс урона и выживаемости", items:["Tough Boots","Endless Battle","Antique Cuirass","Malefic Roar","Immortality"], emblem:"Эмблема бойца; таланты зависят от роли и стиля боя.", spell:"Возмездие для леса, Вспышка или Исполнение для подходящей линии.", note:"Подбирай защиту под главный источник урона соперника."},
  "Танк": {role:"Танк", goal:"Выживаемость и помощь команде", items:["Tough Boots","Dominance Ice","Athena's Shield","Antique Cuirass","Immortality"], emblem:"Эмблема танка; защитные таланты — базовая отправная точка.", spell:"Исцеление или Вспышка — по навыкам героя и задаче команды.", note:"Не покупай все защитные предметы автоматически: оцени физический и магический урон врагов."},
  "Поддержка": {role:"Поддержка", goal:"Помощь союзникам и выживаемость", items:["Tough Boots","Dominance Ice","Oracle","Athena's Shield","Immortality"], emblem:"Эмблема поддержки или подходящая защитная эмблема.", spell:"Исцеление или Вспышка — в зависимости от набора навыков.", note:"Состав предметов зависит от того, лечит герой, даёт щиты, контроль или начинает бой."}
};
const featuredHeroBuilds = {
  "Fanny": {role:"Лес · Убийца", goal:"Мобильность и физический урон", items:["Tough Boots","Blade of the Heptaseas","Malefic Roar","Blade of Despair","Immortality"], emblem:"Эмблема убийцы; таланты под взрывной урон и темп.", spell:"Возмездие для игры в лесу.", note:"Пример для ориентира. Фанни требовательна к энергии и механике; корректируй сборку под матч."},
  "Vexana": {role:"Мид · Маг", goal:"Магический урон и пробивание", items:["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Immortality"], emblem:"Эмблема мага с упором на магический урон.", spell:"Вспышка — для дополнительной мобильности.", note:"Пример сборки, не гарантия актуальной меты. Меняй защитный слот под угрозы."},
  "Claude": {role:"Голд · Стрелок", goal:"Скорость атаки и урон по выносливым целям", items:["Swift Boots","Demon Hunter Sword","Corrosion Scythe","Golden Staff","Immortality"], emblem:"Эмблема стрелка с подходящими талантами на скорость атаки.", spell:"Вдохновение или Вспышка — выбирай по ситуации.", note:"Проверь доступность и текущие параметры предметов в игре; порядок покупки зависит от матча."},
  "Belerick": {role:"Роум · Танк", goal:"Защита команды и выживаемость", items:["Tough Boots","Dominance Ice","Athena's Shield","Antique Cuirass","Immortality"], emblem:"Эмблема танка с защитными талантами.", spell:"Исцеление или Вспышка — по составу команд.", note:"Собирай магическую или физическую защиту по реальным угрозам соперника."}
};
function getHeroBuild(heroName, roles) {
  const featured = featuredHeroBuilds[heroName];
  if (featured) return {...featured, personalized:true};
  const classes = Array.isArray(roles) ? roles : [String(roles || "")];
  const role = classes.find(value=>roleBuildTemplates[value]) || "Боец";
  return {...roleBuildTemplates[role], personalized:false};
}
function openHeroBuild(heroName, rolesText) {
  const modal = $("buildModal");
  const content = $("buildModalContent");
  if (!modal || !content) return;
  const roles = String(rolesText || "").split(",").map(value=>value.trim()).filter(Boolean);
  const build = getHeroBuild(heroName, roles);
  const itemRows = build.items.map((name,index)=>{
    const item = items.find(entry=>entry.name===name);
    return `<div class="build-item-row"><span class="build-slot">0${index+1}</span><div><strong>${escapeHTML(item?item.ru:name)}</strong><span>${escapeHTML(item?item.stats:"Проверь предмет в клиенте игры.")}</span></div></div>`;
  }).join("");
  content.innerHTML = `<h2 id="buildModalTitle">${escapeHTML(heroName)} <span class="red">/ СБОРКА</span></h2>
    <p class="build-modal-subtitle">${escapeHTML(build.role)} · ${escapeHTML(build.goal)}</p>
    <div class="build-modal-section"><h3>Рекомендуемый набор предметов</h3><div class="build-item-list">${itemRows}</div></div>
    <div class="build-advice"><strong>Эмблема</strong><p>${escapeHTML(build.emblem)}</p><strong>Боевой навык</strong><p>${escapeHTML(build.spell)}</p></div>
    <p class="build-modal-note">${build.personalized ? "Персональный пример для героя. " : "Базовый шаблон по классу: это не индивидуальная мета-сборка. "}${escapeHTML(build.note)}</p>
    <p class="fine-print">Mobile Legends обновляется: сверяй предметы, эмблемы и навыки с текущей версией игры и меняй сборку под состав соперника.</p>`;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  const closeButton = modal.querySelector(".build-modal-close");
  if (closeButton) closeButton.focus();
}
function closeHeroBuild() {
  const modal = $("buildModal");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function renderBuilds() {
  const grid = $("buildGrid");
  if (!grid) return;

  const filtered = builds.filter(build=>buildFilter==="Все" || build.hero===buildFilter);
  grid.innerHTML = filtered.map(build=>{
    const rows = build.items.map(name=>{
      const item = items.find(i=>i.name===name);
      return `<div class="build-item-row"><strong>${escapeHTML(item?item.ru:name)}</strong><span>${escapeHTML(item?item.desc:"Проверь назначение предмета в актуальной версии игры.")}</span></div>`;
    }).join("");

    return `<article class="build-card">
      <span class="build-label">BUILD LAB / ${escapeHTML(build.hero)}</span>
      <h3>${escapeHTML(build.hero)}</h3>
      <p>${escapeHTML(build.role)}</p>
      <p><strong>Направление:</strong> ${escapeHTML(build.goal)}</p>
      <div class="build-item-list">${rows}</div>
      <p>${escapeHTML(build.note)}</p>
    </article>`;
  }).join("");
}

function renderFavorites() {
  const grid = $("favoritesGrid");
  if (!grid) return;

  const heroesTab = $("favHeroesTab");
  const itemsTab = $("favItemsTab");
  heroesTab.classList.toggle("active",favoriteTab==="heroes");
  itemsTab.classList.toggle("active",favoriteTab==="items");

  if (favoriteTab==="heroes") {
    const saved = heroes.filter(h=>favoriteHeroes.has(String(h.id)));
    grid.innerHTML = saved.length ? saved.map(hero=>`
      <article class="hero-card">
        <div class="hero-image-wrap">${heroImageMarkup(hero)}</div>
        <div class="hero-card-content"><h3>${escapeHTML(hero.name)}</h3>
        <p class="hero-role">${escapeHTML(getHeroClasses(hero).join(" / "))}</p>
        ${favoriteButton("hero",String(hero.id),true)}</div>
      </article>`).join("") :
      '<p class="empty-state">Ты пока не добавил героев. Нажми ☆ в карточке героя.</p>';
  } else {
    const saved = items.filter(i=>favoriteItems.has(i.id));
    grid.innerHTML = saved.length ? saved.map(item=>`
      <article class="item-card"><div class="item-content">
        <span class="item-category">${escapeHTML(categories[item.cat])}</span>
        <h3>${escapeHTML(item.ru)}</h3><p>${escapeHTML(item.name)}</p>
        <p class="item-description">${escapeHTML(item.desc)}</p>
        ${favoriteButton("item",item.id,true)}
      </div></article>`).join("") :
      '<p class="empty-state">Ты пока не добавил предметы. Нажми ☆ в карточке предмета.</p>';
  }
}

function updateFavorite(type,id) {
  const set = type==="hero" ? favoriteHeroes : favoriteItems;
  const storageKey = type==="hero" ? "grimgg-favorite-heroes" : "grimgg-favorite-items";

  if (set.has(id)) {
    set.delete(id);
    showToast("Удалено из избранного");
  } else {
    set.add(id);
    showToast("Добавлено в избранное");
  }

  safeWrite(storageKey,set);
  renderHeroes();
  renderItems();
  renderFavorites();
}

function renderCounterpicks() {
  const select = $("enemySelect");
  if (!select) return;

  const current = select.value;
  const names = [...new Set(heroes.map(h=>h.name))].sort((a,b)=>a.localeCompare(b));
  select.innerHTML = '<option value="">Выбери героя...</option>' +
    names.map(name=>`<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`).join("");

  if (names.includes(current)) select.value = current;
}

function showCounterpick() {
  const enemy = $("enemySelect").value;
  const result = $("counterResult");

  if (!enemy) {
    result.innerHTML = '<div class="result-icon">!</div><div><strong>Сначала выбери героя</strong><p>Укажи персонажа соперника.</p></div>';
    return;
  }

  const data = counters[enemy];
  if (!data) {
    result.innerHTML = `<div class="result-icon">↗</div><div><strong>План против ${escapeHTML(enemy)}</strong><p>Изучи ключевые навыки героя, подбери подходящий контроль и тип защиты. Для этого персонажа в справочнике нет проверенной персональной контрпик-рекомендации.</p></div>`;
    return;
  }

  result.innerHTML = `<div class="result-icon">↗</div><div>
    <strong>Кого рассмотреть против ${escapeHTML(enemy)}?</strong>
    <p>${data.picks.map(escapeHTML).join(" · ")}</p>
    <p>${escapeHTML(data.reason)}</p>
  </div>`;
}

function setupFilters() {
  $("roleFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-role]");
    if (!button) return;
    activeRole = button.dataset.role;
    $("roleFilters").querySelectorAll("[data-role]").forEach(b=>b.classList.toggle("active",b===button));
    renderHeroes();
  });

  $("itemFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-category]");
    if (!button) return;
    itemCategory = button.dataset.category;
    $("itemFilters").querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b===button));
    renderItems();
  });

  $("buildFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-build]");
    if (!button) return;
    buildFilter = button.dataset.build;
    $("buildFilters").querySelectorAll("[data-build]").forEach(b=>b.classList.toggle("active",b===button));
    renderBuilds();
  });
}

async function loadExternalHeroes() {
  const note = $("heroSourceNote");
  try {
    const response = await fetch(HERO_SOURCE,{cache:"no-cache"});
    if (!response.ok) throw new Error("Внешний каталог недоступен");

    const data = await response.json();
    if (!Array.isArray(data) || !data.length) throw new Error("Неверный формат каталога");

    const normalized = data.map(normalizeRemoteHero).filter(Boolean);
    if (!normalized.length) throw new Error("Не удалось прочитать героев");

    const remoteIdToFallbackId = new Map();
    data.forEach((sourceHero, index) => {
      const sourceName = sourceHero.name_hero || sourceHero.name || sourceHero.nameHero || sourceHero.hero_name;
      const sourceId = String(sourceHero.id_hero ?? sourceHero.id ?? "remote-" + index);
      const fallback = fallbackHeroes.find(item => item.name.toLowerCase() === String(sourceName || "").toLowerCase());
      if (fallback) remoteIdToFallbackId.set(sourceId, String(fallback.id));
    });
    favoriteHeroes = new Set([...favoriteHeroes].map(id => remoteIdToFallbackId.get(String(id)) || String(id)));
    safeWrite("grimgg-favorite-heroes", favoriteHeroes);
    heroes = normalized;
    heroDataSource = "external";
    if (note) note.textContent = "Загружен сторонний каталог сообщества. Он неофициальный и может отставать от текущего патча; роли обозначают классы героев, а не рекомендуемые линии.";
    renderHeroes();
    renderCounterpicks();
    renderFavorites();
  } catch (error) {
    heroDataSource = "fallback";
    if (note) note.textContent = "Внешний каталог недоступен. Показан сокращённый встроенный список; он не является полным каталогом игры.";
    console.warn("Grim_gg: внешний каталог героев недоступен.",error);
  }
}

function setupMenu() {
  const toggle = $("menuToggle");
  const nav = $("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click",()=>{
    const open = toggle.getAttribute("aria-expanded")!=="true";
    toggle.setAttribute("aria-expanded",String(open));
    nav.classList.toggle("open",open);
  });

  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
  }));
}

function init() {
  $("year").textContent = new Date().getFullYear();

  favoriteHeroes = new Set(safeRead("grimgg-favorite-heroes").map(String));
  favoriteItems = new Set(safeRead("grimgg-favorite-items").map(String));

  $("heroSearch").addEventListener("input",event=>{
    heroQuery = event.target.value.trim().toLocaleLowerCase();
    renderHeroes();
  });

  $("itemSearch").addEventListener("input",event=>{
    itemQuery = event.target.value.trim().toLocaleLowerCase();
    renderItems();
  });

  $("counterBtn").addEventListener("click",showCounterpick);
  $("favHeroesTab").addEventListener("click",()=>{
    favoriteTab = "heroes";
    renderFavorites();
  });
  $("favItemsTab").addEventListener("click",()=>{
    favoriteTab = "items";
    renderFavorites();
  });

  document.addEventListener("click",event=>{
    const openBuildButton = event.target.closest("[data-open-build]");
    if (openBuildButton) {
      openHeroBuild(openBuildButton.dataset.openBuild, openBuildButton.dataset.buildRoles);
      return;
    }
    if (event.target.closest("[data-close-build]")) {
      closeHeroBuild();
      return;
    }
    const button = event.target.closest("[data-favorite-type]");
    if (!button) return;
    updateFavorite(button.dataset.favoriteType,button.dataset.favoriteId);
  });

  setupFilters();
  setupMenu();
  document.addEventListener("keydown",event=>{ if(event.key==="Escape") closeHeroBuild(); });
  renderHeroes();
  renderItems();
  renderBuilds();
  renderCounterpicks();
  renderFavorites();

  loadExternalHeroes();
}

document.addEventListener("DOMContentLoaded",init);

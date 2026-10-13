
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
},
{
 id:"gs",name:"Golden Staff",ru:"Золотой посох",cat:"Attack",
 stats:"Скорость атаки · Эффекты обычных атак",
 desc:"Предмет для некоторых сборок на скорость атаки и усиленные обычные атаки.",
 tip:"Проверяй совместимость пассивного эффекта с другими предметами в текущем патче."
},
{
 id:"lt",name:"Lightning Truncheon",ru:"Молниеносный трезубец",cat:"Magic",
 stats:"Магическая сила · Урон навыков",
 desc:"Магический предмет для некоторых сборок с частым использованием навыков.",
 tip:"Сверяй текущую механику эффекта и подбирай к набору навыков конкретного мага."
},
{
 id:"ch",name:"Cursed Helmet",ru:"Проклятый шлем",cat:"Defense",
 stats:"Здоровье · Магическая защита",
 desc:"Защитный предмет с дополнительным эффектом урона вокруг владельца.",
 tip:"Рассматривай для танков, которые долго находятся рядом с противниками; проверь параметры в игре."
},
{
 id:"gh",name:"Guardian Helmet",ru:"Шлем стража",cat:"Defense",
 stats:"Здоровье · Восстановление",
 desc:"Защитный предмет с акцентом на большой запас здоровья и восстановление вне боя.",
 tip:"Оцени, нужен ли дополнительный запас здоровья или лучше взять защиту от конкретного типа урона."
},
{
 id:"ba",name:"Blade Armor",ru:"Клинок брони",cat:"Defense",
 stats:"Физическая защита",
 desc:"Защитный предмет, который рассматривают против героев, полагающихся на обычные атаки.",
 tip:"Сравни с другими защитными предметами и проверяй актуальный эффект."
},
{
 id:"wa",name:"War Axe",ru:"Боевой топор",cat:"Attack",
 stats:"Физический урон · Бой на продолжительной дистанции",
 desc:"Атакующий предмет для некоторых бойцов и героев, которым выгодны затяжные столкновения.",
 tip:"Проверь, подходит ли его пассивный эффект темпу боя выбранного героя."
},
{
 id:"rgm",name:"Rose Gold Meteor",ru:"Метеор из розового золота",cat:"Attack",
 stats:"Физический урон · Защитный эффект",
 desc:"Атакующий предмет с дополнительной защитой в определённых ситуациях.",
 tip:"Рассматривай как ситуационный слот, если важен дополнительный запас на выживание."
},
{
 id:"qw",name:"Queen's Wings",ru:"Крылья королевы",cat:"Defense",
 stats:"Выживаемость в бою",
 desc:"Ситуативный предмет для некоторых бойцов, которым нужно переживать затяжной бой.",
 tip:"Проверь актуальные характеристики и пассивный эффект в клиенте игры."
},
{
 id:"sp",name:"Sky Piercer",ru:"Небесный пронзатель",cat:"Attack",
 stats:"Добивание целей",
 desc:"Ситуативный атакующий предмет, ориентированный на добивание противников.",
 tip:"Покупай только если текущая механика предмета и состояние матча оправдывают этот слот."
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
  const overrides = {
    "Magic Shoes":"magic_boots",
    "Retribution":null,
    "Roaming Blessing":null
  };
  if (Object.prototype.hasOwnProperty.call(overrides,name)) return overrides[name];
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
    const iconSlug = itemIconSlug(item.name);
    const iconMarkup = iconSlug
      ? `<img class="item-image" src="${escapeHTML(ITEM_IMAGE_BASE + iconSlug + ".png")}" alt="" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'item-symbol',textContent:${JSON.stringify(symbol)}}))">`
      : `<div class="item-symbol" aria-label="Иконка предмета недоступна">${symbol}</div>`;

    return `<article class="item-card">
      <div class="item-image-wrap">${iconMarkup}</div>
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
  "Убийца": {role:"Убийца", goal:"Быстрый урон по приоритетной цели", items:["Tough Boots","Blade of the Heptaseas","Malefic Roar","War Axe","Blade of Despair","Immortality"], emblem:"Эмблема убийцы; таланты под темп и урон — отправная точка.", spell:"Возмездие для леса; другой навык — если герой играет не в лесу.", note:"Шаблон по классу, а не индивидуальная мета-сборка для каждого убийцы."},
  "Маг": {role:"Маг", goal:"Магический урон и пробивание", items:["Arcane Boots","Glowing Wand","Lightning Truncheon","Holy Crystal","Divine Glaive","Immortality"], emblem:"Эмблема мага; подбирай таланты под урон, перезарядку и стиль героя.", spell:"Вспышка — частый вариант для мобильности, если она подходит герою.", note:"Шаблон по классу. Меняй предметы в зависимости от магической защиты и состава врага."},
  "Стрелок": {role:"Стрелок", goal:"Стабильный урон обычными атаками", items:["Swift Boots","Demon Hunter Sword","Golden Staff","Corrosion Scythe","Malefic Roar","Immortality"], emblem:"Эмблема стрелка; таланты под скорость атаки или критический урон.", spell:"Вдохновение или Вспышка — в зависимости от героя и угроз.", note:"Не каждый стрелок играет через скорость атаки: проверь механику персонажа."},
  "Боец": {role:"Боец", goal:"Баланс урона и выживаемости", items:["Tough Boots","Endless Battle","War Axe","Antique Cuirass","Malefic Roar","Immortality"], emblem:"Эмблема бойца; таланты зависят от роли и стиля боя.", spell:"Возмездие для леса, Вспышка или Исполнение для подходящей линии.", note:"Подбирай защиту под главный источник урона соперника."},
  "Танк": {role:"Танк", goal:"Выживаемость и помощь команде", items:["Tough Boots","Cursed Helmet","Dominance Ice","Athena's Shield","Antique Cuirass","Immortality"], emblem:"Эмблема танка; защитные таланты — базовая отправная точка.", spell:"Возмездие для леса или Вспышка/Возмездие духа по ситуации и набору навыков.", note:"Не покупай все защитные предметы автоматически: оцени физический и магический урон врагов."},
  "Поддержка": {role:"Поддержка", goal:"Помощь союзникам и выживаемость", items:["Tough Boots","Dominance Ice","Oracle","Athena's Shield","Immortality"], emblem:"Эмблема поддержки или подходящая защитная эмблема.", spell:"Исцеление или Вспышка — в зависимости от набора навыков.", note:"Состав предметов зависит от того, лечит герой, даёт щиты, контроль или начинает бой."}
};
const featuredHeroBuilds = {
  "Fanny": {role:"Лес · Убийца", goal:"Мобильность и физический урон", items:["Tough Boots","Blade of the Heptaseas","Malefic Roar","War Axe","Rose Gold Meteor","Immortality"], emblem:"Эмблема убийцы — один из возможных вариантов; сверяй таланты с актуальной версией.", spell:"Возмездие для игры в лесу.", note:"Пример для ориентира. Фанни требовательна к энергии и механике; корректируй сборку под матч."},
  "Vexana": {role:"Мид · Маг", goal:"Магический урон и пробивание", items:["Arcane Boots","Glowing Wand","Lightning Truncheon","Holy Crystal","Divine Glaive","Immortality"], emblem:"Эмблема мага с талантами под урон и выбранный стиль.", spell:"Вспышка — для дополнительной мобильности.", note:"Пример на основе доступных сборочных ориентиров; меняй защитный слот под угрозы."},
  "Claude": {role:"Голд · Стрелок", goal:"Скорость атаки и урон по выносливым целям", items:["Swift Boots","Demon Hunter Sword","Golden Staff","Corrosion Scythe","Malefic Roar","Immortality"], emblem:"Эмблема стрелка с талантами под скорость атаки.", spell:"Вдохновение или Вспышка — выбирай по ситуации.", note:"Порядок покупки зависит от матча; проверяй текущие параметры и доступность предметов."},
  "Belerick": {role:"Роум · Танк", goal:"Защита команды и выживаемость", items:["Tough Boots","Cursed Helmet","Dominance Ice","Antique Cuirass","Immortality","Guardian Helmet"], emblem:"Эмблема танка или поддержки с подходящими защитными талантами.", talents:"Упор на стойкость и контроль; выбирай таланты на выживаемость, а последний — под начало боя.", spell:"Возмездие духа или Вспышка — по составу команд и твоей задаче.", note:"Сборка ориентирована на выживаемость; меняй защиту по реальным угрозам соперника."},
  "Miya": {role:"Голд · Стрелок",goal:"Скорость атаки и критический урон",items:["Swift Boots","Berserker's Fury","Windtalker","Haas's Claws","Malefic Roar","Immortality"],emblem:"Эмблема стрелка.",talents:"Таланты на скорость атаки/криты; последний талант — на урон обычных атак.",spell:"Вспышка против угроз или Вдохновение для усиления атак.",note:"Следи за безопасной позицией; меняй предметы под защиту соперника."},
  "Layla": {role:"Голд · Стрелок",goal:"Дальний физический урон",items:["Swift Boots","Berserker's Fury","Haas's Claws","Windtalker","Malefic Roar","Immortality"],emblem:"Эмблема стрелка.",talents:"Урон обычных атак и критические характеристики; последний талант под стиль игры.",spell:"Вспышка — чтобы выйти из опасной ситуации.",note:"У Лейлы нет надёжного рывка: держи дистанцию и играй от команды."},
  "Bruno": {role:"Голд · Стрелок",goal:"Критический урон и усиленные атаки",items:["Swift Boots","Berserker's Fury","Haas's Claws","Malefic Roar","Blade of Despair","Immortality"],emblem:"Эмблема стрелка.",talents:"Критический урон и усиление обычных атак.",spell:"Вспышка или Вдохновение по ситуации.",note:"Не забывай собирать защиту, если противники быстро добираются до стрелка."},
  "Brody": {role:"Голд · Стрелок",goal:"Физический урон и пробивание",items:["Tough Boots","Blade of the Heptaseas","Malefic Roar","Blade of Despair","Sea Halberd","Immortality"],emblem:"Эмблема стрелка или убийцы.",talents:"Таланты на физический урон и пробивание; выживаемость — если часто ловят.",spell:"Вспышка или Исполнение по составу врага.",note:"Подбирай обувь по контролю и урону противника."},
  "Moskov": {role:"Голд · Стрелок",goal:"Скорость атаки и давление обычными атаками",items:["Swift Boots","Demon Hunter Sword","Golden Staff","Corrosion Scythe","Malefic Roar","Immortality"],emblem:"Эмблема стрелка.",talents:"Скорость атаки и усиление обычных атак.",spell:"Вспышка или Вдохновение.",note:"Учитывай позицию и возможность безопасно атаковать."},
  "Karrie": {role:"Голд · Стрелок",goal:"Урон по героям с большим запасом здоровья",items:["Swift Boots","Demon Hunter Sword","Golden Staff","Corrosion Scythe","Malefic Roar","Immortality"],emblem:"Эмблема стрелка.",talents:"Скорость атаки и таланты, усиливающие стабильный урон.",spell:"Вспышка или Вдохновение.",note:"Против тяжёлой передней линии сравнивай предметы по текущему патчу."},
  "Beatrix": {role:"Голд · Стрелок",goal:"Физический урон и пробивание",items:["Tough Boots","Blade of Despair","Malefic Roar","Haas's Claws","Sea Halberd","Immortality"],emblem:"Эмблема стрелка.",talents:"Физический урон; подбирай таланты под выбранное оружие и стиль.",spell:"Вспышка — универсальный защитный вариант.",note:"Сборка зависит от оружия и текущей игровой версии."},
  "Vexana": {role:"Мид · Маг", goal:"Магический урон и пробивание", items:["Arcane Boots","Glowing Wand","Lightning Truncheon","Holy Crystal","Divine Glaive","Immortality"], emblem:"Эмблема мага с талантами под урон и выбранный стиль.", talents:"Магический урон/пробивание; последний талант — под взрывной урон или частое применение навыков.", spell:"Вспышка — для дополнительной мобильности.", note:"Пример на основе доступных сборочных ориентиров; меняй защитный слот под угрозы."},
  "Nana": {role:"Мид · Маг",goal:"Магический урон и контроль",items:["Arcane Boots","Genius Wand","Glowing Wand","Holy Crystal","Divine Glaive","Immortality"],emblem:"Эмблема мага.",talents:"Магический урон и пробивание; последний талант под урон навыков.",spell:"Вспышка для безопасной позиции.",note:"Защитный слот меняй под главную угрозу."},
  "Eudora": {role:"Мид · Маг",goal:"Взрывной магический урон",items:["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Lightning Truncheon","Immortality"],emblem:"Эмблема мага.",talents:"Таланты на магическую мощь и взрывной урон.",spell:"Вспышка для выхода из опасности или поиска позиции.",note:"Не трать комбинацию на танка, если рядом есть приоритетная цель."},
  "Aurora": {role:"Мид · Маг",goal:"Магический урон и контроль",items:["Arcane Boots","Glowing Wand","Holy Crystal","Divine Glaive","Lightning Truncheon","Immortality"],emblem:"Эмблема мага.",talents:"Магический урон; подбирай последний талант под частоту навыков.",spell:"Вспышка.",note:"Сохраняй контроль для начала боя или защиты союзников."},
  "Odette": {role:"Мид · Маг",goal:"Урон по области",items:["Arcane Boots","Lightning Truncheon","Holy Crystal","Divine Glaive","Blood Wings","Immortality"],emblem:"Эмблема мага.",talents:"Магическая мощь и урон навыков.",spell:"Вспышка — для позиции перед ультимейтом.",note:"Следи за навыками контроля соперников перед использованием ультимейта."},
  "Cecilion": {role:"Мид · Маг",goal:"Масштабирование и магический урон",items:["Demon Shoes","Clock of Destiny","Lightning Truncheon","Holy Crystal","Divine Glaive","Immortality"],emblem:"Эмблема мага.",talents:"Магическая мощь и мана/перезарядка, если доступны в актуальной версии.",spell:"Вспышка.",note:"Стабильно фарми и не затягивай рискованные размены в начале."},
  "Lylia": {role:"Мид · Маг",goal:"Частые навыки и магический урон",items:["Magic Shoes","Glowing Wand","Genius Wand","Holy Crystal","Divine Glaive","Immortality"],emblem:"Эмблема мага.",talents:"Сокращение перезарядки и магический урон.",spell:"Вспышка.",note:"Сохраняй ультимейт для безопасного выхода из опасной ситуации."},
  "Kagura": {role:"Мид · Маг",goal:"Комбинации и магическое пробивание",items:["Arcane Boots","Genius Wand","Holy Crystal","Divine Glaive","Lightning Truncheon","Immortality"],emblem:"Эмблема мага.",talents:"Магический урон и пробивание.",spell:"Вспышка.",note:"Тренируй комбинации и держи навык отхода."},
  "Terizla": {role:"EXP · Боец",goal:"Выживаемость и урон по области",items:["Tough Boots","War Axe","Queen's Wings","Antique Cuirass","Dominance Ice","Immortality"],emblem:"Эмблема бойца.",talents:"Устойчивость и урон в затяжном бою.",spell:"Вспышка или Исполнение по ситуации.",note:"Подбирай защиту под тип урона соперника на линии."},
  "Ruby": {role:"EXP · Боец",goal:"Контроль, восстановление и выживаемость",items:["Tough Boots","War Axe","Queen's Wings","Oracle","Dominance Ice","Immortality"],emblem:"Эмблема бойца или танка.",talents:"Устойчивость и таланты, помогающие в продолжительном бою.",spell:"Вспышка для комбинаций и выхода из опасности.",note:"Меняй защиту под состав врагов и свою роль в командных боях."},
  "Dyrroth": {role:"EXP · Боец",goal:"Физический урон и пробивание",items:["Tough Boots","War Axe","Hunter Strike","Malefic Roar","Blade of Despair","Immortality"],emblem:"Эмблема бойца или убийцы.",talents:"Физический урон и пробивание.",spell:"Исполнение или Вспышка.",note:"Используй снижение защиты цели и не заходи в бой без пути отхода."},
  "Yu Zhong": {role:"EXP · Боец",goal:"Вход в бой и устойчивость",items:["Tough Boots","War Axe","Queen's Wings","Oracle","Antique Cuirass","Immortality"],emblem:"Эмблема бойца.",talents:"Устойчивость и усиление затяжного боя.",spell:"Вспышка.",note:"Ищи момент зайти на заднюю линию, когда опасный контроль потрачен."},
  "Alpha": {role:"Лес / EXP · Боец",goal:"Урон навыков и устойчивость",items:["Tough Boots","War Axe","Hunter Strike","Queen's Wings","Antique Cuirass","Immortality"],emblem:"Эмблема бойца.",talents:"Урон навыков и устойчивость.",spell:"Возмездие в лесу; Вспышка на линии.",note:"Выбирай предметы по составу врага и своей роли."},
  "Balmond": {role:"Лес · Боец",goal:"Урон и устойчивость в лесу",items:["Tough Boots","War Axe","Hunter Strike","Queen's Wings","Antique Cuirass","Immortality"],emblem:"Эмблема бойца.",talents:"Физический урон и выживаемость.",spell:"Возмездие в лесу.",note:"Подстраивай защиту под основной урон врагов."},
  "Fredrinn": {role:"Лес · Танк",goal:"Передняя линия и контроль целей",items:["Tough Boots","Cursed Helmet","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality"],emblem:"Эмблема танка.",talents:"Защитные таланты и устойчивость в продолжительном бою.",spell:"Возмездие.",note:"Собирайся по фактическому урону соперников."},
  "Tigreal": {role:"Роум · Танк",goal:"Начало боя и контроль",items:["Tough Boots","Dominance Ice","Athena's Shield","Antique Cuirass","Immortality","Guardian Helmet"],emblem:"Эмблема танка.",talents:"Защита и устойчивость; талант на контроль/командную пользу, если доступен.",spell:"Вспышка для комбинации или Возмездие духа.",note:"Согласовывай начало боя с командой."},
  "Khufra": {role:"Роум · Танк",goal:"Контроль мобильных врагов",items:["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality","Guardian Helmet"],emblem:"Эмблема танка.",talents:"Устойчивость и защитные таланты.",spell:"Вспышка или Возмездие духа.",note:"Особенно цени контроль против героев с рывками."},
  "Atlas": {role:"Роум · Танк",goal:"Командный контроль и начало боя",items:["Tough Boots","Dominance Ice","Athena's Shield","Antique Cuirass","Immortality","Guardian Helmet"],emblem:"Эмблема танка.",talents:"Защита и устойчивость.",spell:"Вспышка для неожиданного начала боя.",note:"Начинай бой, когда союзники готовы продолжить атаку."},
  "Franco": {role:"Роум · Танк",goal:"Пики и точечный контроль",items:["Tough Boots","Dominance Ice","Athena's Shield","Antique Cuirass","Immortality","Guardian Helmet"],emblem:"Эмблема танка.",talents:"Выживаемость и усиление контроля/командной пользы.",spell:"Вспышка или Возмездие духа.",note:"Выбирай цели, которых команда сможет быстро устранить."},
  "Lolita": {role:"Роум · Танк",goal:"Защита союзников и контроль",items:["Tough Boots","Dominance Ice","Athena's Shield","Antique Cuirass","Immortality","Guardian Helmet"],emblem:"Эмблема танка.",talents:"Защитные таланты и устойчивость.",spell:"Возмездие духа или Вспышка.",note:"Оцени, какие атаки и снаряды можно блокировать."},
  "Angela": {role:"Роум · Поддержка",goal:"Щиты, помощь союзнику и выживаемость",items:["Tough Boots","Oracle","Dominance Ice","Athena's Shield","Immortality"],emblem:"Эмблема поддержки.",talents:"Командная польза, восстановление и сокращение перезарядки.",spell:"Исцеление или Вспышка.",note:"Выбирай союзника для ультимейта по ситуации, а не автоматически."},
  "Estes": {role:"Роум · Поддержка",goal:"Лечение и защита команды",items:["Tough Boots","Oracle","Dominance Ice","Athena's Shield","Immortality"],emblem:"Эмблема поддержки.",talents:"Восстановление и командная польза.",spell:"Исцеление или Вспышка.",note:"Держись рядом с командой и учитывай антихил соперников."},
  "Diggie": {role:"Роум · Поддержка",goal:"Снятие контроля и командная поддержка",items:["Tough Boots","Flask of the Oasis","Dominance Ice","Athena's Shield","Immortality"],emblem:"Эмблема поддержки.",talents:"Сокращение перезарядки и командная польза.",spell:"Исцеление или Вспышка.",note:"Сохраняй ультимейт под важный массовый контроль врага."}
};
let activeBuildHeroName = "";
let activeBuildRoles = [];
let activeBuildVariant = "standard";

function getHeroBuild(heroName, roles) {
  const featured = featuredHeroBuilds[heroName];
  if (featured) return {...featured, personalized:true};
  const classes = Array.isArray(roles) ? roles : [String(roles || "")];
  const role = classes.find(value=>roleBuildTemplates[value]) || "Боец";
  return {...roleBuildTemplates[role], personalized:false};
}
function getVariantItems(build, variant) {
  if (variant === "standard") return build.items;
  const roleText = String(build.role || "");
  if (variant === "antiTank") {
    if (roleText.includes("Маг")) return ["Arcane Boots","Glowing Wand","Divine Glaive","Holy Crystal","Lightning Truncheon","Immortality"];
    if (roleText.includes("Стрелок")) return ["Swift Boots","Demon Hunter Sword","Corrosion Scythe","Malefic Roar","Rose Gold Meteor","Immortality"];
    if (roleText.includes("Танк") || roleText.includes("Поддержка")) return ["Tough Boots","Dominance Ice","Antique Cuirass","Cursed Helmet","Athena's Shield","Immortality"];
    return ["Tough Boots","Blade of the Heptaseas","Malefic Roar","War Axe","Blade of Despair","Immortality"];
  }
  if (roleText.includes("Танк") || roleText.includes("Поддержка")) return ["Tough Boots","Cursed Helmet","Dominance Ice","Athena's Shield","Antique Cuirass","Guardian Helmet"];
  return ["Tough Boots","Athena's Shield","Antique Cuirass","Rose Gold Meteor","Immortality","Oracle"];
}
function renderHeroBuildModal() {
  const modal = $("buildModal");
  const content = $("buildModalContent");
  if (!modal || !content || !activeBuildHeroName) return;
  const build = getHeroBuild(activeBuildHeroName, activeBuildRoles);
  const selectedItems = getVariantItems(build, activeBuildVariant);
  const itemRows = selectedItems.map((name,index)=>{
    const item = items.find(entry=>entry.name===name);
    const iconSlug = item ? itemIconSlug(item.name) : null;
    const icon = iconSlug
      ? `<img class="build-item-icon" src="${escapeHTML(ITEM_IMAGE_BASE + iconSlug + ".png")}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'build-item-icon-fallback',textContent:'⚔'}))">`
      : `<span class="build-item-icon-fallback">⚔</span>`;
    return `<div class="build-item-row"><span class="build-slot">0${index+1}</span>${icon}<div><strong>${escapeHTML(item?item.ru:name)}</strong><span>${escapeHTML(item?item.stats:"Проверь предмет в клиенте игры.")}</span></div></div>`;
  }).join("");
  const variantLabel = activeBuildVariant === "standard" ? "Основная" : activeBuildVariant === "antiTank" ? "Против танков" : "Защитная";
  const talentText = build.talents || "Первый талант: под стиль героя и выбранную линию. Второй талант: урон/выживаемость по ситуации. Третий талант: основной талант эмблемы, подходящий механике героя.";
  content.innerHTML = `<h2 id="buildModalTitle">${escapeHTML(activeBuildHeroName)} <span class="red">/ СБОРКА</span></h2>
    <p class="build-modal-subtitle">${escapeHTML(build.role)} · ${escapeHTML(build.goal)}</p>
    <div class="build-variant-tabs" role="group" aria-label="Вариант сборки">
      <button type="button" class="build-variant ${activeBuildVariant==="standard"?"active":""}" data-build-variant="standard" aria-pressed="${activeBuildVariant==="standard"}">Основная</button>
      <button type="button" class="build-variant ${activeBuildVariant==="antiTank"?"active":""}" data-build-variant="antiTank" aria-pressed="${activeBuildVariant==="antiTank"}">Против танков</button>
      <button type="button" class="build-variant ${activeBuildVariant==="defense"?"active":""}" data-build-variant="defense" aria-pressed="${activeBuildVariant==="defense"}">Защитная</button>
    </div>
    <div class="build-modal-section"><h3>${escapeHTML(variantLabel)} · предметы по порядку</h3><p class="fine-print">Нажимай на картинки глазами как на подсказку: это порядок покупки, а не обязательная очередь для каждой ситуации.</p><div class="build-item-list">${itemRows}</div></div>
    <div class="build-advice">
      <div class="build-advice-card"><span class="build-advice-icon">✦</span><div><strong>Эмблема</strong><p>${escapeHTML(build.emblem)}</p></div></div>
      <div class="build-advice-card"><span class="build-advice-icon">◆</span><div><strong>Таланты / перки</strong><p>${escapeHTML(talentText)}</p></div></div>
      <div class="build-advice-card"><span class="build-advice-icon">➤</span><div><strong>Боевой навык</strong><p>${escapeHTML(build.spell)}</p></div></div>
    </div>
    <p class="build-modal-note">${build.personalized ? "Рекомендация для конкретного героя. " : "Пока это шаблон по классу, а не точная сборка для каждого героя. "}${escapeHTML(build.note)}</p>
    <p class="fine-print">Сборки и таланты могут меняться после патчей. Перед ранговой игрой проверь обновления и подстраивай защитный слот под врагов.</p>`;
}
function openHeroBuild(heroName, rolesText) {
  const modal = $("buildModal");
  if (!modal) return;
  activeBuildHeroName = String(heroName || "");
  activeBuildRoles = String(rolesText || "").split(",").map(value=>value.trim()).filter(Boolean);
  activeBuildVariant = "standard";
  renderHeroBuildModal();
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
  const enemySelect = $("enemySelect");
  const ownSelect = $("ownHeroSelect");
  if (!enemySelect) return;
  const names = [...new Set(heroes.map(h=>h.name))].sort((a,b)=>a.localeCompare(b));
  const fillSelect = (select, placeholder) => {
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="">${placeholder}</option>` +
      names.map(name=>`<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`).join("");
    if (names.includes(current)) select.value = current;
  };
  fillSelect(enemySelect,"Выбери вражеского героя...");
  fillSelect(ownSelect,"Выбери своего героя...");
}

function inferHeroRole(name) {
  const hero = heroes.find(h=>h.name.toLowerCase()===String(name).toLowerCase());
  if (!hero) return "";
  const roles = getHeroClasses(hero);
  return roles.find(role=>["Убийца","Маг","Стрелок","Боец","Танк","Поддержка"].includes(role)) || "";
}

function getCounterPicks(enemy, enemyRole) {
  const exact = counters[enemy];
  if (exact) return {picks:exact.picks,reason:exact.reason};
  const rolePicks = {
    "Убийца":["Khufra","Franco","Saber"],
    "Маг":["Lolita","Chou","Saber"],
    "Стрелок":["Saber","Franco","Lolita"],
    "Боец":["Kite","Kaja","Franco"],
    "Танк":["Karrie","Claude","Dyrroth"],
    "Поддержка":["Saber","Franco","Chou"]
  };
  const picks = (rolePicks[enemyRole] || ["Khufra","Franco","Saber"]).filter(name=>heroes.some(h=>h.name.toLowerCase()===name.toLowerCase()));
  return {picks,reason:`Для ${enemy} нет отдельной проверенной записи. Это предварительные варианты по классу ${enemyRole || "героя"}; проверяй навыки, состав команд и текущий патч.`};
}

function getSituationalItems(ownHero, ownRole, enemy, enemyRole) {
  const key = String(ownHero || "").toLowerCase();
  let names;
  let reason;
  if (["fanny","фанни"].includes(key)) {
    names = ["Tough Boots","Blade of the Heptaseas","Malefic Roar","War Axe","Immortality"];
    if (enemyRole === "Маг") {
      names = ["Tough Boots","Blade of the Heptaseas","Malefic Roar","Rose Gold Meteor","Athena's Shield","Immortality"];
      reason = "Против сильного магического взрывного урона рассмотри Athena's Shield; Rose Gold Meteor может дать дополнительную защиту. Не забывай, что Фанни зависит от энергии и темпа.";
    } else if (enemyRole === "Танк") {
      names = ["Tough Boots","Blade of the Heptaseas","Malefic Roar","War Axe","Sea Halberd","Immortality"];
      reason = "Против выносливых целей рассмотри физическое пробивание; Sea Halberd имеет смысл против сильного лечения/щитов, если подходит ситуации.";
    } else if (enemyRole === "Стрелок" || enemyRole === "Убийца") {
      names = ["Tough Boots","Blade of the Heptaseas","Malefic Roar","Rose Gold Meteor","Immortality"];
      reason = "Сохраняй взрывной урон, но добавь защитный слот, если соперник быстро отвечает уроном. Против опасного физического урона оцени защитные альтернативы.";
    } else {
      reason = "Это базовый ориентир для Фанни. Меняй защитный слот по типу урона врага и не копируй одну сборку во все матчи.";
    }
  } else if (ownRole === "Маг") {
    names = ["Arcane Boots","Glowing Wand","Holy Crystal","Divine Glaive","Immortality"];
    if (enemyRole === "Танк") names = ["Arcane Boots","Glowing Wand","Divine Glaive","Holy Crystal","Immortality"];
    reason = enemyRole === "Танк" ? "Против танков чаще полезно магическое пробивание; сверяй предметы с их магической защитой." : "Базовый магический вариант. Если враг легко добирается до тебя, замени атакующий слот на подходящую защиту.";
  } else if (ownRole === "Стрелок") {
    names = ["Swift Boots","Demon Hunter Sword","Corrosion Scythe","Malefic Roar","Immortality"];
    if (enemyRole === "Танк") names = ["Swift Boots","Demon Hunter Sword","Malefic Roar","Corrosion Scythe","Immortality"];
    reason = enemyRole === "Танк" ? "Против выносливых целей рассмотри урон по здоровью и физическое пробивание." : "Сохраняй дистанцию; защитный слот нужен, если вражеский герой может быстро ворваться.";
  } else if (ownRole === "Танк" || ownRole === "Поддержка") {
    names = ["Tough Boots","Dominance Ice","Antique Cuirass","Athena's Shield","Immortality"];
    if (enemyRole === "Маг") names = ["Tough Boots","Athena's Shield","Radiant Armor","Dominance Ice","Immortality"];
    if (enemyRole === "Стрелок" || enemyRole === "Убийца") names = ["Tough Boots","Antique Cuirass","Blade Armor","Dominance Ice","Immortality"];
    reason = enemyRole === "Маг" ? "Против магического урона оцени Athena's Shield или Radiant Armor по характеру урона." : "Подбирай защиту под главный источник урона соперника; это не обязательный порядок покупки.";
  } else {
    names = ["Tough Boots","Endless Battle","War Axe","Antique Cuirass","Malefic Roar","Immortality"];
    if (enemyRole === "Маг") names = ["Tough Boots","Endless Battle","Athena's Shield","War Axe","Immortality"];
    reason = "Базовый ориентир для бойца. Подстрой защитные слоты под урон врага и особенности своего героя.";
  }
  const uniqueItems = [...new Set(names)].map(name=>items.find(item=>item.name===name)).filter(Boolean);
  return {items:uniqueItems,reason:reason || "Сборка — ориентир, а не жёсткий порядок покупок. Меняй предметы по ходу матча."};
}

function showCounterpick() {
  const enemy = $("enemySelect")?.value;
  const ownHero = $("ownHeroSelect")?.value;
  const result = $("counterResult");
  if (!result) return;
  if (!enemy) {
    result.innerHTML = '<div class="result-icon">!</div><div><strong>Выбери героя противника</strong><p>Укажи персонажа, против которого хочешь подготовиться.</p></div>';
    return;
  }
  const enemyRole = inferHeroRole(enemy);
  const counterData = getCounterPicks(enemy,enemyRole);
  const pickNames = counterData.picks.length ? counterData.picks : ["Khufra","Franco","Saber"];
  const pickButtons = pickNames.map(name=>{
    const found = heroes.find(h=>h.name.toLowerCase()===name.toLowerCase());
    const actualName = found ? found.name : name;
    const role = found ? getHeroClasses(found).join(" / ") : "Контрпик";
    return `<span class="counter-pick-chip"><strong>${escapeHTML(actualName)}</strong><small>${escapeHTML(role)}</small></span>`;
  }).join("");
  let buildBlock = "";
  if (ownHero) {
    const ownRole = inferHeroRole(ownHero);
    const situational = getSituationalItems(ownHero,ownRole,enemy,enemyRole);
    const itemRows = situational.items.map((item,index)=>`<div class="counter-item-row"><span class="build-slot">0${index+1}</span><div><strong>${escapeHTML(item.ru)}</strong><small>${escapeHTML(item.stats)}</small></div></div>`).join("");
    buildBlock = `<div class="counter-build"><h3>Предметы для ${escapeHTML(ownHero)} против ${escapeHTML(enemy)}</h3><div class="counter-item-list">${itemRows}</div><p>${escapeHTML(situational.reason)}</p></div>`;
  } else {
    buildBlock = '<p class="counter-help">Чтобы увидеть предметы именно для своего героя, выбери его во втором списке.</p>';
  }
  result.innerHTML = `<div class="counter-result-inner">
    <strong>Кого выбрать против ${escapeHTML(enemy)}?</strong>
    <div class="counter-pick-list">${pickButtons}</div>
    <p class="counter-reason">${escapeHTML(counterData.reason)}</p>
    ${buildBlock}
    <p class="fine-print">Подсказки ориентировочные. Пик и предметы зависят от патча, линии, союзников и состава противника.</p>
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
    const variantButton = event.target.closest("[data-build-variant]");
    if (variantButton) {
      activeBuildVariant = variantButton.dataset.buildVariant;
      renderHeroBuildModal();
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

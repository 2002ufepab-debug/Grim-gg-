
"use strict";

/*
 * GRIM_GG — CLIENT-SIDE DATABASE
 * Предметы и советы встроены в файл.
 * Внешний каталог героев используется только при успешной загрузке.
 * Точные значения характеристик не приводятся без проверки текущего патча.
 */

const $ = id => document.getElementById(id);

const HERO_SOURCE =
  "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/hero.json";
const EQUIPMENT_SOURCE =
  "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/equipment.json";

const HERO_IMAGE_BASE =
  "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/images-hero/";
const ITEM_IMAGE_BASE =
  "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/logo-equipment/";

const roleTranslations = {
  assassin:"Убийца", mage:"Маг", marksman:"Стрелок",
  fighter:"Боец", tank:"Танк", support:"Поддержка"
};

const HERO_IMAGE_OVERRIDES = {
  "chang'e":"chang27e.png",
  "x.borg":"xborg.png",
  "luo yi":"luo_yi.png",
  "yi sun-shin":"yi_sun-shin.png",
  "yu zhong":"yu_zhong.png",
  "popol and kupa":"popol_and_kupa.png",
  "lapu-lapu":"lapu-lapu.png"
};
const heroImageFilename = name => HERO_IMAGE_OVERRIDES[String(name || "").toLowerCase()]
  || (String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "") + ".png");
const heroImageUrl = name => HERO_IMAGE_BASE + encodeURIComponent(heroImageFilename(name));

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
  image:heroImageUrl(h[0])
}));

const heroTips = {
  Fanny:"Следи за энергией и маршрутами тросов. Выбирай момент, когда опасные навыки контроля соперников уже потрачены.",
  Vexana:"Держись позади передней линии, используй контроль и помогай команде начинать бой.",
  Claude:"Фарми безопасно и выбирай момент для ультимейта, когда противники не могут быстро остановить тебя.",
  Belerick:"Прикрывай союзников и учитывай, кто из соперников наносит основной урон.",
  Khufra:"Сохраняй контроль против мобильных противников и согласовывай начало боя с союзниками.",
  Gusion:"Тренируй комбинации навыков и сохраняй возможность отступить после атаки.",
  Ling:"Следи за ресурсами и позициями врагов, особенно перед командными боями.",
};

const comboGuides = [
  {hero:"Фанни",key:"Fanny",role:"Убийца",difficulty:"Высокая",situation:"Вход в бой и отход",skills:["2","2","3","1","2"],steps:["Начни с троса к стене и сразу задай вторым тросом направление к цели.","Во время пролёта оцени траекторию и запас энергии; не лети прямо в несколько готовых к контролю врагов.","Используй ультимейт по подходящей цели, когда можешь реализовать метку и урон.","Примени первый навык вблизи цели и продолжай движение тросами только при достаточном запасе энергии.","Заранее оставь безопасный маршрут для отхода."],tip:"Это пример входа в бой, а не жёсткая последовательность. У Фанни траектория и запас энергии меняют комбо; отрабатывай тросы в тренировке.",search:"лес тросы мобильность"},
  {hero:"Госсен",key:"Gusion",role:"Убийца",difficulty:"Высокая",situation:"Комбо с обновлением навыков",skills:["2","3","2","1","1","2"],steps:["Метни кинжалы вторым навыком в сторону выбранной цели.","Используй ультимейт, чтобы изменить позицию и обновить навыки.","Повтори второй навык, направляя кинжалы через цель.","Попади первым навыком и используй повторное нажатие для сближения, если метка сработала.","Повтори первый навык, если он уже доступен, чтобы продолжить атаку или сменить позицию.","Верни кинжалы вторым навыком и оцени, безопасно ли продолжать бой."],tip:"Комбо требует точного попадания и своевременного повторного нажатия. Если цель уходит или рядом несколько врагов, сохрани возможность отступить.",search:"лес кинжалы burst"},
  {hero:"Вексана",key:"Vexana",role:"Маг",difficulty:"Средняя",situation:"Контроль перед командным боем",skills:["1","2","3"],steps:["Попробуй остановить опасную цель первым навыком.","Пока враг ограничен в движении, направь второй навык в выбранную область.","Используй ультимейт, когда он поможет закрепить преимущество в бою."],tip:"Держись позади союзников передней линии. Не расходуй все навыки на танка, если рядом есть уязвимая цель.",search:"мид маг контроль teamfight"},
  {hero:"Клод",key:"Claude",role:"Стрелок",difficulty:"Средняя",situation:"Урон по группе",skills:["1","2","3"],steps:["Попади первым навыком по врагам, чтобы усилить подготовку к атаке.","Размести вторую способность так, чтобы сохранить возможность вернуться в безопасную позицию.","Входи с ультимейтом, когда противники потратили опасный контроль или не могут быстро остановить тебя."],tip:"Не начинай ультимейт в центре врагов, если у них готовы оглушение или другие способы прервать атаку.",search:"голд стрелок ультимейт позиция"},
  {hero:"Белерик",key:"Belerick",role:"Танк",difficulty:"Низкая",situation:"Защита союзников",skills:["2","1","3"],steps:["Подойди к союзникам и выбери момент, когда противник угрожает задней линии.","Используй навык сближения или замедления, чтобы помешать врагу.","Примени ультимейт, когда несколько противников находятся в зоне действия и команда готова продолжить."],tip:"Не начинай бой далеко от союзников. Твоя задача — создать для команды удобное окно, а не просто ворваться первым.",search:"роум танк защита контроль"},
  {hero:"Хуфра",key:"Khufra",role:"Танк",difficulty:"Средняя",situation:"Инициация и контроль",skills:["2","1","3"],steps:["Используй второй навык, если нужно мешать мобильным противникам.","Выбери безопасную траекторию для входа с помощью первого навыка.","Сгруппируй противников ультимейтом у стены или в удобной для команды позиции, если ситуация позволяет."],tip:"Согласуй вход с союзниками: контроль без последующего урона редко приносит пользу.",search:"роум танк мобильные герои инициировать"},
  {hero:"Эудора",key:"Eudora",role:"Маг",difficulty:"Низкая",situation:"Поймать одиночную цель",skills:["2","3","1"],steps:["Подойди на безопасную дистанцию и начни с оглушения.","Используй ультимейт, пока цель не может сразу ответить.","Заверши комбо первым навыком и отойди, пока навыки перезаряжаются."],tip:"Выбирай одиночную цель и следи за мини-картой: после комбо у тебя может не остаться способов защититься.",search:"мид маг оглушение burst"},
  {hero:"Лейла",key:"Layla",role:"Стрелок",difficulty:"Низкая",situation:"Безопасный урон с дистанции",skills:["2","1","3"],steps:["Замедли или задень противника вторым навыком, если он подходит на опасную дистанцию.","Используй первый навык для урона и поддержания дистанции.","Применяй ультимейт по подходящей линии атаки, не выходя вперёд команды."],tip:"Для Лейлы позиция важнее сложной комбинации: атакуй с задней линии и заранее продумывай путь отхода.",search:"голд стрелок дальность позиция"}
];

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
 id:"roam-boots",name:"Roaming Blessing",ru:"Роум-благословение",cat:"Movement",
 stats:"Роум-эффект, связанный с обувью",
 desc:"Справочная карточка: роум-эффект выбирается для поддержки команды и связан с ботинками. Это не отдельная пара обуви для покупки.",
 tip:"Открой вкладку «Перки», чтобы сравнить четыре эффекта: Скрытность, Поощрение, Благословение и Меткий удар. Перед матчем сверяй доступность и правила с текущей версией игры."
},
{
 id:"retribution",name:"Retribution",ru:"Возмездие",cat:"Jungle",
 stats:"Базовое заклинание лесника",
 desc:"Боевой навык для фарма лесных монстров и борьбы за нейтральные цели.",
 tip:"Выбирай заклинание лесника перед началом матча; после развития лесной экипировки доступен один из вариантов усиления."
},
{
 id:"ice-retribution",name:"Ice Retribution",ru:"Ледяное возмездие",cat:"Jungle",
 stats:"Замедление противника",
 desc:"Вариант усиления Возмездия, который помогает преследовать цель за счёт эффекта замедления.",
 tip:"Рассматривай, когда важно догнать противника или не дать ему уйти."
},
{
 id:"flame-retribution",name:"Flame Retribution",ru:"Пламенное возмездие",cat:"Jungle",
 stats:"Ослабление боевых характеристик цели",
 desc:"Вариант усиления Возмездия для давления на вражеского героя в бою.",
 tip:"Рассматривай, если нужно усилить дуэль против выбранной цели."
},
{
 id:"bloody-retribution",name:"Bloody Retribution",ru:"Кровавое возмездие",cat:"Jungle",
 stats:"Похищение здоровья",
 desc:"Вариант усиления Возмездия, ориентированный на дополнительную выживаемость при использовании против героя.",
 tip:"Рассматривай, если для твоего лесника важны выживаемость и продолжительный бой."
},
{
 id:"roam-conceal",name:"Conceal",ru:"Скрытность",cat:"Roam",
 stats:"Активный эффект · Командное перемещение",
 desc:"Роум-эффект, который помогает команде скрытно начать атаку или сменить позицию.",
 tip:"Используй для согласованного выхода на цель или неожиданного начала командного боя."
},
{
 id:"roam-encourage",name:"Encourage",ru:"Поощрение",cat:"Roam",
 stats:"Усиление союзников",
 desc:"Роум-эффект, ориентированный на поддержку союзников рядом с героем.",
 tip:"Выбирай, когда команде важнее усиление союзников в совместных столкновениях."
},
{
 id:"roam-favor",name:"Favor",ru:"Благословение",cat:"Roam",
 stats:"Поддержка и восстановление",
 desc:"Роум-эффект для героев поддержки, которым важно помогать союзникам восстанавливать здоровье.",
 tip:"Рассматривай на героях, чьи навыки хорошо сочетаются с лечением союзников."
},
{
 id:"roam-dire-hit",name:"Dire Hit",ru:"Меткий удар",cat:"Roam",
 stats:"Дополнительное давление на цель",
 desc:"Роум-эффект, ориентированный на усиление давления на противника при подходящих условиях.",
 tip:"Рассматривай, если команда хочет быстрее добивать выбранные цели."
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
},
{
 id:"wt",name:"Windtalker",ru:"Ветрорез",cat:"Attack",
 stats:"Скорость атаки · Критические атаки",
 desc:"Предмет для некоторых сборок стрелков с упором на скорость атак и критические удары.",
 tip:"Сравнивай с другими вариантами критического урона и проверяй характеристики в текущем патче."
},
{
 id:"hcw",name:"Haas's Claws",ru:"Когти Хааса",cat:"Attack",
 stats:"Физический урон · Восстановление здоровья",
 desc:"Атакующий предмет для некоторых сборок, зависящих от обычных атак.",
 tip:"Проверь текущие свойства предмета и нужна ли герою дополнительная выживаемость."
},
{
 id:"ds",name:"Demon Shoes",ru:"Демонические ботинки",cat:"Movement",
 stats:"Передвижение · Восстановление маны",
 desc:"Обувь для героев, которым важно поддерживать запас маны.",
 tip:"Сравни с обувью на пробивание или сокращение перезарядки."
},
{
 id:"cod",name:"Clock of Destiny",ru:"Часы судьбы",cat:"Magic",
 stats:"Магическая сила · Мана",
 desc:"Магический предмет для отдельных сборок; доступность и свойства следует сверять с текущим патчем.",
 tip:"Используй только если предмет доступен в твоей версии игры и подходит выбранному герою."
},
{
 id:"hs",name:"Hunter Strike",ru:"Удар охотника",cat:"Attack",
 stats:"Физическое пробивание · Передвижение",
 desc:"Физический атакующий предмет для некоторых героев, которым важно пробивание и мобильность.",
 tip:"Подбирай по стилю героя и актуальным характеристикам предмета."
},
{
 id:"flask",name:"Flask of the Oasis",ru:"Фляга оазиса",cat:"Defense",
 stats:"Поддержка · Усиление лечения и щитов",
 desc:"Предмет для некоторых сборок поддержки, связанных с лечением и щитами.",
 tip:"Проверь доступность предмета и его эффект в актуальной версии игры."
}
];

const categories = {
  Attack:"Физический урон",
  Magic:"Магия",
  Defense:"Защита",
  Movement:"Передвижение",
  Jungle:"Лес",
  Roam:"Роум",
  Other:"Прочее"
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
    reason:"Контроль может прервать удобный для Госсена вход. Следи за тем, когда он потратил навыки."
  }
};

let heroes = fallbackHeroes.map(h=>({...h}));
let heroDataSource = "fallback";
let heroQuery = "";
let activeRole = "Все";
let activeTier = "Все";
let activeTierRole = "Все";
let itemQuery = "";
let itemCategory = "Все";
let perkQuery = "";
let perkCategory = "Все";
let buildFilter = "Все";
let buildRoleFilter = "Все";
let buildQuery = "";
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
    "Demon Shoes":"demon_boots",
    "Retribution":"retribution",
    "Ice Retribution":"ice_retribution",
    "Flame Retribution":"flame_retribution",
    "Bloody Retribution":"bloody_retribution",
    "Conceal":"conceal",
    "Encourage":"encourage",
    "Favor":"favor",
    "Dire Hit":"dire_hit"
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

  const sourceRoles = Array.isArray(hero.role)
    ? hero.role
    : Array.isArray(hero.roles) ? hero.roles
    : typeof hero.role === "string" ? [hero.role] : [];

  // Некоторые внешние записи объединяют несколько классов в одну строку.
  const roleText = sourceRoles
    .flatMap(role => String(role).split(/[\\/,|]/))
    .map(role => role.trim().toLowerCase())
    .filter(Boolean);
  const translatedRoles = roleText.map(role=>roleTranslations[role] || role);
  const fallbackMatch = fallbackHeroes.find(h=>h.name.toLowerCase()===String(name).toLowerCase());
  const filename = hero["images-hero"] || hero.image || hero.image_url || "";

  return {
    id:fallbackMatch ? String(fallbackMatch.id) : String(hero.id_hero ?? hero.id ?? "remote-"+index),
    name:String(name),
    role:translatedRoles.join(" / ") || "Роль не указана",
    image:filename && /^https?:\/\//i.test(filename)
      ? filename
      : filename ? HERO_IMAGE_BASE + String(filename).replace(/^images-hero\//, "").split("/").map(part => encodeURIComponent(part)).join("/")
      : heroImageUrl(name),
    roles:roleText
  };
}

function heroImageMarkup(hero) {
  const initial = escapeHTML((hero.name || "?").slice(0,1).toUpperCase());
  if (!hero.image) {
    return `<div class="hero-image-fallback" role="img" aria-label="Изображение героя недоступно">${initial}</div>`;
  }
  const retryImage = heroImageUrl(hero.name);
  return `<img class="hero-image" src="${escapeHTML(hero.image)}" data-retry="${escapeHTML(retryImage)}" alt="${escapeHTML(hero.name)}" loading="lazy" decoding="async" fetchpriority="low" onerror="if(this.dataset.retry){const next=this.dataset.retry;this.dataset.retry='';this.src=next;}else{this.onerror=null;this.replaceWith(Object.assign(document.createElement('div'),{className:'hero-image-fallback',textContent:${JSON.stringify(initial)},role:'img',ariaLabel:'Изображение героя недоступно'}))}">`;
}

function favoriteButton(type,id,saved) {
  return `<button type="button" class="favorite-btn ${saved?"saved":""}" data-favorite-type="${type}" data-favorite-id="${escapeHTML(id)}" aria-pressed="${saved}">${saved?"★ В избранном":"☆ В избранное"}</button>`;
}

function hero3DModelUrl(hero) {
  const slug = String(hero?.name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/&/g, "-and-")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return "https://mlbb.tools/heroes/" + slug + "/model";
}

let activeDetailHeroId = "";

function getHeroById(id) {
  return heroes.find(hero => String(hero.id) === String(id)) || null;
}

function renderHeroDetailContent(hero, target) {
  if (!hero || !target) return;
  const roles = getHeroClasses(hero);
  const tip = heroTips[hero.name] || "Учитывай дальность навыков, следи за мини-картой и подстраивай тактику под состав команды соперника.";
  const headingId = target.id === "heroDetailModalContent" ? "heroDetailModalTitle" : "heroDetailPageTitle";
  const build = getHeroBuild(hero.name, roles);
  const buildRows = build.items.map((name,index)=>{
    const item = items.find(entry=>entry.name===name);
    const iconSlug = item ? itemIconSlug(item.name) : null;
    const iconUrl = item && item.imageFile ? ITEM_IMAGE_BASE + item.imageFile : iconSlug ? ITEM_IMAGE_BASE + iconSlug + ".png" : "";
    const icon = iconUrl ? `<img class="build-item-icon" src="${escapeHTML(iconUrl)}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'build-item-icon-fallback',textContent:'⚔'}))">` : '<span class="build-item-icon-fallback">⚔</span>';
    return `<div class="build-item-row">${icon}<div><strong>${escapeHTML(item?item.ru:name)}</strong><span>${escapeHTML(item?item.stats:"Проверь предмет в актуальной версии игры.")}</span></div></div>`;
  }).join("");
  const talentRoleDefaults = {
    "Убийца": "Приоритет: физический урон и пробивание; дополнительный талант — под быстрое устранение тонких целей. Для леса выбирай настройки, усиливающие темп фарма и ранние ганги.",
    "Маг": "Приоритет: магическое пробивание и урон навыков; дополнительный талант — под перезарядку или устойчивость, если часто ловят.",
    "Стрелок": "Приоритет: усиление обычных атак и подходящие характеристики (скорость атаки или критический урон). Выбирай последний талант под конкретного стрелка.",
    "Боец": "Приоритет: урон в продолжительном бою и устойчивость. Для взрывного героя смещай выбор в сторону физического урона и пробивания.",
    "Танк": "Приоритет: выживаемость и командная польза; выбирай дополнительный талант под контроль, начало боя или восстановление.",
    "Поддержка": "Приоритет: командная польза, восстановление и сокращение перезарядки; подстраивай выбор под лечение, щиты и контроль героя."
  };
  const talentText = build.talents || talentRoleDefaults[resolveBuildRole(roles)] || talentRoleDefaults["Боец"];
  const emblemText = build.emblem || roleBuildTemplates[resolveBuildRole(roles)]?.emblem || "Выбери эмблему под роль и механику героя.";
  const spellText = build.spell || roleBuildTemplates[resolveBuildRole(roles)]?.spell || "Боевой навык выбирай под роль и состав соперника.";
  const talentSection = `<div class="hero-detail-section hero-talents-section">
    <span class="eyebrow">GRIM_GG / EMBLEM & TALENTS</span>
    <h3>Эмблема, таланты и боевой навык</h3>
    <div class="hero-talent-grid">
      <div class="hero-talent-card"><span class="hero-talent-label">Эмблема</span><p>${escapeHTML(emblemText)}</p></div>
      <div class="hero-talent-card"><span class="hero-talent-label">Таланты</span><p>${escapeHTML(talentText)}</p></div>
      <div class="hero-talent-card"><span class="hero-talent-label">Боевой навык</span><p>${escapeHTML(spellText)}</p></div>
    </div>
    <p class="fine-print">Это рекомендации по роли и герою, а не подтверждённый пресет трёх конкретных талантов. Точные названия и иконки добавим после проверки данных актуального патча, чтобы не показывать неверные перки.</p>
  </div>`;
  const combo = comboGuides.find(entry => String(entry.key || entry.hero).toLocaleLowerCase() === String(hero.name).toLocaleLowerCase());
  const skillsSection = combo
    ? `<div class="hero-detail-section"><h3>Навыки и комбо</h3><p class="fine-print">Комбо: ${combo.skills.map(escapeHTML).join(" → ")}</p><ol class="hero-skill-steps">${combo.steps.map(step=>`<li>${escapeHTML(step)}</li>`).join("")}</ol><p>${escapeHTML(combo.tip)}</p></div>`
    : `<div class="hero-detail-section"><h3>Навыки героя</h3><p class="fine-print">Подробные описания навыков этого героя ещё не подключены к справочнику. Не показываем выдуманные данные.</p><a class="btn btn-ghost" href="?page=guides">Открыть комбо и гайды ↗</a></div>`;
  const buildSection = `<div class="hero-detail-section hero-build-inline">
    <div class="hero-build-inline-heading"><div><span class="eyebrow">GRIM_GG / BUILD</span><h3>Сборка героя</h3></div><p>${escapeHTML(build.goal)}</p></div>
    <div class="build-item-list">${buildRows}</div>
    <p class="fine-print">${build.personalized ? "Подборка для конкретного героя." : "Стартовый шаблон по роли; не индивидуальная мета-сборка."} ${escapeHTML(build.note)}</p>
    <button type="button" class="btn btn-red" data-open-build="${escapeHTML(hero.name)}" data-build-roles="${escapeHTML(roles.join(","))}">Другие варианты сборки ↗</button>
  </div>`;
  target.innerHTML = `
    <div class="hero-detail-layout">
      <div class="hero-detail-left">
        <div class="hero-detail-art">${heroImageMarkup(hero)}</div>
        ${buildSection}
      </div>
      <div class="hero-detail-copy">
        <span class="eyebrow">GRIM_GG / HERO PROFILE</span>
        <h2 id="${headingId}">${escapeHTML(hero.name)}</h2>
        <p class="hero-role">${escapeHTML(hero.role || roles.join(" / "))}</p>
        <div class="hero-tags">${roles.map(role=>`<span>${escapeHTML(role)}</span>`).join("")}</div>
        <div class="hero-detail-tip"><strong>Совет Grim_gg</strong><p>${escapeHTML(tip)}</p></div>
        <div class="hero-detail-actions">
          ${favoriteButton("hero",String(hero.id),favoriteHeroes.has(String(hero.id)))}
          <button type="button" class="btn btn-ghost" data-open-hero-full="${escapeHTML(hero.name)}">Полная страница ↗</button>
          <a class="btn btn-3d" href="${escapeHTML(hero3DModelUrl(hero))}" target="_blank" rel="noopener noreferrer" aria-label="Открыть 3D-модель героя ${escapeHTML(hero.name)}">◈ 3D-модель ↗</a>
          <a class="btn btn-ghost" href="?page=guides">Комбо и гайды ↗</a>
        </div>
      </div>
    </div>
    ${skillsSection}
    ${talentSection}`;
}

function renderHeroFullPage(name) {
  const target = $("heroDetailPage");
  if (!target) return;
  const hero = heroes.find(entry => entry.name.toLocaleLowerCase() === String(name || "").toLocaleLowerCase());
  if (!hero) {
    target.innerHTML = '<div class="empty-state"><strong>Герой не найден</strong><p>Вернись в каталог и выбери героя ещё раз.</p><a class="btn btn-ghost" href="?page=heroes">Вернуться к героям</a></div>';
    return;
  }
  activeDetailHeroId = String(hero.id);
  renderHeroDetailContent(hero,target);
}

function openHeroDetail(id) {
  const hero = getHeroById(id);
  const modal = $("heroDetailModal");
  const content = $("heroDetailModalContent");
  if (!hero || !modal || !content) return;
  activeDetailHeroId = String(hero.id);
  renderHeroDetailContent(hero,content);
  modal.hidden = false;
  if ($("buildModal")) $("buildModal").hidden = true;
  document.body.classList.add("modal-open");
  modal.querySelector(".hero-detail-close")?.focus();
}

function closeHeroDetail() {
  const modal = $("heroDetailModal");
  if (!modal) return;
  modal.hidden = true;
  if ($("buildModal")?.hidden !== false) document.body.classList.remove("modal-open");
}

function renderHeroes() {
  const grid = $("heroGrid");
  if (!grid) return;

  const roleFilters = $("roleFilters");
  if (roleFilters) {
    roleFilters.querySelectorAll("[data-role-count]").forEach(button => {
      const role = button.dataset.roleCount;
      const count = role === "Все" ? heroes.length : heroes.filter(hero => getHeroClasses(hero).includes(role)).length;
      const output = button.querySelector(".role-count");
      if (output) output.textContent = String(count);
    });
  }

  const filtered = heroes.filter(hero=>
    (activeRole==="Все" || getHeroClasses(hero).includes(activeRole)) &&
    hero.name.toLocaleLowerCase().includes(heroQuery)
  );

  $("heroCount").textContent = `Показано: ${filtered.length}. ${heroDataSource === "fallback" ? "Показан сокращённый встроенный список: он не является полным каталогом." : "Роли взяты из стороннего каталога сообщества и не означают, что герой рекомендован для указанной линии."}`;

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">Герои не найдены. Попробуй другой поиск или роль.</p>';
    return;
  }

  grid.innerHTML = filtered.map(hero=>{
    const id = String(hero.id);
    const saved = favoriteHeroes.has(id);
    const heroClasses = getHeroClasses(hero);
    const tip = heroTips[hero.name] ||
      "Учитывай дальность навыков, следи за мини-картой и подстраивай тактику под состав команды соперника.";

    return `<article class="hero-card">
      <div class="hero-image-wrap">
        <button type="button" class="hero-image-open" data-open-hero="${escapeHTML(id)}" aria-label="Открыть профиль героя ${escapeHTML(hero.name)}">
          ${heroImageMarkup(hero)}
          <span class="hero-id">HERO / ${escapeHTML(id)}</span>
          <span class="hero-image-hint">Открыть профиль ↗</span>
        </button>
      </div>
      <div class="hero-card-content">
        <h3><button type="button" class="hero-name-open" data-open-hero="${escapeHTML(id)}">${escapeHTML(hero.name)}</button></h3>
        <p class="hero-role">${escapeHTML(hero.role || getHeroClasses(hero).join(" / "))}</p>
        <div class="hero-tags">${heroClasses.map(role=>`<span>${escapeHTML(role)}</span>`).join("")}</div>
        <div class="hero-card-actions">
          <button type="button" class="btn btn-red hero-build-btn" data-open-build="${escapeHTML(hero.name)}" data-build-roles="${escapeHTML(heroClasses.join(","))}">Сборка ↗</button>
          <a class="btn btn-3d hero-card-3d" href="${escapeHTML(hero3DModelUrl(hero))}" target="_blank" rel="noopener noreferrer" aria-label="Открыть 3D-модель героя ${escapeHTML(hero.name)}">◈ 3D-модель</a>
        </div>
        <details><summary>Игровой совет ↗</summary><p>${escapeHTML(tip)}</p></details>
        ${favoriteButton("hero",id,saved)}
      </div>
    </article>`;
  }).join("");
}


const tierHighlights = {
  Fanny:{tier:"S",reason:"Очень высокий потенциал при точном управлении тросами и хорошем понимании карты."},
  Ling:{tier:"S",reason:"Мобильность позволяет выбирать цели и менять направление атаки; важны ресурсы и тайминг."},
  Vexana:{tier:"S",reason:"Контроль и урон по области могут заметно влиять на командные сражения."},
  Claude:{tier:"S",reason:"Силен при хорошем фарме, подходящих предметах и безопасной позиции в бою."},
  Khufra:{tier:"S",reason:"Контроль и противодействие рывкам полезны против мобильных героев."},
  Belerick:{tier:"A",reason:"Выносливость и ответ на частые обычные атаки помогают против определённых составов."},
  Ruby:{tier:"A",reason:"Контроль и восстановление помогают в затяжных боях при правильном выборе момента."},
  Xavier:{tier:"A",reason:"Дальность навыков помогает наносить урон и поддерживать команду из безопасной позиции."},
  Karrie:{tier:"A",reason:"Может хорошо справляться с выносливыми целями при подходящих предметах."},
  Diggie:{tier:"A",reason:"Полезен против составов, которые полагаются на контроль, если вовремя использовать поддержку."},
  Terizla:{tier:"A",reason:"Выносливость и контроль по области полезны в боях за ключевые цели."},
  Tigreal:{tier:"B",reason:"Сильное начало боя требует обзора, позиции и согласованных действий команды."},
  Chou:{tier:"B",reason:"Может изолировать важную цель, но многое зависит от механики и точного тайминга."},
  Miya:{tier:"B",reason:"Раскрывается при безопасном фарме и надёжном прикрытии союзников."},
  Layla:{tier:"B",reason:"Высокая дальность помогает наносить урон, но позиция и защита команды особенно важны."},
  Eudora:{tier:"B",reason:"Опасна при удачной комбинации, однако зависит от возможности добраться до цели."},
  Nana:{tier:"B",reason:"Контроль мешает соперникам, а эффективность зависит от таймингов и состава команд."},
  Saber:{tier:"B",reason:"Опасен для одиночных целей, но ему сложнее против слаженной и сгруппированной команды."},
  Alucard:{tier:"B",reason:"Нуждается в хорошем выборе момента входа и подходящих условиях для сближения."},
  Hanabi:{tier:"B",reason:"Может наносить урон в командных боях, если получает время и защиту."},
  Gusion:{tier:"A",reason:"Высокий потенциал быстрого урона при хорошем исполнении комбинаций."},
  Faramis:{tier:"A",reason:"Командная поддержка и своевременное использование ультимейта могут изменить ход боя."},
  Lolita:{tier:"A",reason:"Защитные способности особенно ценны против подходящих снарядов и атак соперника."},
};

function tierReason(hero, tier) {
  const custom = tierHighlights[hero.name];
  if (custom) return custom.reason;
  const role = getHeroClasses(hero)[0] || "героя";
  const defaults = {
    S:"Предварительно высокий приоритет. Проверь, подходит ли герой под состав команды и текущий патч.",
    A:"Надёжный вариант во многих ситуациях; результат зависит от противостояния, сборки и мастерства игрока.",
    B:"Ситуативный выбор. Оцени составы команд, контрпики и собственный опыт игры на герое.",
    C:"Выбор требует подходящих условий или хорошего владения героем; учитывай контрпики и план команды."
  };
  return `${defaults[tier]} Роль в каталоге: ${role}.`;
}

function getTierEntries() {
  const knownNames = new Map(Object.entries(tierHighlights).map(([name, data]) => [name.toLocaleLowerCase(), data]));
  return heroes.map(hero => {
    const custom = knownNames.get(hero.name.toLocaleLowerCase());
    const tier = custom?.tier || "B";
    return {
      hero,
      tier,
      role: getHeroClasses(hero),
      reason: custom?.reason || tierReason(hero, tier)
    };
  }).sort((a,b) => {
    const order = {S:0,A:1,B:2,C:3};
    return order[a.tier]-order[b.tier] || a.hero.name.localeCompare(b.hero.name);
  });
}

function renderTierList() {
  const grid = $("tierGrid");
  const count = $("tierCount");
  if (!grid || !count) return;
  const query = ($("tierSearch")?.value || "").trim().toLocaleLowerCase();
  const filtered = getTierEntries().filter(entry =>
    (activeTier === "Все" || entry.tier === activeTier) &&
    (activeTierRole === "Все" || entry.role.includes(activeTierRole)) &&
    entry.hero.name.toLocaleLowerCase().includes(query)
  );
  count.textContent = `Показано ${filtered.length} из ${heroes.length} героев · сортировка по уровню и имени`;
  if (!filtered.length) {
    const tierHasNoAssignedHeroes = activeTier === "C" && !query && activeTierRole === "Все";
    const emptyTitle = tierHasNoAssignedHeroes ? "Уровень C пока не назначен" : "Ничего не найдено";
    const emptyMessage = tierHasNoAssignedHeroes
      ? "В текущей редакционной оценке герои уровня C не указаны. Герои без отдельной оценки временно отображаются на уровне B."
      : "Измени поиск или сбрось фильтры.";
    grid.innerHTML = `<div class="tier-empty"><strong>${emptyTitle}</strong><p>${emptyMessage}</p><button class="btn btn-ghost" type="button" data-tier-reset>Сбросить фильтры</button></div>`;
    return;
  }
  const tierNames = {S:"Высокий приоритет",A:"Надёжный выбор",B:"Ситуативный выбор",C:"Требует условий"};
  grid.innerHTML = filtered.map(entry => {
    const art = heroImageMarkup(entry.hero);
    const roles = entry.role.map(role => `<span>${escapeHTML(role)}</span>`).join("");
    return `<article class="tier-card">
      <div class="tier-card-art">${art}<span class="tier-rank tier-${entry.tier.toLowerCase()}">${entry.tier}</span></div>
      <div class="tier-card-content">
        <div class="tier-card-meta"><span class="tier-role">${escapeHTML(tierNames[entry.tier])}</span><span class="tier-level-label">${entry.tier} TIER</span></div>
        <h3>${escapeHTML(entry.hero.name)}</h3>
        <div class="tier-role-tags">${roles}</div>
        <details class="tier-details"><summary>Почему этот уровень?</summary><p>${escapeHTML(entry.reason)}</p></details>
      </div>
    </article>`;
  }).join("");
}

function effectIconMarkup(item) {
  const art = {
    "retribution": '<path d="M59 13 34 55h17l-7 29 31-43H57Z" fill="#ff526b" stroke="#ffd0d7" stroke-width="3" stroke-linejoin="round"/><path d="m34 55-11 6 17 7 4-13" fill="#ff9aaa"/><circle cx="48" cy="48" r="36" fill="none" stroke="#ff526b" stroke-opacity=".5" stroke-width="3"/>',
    "roam-boots": '<path d="M24 54c8 1 14-4 18-15l10 8c7 5 13 7 20 7 5 0 9 4 9 9v8H18v-7c0-5 2-8 6-10Z" fill="#b88cff" stroke="#eadbff" stroke-width="3" stroke-linejoin="round"/><path d="M22 65h55M42 45l-3 8M51 49l-2 5" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
    "ice-retribution": '<g fill="none" stroke="#8feaff" stroke-width="3" stroke-linecap="round"><path d="M48 22v52M25 35l46 26M71 35L25 61M39 29l9 7 9-7M39 67l9-7 9 7M20 43l5-8 9 1M62 64l9 1 5-8M20 53l5 8 9-1M62 36l9-1 5 8"/></g>',
    "flame-retribution": '<path d="M49 18c4 14-8 17-2 29 4-7 11-10 12-19 14 13 18 25 12 37-5 11-15 17-27 14-15-3-23-16-17-29 3-7 10-13 12-22 4 5 5 9 4 14 8-6 10-14 6-24Z" fill="#ff9858" stroke="#ffd1a0" stroke-width="3" stroke-linejoin="round"/><path d="M47 51c7 7 10 12 6 19-3 5-10 4-12-1-3-6 2-11 6-18Z" fill="#fff0bf"/>',
    "bloody-retribution": '<path d="M48 18C39 32 27 43 27 56a21 21 0 0 0 42 0C69 43 57 32 48 18Z" fill="#ff526b" stroke="#ffb2bc" stroke-width="3"/><path d="M37 57c1 6 5 9 10 10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
    "roam-conceal": '<path d="M17 48s12-19 31-19 31 19 31 19-12 19-31 19-31-19-31-19Z" fill="none" stroke="#c9a5ff" stroke-width="4"/><circle cx="48" cy="48" r="10" fill="#8d63d8" stroke="#eee0ff" stroke-width="3"/><path d="M13 75 75 13" stroke="#c9a5ff" stroke-width="4" stroke-linecap="round"/>',
    "roam-encourage": '<path d="m48 16 9 20 22 2-17 15 5 22-19-12-19 12 5-22-17-15 22-2 9-20Z" fill="#ffc65e" stroke="#fff0b2" stroke-width="3" stroke-linejoin="round"/>',
    "roam-favor": '<path d="M48 75 20 49C3 31 26 13 40 30l8 9 8-9c14-17 37 1 20 19L48 75Z" fill="#72e0a2" stroke="#d7ffe4" stroke-width="3" stroke-linejoin="round"/>',
    "roam-dire-hit": '<circle cx="48" cy="48" r="28" fill="none" stroke="#ff7487" stroke-width="4"/><circle cx="48" cy="48" r="15" fill="none" stroke="#ffb3bf" stroke-width="4"/><circle cx="48" cy="48" r="5" fill="#fff"/><path d="M48 9v17M48 70v17M9 48h17M70 48h17" stroke="#ff7487" stroke-width="4" stroke-linecap="round"/>'
  }[item.id];
  if (!art) return "";
  const glow = item.cat === "Roam" ? "#241a35" : "#172632";
  return `<svg class="item-image item-image-vector" viewBox="0 0 96 96" role="img" aria-label="${escapeHTML(item.ru)}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="effect-bg-${escapeHTML(item.id)}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${glow}"/><stop offset="1" stop-color="#100d13"/></linearGradient></defs><rect x="3" y="3" width="90" height="90" rx="18" fill="url(#effect-bg-${escapeHTML(item.id)})" stroke="#765065" stroke-width="2"/><circle cx="48" cy="48" r="35" fill="#ffffff08" stroke="#ffffff18"/>${art}</svg>`;
}

function renderItemCards(filtered, grid, emptyMessage) {
  if (!grid) return;
  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">' + escapeHTML(emptyMessage) + '</p>';
    return;
  }
  grid.innerHTML = filtered.map(item=>{
    const saved = favoriteItems.has(item.id);
    const symbol = item.cat === "Jungle" ? "⚔" : item.cat === "Roam" ? "◈" : escapeHTML(item.ru.slice(0,1).toUpperCase());
    const iconSlug = itemIconSlug(item.name);
    // У базового Возмездия в стороннем наборе нет отдельного PNG — используем локальную SVG-иконку.
    // Используем исходные PNG-иконки предметов и усилений там, где они доступны.
    // Для общего роум-благословения оставляем собственную векторную пиктограмму:
    // в наборе нет отдельного файла с таким названием.
    const vectorIcon = item.id === "roam-boots" ? effectIconMarkup(item) : "";
    const iconSource = item.imageFile
      ? ITEM_IMAGE_BASE + item.imageFile
      : item.id === "retribution"
        ? "assets/retribution.svg"
        : item.id === "roam-boots"
          ? ""
          : iconSlug ? ITEM_IMAGE_BASE + iconSlug + ".png" : "";
    const iconMarkup = vectorIcon || (iconSource
      ? `<img class="item-image" src="${escapeHTML(iconSource)}" data-retry="${escapeHTML(ITEM_IMAGE_BASE + (iconSlug ? iconSlug + ".png" : ""))}" alt="${escapeHTML(item.ru)}" loading="lazy" decoding="async" onerror="if(this.dataset.retry){const next=this.dataset.retry;this.dataset.retry='';this.src=next;}else{this.onerror=null;this.replaceWith(Object.assign(document.createElement('div'),{className:'item-symbol',textContent:${JSON.stringify(symbol)}}))}">`
      : `<div class="item-symbol" aria-label="Иконка предмета недоступна">${symbol}</div>`);
    return `<article class="item-card">
      <div class="item-image-wrap">${iconMarkup}</div>
      <div class="item-content">
        <span class="item-category">${escapeHTML(categories[item.cat] || item.cat)}</span>
        <h3>${escapeHTML(item.ru)}</h3>
        <p class="item-description">${escapeHTML(item.name)}</p>
        <p class="item-stats">${escapeHTML(item.stats)}</p>
        <p class="item-description">${escapeHTML(item.desc)}</p>
        <details><summary>Подробнее</summary><p class="item-tip">${escapeHTML(item.tip)}</p><p class="fine-print">Проверяй актуальные эффекты в текущей версии игры.</p></details>
        ${favoriteButton("item",item.id,saved)}
      </div>
    </article>`;
  }).join("");
}

function renderItems() {
  const grid = $("itemGrid");
  if (!grid) return;
  const filtered = items.filter(item=>{
    if (item.cat==="Jungle" || item.cat==="Roam") return false;
    const matchesCategory = itemCategory==="Все" || item.cat===itemCategory;
    const haystack = `${item.name} ${item.ru} ${item.desc} ${item.stats} ${item.tip}`.toLocaleLowerCase();
    return matchesCategory && haystack.includes(itemQuery);
  });
  $("itemCount").textContent = `Предметов в справочнике: ${filtered.length}`;
  renderItemCards(filtered,grid,"Предметы не найдены.");
}

function renderPerks() {
  const grid = $("perkGrid");
  if (!grid) return;
  const filtered = items.filter(item=>{
    if (item.cat!=="Jungle" && item.cat!=="Roam") return false;
    const matchesCategory = perkCategory==="Все" || item.cat===perkCategory;
    const haystack = `${item.name} ${item.ru} ${item.desc} ${item.stats} ${item.tip}`.toLocaleLowerCase();
    return matchesCategory && haystack.includes(perkQuery);
  });
  $("perkCount").textContent = `Заклинаний и эффектов: ${filtered.length}`;
  renderItemCards(filtered,grid,"В этом разделе ничего не найдено.");
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

const magicDamageHeroNames = new Set([
  "Aamon","Alice","Aurora","Cecilion","Chang'e","Cyclops","Esmeralda","Eudora",
  "Faramis","Gord","Guinevere","Gusion","Harith","Harley","Kadita","Kagura","Lylia",
  "Luo Yi","Lunox","Nana","Novaria","Odette","Pharsa","Selena","Valentina",
  "Vale","Valir","Vexana","Xavier","Yve","Zhask","Julian","Silvanna"
]);
const roleAliases = {
  "assassin":"Убийца","убийца":"Убийца",
  "mage":"Маг","маг":"Маг",
  "marksman":"Стрелок","стрелок":"Стрелок",
  "fighter":"Боец","боец":"Боец",
  "tank":"Танк","танк":"Танк",
  "support":"Поддержка","поддержка":"Поддержка"
};
function resolveBuildRole(roles) {
  const classes = Array.isArray(roles) ? roles : [String(roles || "")];
  for (const value of classes) {
    const normalized = String(value).trim().toLowerCase();
    const role = roleAliases[normalized] || value;
    if (roleBuildTemplates[role]) return role;
  }
  return "Боец";
}
function getHeroBuild(heroName, roles) {
  const name = String(heroName || "").trim();
  const featured = featuredHeroBuilds[name];
  const role = resolveBuildRole(roles);
  const roleValues = Array.isArray(roles) ? roles : String(roles || "").split(",");
  const normalizedRoles = roleValues.map(value => {
    const normalized = String(value).trim().toLowerCase();
    return roleAliases[normalized] || roleTranslations[normalized] || String(value).trim();
  });
  // У части героев несколько классов: проверяем все роли, а не только первую.
  const hasMagicRole = normalizedRoles.some(value =>
    /(^|[ ·/])маг($|[ ·/])/i.test(String(value)) ||
    /(^|[ ·/])mage($|[ ·/])/i.test(String(value))
  );
  const roleText = String(featured?.role || "");
  const isMagicBuild = magicDamageHeroNames.has(name) ||
    hasMagicRole ||
    role === "Маг" ||
    /(^|[ ·/])маг($|[ ·/])/i.test(roleText) ||
    /(^|[ ·/])mage($|[ ·/])/i.test(roleText);
  const magicTemplate = roleBuildTemplates["Маг"];
  if (featured) {
    const build = {...featured, personalized:true, isMagicBuild};
    const hasPhysicalAttackItem = build.items.some(itemName => {
      const item = items.find(entry => entry.name === itemName);
      return item?.cat === "Attack";
    });
    if (isMagicBuild && hasPhysicalAttackItem) {
      build.items = [...magicTemplate.items];
      build.goal = "Магический урон и пробивание";
      build.note = "Базовая магическая сборка для ориентира. Подстраивай защитный слот и порядок покупки под соперников.";
    }
    return build;
  }
  const template = isMagicBuild ? magicTemplate : roleBuildTemplates[role];
  return {...template, personalized:false, isMagicBuild};
}
function getVariantItems(build, variant) {
  const roleText = String(build.role || "");
  const isMagicBuild = Boolean(build.isMagicBuild) ||
    /(^|[ ·/])маг($|[ ·/])/i.test(roleText);
  if (variant === "standard") return build.items;
  if (variant === "antiTank") {
    if (isMagicBuild) return ["Arcane Boots","Glowing Wand","Divine Glaive","Holy Crystal","Lightning Truncheon","Immortality"];
    if (/Стрелок/i.test(roleText)) return ["Swift Boots","Demon Hunter Sword","Corrosion Scythe","Malefic Roar","Rose Gold Meteor","Immortality"];
    if (/Танк|Поддержка/i.test(roleText)) return ["Tough Boots","Dominance Ice","Antique Cuirass","Cursed Helmet","Athena's Shield","Immortality"];
    return ["Tough Boots","Blade of the Heptaseas","Malefic Roar","War Axe","Blade of Despair","Immortality"];
  }
  if (/Танк|Поддержка/i.test(roleText)) return ["Tough Boots","Cursed Helmet","Dominance Ice","Athena's Shield","Antique Cuirass","Guardian Helmet"];
  if (isMagicBuild) return ["Tough Boots","Athena's Shield","Rose Gold Meteor","Immortality","Oracle","Divine Glaive"];
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
    const iconUrl = item && item.imageFile ? ITEM_IMAGE_BASE + item.imageFile : iconSlug ? ITEM_IMAGE_BASE + iconSlug + ".png" : "";
    const icon = iconUrl
      ? `<img class="build-item-icon" src="${escapeHTML(iconUrl)}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'build-item-icon-fallback',textContent:'⚔'}))">`
      : `<span class="build-item-icon-fallback">⚔</span>`;
    return `<div class="build-item-row"><span class="build-slot">0${index+1}</span>${icon}<div><strong>${escapeHTML(item?item.ru:name)}</strong><span>${escapeHTML(item?item.stats:"Проверь предмет в клиенте игры.")}</span></div></div>`;
  }).join("");
  const variantLabel = activeBuildVariant === "standard" ? "Основная" : activeBuildVariant === "antiTank" ? "Против танков" : "Защитная";
  const talentText = build.talents || "Первый талант: под стиль героя и выбранную линию. Второй талант: урон/выживаемость по ситуации. Третий талант: основной талант эмблемы, подходящий механике героя.";
  content.innerHTML = `<h2 id="buildModalTitle">${escapeHTML(activeBuildHeroName)} <span class="red">/ СБОРКА</span></h2>
    <p class="build-modal-subtitle">${escapeHTML(build.role)} · ${build.isMagicBuild ? "МАГИЧЕСКАЯ СБОРКА" : "СБОРКА ПО РОЛИ"} · ${escapeHTML(build.goal)}</p>
    <div class="build-variant-tabs" role="group" aria-label="Вариант сборки">
      <button type="button" class="build-variant ${activeBuildVariant==="standard"?"active":""}" data-build-variant="standard" aria-pressed="${activeBuildVariant==="standard"}">Основная</button>
      <button type="button" class="build-variant ${activeBuildVariant==="antiTank"?"active":""}" data-build-variant="antiTank" aria-pressed="${activeBuildVariant==="antiTank"}">Против танков</button>
      <button type="button" class="build-variant ${activeBuildVariant==="defense"?"active":""}" data-build-variant="defense" aria-pressed="${activeBuildVariant==="defense"}">Защитная</button>
    </div>
    <div class="build-modal-section"><h3>${escapeHTML(variantLabel)} · предметы по порядку</h3><p class="fine-print">Порядок покупки — ориентир, а не обязательная последовательность для каждого матча.</p><div class="build-item-list">${itemRows}</div></div>
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

  const query = buildQuery.trim().toLocaleLowerCase();
  const filtered = heroes.filter(hero => {
    const roles = getHeroClasses(hero);
    const matchesRole = buildRoleFilter === "Все" || roles.includes(buildRoleFilter);
    const matchesQuery = String(hero.name || "").toLocaleLowerCase().includes(query);
    return matchesRole && matchesQuery;
  });

  const count = $("buildCount");
  if (count) count.textContent = `Сборок в каталоге: ${filtered.length} из ${heroes.length} героев`;

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">Герои не найдены. Измени поиск или выбери другую роль.</p>';
    return;
  }

  grid.innerHTML = filtered.map(hero => {
    const roles = getHeroClasses(hero);
    const build = getHeroBuild(hero.name, roles);
    const rows = build.items.map((name,index) => {
      const item = items.find(entry => entry.name === name);
      const iconSlug = item ? itemIconSlug(item.name) : null;
      const iconUrl = item && item.imageFile ? ITEM_IMAGE_BASE + item.imageFile : iconSlug ? ITEM_IMAGE_BASE + iconSlug + ".png" : "";
      const icon = iconUrl
        ? `<img class="build-item-icon" src="${escapeHTML(iconUrl)}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'build-item-icon-fallback',textContent:'⚔'}))">`
        : `<span class="build-item-icon-fallback">⚔</span>`;
      return `<div class="build-item-row"><span class="build-slot">0${index+1}</span>${icon}<div><strong>${escapeHTML(item ? item.ru : name)}</strong><span>${escapeHTML(item ? item.stats : "Проверь предмет в актуальной версии игры.")}</span></div></div>`;
    }).join("");

    return `<article class="build-card">
      <span class="build-label">BUILD LAB / ${escapeHTML(hero.name)}</span>
      <h3>${escapeHTML(hero.name)}</h3>
      <p>${escapeHTML(roles.join(" / "))}</p>
      <p><strong>Направление:</strong> ${escapeHTML(build.goal)}</p>
      <div class="build-item-list">${rows}</div>
      <p class="fine-print">${build.personalized ? "Подборка для конкретного героя." : "Стартовый шаблон по роли; не индивидуальная мета-сборка."} ${escapeHTML(build.note)}</p>
      <button class="btn btn-ghost build-open-button" type="button" data-open-build="${escapeHTML(hero.name)}" data-build-roles="${escapeHTML(roles.join(","))}">Все варианты сборки ↗</button>
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
  heroesTab.setAttribute("aria-pressed",String(favoriteTab==="heroes"));
  itemsTab.setAttribute("aria-pressed",String(favoriteTab==="items"));

  if (favoriteTab==="heroes") {
    const saved = heroes.filter(h=>favoriteHeroes.has(String(h.id)));
    grid.innerHTML = saved.length ? saved.map(hero=>`
      <article class="hero-card">
        <div class="hero-image-wrap">${heroImageMarkup(hero)}</div>
        <div class="hero-card-content"><h3>${escapeHTML(hero.name)}</h3>
        <p class="hero-role">${escapeHTML(getHeroClasses(hero).join(" / "))}</p>
        <a class="btn btn-3d hero-card-3d" href="${escapeHTML(hero3DModelUrl(hero))}" target="_blank" rel="noopener noreferrer" aria-label="Открыть 3D-модель героя ${escapeHTML(hero.name)}">◈ 3D-модель героя ↗</a>
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
  renderTierList();
  renderItems();
  renderFavorites();
  if (type === "hero" && activeDetailHeroId) {
    const activeHero = getHeroById(activeDetailHeroId);
    if (activeHero) {
      renderHeroDetailContent(activeHero,$("heroDetailModalContent"));
      renderHeroDetailContent(activeHero,$("heroDetailPage"));
    }
  }
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
  const exactEntry = Object.entries(counters).find(([name]) =>
    name.toLocaleLowerCase() === String(enemy).toLocaleLowerCase()
  );
  const availableNames = new Set(heroes.map(hero=>hero.name.toLocaleLowerCase()));
  if (exactEntry) {
    const [ , exact ] = exactEntry;
    return {
      picks: exact.picks.filter(name=>availableNames.has(name.toLocaleLowerCase())),
      reason: exact.reason
    };
  }
  const rolePicks = {
    "Убийца":["Khufra","Franco","Saber"],
    "Маг":["Lolita","Chou","Saber"],
    "Стрелок":["Saber","Franco","Lolita"],
    "Боец":["Khufra","Kaja","Franco"],
    "Танк":["Karrie","Claude","Dyrroth"],
    "Поддержка":["Saber","Franco","Chou"]
  };
  const suggested = rolePicks[enemyRole] || ["Khufra","Franco","Saber"];
  const picks = suggested.filter(name=>availableNames.has(name.toLocaleLowerCase()));
  const reason = `Для героя «${enemy}» нет отдельной проверенной записи. Это предварительные варианты по классу «${enemyRole || "неизвестная роль"}». Учитывай способности героев, составы команд и текущий патч.`;
  return {picks,reason};
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
    result.innerHTML = '<div class="result-icon">!</div><div><strong>Выбери героя противника</strong><p>Укажи героя, к встрече с которым хочешь подготовиться.</p></div>';
    return;
  }
  const enemyRole = inferHeroRole(enemy);
  const counterData = getCounterPicks(enemy,enemyRole);
  const pickNames = counterData.picks;
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
    ${pickButtons ? `<div class="counter-pick-list">${pickButtons}</div>` : '<p class="counter-help">В загруженном каталоге не нашлось подходящих вариантов для этой роли. Попробуй другой выбор и учитывай навыки соперника.</p>'}
    <p class="counter-reason">${escapeHTML(counterData.reason)}</p>
    ${buildBlock}
    <p class="fine-print">Подсказки носят ориентировочный характер. Выбор героя и предметов зависит от текущего патча, линии, союзников и состава команды противника.</p>
  </div>`;
}

let activeComboRole = "Все";
function renderComboGuides() {
  const grid = $("comboGrid");
  if (!grid) return;
  const query = ($("comboSearch")?.value || "").trim().toLocaleLowerCase();
  const filtered = comboGuides.filter(combo => {
    const roleMatch = activeComboRole === "Все" || combo.role === activeComboRole;
    const haystack = [combo.hero,combo.key,combo.role,combo.situation,combo.difficulty,combo.tip,combo.search,...combo.steps].join(" ").toLocaleLowerCase();
    return roleMatch && (!query || haystack.includes(query));
  });
  const count = $("comboCount");
  if (count) count.textContent = `Показано комбо: ${filtered.length} из ${comboGuides.length}`;
  if (!filtered.length) {
    grid.innerHTML = '<div class="combo-empty"><strong>Ничего не найдено</strong><p>Попробуй другое имя героя или сбрось фильтр роли.</p><button class="filter" type="button" data-combo-reset>Сбросить фильтры</button></div>';
    return;
  }
  grid.innerHTML = filtered.map((combo,index) => `
    <article class="combo-card">
      <div class="combo-card-top">
        <span class="combo-code">COMBO_${String(index+1).padStart(2,"0")}</span>
        <span class="combo-difficulty difficulty-${combo.difficulty==="Высокая"?"hard":combo.difficulty==="Средняя"?"medium":"easy"}">Сложность: ${escapeHTML(combo.difficulty.toLocaleLowerCase())}</span>
      </div>
      <div class="combo-card-heading"><div class="combo-avatar">${(() => { const matchedHero = heroes.find(hero => hero.name.toLocaleLowerCase() === combo.key.toLocaleLowerCase()); return matchedHero ? heroImageMarkup(matchedHero) : `<span aria-hidden="true">${escapeHTML(combo.hero.slice(0,1).toUpperCase())}</span>`; })()}</div><div><h3>${escapeHTML(combo.hero)}</h3><span class="combo-role">${escapeHTML(combo.role)} · ${escapeHTML(combo.situation)}</span></div></div>
      <div class="combo-sequence" aria-label="Порядок навыков">${combo.skills.map((skill,i)=>`<span class="combo-step"><b>${escapeHTML(skill)}</b><small>${i===combo.skills.length-1?"Финиш":"Шаг "+(i+1)}</small></span>`).join('<span class="combo-arrow" aria-hidden="true">›</span>')}</div>
      <details class="combo-details"><summary>Показать объяснение комбо</summary><ol>${combo.steps.map(step=>`<li>${escapeHTML(step)}</li>`).join("")}</ol><div class="combo-tip"><strong>Совет Grim_gg</strong><p>${escapeHTML(combo.tip)}</p></div></details>
    </article>`).join("");
}

function syncFilterSelection(container, selector, activeButton) {
  if (!container) return;
  container.querySelectorAll(selector).forEach(button => {
    const selected = button === activeButton;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function setupFilters() {
  $("comboSearch")?.addEventListener("input",renderComboGuides);
  $("comboFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-combo-role]");
    if (!button) return;
    activeComboRole = button.dataset.comboRole;
    syncFilterSelection($("comboFilters"),"[data-combo-role]",button);
    renderComboGuides();
  });
  $("comboGrid")?.addEventListener("click",event=>{
    if (!event.target.closest("[data-combo-reset]")) return;
    activeComboRole = "Все";
    if ($("comboSearch")) $("comboSearch").value = "";
    syncFilterSelection($("comboFilters"),"[data-combo-role]",$("comboFilters")?.querySelector('[data-combo-role="Все"]'));
    renderComboGuides();
  });
  $("roleFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-role]");
    if (!button) return;
    activeRole = button.dataset.role;
    syncFilterSelection($("roleFilters"),"[data-role]",button);
    renderHeroes();
  });

  $("tierSearch")?.addEventListener("input",renderTierList);

  $("tierGrid")?.addEventListener("click",event=>{
    if (!event.target.closest("[data-tier-reset]")) return;
    activeTier = "Все";
    activeTierRole = "Все";
    if ($("tierSearch")) $("tierSearch").value = "";
    syncFilterSelection($("tierFilters"),"[data-tier]",$("tierFilters")?.querySelector('[data-tier="Все"]'));
    syncFilterSelection($("tierRoleFilters"),"[data-tier-role]",$("tierRoleFilters")?.querySelector('[data-tier-role="Все"]'));
    renderTierList();
  });

  $("tierFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-tier]");
    if (!button) return;
    activeTier = button.dataset.tier;
    syncFilterSelection($("tierFilters"),"[data-tier]",button);
    renderTierList();
  });

  $("tierRoleFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-tier-role]");
    if (!button) return;
    activeTierRole = button.dataset.tierRole;
    syncFilterSelection($("tierRoleFilters"),"[data-tier-role]",button);
    renderTierList();
  });

  $("itemFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-category]");
    if (!button) return;
    itemCategory = button.dataset.category;
    syncFilterSelection($("itemFilters"),"[data-category]",button);
    renderItems();
  });

  $("perkFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-perk-category]");
    if (!button) return;
    perkCategory = button.dataset.perkCategory;
    syncFilterSelection($("perkFilters"),"[data-perk-category]",button);
    renderPerks();
  });

  $("buildSearch")?.addEventListener("input",event=>{
    buildQuery = event.target.value;
    renderBuilds();
  });
  $("buildFilters")?.addEventListener("click",event=>{
    const button = event.target.closest("[data-build-role]");
    if (!button) return;
    buildRoleFilter = button.dataset.buildRole;
    syncFilterSelection($("buildFilters"),"[data-build-role]",button);
    renderBuilds();
  });
}

async function loadExternalItems() {
  try {
    const response = await fetch(EQUIPMENT_SOURCE,{cache:"no-cache"});
    if (!response.ok) throw new Error("Каталог предметов недоступен");
    const data = await response.json();
    if (!Array.isArray(data) || !data.length) throw new Error("Неверный формат каталога предметов");
    const existingNames = new Set(items.map(item=>String(item.name).toLocaleLowerCase()));
    const categoryFor = (name,index) => {
      const value = String(name).toLocaleLowerCase();
      if (/retribution|conceal|dire hit|encourage|favor|allow throw|broken heart|throw forbidden/.test(value)) return "Roam";
      if (/boots|shoes/.test(value)) return "Movement";
      if (/wand|crystal|codex|tome|magic necklace|magic blade|book of sages|flower of hope|lantern of hope|wishing lantern|concentrated energy|starlium|lightning truncheon|holy crystal|divine glaive|genius wand|glowing wand|ice queen|blood wings|feather of heaven|clock of destiny|enchanted talisman|mystic container|azure blade|elegant gem|exotic veil/.test(value)) return "Magic";
      if (/armor|shield|helmet|breastplate|guardian|immortality|oracle|wings|belt|cloak|jerkin|legplates|vitality|healing necklace|rock potion|black ice|dreadnaught|molten essence|silence robe|chastise|thunder belt|dominance|athena|antique|radiant|cursed|queen's wings/.test(value)) return "Defense";
      if (/potion/.test(value)) return "Attack";
      if (/dagger|spear|sword|bow|glove|scythe|malefic|fury|corrosion|despair|heptaseas|hunter strike|wind of nature|windtalker|sky piercer|hunting bow|knife|crossbow|vampire mallet|ogre tomahawk|regular spear|rogue meteor|hass's claws|berserker/.test(value)) return "Attack";
      return "Other";
    };
    data.forEach((entry,index)=>{
      const name = String(entry["name-equipment"] || "").trim();
      if (!name || existingNames.has(name.toLocaleLowerCase())) return;
      const imageFile = String(entry["logo-equipment"] || "").trim();
      const price = Number(entry["prize-gold"]);
      const cat = categoryFor(name,index);
      items.push({
        id:"catalog-" + name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),
        name,
        ru:name,
        cat,
        imageFile,
        stats:Number.isFinite(price) && price > 0 ? "Цена: " + price.toLocaleString("ru-RU") + " золота" : "Цена не указана",
        desc:"Предмет добавлен из внешнего каталога MLBB. Название и иконка могут зависеть от версии источника.",
        tip:"Проверь наличие, цену и характеристики предмета в актуальной версии игры."
      });
      existingNames.add(name.toLocaleLowerCase());
    });
    renderItems();
    renderPerks();
    renderBuilds();
    renderFavorites();
    const count = $("itemCount");
    if (count) count.textContent = `Предметов в справочнике: ${items.filter(item=>item.cat!=="Jungle" && item.cat!=="Roam").length}`;
  } catch (error) {
    console.warn("Grim_gg: внешний каталог предметов недоступен.",error);
  }
}

async function loadExternalHeroes() {
  const note = $("heroSourceNote");
  try {
    const response = await fetch(HERO_SOURCE,{cache:"no-cache"});
    if (!response.ok) throw new Error("Внешний каталог недоступен");

    const data = await response.json();
    if (!Array.isArray(data) || !data.length) throw new Error("Неверный формат каталога");

    const normalized = data.map(normalizeRemoteHero).filter(Boolean);
    if (!normalized.length) throw new Error("Не удалось обработать каталог героев");

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
    renderTierList();
    renderBuilds();
    renderComboGuides();
    renderCounterpicks();
    renderFavorites();
    if (new URLSearchParams(window.location.search).get("page") === "hero") {
      renderHeroFullPage(new URLSearchParams(window.location.search).get("name"));
    }
  } catch (error) {
    heroDataSource = "fallback";
    if (note) note.textContent = "Внешний каталог недоступен. Показан сокращённый встроенный список; он не является полным каталогом игры.";
    console.warn("Grim_gg: внешний каталог героев недоступен.",error);
  }
}


function applyPageNavigation(requestedPage, shouldScroll = true) {
  const pageIds = ["home","heroes","tierlist","items","perks","talents","builds","favorites","guides","counterpicks","esports","hero"];
  const page = requestedPage && pageIds.includes(requestedPage) ? requestedPage : null;
  const visibleSection = page === "hero" ? "hero-detail" : page === "talents" ? "talentLab" : page;

  document.querySelectorAll("main > section").forEach(section => {
    const isHeroDetail = section.id === "hero-detail";
    section.classList.toggle("page-hidden", isHeroDetail ? page !== "hero" : Boolean(page) && section.id !== visibleSection);
  });

  document.querySelectorAll("#nav a").forEach(link => {
    const linkPage = new URLSearchParams(link.search).get("page");
    if (page && linkPage === page) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const titles = {
    home: "Главная",
    heroes: "Герои",
    tierlist: "Тир-лист",
    items: "Предметы",
    perks: "Перки и заклинания",
    talents: "Таланты и эмблемы",
    builds: "Сборки",
    favorites: "Избранное",
    guides: "Комбо и гайды",
    counterpicks: "Контрпики",
    esports: "Киберспорт",
    hero: "Профиль героя"
  };
  document.title = page ? `Grim_gg — ${titles[page]}` : "Grim_gg — тактическая база Mobile Legends";

  if (shouldScroll) window.scrollTo({ top: 0, behavior: "auto" });
}

function setupPageNavigation() {
  const getRequestedPage = () => new URLSearchParams(window.location.search).get("page");
  applyPageNavigation(getRequestedPage(), false);

  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.searchParams.has("page")) return;

    event.preventDefault();
    closeHeroDetail();
    closeHeroBuild();
    if (url.href !== window.location.href) history.pushState({}, "", url.href);
    applyPageNavigation(url.searchParams.get("page"));
    if (url.searchParams.get("page") === "hero") renderHeroFullPage(url.searchParams.get("name"));
    const nav = $("nav");
    const toggle = $("menuToggle");
    nav?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });

  window.addEventListener("popstate", () => {
    applyPageNavigation(getRequestedPage(), false);
    if (getRequestedPage() === "hero") renderHeroFullPage(new URLSearchParams(window.location.search).get("name"));
  });
  if (getRequestedPage() === "hero") renderHeroFullPage(new URLSearchParams(window.location.search).get("name"));
}

function setupMenu() {
  const toggle = $("menuToggle");
  const nav = $("nav");
  if (!toggle || !nav) return;

  const setMenuOpen = open => {
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open ? "Закрыть меню" : "Открыть меню");
    nav.classList.toggle("open",open);
  };

  toggle.addEventListener("click",()=>{
    setMenuOpen(toggle.getAttribute("aria-expanded")!=="true");
  });

  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>setMenuOpen(false)));
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape") setMenuOpen(false);
  });
}

function setupBackToTop() {
  const button = $("backToTop");
  if (!button) return;

  const updateVisibility = () => {
    const shouldShow = window.scrollY > 420;
    button.hidden = !shouldShow;
    button.classList.toggle("is-visible", shouldShow);
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  updateVisibility();
}


const ESPORTS_NEWS_URL = "data/esports-news.json";
let esportsRefreshTimer = null;

function formatEsportsDate(value) {
  if (!value) return "Дата не указана";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Kyiv" }).format(parsed);
}

function renderEsportsNews(newsData) {
  const grid = $("esportsNewsGrid");
  const feature = $("esportsFeaturedNews");
  const updated = $("esportsLastUpdated");
  if (!grid || !Array.isArray(newsData?.articles) || !newsData.articles.length) {
    if (grid) grid.innerHTML = '<article class="esports-card"><h3>Пока нет свежих публикаций</h3><p>Попробуй обновить страницу позже или открой официальный сайт MOONTON.</p><a class="esports-link" href="https://en.moonton.com/news/index.html" target="_blank" rel="noopener noreferrer">Официальные новости ↗</a></article>';
    if (updated) updated.textContent = "Источник временно недоступен";
    return;
  }

  const articles = newsData.articles.filter(item => item && typeof item.title === "string" && typeof item.url === "string" && /^https:\/\/en\.moonton\.com\/news\/[\w-]+\.html(?:[?#].*)?$/.test(item.url)).slice(0, 18);
  if (!articles.length) return;

  const makeTag = title => {
    const text = String(title || "MLBB ESPORTS").toLocaleUpperCase("ru-RU");
    return text.length > 38 ? text.slice(0, 35) + "…" : text;
  };
  const makeLink = (url, label) => {
    const a = document.createElement("a");
    a.className = "esports-link";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label;
    return a;
  };

  if (feature) {
    const first = articles[0];
    const tag = feature.querySelector(".esports-tag");
    const heading = feature.querySelector("h3");
    const paragraph = feature.querySelector("p");
    const link = feature.querySelector("a.esports-link");
    const meta = feature.querySelector(".esports-meta");
    if (tag) tag.textContent = "ПОСЛЕДНЯЯ НОВОСТЬ";
    if (heading) heading.textContent = first.title;
    if (paragraph) paragraph.textContent = first.description || "Открой источник, чтобы прочитать полную новость.";
    if (link) { link.href = first.url; link.textContent = "Читать новость ↗"; }
    if (meta) meta.textContent = [formatEsportsDate(first.published), "Официальный источник: MOONTON Games"].filter(Boolean).join(" · ");
  }

  const fragment = document.createDocumentFragment();
  articles.slice(1).forEach(item => {
    const card = document.createElement("article");
    card.className = "esports-card";
    const top = document.createElement("div");
    top.className = "esports-card-top";
    const tag = document.createElement("span");
    tag.className = "esports-tag";
    tag.textContent = "MOONTON / MLBB";
    const date = document.createElement("span");
    date.className = "esports-date";
    date.textContent = formatEsportsDate(item.published);
    top.append(tag, date);
    const heading = document.createElement("h3");
    heading.textContent = item.title;
    const description = document.createElement("p");
    description.textContent = item.description || "Открой официальную публикацию для подробностей.";
    card.append(top, heading, description, makeLink(item.url, "Подробнее ↗"));
    fragment.append(card);
  });
  grid.replaceChildren(fragment);
  if (updated) {
    const stamp = newsData.updatedAt ? new Date(newsData.updatedAt) : null;
    updated.textContent = stamp && !Number.isNaN(stamp.getTime())
      ? "Лента обновлена " + new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", timeZone: "Europe/Kyiv" }).format(stamp) + " · Киев"
      : "Автоматическая лента MOONTON Games";
  }
}

async function loadEsportsNews() {
  try {
    const response = await fetch(ESPORTS_NEWS_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error("News feed HTTP " + response.status);
    const data = await response.json();
    renderEsportsNews(data);
  } catch (error) {
    const updated = $("esportsLastUpdated");
    if (updated) updated.textContent = "Не удалось обновить ленту — показаны доступные данные";
    const grid = $("esportsNewsGrid");
    if (grid) grid.innerHTML = '<article class="esports-card"><h3>Не удалось загрузить ленту</h3><p>Проверь подключение и попробуй ещё раз. Можно открыть официальный источник.</p><a class="esports-link" href="https://en.moonton.com/news/index.html" target="_blank" rel="noopener noreferrer">Открыть MOONTON ↗</a></article>';
  }
  if (!esportsRefreshTimer) esportsRefreshTimer = window.setInterval(loadEsportsNews, 5 * 60 * 1000);
}

function init() {
  $("year").textContent = new Date().getFullYear();

  favoriteHeroes = new Set(safeRead("grimgg-favorite-heroes").map(String));
  favoriteItems = new Set(safeRead("grimgg-favorite-items").map(String));
  
  // Keep the selected filter state available to assistive technology.
  document.querySelectorAll("[data-role],[data-tier],[data-tier-role],[data-category],[data-perk-category],[data-build-role],[data-combo-role]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  $("heroSearch").addEventListener("input",event=>{
    heroQuery = event.target.value.trim().toLocaleLowerCase();
    renderHeroes();
  });

  $("itemSearch").addEventListener("input",event=>{
    itemQuery = event.target.value.trim().toLocaleLowerCase();
    renderItems();
  });

  $("perkSearch")?.addEventListener("input",event=>{
    perkQuery = event.target.value.trim().toLocaleLowerCase();
    renderPerks();
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
    const openHeroButton = event.target.closest("[data-open-hero]");
    if (openHeroButton) {
      // Профиль сразу показывает навыки/комбо и сборку на одной панели.
      openHeroDetail(openHeroButton.dataset.openHero);
      return;
    }
    const fullHeroButton = event.target.closest("[data-open-hero-full]");
    if (fullHeroButton) {
      const heroName = fullHeroButton.dataset.openHeroFull;
      const url = new URL(window.location.href);
      url.searchParams.set("page", "hero");
      url.searchParams.set("name", heroName);
      closeHeroDetail();
      closeHeroBuild();
      history.pushState({}, "", url.href);
      applyPageNavigation("hero");
      renderHeroFullPage(heroName);
      return;
    }
    if (event.target.closest("[data-close-hero]")) {
      closeHeroDetail();
      return;
    }
    const openBuildButton = event.target.closest("[data-open-build]");
    if (openBuildButton) {
      closeHeroDetail();
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

  setupPageNavigation();
  setupBackToTop();
  setupFilters();
  setupMenu();
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape") {
      closeHeroDetail();
      closeHeroBuild();
    }
  });
  renderHeroes();
  renderItems();
  renderPerks();
  renderBuilds();
  renderComboGuides();
  renderCounterpicks();
  renderFavorites();

  loadExternalHeroes();
  loadExternalItems();
  loadEsportsNews();
  $("refreshEsportsNews")?.addEventListener("click", () => {
    const button = $("refreshEsportsNews");
    if (button) { button.disabled = true; button.textContent = "Обновляем…"; }
    loadEsportsNews().finally(() => {
      if (button) { button.disabled = false; button.textContent = "Обновить ленту ↻"; }
    });
  });
}

document.addEventListener("DOMContentLoaded",init);


const $ = id => document.getElementById(id);

const heroes = [
["Fanny","Лес","Убийца"],["Vexana","Мид","Маг"],["Claude","Голд","Стрелок"],
["Belerick","Роум","Танк"],["Khufra","Роум","Танк"],["Gusion","Лес","Убийца"],
["Ling","Лес","Убийца"],["Miya","Голд","Стрелок"],["Layla","Голд","Стрелок"],
["Tigreal","Роум","Танк"],["Saber","Лес","Убийца"],["Lancelot","Лес","Убийца"],
["Hayabusa","Лес","Убийца"],["Alucard","Лес","Боец"],["Balmond","Лес","Боец"],
["Chou","EXP","Боец"],["Terizla","EXP","Боец"],["Yu Zhong","EXP","Боец"],
["Dyrroth","EXP","Боец"],["Ruby","EXP","Боец"],["X.Borg","EXP","Боец"],
["Paquito","EXP","Боец"],["Alpha","Лес","Боец"],["Fredrinn","Лес","Танк"],
["Aamon","Лес","Убийца"],["Julian","Лес","Боец"],["Lunox","Мид","Маг"],
["Kagura","Мид","Маг"],["Lylia","Мид","Маг"],["Cecilion","Мид","Маг"],
["Luo Yi","Мид","Маг"],["Xavier","Мид","Маг"],["Pharsa","Мид","Маг"],
["Aurora","Мид","Маг"],["Odette","Мид","Маг"],["Eudora","Мид","Маг"],
["Nana","Мид","Маг"],["Cyclops","Мид","Маг"],["Harith","Мид","Маг"],
["Bruno","Голд","Стрелок"],["Brody","Голд","Стрелок"],["Beatrix","Голд","Стрелок"],
["Melissa","Голд","Стрелок"],["Ixia","Голд","Стрелок"],["Moskov","Голд","Стрелок"],
["Karrie","Голд","Стрелок"],["Wanwan","Голд","Стрелок"],["Hanabi","Голд","Стрелок"],
["Popol and Kupa","Голд","Стрелок"],["Lolita","Роум","Танк"],["Atlas","Роум","Танк"],
["Minotaur","Роум","Танк"],["Angela","Роум","Поддержка"],["Estes","Роум","Поддержка"],
["Floryn","Роум","Поддержка"],["Diggie","Роум","Поддержка"],["Mathilda","Роум","Поддержка"],
["Johnson","Роум","Танк"],["Akai","Роум","Танк"],["Franco","Роум","Танк"],
["Hylos","Роум","Танк"],["Grock","Роум","Танк"],["Min
sitthar","EXP","Боец"]
].map((h,i)=>({name:h[0],lane:h[1],role:h[2],id:i+1}));

const heroTips = {
Fanny:"Следи за энергией и маршрутами тросов. Входи в бой после траты вражеского контроля.",
Vexana:"Держись за передней линией и используй контроль в командных боях.",
Claude:"Фарми безопасно и ищи момент, когда соперники потратили контроль.",
Belerick:"Прикрывай союзников и принимай на себя атаки противников.",
Khufra:"Сохраняй контроль против мобильных героев."
};

const items = [
{name:"Blade of Despair",ru:"Клинок отчаяния",cat:"Attack",stats:"Физическая атака · Скорость передвижения",desc:"Усиливает физический урон. Пассивный эффект помогает добивать ослабленных противников.",tip:"Покупай для усиления физического урона, когда нужна высокая атакующая мощь."},
{name:"Berserker's Fury",ru:"Ярость берсерка",cat:"Attack",stats:"Физическая атака · Критический урон",desc:"Усиливает критические удары.",tip:"Полезен героям, чья сборка зависит от критических атак."},
{name:"Demon Hunter Sword",ru:"Меч охотника на демонов",cat:"Attack",stats:"Физическая атака · Скорость атаки",desc:"Помогает наносить дополнительный урон противникам с большим запасом здоровья.",tip:"Рассматривай против выносливых героев."},
{name:"Malefic Roar",ru:"Рёв злобы",cat:"Attack",stats:"Физическое пробивание",desc:"Помогает пробивать физическую защиту противников.",tip:"Полезен против героев, собирающих броню."},
{name:"Blade of the Heptaseas",ru:"Клинок гептасисов",cat:"Attack",stats:"Физическая атака · Здоровье · Пробивание",desc:"Подходит для физического урона и внезапных атак.",tip:"Рассматривай для героев, атакующих из засады."},
{name:"Corrosion Scythe",ru:"Коса коррозии",cat:"Attack",stats:"Скорость атаки · Скорость передвижения",desc:"Помогает чаще атаковать и замедлять врагов.",tip:"Полезна героям, которым важно преследовать цели."},
{name:"Endless Battle",ru:"Бесконечная битва",cat:"Attack",stats:"Физические характеристики · Восстановление",desc:"Сочетает несколько полезных характеристик и усиление атаки после навыка.",tip:"Подходит некоторым бойцам и героям с частым применением навыков."},
{name:"Haas's Claws",ru:"Когти Хааса",cat:"Attack",stats:"Физическая атака · Критические характеристики",desc:"Атакующий предмет для некоторых сборок стрелков.",tip:"Проверяй совместимость с текущей сборкой и версией игры."},
{name:"Holy Crystal",ru:"Священный кристалл",cat:"Magic",stats:"Магическая сила",desc:"Сильно увеличивает магическую мощь героя.",tip:"Полезен магам, которым нужен высокий магический урон."},
{name:"Divine Glaive",ru:"Божественный меч",cat:"Magic",stats:"Магическое пробивание",desc:"Помогает магическому урону проходить через магическую защиту.",tip:"Рассматривай против врагов с магической защитой."},
{name:"Genius Wand",ru:"Жезл гения",cat:"Magic",stats:"Магическая сила · Пробивание",desc:"Помогает ослаблять магическую защиту противника.",tip:"Подходит героям, которые часто наносят магический урон."},
{name:"Glowing Wand",ru:"Светящийся жезл",cat:"Magic",stats:"Магическая сила · Дополнительные эффекты",desc:"Помогает наносить дополнительный магический урон.",tip:"Рассматривай против выносливых целей, если эффект подходит твоему герою."},
{name:"Feather of Heaven",ru:"Перо небес",cat:"Magic",stats:"Магическая сила · Скорость атаки",desc:"Сочетает магическую силу и скорость обычных атак.",tip:"Подходит некоторым героям, совмещающим магию и обычные атаки."},
{name:"Blood Wings",ru:"Кровавые крылья",cat:"Magic",stats:"Магическая сила · Защитный эффект",desc:"Усиливает магическую мощь и может добавить выживаемость.",tip:"Рассматривай для поздней стадии матча."},
{name:"Athena's Shield",ru:"Щит Афины",cat:"Defense",stats:"Здоровье · Магическая защита",desc:"Помогает переживать сильный магический урон.",tip:"Рассматривай против опасных магов и взрывного магического урона."},
{name:"Radiant Armor",ru:"Сияющая броня",cat:"Defense",stats:"Здоровье · Магическая защита",desc:"Помогает против повторяющегося магического урона.",tip:"Выбирай с учётом типа магического урона соперника."},
{name:"Antique Cuirass",ru:"Старинная кираса",cat:"Defense",stats:"Здоровье · Физическая защита",desc:"Защитный предмет против некоторых героев физического урона.",tip:"Полезен против соперников, часто наносящих урон навыками."},
{name:"Dominance Ice",ru:"Ледяное господство",cat:"Defense",stats:"Защита · Противодействие скорости атаки",desc:"Помогает противодействовать некоторым эффектам скорости атаки и восстановления здоровья.",tip:"Рассматривай против героев, зависящих от атак и лечения."},
{name:"Immortality",ru:"Бессмертие",cat:"Defense",stats:"Здоровье · Физическая защита",desc:"Пассивный эффект позволяет вернуться в бой после поражения с перезарядкой.",tip:"Часто рассматривают для повышения выживаемости в поздней игре."},
{name:"Oracle",ru:"Оракул",cat:"Defense",stats:"Защита · Усиление восстановления",desc:"Улучшает выживаемость и некоторые эффекты восстановления.",tip:"Полезность зависит от героя и вражеского состава."},
{name:"Warrior Boots",ru:"Ботинки воина",cat:"Movement",stats:"Передвижение · Физическая защита",desc:"Дают мобильность и помогают против физических атак.",tip:"Рассматривай против физического урона."},
{name:"Tough Boots",ru:"Прочные ботинки",cat:"Movement",stats:"Передвижение · Магическая защита",desc:"Помогают против магического урона и некоторых эффектов контроля.",tip:"Рассматривай против магов и команд с контролем."},
{name:"Magic Shoes",ru:"Магические ботинки",cat:"Movement",stats:"Передвижение · Перезарядка навыков",desc:"Помогают чаще использовать навыки.",tip:"Подходят героям, которым важна перезарядка."},
{name:"Swift Boots",ru:"Ботинки стремительности",cat:"Movement",stats:"Передвижение · Скорость атаки",desc:"Повышают скорость передвижения и атаки.",tip:"Полезны некоторым стрелкам."},
{name:"Ice Retribution",ru:"Ледяное возмездие",cat:"Jungle",stats:"Заклинание лесника",desc:"Вариант возмездия для героев лесной роли.",tip:"Выбор зависит от героя и плана на матч."},
{name:"Conceal",ru:"Маскировка",cat:"Roam",stats:"Эффект командного перемещения",desc:"Роум-эффект для организации внезапного сближения команды.",tip:"Согласуй использование с союзниками."}
];

const categoryNames={Attack:"Физический урон",Magic:"Магия",Defense:"Защита",Movement:"Передвижение",Jungle:"Лес",Roam:"Роум"};
let activeRole="Все",heroQuery="",itemCategory="Все",itemQuery="";

function escapeHTML(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

function renderHeroes(){
 const grid=$("heroGrid");
 if(!grid)return;
 const filtered=heroes.filter(h=>(activeRole==="Все"||h.lane===activeRole)&&h.name.toLowerCase().includes(heroQuery));
 $("heroCount").textContent=`Героев в локальном списке: ${filtered.length}. Это не полный актуальный каталог игры.`;
 grid.innerHTML=filtered.map(h=>`
 <article class="hero-card">
 <div class="hero-image-wrap">
 <div class="hero-image-fallback">${escapeHTML(h.name[0])}</div>
 <span class="hero-id">HERO ${String(h.id).padStart(3,"0")}</span>
 </div>
 <div class="hero-card-content"><h3>${escapeHTML(h.name)}</h3>
 <p class="hero-role">${escapeHTML(h.role)} · ${escapeHTML(h.lane)}</p>
 <details><summary>Игровой совет ↗</summary><p>${escapeHTML(heroTips[h.name]||"Следи за мини-картой, выбирай момент для боя и адаптируй сборку под соперников.")}</p></details>
 </div></article>`).join("")||"<p>Герои не найдены.</p>";
}

function renderItems(){
 const grid=$("itemGrid");
 if(!grid)return;
 const filtered=items.filter(i=>(itemCategory==="Все"||i.cat===itemCategory)&&(i.name+" "+i.ru+" "+i.desc).toLowerCase().includes(itemQuery));
 $("itemCount").textContent=`Предметов в базе: ${filtered.length}`;
 grid.innerHTML=filtered.map(i=>`
 <article class="item-card">
 <div class="item-image-wrap"><div class="hero-image-fallback">${escapeHTML(i.ru[0])}</div></div>
 <div class="item-content">
 <span class="item-category">${escapeHTML(categoryNames[i.cat])}</span>
 <h3>${escapeHTML(i.ru)}</h3><p><small>${escapeHTML(i.name)}</small></p>
 <p class="item-stats">${escapeHTML(i.stats)}</p>
 <p class="item-description">${escapeHTML(i.desc)}</p>
 <details><summary>Когда покупать?</summary><p class="item-tip">${escapeHTML(i.tip)}</p><p class="item-tip">Проверь точные характеристики и эффекты в актуальной версии игры.</p></details>
 </div></article>`).join("")||"<p>Предметы не найдены.</p>";
}

function renderBuilds(){
 const grid=$("buildGrid");if(!grid)return;
 const builds=[
 ["Фанни","Лес · Убийца","Урон · Пробивание · Ситуативная защита","Следи за энергией и выбирай момент для входа."],
 ["Вексана","Мид · Маг","Магическая сила · Пробивание · Перезарядка","Держи дистанцию и помогай контролем."],
 ["Клод","Голд · Стрелок","Скорость атаки · Урон · Защита по ситуации","Фарми безопасно и выбирай момент для ультимейта."],
 ["Белерик","Роум · Танк","Защита · Устойчивость · Предметы против врага","Прикрывай союзников и принимай атаки."]
 ];
 grid.innerHTML=builds.map(b=>`<article class="panel"><span class="eyebrow">BUILD LAB</span><h3>${escapeHTML(b[0])}</h3><p>${escapeHTML(b[1])}</p><p>${escapeHTML(b[2])}</p><p>${escapeHTML(b[3])}</p></article>`).join("");
}

function setup(){
 $("year").textContent=new Date().getFullYear();
 $("heroSearch").addEventListener("input",e=>{heroQuery=e.target.value.toLowerCase().trim();renderHeroes();});
 $("roleFilters").addEventListener("click",e=>{
 const b=e.target.closest("[data-role]");if(!b)return;
 activeRole=b.dataset.role;
 $("roleFilters").querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));renderHeroes();
 });
 $("itemSearch").addEventListener("input",e=>{itemQuery=e.target.value.toLowerCase().trim();renderItems();});
 $("itemFilters").addEventListener("click",e=>{
 const b=e.target.closest("[data-category]");if(!b)return;
 itemCategory=b.dataset.category;
 $("itemFilters").querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));renderItems();
 });
 const select=$("enemySelect");
 select.innerHTML+=[...new Set(heroes.map(h=>h.name))].sort().map(n=>`<option value="${escapeHTML(n)}">${escapeHTML(n)}</option>`).join("");
 $("counterBtn").addEventListener("click",()=>{
 const enemy=select.value;
 if(!enemy){$("counterResult").textContent="Сначала выбери героя соперника.";return;}
 const tips={
 Fanny:"Рассмотри Хуфру, Минситтара или Каю: контроль мобильности может помочь остановить Фанни.",
 Claude:"Рассмотри героев с надёжным контролем и способностью прерывать его вход в бой.",
 Ling:"Контроль и своевременная помощь союзников могут затруднить Лингу передвижение.",
 Layla:"Ищи героев, которые могут безопасно сократить дистанцию и ограничить её позиционирование."
 };
 $("counterResult").textContent=tips[enemy]||"Рассмотри надёжный контроль, подходящий тип урона и героев, способных ограничить сильные стороны "+enemy+". Контрпик зависит от состава команд.";
 });
 $("menuToggle").addEventListener("click",()=>$("nav").classList.toggle("open"));
 $("nav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));
 renderHeroes();renderItems();renderBuilds();
}

document.addEventListener("DOMContentLoaded",setup);

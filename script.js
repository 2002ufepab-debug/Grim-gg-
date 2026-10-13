const heroes = [
 {name:'Фанни',role:'Лес',difficulty:'Сложная',mark:'F',tip:'Следи за энергией и маршрутами тросов. Входи в бой, когда контроль соперника уже потрачен.',counters:['Хуфра','Минситтар','Кая']},
 {name:'Вексана',role:'Мид',difficulty:'Средняя',mark:'V',tip:'Используй дальность навыков и контроль для помощи боковым линиям. Не трать все умения без обзора карты.',counters:['Кагура','Лунокс','Харли']},
 {name:'Белерик',role:'Роум',difficulty:'Лёгкая',mark:'B',tip:'Принимай урон, когда команда рядом, и защищай союзников с небольшим запасом здоровья.',counters:['Валир','Кимми','Карри']},
 {name:'Теризла',role:'EXP',difficulty:'Средняя',mark:'T',tip:'Сильнее в затяжных разменах. Следи за позиционированием и используй контроль, чтобы начать командный бой.',counters:['Джулиан','Даш','Валир']},
 {name:'Кэрри',role:'Голд',difficulty:'Средняя',mark:'K',tip:'Фокусируйся на безопасном фарме и выбирай позицию так, чтобы наносить урон передней линии без риска.',counters:['Лолита','Наталья','Харли']},
 {name:'Хуфра',role:'Роум',difficulty:'Средняя',mark:'H',tip:'Ищи моменты, когда мобильные герои соперника готовы входить в бой, и перекрывай им удобный путь.',counters:['Валир','Эсмеральда','Дигги']},
 {name:'Ланселот',role:'Лес',difficulty:'Сложная',mark:'L',tip:'Сохраняй рывки для выхода, не только для входа. Следи за контролем и не начинай бой без информации.',counters:['Хуфра','Минситтар','Кая']},
 {name:'Лунокс',role:'Мид',difficulty:'Сложная',mark:'L',tip:'Переключай формы под ситуацию и выбирай момент для урона. Не стой на месте во время командной драки.',counters:['Кагура','Харли','Селена']}
];
const builds = [
 {hero:'Фанни',role:'ЛЕС · УРОН',tags:['Охотничий удар','Урон от атаки','Пробивание','Скорость передвижения'],desc:'Играй от темпа и преимущества по золоту.',note:'Подстраивай защитный слот под главную угрозу врага.'},
 {hero:'Вексана',role:'МИД · МАГИЯ',tags:['Магическая сила','Сокращение перезарядки','Пробивание магии','Выживаемость'],desc:'Контроль и магический урон в командных боях.',note:'Порядок покупки предметов зависит от темпа матча.'},
 {hero:'Белерик',role:'РОУМ · ЗАЩИТА',tags:['Защита от физ. урона','Защита от магии','Устойчивость','Командная аура'],desc:'Защищай союзников и мешай соперникам добраться до задней линии.',note:'Не копируй один набор защиты в каждый матч.'}
];
const guides = {
 team:{title:'Как собрать сбалансированную команду',body:'Перед матчем проверь, есть ли у команды:',items:['Надёжный герой на передней линии или защитник.','Контроль, который помогает начинать бой или останавливать врыв.','Стабильный источник физического и магического урона.','Герой, который может наносить урон по целям и башням.','Синергия навыков и понятное распределение ролей.']},
 items:{title:'Когда покупать защитные предметы',body:'Не жди конца матча, если один соперник уже сильно опережает по золоту.',items:['Против сильного физического урона рассмотри физическую защиту.','Против магического взрыва — магическую защиту и выживаемость.','Против лечения и восстановления проверь, какие антихил-предметы доступны в текущем патче.','Сверяйся с актуальными характеристиками предметов в игре.']},
 map:{title:'Карта важнее лишнего убийства',body:'Хорошее решение часто начинается с информации, а не с драки.',items:['Проверяй мини-карту перед тем, как заходить в реку или лес соперника.','После успешного боя забирай цель или башню, если это безопасно.','Не уходи далеко от команды без понимания, где соперники.','Следи за волнами миньонов: они создают давление даже без прямого боя.']}
};
const $ = (s)=>document.querySelector(s);
const heroGrid=$('#heroGrid'), enemySelect=$('#enemySelect'), result=$('#counterResult'), toast=$('#toast');
function renderHeroes(role='Все'){
 const list=role==='Все'?heroes:heroes.filter(h=>h.role===role);
 heroGrid.innerHTML=list.map(h=>`<article class="hero-card" data-mark="${h.mark}"><span class="hero-role">${h.role.toUpperCase()} / ${h.difficulty.toUpperCase()}</span><h3>${h.name}</h3><p>${h.tip}</p><div class="card-bottom"><span>GRIM DATABASE</span><button data-hero="${h.name}">Совет ↗</button></div></article>`).join('');
}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2600)}
function pickCounter(){const name=enemySelect.value;if(!name){showToast('Сначала выбери героя соперника.');return}const enemy=heroes.find(h=>h.name===name);const picks=enemy.counters.map(n=>heroes.find(h=>h.name===n)).filter(Boolean);const suggestions=picks.length?picks:[heroes.find(h=>h.role==='Роум'),heroes.find(h=>h.role==='Мид')].filter(Boolean);result.innerHTML=`<div class="result-icon">↗</div><div><strong>Против ${enemy.name} рассмотри:</strong><p>${suggestions.map(h=>`<b>${h.name}</b> — ${h.role}; `).join('')}</p><p>${enemy.tip}</p><p class="fine-print">Это ориентир, а не гарантия победы. Учитывай весь состав, патч и собственный опыт.</p></div>`}
heroes.forEach(h=>{const option=document.createElement('option');option.value=h.name;option.textContent=h.name;enemySelect.appendChild(option)});
renderHeroes();
$('#counterBtn').addEventListener('click',pickCounter);
enemySelect.addEventListener('change',()=>{if(enemySelect.value)pickCounter()});
$('#roleFilters').addEventListener('click',e=>{const b=e.target.closest('[data-role]');if(!b)return;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderHeroes(b.dataset.role)});
heroGrid.addEventListener('click',e=>{const b=e.target.closest('[data-hero]');if(!b)return;enemySelect.value=b.dataset.hero;document.querySelector('#counterpicks').scrollIntoView({behavior:'smooth'});pickCounter()});
$('#buildGrid').innerHTML=builds.map(b=>`<article class="build-card"><div class="build-top"><h3>${b.hero}</h3><span class="pill">${b.role}</span></div><p>${b.desc}</p><div class="item-list">${b.tags.map(t=>`<span class="item-chip">${t}</span>`).join('')}</div><p class="build-note">${b.note}</p></article>`).join('');
$('#guides').addEventListener('click',e=>{const b=e.target.closest('[data-guide]');if(!b)return;const g=guides[b.dataset.guide];const box=$('#guideDetail');box.hidden=false;box.innerHTML=`<h3>${g.title}</h3><p>${g.body}</p><ul>${g.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;box.scrollIntoView({behavior:'smooth',block:'nearest'})});
const menuToggle=$('#menuToggle'),nav=$('#nav');menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'✕':'☰'});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰'}});
$('#year').textContent=new Date().getFullYear();

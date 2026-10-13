
const heroes = [
  {name:'Фанни',role:'Лес',difficulty:'Сложная',mark:'F',image:'https://mobile-legends.fandom.com/wiki/Special:FilePath/Fanny.jpg',tip:'Следи за энергией и маршрутами тросов. Входи в бой, когда контроль соперника уже потрачен.',counters:['Хуфра','Минситтар','Кая']},
  {name:'Вексана',role:'Мид',difficulty:'Средняя',mark:'V',image:'https://mobile-legends.fandom.com/wiki/Special:FilePath/Vexana.jpg',tip:'Используй дальность навыков и контроль для помощи боковым линиям. Не трать все умения без обзора карты.',counters:['Кагура','Лунокс','Харли']},
  {name:'Белерик',role:'Роум',difficulty:'Лёгкая',mark:'B',image:'https://mobile-legends.fandom.com/wiki/Special:FilePath/Belerick.jpg',tip:'Принимай урон, когда команда рядом, и защищай союзников.',counters:['Валир','Кимми','Карри']},
  {name:'Теризла',role:'EXP',difficulty:'Средняя',mark:'T',image:'https://mobile-legends.fandom.com/wiki/Special:FilePath/Terizla.jpg',tip:'Используй контроль, чтобы начинать командные бои.',counters:['Джулиан','Даш','Валир']},
  {name:'Кэрри',role:'Голд',difficulty:'Средняя',mark:'K',image:'https://mobile-legends.fandom.com/wiki/Special:FilePath/Karrie.jpg',tip:'Фарми безопасно и выбирай хорошую позицию в бою.',counters:['Лолита','Наталья','Харли']},
  {name:'Хуфра',role:'Роум',difficulty:'Средняя',mark:'H',image:'https://mobile-legends.fandom.com/wiki/Special:FilePath/Khufra.jpg',tip:'Останавливай мобильных героев соперника в подходящий момент.',counters:['Валир','Эсмеральда','Дигги']},
  {name:'Ланселот',role:'Лес',difficulty:'Сложная',mark:'L',image:'https://mobile-legends.fandom.com/wiki/Special:FilePath/Lancelot.jpg',tip:'Сохраняй рывки для выхода из боя и следи за контролем соперника.',counters:['Хуфра','Минситтар','Кая']},
  {name:'Лунокс',role:'Мид',difficulty:'Сложная',mark:'L',image:'https://mobile-legends.fandom.com/wiki/Special:FilePath/Lunox.jpg',tip:'Переключай формы под ситуацию и выбирай момент для нанесения урона.',counters:['Кагура','Харли','Селена']}
];

const builds = [
  {hero:'Фанни',role:'ЛЕС · УРОН',tags:['Охотничий удар','Урон от атаки','Пробивание','Скорость передвижения'],desc:'Играй от темпа и преимущества по золоту.',note:'Подстраивай защитный слот под угрозу врага.'},
  {hero:'Вексана',role:'МИД · МАГИЯ',tags:['Магическая сила','Сокращение перезарядки','Пробивание магии','Выживаемость'],desc:'Контроль и магический урон в командных боях.',note:'Покупай предметы с учётом ситуации.'},
  {hero:'Белерик',role:'РОУМ · ЗАЩИТА',tags:['Физическая защита','Магическая защита','Устойчивость','Командная аура'],desc:'Защищай союзников и мешай соперникам добраться до задней линии.',note:'Меняй защиту в зависимости от состава врага.'}
];

const guides = {
  team:{title:'Как собрать сбалансированную команду',body:'Перед матчем проверь, есть ли у команды:',items:['Надёжный герой на передней линии.','Контроль для начала боя или остановки врыва.','Физический и магический урон.','Герой для давления на башни.','Синергия навыков и распределение ролей.']},
  items:{title:'Когда покупать защитные предметы',body:'Подбирай предметы под главную угрозу:',items:['Против физического урона рассмотри физическую защиту.','Против магического взрыва — магическую защиту.','При сильном лечении соперника рассмотри антихил.','Проверяй характеристики предметов в текущем патче.']},
  map:{title:'Карта важнее лишнего убийства',body:'Хорошее решение начинается с информации:',items:['Проверяй мини-карту перед входом во вражеский лес.','После успешного боя забирай цель или башню.','Не уходи далеко от команды без информации.','Следи за волнами миньонов.']}
};

const $ = selector => document.querySelector(selector);
const heroGrid = $('#heroGrid');
const enemySelect = $('#enemySelect');
const result = $('#counterResult');
const toast = $('#toast');

function renderHeroes(role = 'Все') {
  if (!heroGrid) return;

  const list = role === 'Все'
    ? heroes
    : heroes.filter(hero => hero.role === role);

  heroGrid.innerHTML = list.map(hero => `
    <article class="hero-card" data-mark="${hero.mark}">
      <div class="hero-art">
        <img
          src="${hero.image}"
          alt="${hero.name}"
          loading="lazy"
          onerror="this.style.display='none';this.parentElement.classList.add('image-missing')"
        >
        <span class="hero-art-mark">${hero.mark}</span>
      </div>
      <div class="hero-info">
        <span class="hero-role">${hero.role.toUpperCase()} / ${hero.difficulty.toUpperCase()}</span>
        <h3>${hero.name}</h3>
        <p>${hero.tip}</p>
        <div class="card-bottom">
          <span>GRIM DATABASE</span>
          <button type="button" data-hero="${hero.name}">Совет ↗</button>
        </div>
      </div>
    </article>
  `).join('');
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function pickCounter() {
  if (!enemySelect || !result) return;

  const name = enemySelect.value;
  if (!name) {
    showToast('Сначала выбери героя соперника.');
    return;
  }

  const enemy = heroes.find(hero => hero.name === name);
  if (!enemy) return;

  const picks = enemy.counters
    .map(name => heroes.find(hero => hero.name === name))
    .filter(Boolean);

  const suggestions = picks.length
    ? picks
    : heroes.filter(hero => hero.role === 'Роум' || hero.role === 'Мид').slice(0, 2);

  result.innerHTML = `
    <div class="result-icon">↗</div>
    <div>
      <strong>Против ${enemy.name} рассмотри:</strong>
      <p>${suggestions.map(hero => `<b>${hero.name}</b> — ${hero.role}`).join('; ')}</p>
      <p>${enemy.tip}</p>
      <p class="fine-print">Учитывай состав команды, патч и собственный опыт.</p>
    </div>
  `;
}

function initSite() {
  if (enemySelect) {
    enemySelect.innerHTML = '<option value="">Выбери героя соперника</option>';
    heroes.forEach(hero => {
      const option = document.createElement('option');
      option.value = hero.name;
      option.textContent = hero.name;
      enemySelect.appendChild(option);
    });
    enemySelect.addEventListener('change', pickCounter);
  }

  renderHeroes();

  const counterBtn = $('#counterBtn');
  if (counterBtn) counterBtn.addEventListener('click', pickCounter);

  const filters = $('#roleFilters');
  if (filters) {
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-role]');
      if (!button) return;

      document.querySelectorAll('.filter').forEach(item => {
        item.classList.toggle('active', item === button);
      });

      renderHeroes(button.dataset.role);
    });
  }

  if (heroGrid) {
    heroGrid.addEventListener('click', event => {
      const button = event.target.closest('[data-hero]');
      if (!button || !enemySelect) return;

      enemySelect.value = button.dataset.hero;
      $('#counterpicks')?.scrollIntoView({behavior:'smooth'});
      pickCounter();
    });
  }

  const buildGrid = $('#buildGrid');
  if (buildGrid) {
    buildGrid.innerHTML = builds.map(build => `
      <article class="build-card">
        <div class="build-top">
          <h3>${build.hero}</h3>
          <span class="pill">${build.role}</span>
        </div>
        <p>${build.desc}</p>
        <div class="item-list">
          ${build.tags.map(tag => `<span class="item-chip">${tag}</span>`).join('')}
        </div>
        <p class="build-note">${build.note}</p>
      </article>
    `).join('');
  }

  const guideArea = $('#guides');
  if (guideArea) {
    guideArea.addEventListener('click', event => {
      const button = event.target.closest('[data-guide]');
      if (!button) return;

      const guide = guides[button.dataset.guide];
      const box = $('#guideDetail');
      if (!guide || !box) return;

      box.hidden = false;
      box.innerHTML = `
        <h3>${guide.title}</h3>
        <p>${guide.body}</p>
        <ul>${guide.items.map(item => `<li>${item}</li>`).join('')}</ul>
      `;
      box.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
  }

  const menuToggle = $('#menuToggle');
  const nav = $('#nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.textContent = open ? '✕' : '☰';
    });

    nav.addEventListener('click', event => {
      if (event.target.closest('a')) {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}

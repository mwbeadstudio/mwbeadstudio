const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('open');
    });
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const collectionFilter = document.querySelector('[data-collection-filter]');
if (collectionFilter) {
  const cards = [...document.querySelectorAll('#product-grid .product-card')];
  const count = document.querySelector('[data-filter-count]');
  let initialized = false;

  const filterCollection = () => {
    const category = collectionFilter.value;
    let visible = 0;
    cards.forEach((card) => {
      const matches = category === 'all' || card.dataset.category === category;
      card.hidden = !matches;
      if (matches) {
        visible += 1;
        if (initialized) card.classList.add('visible');
      }
    });
    count.textContent = `${visible} ${visible === 1 ? 'piece' : 'pieces'}`;
    initialized = true;
  };

  collectionFilter.addEventListener('change', filterCollection);
  filterCollection();
}

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const controls = carousel.querySelector('.carousel-controls');
  const pauseButton = carousel.querySelector('[data-pause]');
  const count = carousel.querySelector('[data-carousel-count]');
  const status = carousel.querySelector('[data-carousel-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reducedMotion.matches;
  let hovered = false;
  let timer;

  const schedule = () => {
    window.clearInterval(timer);
    if (!paused && !hovered && !document.hidden && !carousel.contains(document.activeElement)) {
      timer = window.setInterval(() => show(current + 1), 5000);
    }
  };
  const show = (index, announce = false) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    count.textContent = `${current + 1} / ${slides.length}`;
    if (announce) status.textContent = slides[current].getAttribute('aria-label');
  };
  const updatePause = () => {
    pauseButton.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
    schedule();
  };
  controls.hidden = false;
  carousel.querySelector('[data-previous]').addEventListener('click', () => { show(current - 1, true); schedule(); });
  carousel.querySelector('[data-next]').addEventListener('click', () => { show(current + 1, true); schedule(); });
  pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => window.setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updatePause(); });
  updatePause();
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

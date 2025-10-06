
export function setupAutoScroll() {
  const classSelector = window.innerWidth >= 1000 ? '.scroll-cnt.s-data-cnt' : '.scroll-cnt.s-data-grid';
  autoScroll(classSelector);
}

function autoScroll(scrollContainerClass) {
  const scrollContainers = document.querySelectorAll(scrollContainerClass);
  const intervals = new Map();

  const settings = [
    { speed: 0.020 }, //1
    { speed: 0.011 }, //4
    { speed: 0.028 }, //5
    { speed: 0.009 }, //6
    { speed: 0.008 }, //2
    { speed: 0.016 }, //3
  ];

  scrollContainers.forEach((container, index) => {
    const { speed } = settings[index];
    initializeScrolling(container, index, speed, intervals);

container.addEventListener('mouseenter', () => {
  pausedContainers.set(container, true);
  const handler = () => {
    if (pausedContainers.get(container)) {
      scrollOffsets.set(container, container.scrollTop);
    }
  };
  container.addEventListener('scroll', handler, { passive: true });
  scrollSyncHandlers.set(container, handler);
});

container.addEventListener('mouseleave', () => {
  scrollOffsets.set(container, container.scrollTop);
  lastTimestamps.set(container, performance.now());
  pausedContainers.set(container, false);
  const handler = scrollSyncHandlers.get(container);
  if (handler) {
    container.removeEventListener('scroll', handler);
    scrollSyncHandlers.delete(container);
  }
});



  });
}


function manageCloning(container, articlesContainer, index) {
  const existingClone = document.getElementById(`ch-b-${index}`);
  const isHidden = document.body.getAttribute('data-hidden') === 'true';

  if (window.innerWidth >= 1000 && !existingClone) {
    const clonedArticlesContainer = articlesContainer.cloneNode(true);
    clonedArticlesContainer.id = `ch-b-${index}`;
    clonedArticlesContainer.classList.add("s-data-clnd");
    if (isHidden) {
      clonedArticlesContainer.classList.add("hide");
    }
    container.appendChild(clonedArticlesContainer);
  } else if (window.innerWidth < 1000) {
    const allClones = document.querySelectorAll('.s-data-clnd');
    allClones.forEach(clone => {
      clone.remove();
    });
  }
}


const lastTimestamps = new Map();
const scrollOffsets = new Map();
const pausedContainers = new Map();
const scrollSyncHandlers = new Map();


function manageScroll(container, articlesContainer, index, _, lastTime, speed) {
  if (pausedContainers.get(container)) {
    const now = performance.now();
    lastTimestamps.set(container, now);
    requestAnimationFrame(() =>
      manageScroll(container, articlesContainer, index, 0, now, speed)
    );
    return;
  }

  const now = performance.now();
  const last = lastTimestamps.get(container) || now;
  const delta = now - last;

  const current = scrollOffsets.get(container) ?? container.scrollTop;
  const next = current + delta * speed;

  container.scrollTop = next;
  scrollOffsets.set(container, next);
  lastTimestamps.set(container, now);

  const clone = document.getElementById(`ch-b-${index}`);
  if (clone) {
    const end = clone.getBoundingClientRect().top - container.getBoundingClientRect().top;
    if (end <= 0) {
      container.scrollTop = articlesContainer.offsetTop;
      scrollOffsets.set(container, articlesContainer.offsetTop);
    }
  }

  requestAnimationFrame(() =>
    manageScroll(container, articlesContainer, index, 0, now, speed)
  );
}



function initializeScrolling(container, index, speed, intervals) {
  const scrollContainer = container.matches('.scroll-cnt.s-data-grid') ? container : container.firstElementChild;
  scrollContainer.id = container.matches('.scroll-cnt.s-data-grid') ? `ch-a-${index}-mb` : `ch-a-${index}`;

  manageCloning(container, scrollContainer, index);

  if (intervals.has(container)) {
    cancelAnimationFrame(intervals.get(container));
  }

  intervals.set(
    container,
    requestAnimationFrame(() =>
      manageScroll(container, scrollContainer, index, 0, performance.now(), speed)
    )
  );
}



// Helpers
function getBrowserSettings() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const step = isSafari ? 1 : 0.5;
  const minDelay = isSafari ? 60 : 30;
  const maxDelay = isSafari ? 100 : 180;
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  return { step, delay };
}


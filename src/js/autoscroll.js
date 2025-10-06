
export function setupAutoScroll() {
  const classSelector = window.innerWidth >= 1225 ? '.scroll-cnt.s-data-cnt' : '.scroll-cnt.s-data-grid';
  autoScroll(classSelector);
}

function autoScroll(scrollContainerClass) {
  const { step, delay } = getBrowserSettings();
  const scrollContainers = document.querySelectorAll(scrollContainerClass);
  const intervals = new Map();

  scrollContainers.forEach((container, index) => {
    initializeScrolling(container, index, step, delay, intervals);
  });
}


function manageCloning(container, articlesContainer, index) {
  const existingClone = document.getElementById(`ch-b-${index}`);
  const isHidden = document.body.getAttribute('data-hidden') === 'true';

  if (window.innerWidth >= 1225 && !existingClone) {
    const clonedArticlesContainer = articlesContainer.cloneNode(true);
    clonedArticlesContainer.id = `ch-b-${index}`;
    clonedArticlesContainer.classList.add("s-data-clnd");
    if (isHidden) {
      clonedArticlesContainer.classList.add("hide");
    }
    container.appendChild(clonedArticlesContainer);
  } else if (window.innerWidth < 1225) {
    const allClones = document.querySelectorAll('.s-data-clnd');
    allClones.forEach(clone => {
      clone.remove();
    });
  }
}

function manageScroll(container, isActiveRef, articlesContainer, index, delay, lastTime, step) {
  const now = performance.now();
  if (isActiveRef.isActive && now - lastTime >= delay) {
    container.scrollTop += step;
    const clonedArticlesContainer = document.getElementById(`ch-b-${index}`);
    if (clonedArticlesContainer) {
      const secondDivTop = clonedArticlesContainer.getBoundingClientRect().top - container.getBoundingClientRect().top;
      if (secondDivTop <= 0) {
        container.scrollTop = articlesContainer.offsetTop;
      }
    }
    lastTime = now;
  }
  requestAnimationFrame(() => manageScroll(container, isActiveRef, articlesContainer, index, delay, lastTime, step));
}

function initializeScrolling(container, index, step, delay, intervals) {
  const scrollContainer = container.matches('.scroll-cnt.s-data-grid') ? container : container.firstElementChild;
  scrollContainer.id = container.matches('.scroll-cnt.s-data-grid') ? `ch-a-${index}-mb` : `ch-a-${index}`;

  manageCloning(container, scrollContainer, index);

  let isActiveRef = { isActive: true };
  if (intervals.has(container)) {
    cancelAnimationFrame(intervals.get(container));
  }
  intervals.set(container, requestAnimationFrame(() => manageScroll(container, isActiveRef, scrollContainer, index, delay, performance.now(), step)));

  setupEventListeners(container, isActiveRef);
}

function setupEventListeners(container, isActiveRef) {
  container.addEventListener('mouseenter', () => { isActiveRef.isActive = false; });
  container.addEventListener('mouseleave', () => { isActiveRef.isActive = true; });
}


// Helpers


function getBrowserSettings() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const step = isSafari ? 1 : 0.5;
  const minDelay = isSafari ? 60 : 30;
  const maxDelay = isSafari ? 100 : 80;
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;
  return { step, delay };
}


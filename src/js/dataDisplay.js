import { dataSources } from "./dataSource";
let autoScrollTimeout;

export function init() {
  const scrollContainer = document.querySelector('.scroll-cnt');

  if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (event) => { }, true);
  } 

  // Fetch datas
  const fetchedData = dataSources.map(source => {
    return fetchData(source.url, source.elementId);
  });

  Promise.all(fetchedData).then(() => {

    setTimeout(() => {
      setVisibleData();
    }, 3000);

    setTimeout(() => {
       setupAutoScroll()
    }, 4000);
  });
}

function setupAutoScroll() {
  const classSelector = window.innerWidth >= 1225 ? '.scroll-cnt.s-data-cnt' : '.scroll-cnt.s-data-grid';
  autoScroll(classSelector);
}

window.addEventListener('resize', () => {
  clearTimeout(autoScrollTimeout);
  autoScrollTimeout = setTimeout(setupAutoScroll, 2000);
});

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

function fetchData(url, elementId) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayFormattedData(data, elementId);
    })
    .catch(error => {
      console.error(`Failed to load data from ${url}: ${error.message}`);
    });
}

function displayFormattedData(obj, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const formatted = formatJson(obj, 0);
  element.textContent = formatted;
}

function formatJson(obj, indentLevel) {
  const indent = ' '.repeat(indentLevel * 2);
  let result = '';

  function removeQuotes(value) {
    if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    return value;
  }

  for (const key in obj) {
    const value = obj[key];
    const formattedKey = key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result += `${indent}${formattedKey}: {\n${formatJson(value, indentLevel + 0.5)}${indent}}\n`;
    } else if (Array.isArray(value)) {
      const arrayContent = value.map(v => {
        if (typeof v === 'object' && v !== null) {
          const objectContent = formatJson(v, indentLevel + 1.7);
          return `${indent}  {\n${objectContent}${indent}  }`;
        } else {
          return `${indent}  ${removeQuotes(JSON.stringify(v))}`;
        }
      }).join(',\n');
      result += `${indent}${formattedKey}: [\n${arrayContent}\n${indent}]\n`;
    } else {
      result += `${indent}${formattedKey}: ${removeQuotes(JSON.stringify(value))}\n`;
    }
  }

  return result;
}

// auto scroll
function autoScroll(scrollContainerClass) {
  console.log(scrollContainerClass);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const intervals = new Map();
  const step = isSafari ? 1 : 0.5;
  const minDelay = isSafari ? 60 : 30;
  const maxDelay = isSafari ? 100 : 80;
  const scrollContainers = document.querySelectorAll(scrollContainerClass);

  const manageScroll = (container, isActiveRef, articlesContainer, index, delay, lastTime) => {
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
    if (intervals.has(container)) {
      requestAnimationFrame(() => manageScroll(container, isActiveRef, articlesContainer, index, delay, lastTime));
    }
  };

  scrollContainers.forEach((container, index) => {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    let articlesContainer;
    if(scrollContainerClass === '.scroll-cnt.s-data-grid') {
      articlesContainer = container;
      articlesContainer.id = `ch-a-${index}-mb`;
    }else {
      articlesContainer = container.firstElementChild;
      articlesContainer.id = `ch-a-${index}`;
    }
    manageCloning(container, articlesContainer, index);

    let isActiveRef = { isActive: true }; 

    if (intervals.has(container)) {
      cancelAnimationFrame(intervals.get(container));
    }
    intervals.set(container, requestAnimationFrame(() => manageScroll(container, isActiveRef, articlesContainer, index, delay, performance.now())));

    container.addEventListener('mouseenter', () => { isActiveRef.isActive = false; });
    container.addEventListener('mouseleave', () => { isActiveRef.isActive = true; });
  });
}

function setVisibleData() {
  const element = document.querySelector('.s-data-grid');
  if (element) {
    element.style.opacity = '1';
  }

  setTimeout(() => {
    const menuAndPanels = document.querySelector('.c-menu');
    if (menuAndPanels) {
      menuAndPanels.style.opacity = '1';
    }
  }, 1000);
}
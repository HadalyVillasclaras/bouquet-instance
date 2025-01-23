import { dataSources, dataSources1, dataSources2, dataSources3, dataSources4, dataSources5, dataSources6, } from "./dataSource";
import { setVisibleData } from "./elementsDisplay";
import { setupAutoScroll } from "./autoscroll";
let autoScrollTimeout;


export function init() {
  const scrollContainer = document.querySelector('.scroll-cnt');

  if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (event) => { }, true);
    scrollContainer.addEventListener('scroll', (event) => { }, true);

  }

  if (window.innerWidth < 1080) {
    let currentDataIndex = 1;
    const dataSourceArray = [dataSources1, dataSources2, dataSources3, dataSources4, dataSources5, dataSources6];
    const dataContainerSelectors = ['.s-data-cnt--intro', '.s-data-cnt--rot', '.s-data-cnt--zoom', '.s-data-cnt--time', '.s-data-cnt--gltf', '.s-data-cnt--gpu'];

    function loadData() {
      if (currentDataIndex > dataSourceArray.length) {
        return;
      }
      const currentDataSources = dataSourceArray[currentDataIndex - 1];
      const fetchedData = currentDataSources.map(source => {
        return fetchData(source.url, source.elementId);
      });

      Promise.all(fetchedData).then(() => {
        currentDataIndex++;
       
      });
    }

    loadData();
    scrollContainer.addEventListener('scroll', () => {
      if (currentDataIndex > dataSourceArray.length) {
        return;
      }

      const isDataShown = document.body.getAttribute('data-hidden') !== 'true';
      if (!isDataShown) {
        return;  
      }

      const nextDataContainer = document.querySelector(dataContainerSelectors[currentDataIndex - 1]);
      const { scrollTop, clientHeight } = scrollContainer;
      const { offsetTop } = nextDataContainer;

      if (scrollTop + clientHeight >= offsetTop - 200) {
        loadData();
      }
    });
    setVisibleData();
    setupAutoScroll();
  } else {
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


// Autoscroll
window.addEventListener('resize', () => {
  const element = document.querySelector('.s-data-grid');
  if (element) {
    element.style.opacity = '0';
  }
  clearTimeout(autoScrollTimeout);
  autoScrollTimeout = setTimeout(() => {
    init();
  }, 1000);
});
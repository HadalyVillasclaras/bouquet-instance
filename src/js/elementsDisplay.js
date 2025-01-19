document.addEventListener('DOMContentLoaded', init);
const dataButton = document.getElementById('btn-toggle-data');
const ctrlButton = document.getElementById('btn-toggle-ctrl');
const infoButton = document.getElementById('btn-toggle-info');

const panelInfo = document.getElementById('panel-info');
const panelControls = document.getElementById('panel-controls');


function init() {

  if (dataButton) {
    dataButton.addEventListener('click', toggleData);

  }

  if (ctrlButton) {
    ctrlButton.addEventListener('click', function (event) {
      togglePanel(panelControls, panelInfo);
      toggleButtonSelected(ctrlButton, infoButton);
      event.stopPropagation();
    });
  }

  if (infoButton) {
    infoButton.addEventListener('click', function (event) {
      togglePanel(panelInfo, panelControls);
      toggleButtonSelected(infoButton, ctrlButton);
      event.stopPropagation();
    });
  }
}


function toggleButtonSelected(activeButton, otherButton) {
  if (activeButton) {
    activeButton.classList.toggle('selected');
  }

  if (otherButton && otherButton.classList.contains('selected')) {
    otherButton.classList.remove('selected');
  }
}

function togglePanel(currentPanel, otherPanel) {
  if (currentPanel && otherPanel) {
    if (currentPanel.classList.contains('hide')) {
      currentPanel.classList.remove('hide');
      otherPanel.classList.add('hide');
    } else {
      currentPanel.classList.add('hide');
    }
  }


}

function toggleData() {
  const body = document.body;
  const elements = document.querySelectorAll('.data-tgl, .s-data-clnd');
  let isHidden = false;

  elements.forEach(element => {
    if (element.classList.contains('hide')) {
      element.classList.remove('hide');
    } else {
      element.classList.add('hide');
      isHidden = true;
    }
  });

  body.setAttribute('data-hidden', isHidden);

  dataButton.classList.toggle('selected');
}



export function setVisibleData() {
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

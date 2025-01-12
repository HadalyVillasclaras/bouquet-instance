document.addEventListener('DOMContentLoaded', init);
const dataButton = document.getElementById('btn-toggle-data');
const ctrlButton = document.getElementById('btn-toggle-ctrl');
const infoButton = document.getElementById('btn-toggle-info');

const panelInfo = document.getElementById('panel-info');
const panelControls = document.getElementById('panel-controls');


function init() {
  // document.addEventListener('click', closeIfClickOutside);

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

  if (isHidden) {
    dataButton.textContent = 'Reveal Data';
  } else {
    dataButton.textContent = 'Hide Data';
  }
}

function closeIfClickOutside(event) {
  if (!panelInfo.contains(event.target) && !panelControls.contains(event.target) &&
    !dataButton.contains(event.target) && !ctrlButton.contains(event.target) && !infoButton.contains(event.target)) {
    if (!panelInfo.classList.contains('hide')) {
      panelInfo.classList.add('hide');
    }
    if (!panelControls.classList.contains('hide')) {
      panelControls.classList.add('hide');
    }
  }
}
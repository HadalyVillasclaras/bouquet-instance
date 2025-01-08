document.addEventListener('DOMContentLoaded', init);

function init() {

  // Toggle data button
  const dataButton = document.getElementById('btn-toggle-data');
  if (dataButton) {
    dataButton.addEventListener('click', toggleData);
  }

  const ctrlButton = document.getElementById('btn-toggle-ctrl');
  if (ctrlButton) {
    ctrlButton.addEventListener('click', function() {
      togglePanel('panel-controls', 'panel-info');
    });
  }

  const infoButton = document.getElementById('btn-toggle-info');
  if (infoButton) {
    infoButton.addEventListener('click', function() {
      togglePanel('panel-info', 'panel-controls');
    });
  }
}


function togglePanel(currentPanelId, otherPanelId) {
  const currentPanel = document.getElementById(currentPanelId);
  const otherPanel = document.getElementById(otherPanelId);

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
  const button = document.getElementById('btn-toggle-data');
  const elements = document.querySelectorAll('.data-tgl');
  const clonedContainers = document.querySelectorAll('.s-data-clnd');
  let isHidden = true;

  elements.forEach(element => {
    if (element.classList.contains('hide')) {
      element.classList.remove('hide');
    } else {
      element.classList.add('hide');
      isHidden = false;
    }
  });

  clonedContainers.forEach(container => {
    if (container.classList.contains('hide')) {
      container.classList.remove('hide');
    } else {
      container.classList.add('hide');
      isHidden = false;
    }
  });

  if (!isHidden) {
    button.textContent = 'Reveal Data';
  } else {
    button.textContent = 'Hide Data';
  }
}

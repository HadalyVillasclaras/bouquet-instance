document.addEventListener('DOMContentLoaded', init);

function init() {
  const dataButton = document.getElementById('btn-toggle-data');
  const ctrlButton = document.getElementById('btn-toggle-ctrl');
  const infoButton = document.getElementById('btn-toggle-info');

  if (dataButton) {
    dataButton.addEventListener('click', toggleData);
  }

  if (ctrlButton) {
    ctrlButton.addEventListener('click', function() {
      togglePanel('panel-controls', 'panel-info');
      toggleButtonSelectedState('btn-toggle-ctrl', 'btn-toggle-info');

    });
  }

  if (infoButton) {
    infoButton.addEventListener('click', function() {
      togglePanel('panel-info', 'panel-controls');
      toggleButtonSelectedState('btn-toggle-info', 'btn-toggle-ctrl');
    });
  }
}

function selectButton(buttonId) {
  const button = document.getElementById(buttonId);
  button.classList.add('selected');
}

function unselectButton(buttonId) {
  const button = document.getElementById(buttonId);
  button.classList.remove('selected');
}

function toggleButtonSelectedState(activeButtonId, otherButtonId) {
  const activeButton = document.getElementById(activeButtonId);
  const otherButton = document.getElementById(otherButtonId);

  if (activeButton) {
    activeButton.classList.toggle('selected');
  }

  if (otherButton && otherButton.classList.contains('selected')) {
    otherButton.classList.remove('selected');
  }
}

function togglePanel(currentPanelId, otherPanelId) {
  const currentPanel = document.getElementById(currentPanelId);
  const otherPanel = document.getElementById(otherPanelId);

  if (currentPanel && otherPanel) {
    if (currentPanel.classList.contains('hide')) {
      showPanel(currentPanelId);
      hidePanel(otherPanelId);
    } else {
      hidePanel(currentPanelId);
    }
  }
}

function hidePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (panel && !panel.classList.contains('hide')) {
    panel.classList.add('hide');
  }
}

function showPanel(panelId) {
  const panel = document.getElementById(panelId);
  if (panel && panel.classList.contains('hide')) {
    panel.classList.remove('hide');
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
    disableButton('btn-toggle-ctrl', true);
    togglePanel('panel-controls', 'panel-info');
    selectButton('btn-toggle-ctrl');
    unselectButton('btn-toggle-info');
  } else {
    button.textContent = 'Hide Data';
    disableButton('btn-toggle-ctrl', false);
    hidePanel('panel-controls');
    unselectButton('btn-toggle-ctrl');
  }
}

function disableButton(buttonId, disabled) {
  const button = document.getElementById(buttonId);
  if (button) {
    if (!disabled) {
      button.disabled = true;
      button.classList.add('disabled');
    } else {
      button.disabled = false;
      button.classList.remove('disabled');
    }
  }
}
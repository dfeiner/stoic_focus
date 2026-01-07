// DOM Elements
const domainInput = document.getElementById('domainInput');
const addDomainBtn = document.getElementById('addDomainBtn');
const domainList = document.getElementById('domainList');
const errorMessage = document.getElementById('errorMessage');
const timerValue = document.getElementById('timerValue');
const timerUnit = document.getElementById('timerUnit');
const startBlockingBtn = document.getElementById('startBlockingBtn');
const timerStatus = document.getElementById('timerStatus');
const presetName = document.getElementById('presetName');
const savePresetBtn = document.getElementById('savePresetBtn');
const presetSelect = document.getElementById('presetSelect');
const loadPresetBtn = document.getElementById('loadPresetBtn');
const deletePresetBtn = document.getElementById('deletePresetBtn');

// State
let blockedDomains = [];
let presets = {};
let timerEndTime = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const timerData = await loadData();
  renderDomainList();
  renderPresets();
  updateTimerStatus();
  updateStartButton();

  // Restore timer input values from storage, or use defaults (60 minutes)
  if (timerData.lastTimerValue) {
    timerValue.value = timerData.lastTimerValue;
  }
  if (timerData.lastTimerUnit) {
    timerUnit.value = timerData.lastTimerUnit;
  }

  // Update timer status every second
  setInterval(updateTimerStatus, 1000);
});

// Load data from storage
async function loadData() {
  const data = await chrome.storage.local.get(['blockedDomains', 'timerEndTime', 'presets', 'lastTimerValue', 'lastTimerUnit']);
  blockedDomains = data.blockedDomains || [];
  timerEndTime = data.timerEndTime || null;
  presets = data.presets || {};
  return {
    lastTimerValue: data.lastTimerValue,
    lastTimerUnit: data.lastTimerUnit
  };
}

// Save data to storage
async function saveData() {
  await chrome.storage.local.set({
    blockedDomains,
    timerEndTime,
    presets
  });
}

// Save timer input values to storage
async function saveTimerInputs(value, unit) {
  await chrome.storage.local.set({
    lastTimerValue: value,
    lastTimerUnit: unit
  });
}

// Validate and normalize domain
function normalizeDomain(input) {
  let domain = input.trim().toLowerCase();

  // Remove protocol
  domain = domain.replace(/^https?:\/\//, '');

  // Remove www.
  domain = domain.replace(/^www\./, '');

  // Remove path and query
  domain = domain.split('/')[0].split('?')[0];

  // Basic validation
  if (!domain || domain.length === 0) {
    return null;
  }

  // Check for valid domain format
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return null;
  }

  return domain;
}

// Add domain
addDomainBtn.addEventListener('click', async () => {
  const domain = normalizeDomain(domainInput.value);

  if (!domain) {
    showError('Please enter a valid domain (e.g., reddit.com)');
    return;
  }

  if (blockedDomains.includes(domain)) {
    showError('Domain already in list');
    return;
  }

  blockedDomains.push(domain);
  await saveData();
  domainInput.value = '';
  errorMessage.textContent = '';
  renderDomainList();
  updateStartButton();
});

// Allow adding domain with Enter key
domainInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addDomainBtn.click();
  }
});

// Remove domain
async function removeDomain(domain) {
  blockedDomains = blockedDomains.filter(d => d !== domain);
  await saveData();
  renderDomainList();
  updateStartButton();
}

// Render domain list
function renderDomainList() {
  if (blockedDomains.length === 0) {
    domainList.innerHTML = '<div class="empty-state">No domains blocked yet</div>';
    return;
  }

  domainList.innerHTML = blockedDomains.map(domain => `
    <li class="domain-item">
      <span class="domain-name">${domain}</span>
      <button data-domain="${domain}">Remove</button>
    </li>
  `).join('');

  // Add event listeners to remove buttons
  domainList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      removeDomain(btn.dataset.domain);
    });
  });
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  setTimeout(() => {
    errorMessage.textContent = '';
  }, 3000);
}

// Update start button state
function updateStartButton() {
  startBlockingBtn.disabled = blockedDomains.length === 0;
}

// Start blocking
startBlockingBtn.addEventListener('click', async () => {
  const value = parseInt(timerValue.value);
  const unit = timerUnit.value;

  if (!value || value <= 0) {
    showError('Please enter a valid time greater than 0');
    return;
  }

  // Convert to minutes
  let minutes = value;
  if (unit === 'hours') {
    minutes = value * 60;
  }

  // Validate range (1 minute to 12 hours = 720 minutes)
  if (minutes < 1 || minutes > 720) {
    showError('Timer must be between 1 minute and 12 hours');
    return;
  }

  // Save timer input values to storage
  await saveTimerInputs(value, unit);

  // Calculate end time
  timerEndTime = Date.now() + (minutes * 60 * 1000);
  await saveData();

  updateTimerStatus();

  // Close popup after starting
  window.close();
});

// Update timer status display
function updateTimerStatus() {
  if (!timerEndTime || Date.now() >= timerEndTime) {
    timerStatus.classList.remove('active');
    if (timerEndTime && Date.now() >= timerEndTime) {
      // Timer expired, clear it
      timerEndTime = null;
      saveData();
    }
    return;
  }

  const remaining = timerEndTime - Date.now();
  const timeString = formatTime(remaining);

  timerStatus.textContent = `Blocking active: ${timeString} remaining`;
  timerStatus.classList.add('active');
}

// Format time remaining
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Save preset
savePresetBtn.addEventListener('click', async () => {
  const name = presetName.value.trim();

  if (!name) {
    showError('Please enter a preset name');
    return;
  }

  if (blockedDomains.length === 0) {
    showError('Add some domains first');
    return;
  }

  presets[name] = [...blockedDomains];
  await saveData();
  presetName.value = '';
  renderPresets();
  showError(''); // Clear any errors
});

// Load preset
loadPresetBtn.addEventListener('click', async () => {
  const selectedPreset = presetSelect.value;

  if (!selectedPreset) {
    showError('Please select a preset');
    return;
  }

  if (presets[selectedPreset]) {
    blockedDomains = [...presets[selectedPreset]];
    await saveData();
    renderDomainList();
    updateStartButton();
    showError(''); // Clear any errors
  }
});

// Delete preset
deletePresetBtn.addEventListener('click', async () => {
  const selectedPreset = presetSelect.value;

  if (!selectedPreset) {
    showError('Please select a preset to delete');
    return;
  }

  delete presets[selectedPreset];
  await saveData();
  renderPresets();
  showError(''); // Clear any errors
});

// Render presets dropdown
function renderPresets() {
  const presetNames = Object.keys(presets);

  if (presetNames.length === 0) {
    presetSelect.innerHTML = '<option value="">-- No presets saved --</option>';
    return;
  }

  presetSelect.innerHTML = '<option value="">-- Select Preset --</option>' +
    presetNames.map(name => `<option value="${name}">${name}</option>`).join('');
}

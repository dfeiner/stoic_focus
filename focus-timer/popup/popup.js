// DOM Elements
const domainInput = document.getElementById('domainInput');
const addDomainBtn = document.getElementById('addDomainBtn');
const domainList = document.getElementById('domainList');
const errorMessage = document.getElementById('errorMessage');
const timerValue = document.getElementById('timerValue');
const timerUnit = document.getElementById('timerUnit');
const startBlockingBtn = document.getElementById('startBlockingBtn');
const timerStatus = document.getElementById('timerStatus');
const timerErrorMessage = document.getElementById('timerErrorMessage');
const resetBtn = document.getElementById('resetBtn');
const presetName = document.getElementById('presetName');
const savePresetBtn = document.getElementById('savePresetBtn');
const presetSelect = document.getElementById('presetSelect');
const loadPresetBtn = document.getElementById('loadPresetBtn');
const deletePresetBtn = document.getElementById('deletePresetBtn');
const featuredQuote = document.getElementById('featuredQuote');

// Motivational quotes (duplicated from content.js since popup and content scripts run in separate contexts)
const QUOTES = [
  "The key is not to prioritize what's on your schedule, but to schedule your priorities. - Stephen Covey",
  "You can do anything, but not everything. - David Allen",
  "Focus is a matter of deciding what things you're not going to do. - John Carmack",
  "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus. - Alexander Graham Bell",
  "It's not always that we need to do more but rather that we need to focus on less. - Nathan W. Morris",
  "The successful warrior is the average man, with laser-like focus. - Bruce Lee",
  "Where focus goes, energy flows. - Tony Robbins",
  "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days. - Zig Ziglar",
  "To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction. - Cal Newport",
  "Your ability to concentrate single-mindedly on one thing, the most important thing, and stay at it until it is complete, is essential to success. - Brian Tracy",
  "The difference between successful people and really successful people is that really successful people say no to almost everything. - Warren Buffett",
  "Starve your distractions, feed your focus. - Unknown",
  "It is not enough to be busy. The question is: what are we busy about? - Henry David Thoreau",
  "Action expresses priorities. - Mahatma Gandhi",
  "The ability to concentrate and to use your time well is everything if you want to succeed in business—or almost anywhere else for that matter. - Lee Iacocca",
  "You have power over your mind—not outside events. Realize this, and you will find strength. - Marcus Aurelius",
  "The impediment to action advances action. What stands in the way becomes the way. - Marcus Aurelius",
  "Waste no more time arguing about what a good man should be. Be one. - Marcus Aurelius",
  "If it is not right, do not do it; if it is not true, do not say it. - Marcus Aurelius",
  "The best revenge is not being like your enemy. - Marcus Aurelius",
  "It is not that we have a short time to live, but that we waste a lot of it. - Seneca",
  "We suffer more often in imagination than in reality. - Seneca",
  "If a man knows not to which port he sails, no wind is favorable. - Seneca",
  "He who is brave is free. - Seneca",
  "Difficulties strengthen the mind, as labor does the body. - Seneca",
  "First say to yourself what you would be; and then do what you have to do. - Epictetus",
  "We cannot choose our external circumstances, but we can always choose how we respond to them. - Epictetus",
  "No man is free who is not master of himself. - Epictetus",
  "Don't explain your philosophy. Embody it. - Epictetus",
  "The more we value things outside our control, the less control we have. - Epictetus",
  "Focus on what you can control, and let go of what you cannot. - Epictetus",
  "The secret of getting ahead is getting started. - Mark Twain",
  "Do the hard jobs first. The easy jobs will take care of themselves. - Dale Carnegie",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work. - Stephen King",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. - Zig Ziglar",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Discipline is choosing between what you want now and what you want most. - Abraham Lincoln",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Concentration is the root of all the higher abilities in man. - Bruce Lee",
  "The successful person has the habit of doing the things failures don't like to do. - E. M. Gray",
  "The price of anything is the amount of life you exchange for it. - Henry David Thoreau",
  "Our life is what our thoughts make it. - Marcus Aurelius",
  "Very little is needed to make a happy life; it is all within yourself, in your way of thinking. - Marcus Aurelius",
  "How much trouble he avoids who does not look to see what his neighbor says or does. - Marcus Aurelius",
  "The happiness of your life depends upon the quality of your thoughts. - Marcus Aurelius",
  "You become what you give your attention to. - Epictetus",
  "It's not what happens to you, but how you react to it that matters. - Epictetus",
  "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control. - Epictetus"
];

// State
let blockedDomains = [];
let presets = {};
let timerEndTime = null;
let selectedPresetName = null;
let baselineState = null;

// Get random quote
function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// Display featured quote
function displayFeaturedQuote() {
  if (featuredQuote) {
    featuredQuote.textContent = getRandomQuote();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  displayFeaturedQuote();
  const timerData = await loadData();
  renderDomainList();
  renderPresets();
  updateTimerStatus();
  updateStartButton();
  updateSaveButtonState();
  updateAddButtonState();

  // Restore timer input values from storage, or use defaults (60 minutes)
  if (timerData.lastTimerValue) {
    timerValue.value = timerData.lastTimerValue;
  }
  if (timerData.lastTimerUnit) {
    timerUnit.value = timerData.lastTimerUnit;
  }
  
  // Validate timer after loading values
  validateTimer();

  // Wire up change listeners
  timerValue.addEventListener('input', () => {
    updateSaveButtonState();
    updateStartButton();
  });
  timerUnit.addEventListener('change', () => {
    updateSaveButtonState();
    updateStartButton();
  });
  presetName.addEventListener('input', updateAddButtonState);
  presetSelect.addEventListener('change', handlePresetSelect);

  // Update timer status every second
  setInterval(updateTimerStatus, 1000);
});

// Load data from storage
async function loadData() {
  const data = await chrome.storage.local.get(['blockedDomains', 'timerEndTime', 'presets', 'lastTimerValue', 'lastTimerUnit']);
  blockedDomains = data.blockedDomains || [];
  timerEndTime = data.timerEndTime || null;
  presets = data.presets || {};
  
  // Migrate old preset format (arrays) to new format (objects)
  for (const [name, preset] of Object.entries(presets)) {
    if (Array.isArray(preset)) {
      // Old format: array of domains
      // Convert to new format with timer settings from defaults
      presets[name] = {
        domains: [...preset],
        timerValue: data.lastTimerValue || 60,
        timerUnit: data.lastTimerUnit || 'minutes'
      };
    }
  }
  
  // If any presets were migrated, save them back
  if (Object.keys(presets).length > 0) {
    await saveData();
  }
  
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
  updateSaveButtonState();
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
  updateSaveButtonState();
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

// Validate timer and return true if valid (<= 24 hours)
function validateTimer() {
  const value = parseInt(timerValue.value);
  const unit = timerUnit.value;

  if (!value || value <= 0) {
    timerErrorMessage.textContent = '';
    return false;
  }

  // Convert to minutes
  let minutes = value;
  if (unit === 'hours') {
    minutes = value * 60;
  }

  // Check if timer exceeds 24 hours (1440 minutes)
  if (minutes > 1440) {
    timerErrorMessage.textContent = 'Please set the timer to 24 hours or less to continue';
    return false;
  } else {
    timerErrorMessage.textContent = '';
    return true;
  }
}

// Update start button state
function updateStartButton() {
  const hasDomains = blockedDomains.length > 0;
  const timerValid = validateTimer();
  startBlockingBtn.disabled = !hasDomains || !timerValid;
}

// Compare two arrays for equality
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

// Update Save button state based on whether changes have been made
function updateSaveButtonState() {
  if (!selectedPresetName || !baselineState) {
    loadPresetBtn.disabled = true;
    return;
  }

  const currentState = {
    domains: [...blockedDomains].sort(),
    timerValue: parseInt(timerValue.value) || 60,
    timerUnit: timerUnit.value || 'minutes'
  };

  const baseline = {
    domains: [...baselineState.domains].sort(),
    timerValue: baselineState.timerValue,
    timerUnit: baselineState.timerUnit
  };

  // Check if domains changed
  const domainsChanged = !arraysEqual(currentState.domains, baseline.domains);
  
  // Check if timer changed
  const timerChanged = currentState.timerValue !== baseline.timerValue || 
                       currentState.timerUnit !== baseline.timerUnit;

  // Enable Save button only if changes detected
  loadPresetBtn.disabled = !domainsChanged && !timerChanged;
}

// Update Add button state based on input field
function updateAddButtonState() {
  const name = presetName.value.trim();
  savePresetBtn.disabled = !name;
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

  // Validate range (1 minute to 24 hours = 1440 minutes)
  if (minutes < 1 || minutes > 1440) {
    showError('Timer must be between 1 minute and 24 hours');
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

// Reset button
resetBtn.addEventListener('click', async () => {
  // Clear blocked domains
  blockedDomains = [];
  
  // Reset timer to default (60 minutes)
  timerValue.value = 60;
  timerUnit.value = 'minutes';
  
  // Clear active timer
  timerEndTime = null;
  
  // Reset preset selection state
  selectedPresetName = null;
  baselineState = null;
  presetSelect.value = '';
  
  // Save data to storage
  await saveData();
  await saveTimerInputs(60, 'minutes');
  
  // Update UI
  renderDomainList();
  updateStartButton();
  updateTimerStatus();
  updateSaveButtonState();
  renderPresets();
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

// Save preset (Add button - creates new preset)
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

  presets[name] = {
    domains: [...blockedDomains],
    timerValue: parseInt(timerValue.value) || 60,
    timerUnit: timerUnit.value || 'minutes'
  };
  await saveData();
  presetName.value = '';
  updateAddButtonState();
  renderPresets();
  showError(''); // Clear any errors
});

// Handle preset selection change (auto-load preset)
async function handlePresetSelect() {
  const selectedPreset = presetSelect.value;

  if (!selectedPreset) {
    selectedPresetName = null;
    baselineState = null;
    updateSaveButtonState();
    return;
  }

  if (presets[selectedPreset]) {
    const preset = presets[selectedPreset];
    
    // Handle old format (array) for backwards compatibility
    if (Array.isArray(preset)) {
      blockedDomains = [...preset];
      // Don't change timer values if preset is old format
    } else {
      // New format (object with domains, timerValue, timerUnit)
      blockedDomains = [...preset.domains];
      timerValue.value = preset.timerValue || 60;
      timerUnit.value = preset.timerUnit || 'minutes';
      await saveTimerInputs(preset.timerValue || 60, preset.timerUnit || 'minutes');
    }
    
    await saveData();
    renderDomainList();
    updateStartButton();
    
    // Set selected preset and baseline state for change tracking
    selectedPresetName = selectedPreset;
    baselineState = {
      domains: [...blockedDomains],
      timerValue: parseInt(timerValue.value) || 60,
      timerUnit: timerUnit.value || 'minutes'
    };
    
    updateSaveButtonState();
    showError(''); // Clear any errors
  }
}

// Save preset (Save button - overwrites selected preset)
loadPresetBtn.addEventListener('click', async () => {
  const selectedPreset = presetSelect.value;

  if (!selectedPreset) {
    showError('Please select a preset to save');
    return;
  }

  if (!selectedPresetName || selectedPresetName !== selectedPreset) {
    showError('Please select the preset you want to save');
    return;
  }

  // Save current state over the selected preset
  presets[selectedPreset] = {
    domains: [...blockedDomains],
    timerValue: parseInt(timerValue.value) || 60,
    timerUnit: timerUnit.value || 'minutes'
  };
  
  await saveData();
  
  // Update baseline state to match current state (changes are now saved)
  baselineState = {
    domains: [...blockedDomains],
    timerValue: parseInt(timerValue.value) || 60,
    timerUnit: timerUnit.value || 'minutes'
  };
  
  updateSaveButtonState();
  renderPresets();
  showError(''); // Clear any errors
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
  
  // Reset selection state if we deleted the currently selected preset
  if (selectedPresetName === selectedPreset) {
    selectedPresetName = null;
    baselineState = null;
    presetSelect.value = '';
  }
  
  renderPresets();
  updateSaveButtonState();
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

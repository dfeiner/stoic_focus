// Motivational quotes
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
  "The ability to concentrate and to use your time well is everything if you want to succeed in business—or almost anywhere else for that matter. - Lee Iacocca"
];

let overlayElement = null;
let timerInterval = null;
let isOverrideMode = false;

// Check if current domain is blocked
function isCurrentDomainBlocked(blockedDomains) {
  const currentDomain = window.location.hostname.toLowerCase();

  // Remove www. prefix for comparison
  const cleanDomain = currentDomain.replace(/^www\./, '');

  return blockedDomains.some(blocked => {
    // Check if current domain matches or is a subdomain of blocked domain
    return cleanDomain === blocked || cleanDomain.endsWith('.' + blocked);
  });
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

// Get random quote
function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// Create overlay HTML
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'focus-timer-overlay';
  overlay.innerHTML = `
    <div class="focus-timer-content">
      <div class="focus-timer-time" id="focus-timer-time">--:--</div>
      <div class="focus-timer-message">You blocked this to do more important work</div>
      <div class="focus-timer-quote" id="focus-timer-quote">${getRandomQuote()}</div>
      <div class="focus-timer-override-section">
        <button class="focus-timer-override-btn" id="focus-timer-override-btn">Override</button>
        <div class="focus-timer-override-input-section" id="focus-timer-override-input" style="display: none;">
          <p class="focus-timer-override-prompt">Type 'This is not a distraction' to continue</p>
          <input
            type="text"
            id="focus-timer-override-text"
            class="focus-timer-override-text-input"
            placeholder="Type here..."
            autocomplete="off"
          >
          <button class="focus-timer-submit-btn" id="focus-timer-submit-btn">Submit</button>
          <div class="focus-timer-error" id="focus-timer-error"></div>
        </div>
      </div>
    </div>
  `;

  return overlay;
}

// Show overlay
function showOverlay() {
  if (overlayElement) return; // Already showing

  overlayElement = createOverlay();
  document.body.appendChild(overlayElement);

  // Prevent scrolling
  document.body.style.overflow = 'hidden';

  // Set up event listeners
  setupOverlayListeners();

  // Start timer update
  updateTimerDisplay();
  timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Hide overlay
function hideOverlay() {
  if (!overlayElement) return;

  clearInterval(timerInterval);
  overlayElement.remove();
  overlayElement = null;
  document.body.style.overflow = '';
  isOverrideMode = false;
}

// Update timer display
async function updateTimerDisplay() {
  const data = await chrome.storage.local.get(['timerEndTime']);
  const timerEndTime = data.timerEndTime;

  if (!timerEndTime || Date.now() >= timerEndTime) {
    hideOverlay();
    return;
  }

  const remaining = timerEndTime - Date.now();
  const timeElement = document.getElementById('focus-timer-time');
  if (timeElement) {
    timeElement.textContent = formatTime(remaining);
  }
}

// Setup overlay event listeners
function setupOverlayListeners() {
  const overrideBtn = document.getElementById('focus-timer-override-btn');
  const overrideInputSection = document.getElementById('focus-timer-override-input');
  const submitBtn = document.getElementById('focus-timer-submit-btn');
  const overrideText = document.getElementById('focus-timer-override-text');
  const errorDiv = document.getElementById('focus-timer-error');

  // Show override input
  overrideBtn.addEventListener('click', () => {
    isOverrideMode = true;
    overrideBtn.style.display = 'none';
    overrideInputSection.style.display = 'block';
    overrideText.focus();
  });

  // Submit override
  const handleSubmit = async () => {
    const text = overrideText.value.trim();
    const requiredText = 'this is not a distraction';

    if (text.toLowerCase() === requiredText) {
      // Clear timer and remove overlay
      await chrome.storage.local.set({ timerEndTime: null });
      hideOverlay();
    } else {
      errorDiv.textContent = 'Incorrect phrase. Try again.';
      overrideText.value = '';
      overrideText.focus();

      setTimeout(() => {
        errorDiv.textContent = '';
      }, 3000);
    }
  };

  submitBtn.addEventListener('click', handleSubmit);

  // Allow Enter key to submit
  overrideText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  });
}

// Check if should show overlay
async function checkAndShowOverlay() {
  const data = await chrome.storage.local.get(['blockedDomains', 'timerEndTime']);
  const blockedDomains = data.blockedDomains || [];
  const timerEndTime = data.timerEndTime;

  // Check if timer is active
  if (!timerEndTime || Date.now() >= timerEndTime) {
    hideOverlay();
    return;
  }

  // Check if current domain is blocked
  if (isCurrentDomainBlocked(blockedDomains)) {
    showOverlay();
  } else {
    hideOverlay();
  }
}

// Initialize
checkAndShowOverlay();

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    checkAndShowOverlay();
  }
});

// Periodically check (in case timer expires)
setInterval(checkAndShowOverlay, 1000);

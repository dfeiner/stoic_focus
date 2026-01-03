// Background service worker for Focus Timer

// Clear timer on browser startup (intentional fresh start)
chrome.runtime.onStartup.addListener(async () => {
  await chrome.storage.local.set({ timerEndTime: null });
  console.log('Focus Timer: Timer cleared on browser startup');
});

// Clear timer when extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ timerEndTime: null });
  console.log('Focus Timer: Timer cleared on extension install/update');
});

// Monitor timer and clear when expired
async function monitorTimer() {
  const data = await chrome.storage.local.get(['timerEndTime']);
  const timerEndTime = data.timerEndTime;

  if (timerEndTime && Date.now() >= timerEndTime) {
    // Timer expired, clear it
    await chrome.storage.local.set({ timerEndTime: null });
    console.log('Focus Timer: Timer expired and cleared');
  }
}

// Check timer every minute
setInterval(monitorTimer, 60000);

// Initial check
monitorTimer();

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getTimerStatus') {
    chrome.storage.local.get(['timerEndTime', 'blockedDomains'], (data) => {
      sendResponse({
        timerEndTime: data.timerEndTime,
        blockedDomains: data.blockedDomains || []
      });
    });
    return true; // Will respond asynchronously
  }

  if (message.type === 'clearTimer') {
    chrome.storage.local.set({ timerEndTime: null }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log('Focus Timer: Background service worker initialized');

# Chrome Extension: Focus Timer - Block Distracting Domains

## Overview
Build a Chrome extension that helps users maintain focus by temporarily blocking access to distracting websites. When a user visits a blocked domain, they see a semi-transparent overlay on the actual page with a timer and motivational content. Users can override blocks through a deliberate two-step process.

## Core Functionality

### 1. Domain Blocking
- Users can add/remove domains to a block list via popup interface
- Single timer applies to ALL domains in the list (not individual timers)
- Timer range: 1 minute to 12 hours (720 minutes)
- Timer counts in real-time and does NOT persist across browser restarts
- Setting a new block while one is active REPLACES the existing timer

### 2. Block Overlay Experience
When user visits a blocked domain:
- Inject a semi-transparent overlay on top of the actual page (don't redirect)
- Overlay displays:
  - Time remaining (formatted as "Xh Ym" or "Xm Ys")
  - Message: "You blocked this to do more important work"
  - A randomly selected motivational quote about focus/productivity
  - Override button

### 3. Override Flow
- User clicks "Override" button on overlay
- Input field appears prompting: "Type 'This is not a distraction' to continue"
- User must type exactly: "This is not a distraction" (case-insensitive is fine)
- On submit: Remove overlay entirely AND clear the timer for all domains (ends the blocking session)
- If text doesn't match, show error message and don't remove block

### 4. Preset Lists Feature
- Users can save their current domain list as a named preset (e.g., "Deep Work", "Writing Mode")
- Users can load a saved preset to quickly populate the domain list
- Users can delete saved presets
- Presets are stored locally

## Technical Requirements

### Extension Structure (Manifest V3)
- Use Chrome Extension Manifest V3
- Required permissions: `storage`, `activeTab`, `scripting`, `declarativeNetRequest` or appropriate APIs for content script injection
- Use `chrome.storage.local` for all data persistence

### Data Storage Schema
Store in `chrome.storage.local`:
```javascript
{
  blockedDomains: ["facebook.com", "twitter.com", ...],
  timerEndTime: <timestamp or null>,
  presets: {
    "preset-name": ["domain1.com", "domain2.com", ...],
    ...
  }
}
```

### Components Needed
1. **Popup UI** (`popup.html`, `popup.js`, `popup.css`)
   - Input field to add domains
   - List showing current blocked domains with delete buttons
   - Timer input (number input + dropdown for minutes/hours)
   - Start/Stop blocking button
   - Preset management section (save current list, load preset, delete preset)
   
2. **Content Script** (`content.js`, `overlay.css`)
   - Checks if current domain is blocked and timer is active
   - Injects overlay HTML with styling
   - Handles override interaction
   - Updates timer display every second
   
3. **Background/Service Worker** (`background.js`)
   - Monitors timer state
   - Clears timer when browser restarts (don't restore from storage)
   - Handles messages between popup and content scripts

## Design Specifications

### Typography
- Font: Manrope (include via Google Fonts or bundle)
- Overlay heading: 24px, semibold
- Timer: 48px, bold
- Body text: 16px, regular
- Quote: 18px, italic

### Color Palette (Earth Tones)
- Overlay background: rgba(warm brown/sage, 0.95) - semi-transparent but highly visible
- Text: Soft off-white or warm cream
- Accent/buttons: Terracotta or burnt orange
- Input fields: Light sage or warm beige backgrounds
- Error state: Muted red-orange

### Overlay Layout
- Full viewport coverage
- Centered content container (max-width: 600px)
- Stack vertically:
  1. Timer (large, prominent)
  2. "You blocked this to do more important work" message
  3. Motivational quote (styled differently, italic)
  4. Override button (bottom of container)
- Minimal, calm aesthetic - lots of breathing room

### Popup UI
- Clean, simple form layout
- Domain list shows each domain with small X/delete button
- Preset section at bottom with dropdown/buttons
- "Start Blocking" button is primary CTA

## Motivational Quotes
Include 10-15 rotating quotes about focus, productivity, and time management. Examples:
- "The key is not to prioritize what's on your schedule, but to schedule your priorities." - Stephen Covey
- "You can do anything, but not everything." - David Allen
- "Focus is a matter of deciding what things you're not going to do." - John Carmack
- "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus." - Alexander Graham Bell
- "It's not always that we need to do more but rather that we need to focus on less." - Nathan W. Morris
- "The successful warrior is the average man, with laser-like focus." - Bruce Lee
- "Where focus goes, energy flows." - Tony Robbins
- "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days." - Zig Ziglar
- "To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction." - Cal Newport
- "Your ability to concentrate single-mindedly on one thing, the most important thing, and stay at it until it is complete, is essential to success." - Brian Tracy

## Behavior Details

### Timer Logic
- When user clicks "Start Blocking" in popup:
  - Calculate end time: `Date.now() + (minutes * 60 * 1000)`
  - Store `timerEndTime` in storage
  - Close popup
- Every second, content script checks: `if (Date.now() < timerEndTime)` → show overlay
- When timer expires naturally, clear `timerEndTime` from storage
- On browser restart, don't restore timer (intentional fresh start)

### Domain Matching
- Match exact domains and all subdomains (e.g., "reddit.com" blocks "reddit.com" and "www.reddit.com" and "old.reddit.com")
- Strip protocol and path when user adds domains (just store domain)
- Validate domain format on input

### Edge Cases
- If user sets 0 or negative time, show error
- If domain list is empty, disable "Start Blocking" button
- If no timer is active, content script does nothing
- Override should work even if JavaScript is partially broken on page

## File Structure
```
focus-timer/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/
│   ├── content.js
│   └── overlay.css
├── background/
│   └── background.js
├── assets/
│   └── icons/ (16px, 48px, 128px)
└── README.md
```

## Development Notes
- Start with popup UI and storage logic
- Then implement content script overlay injection
- Test with common sites (reddit.com, twitter.com, etc.)
- Ensure overlay appears above all page content (high z-index)
- Make sure overlay is keyboard accessible (tab to override button, enter to submit)

## Success Criteria
- ✅ User can add domains and start timer from popup
- ✅ Visiting blocked domain shows overlay with correct time remaining
- ✅ Override flow requires exact phrase to unblock
- ✅ Timer clears on browser restart
- ✅ Presets can be saved and loaded
- ✅ Design matches earth tone, Manrope aesthetic
- ✅ All interactions are smooth and bug-free

---

Build this extension step by step, starting with the manifest and basic popup structure, then adding overlay injection, then preset functionality. Test thoroughly at each stage.

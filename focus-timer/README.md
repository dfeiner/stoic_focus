# Focus Timer - Chrome Extension

A Chrome extension that helps users maintain focus by temporarily blocking access to distracting websites with a motivational overlay.

## Features

- **Domain Blocking**: Add any website domain to your block list
- **Focus Timer**: Set a timer from 1 minute to 12 hours to block all domains
- **Motivational Overlay**: When visiting blocked sites, see an inspiring overlay instead of the content
- **Deliberate Override**: Two-step process to unblock sites if absolutely necessary
- **Preset Management**: Save and load domain lists for different focus modes (e.g., "Deep Work", "Writing Mode")
- **Beautiful Design**: Earth-tone color palette with Manrope font for a calm, focused experience

## Installation

### From Source

1. Clone or download this repository
2. Add extension icons (see Icons section below)
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked"
6. Select the `focus-timer` directory

## Usage

### Basic Workflow

1. **Add Domains**: Click the extension icon and add websites you want to block (e.g., `reddit.com`, `twitter.com`)
2. **Set Timer**: Choose a duration (minutes or hours) for your focus session
3. **Start Blocking**: Click "Start Blocking" to begin your focus session
4. **Stay Focused**: When you visit a blocked site, you'll see a motivational overlay with time remaining
5. **Override if Needed**: If you absolutely must access a blocked site, click "Override" and type the required phrase

### Preset Lists

Save your frequently used domain lists:

1. Add domains to your current list
2. Enter a name for your preset (e.g., "Work Focus")
3. Click "Save"
4. Load presets anytime from the dropdown menu

### Override Process

To unblock sites during an active session:

1. Click the "Override" button on the overlay
2. Type exactly: `This is not a distraction` (case-insensitive)
3. Click "Submit"
4. The overlay will be removed and the timer will be cleared for all domains

## Technical Details

### Architecture

- **Manifest V3**: Modern Chrome extension architecture
- **Components**:
  - Popup UI for configuration
  - Content script for overlay injection
  - Background service worker for timer management
  - Local storage for persistence

### Data Storage

All data is stored locally using `chrome.storage.local`:

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

### Timer Behavior

- Timer applies to ALL domains in your block list
- Setting a new timer replaces any existing timer
- Timer does NOT persist across browser restarts (intentional fresh start)
- Timer clears when it expires or when you override

### Domain Matching

- Blocks exact domains and all subdomains
- Example: Blocking `reddit.com` also blocks `www.reddit.com` and `old.reddit.com`
- Automatically normalizes domains (removes protocol, www, paths)

## Icons

The extension requires three icon sizes:

- `assets/icons/icon16.png` (16x16px)
- `assets/icons/icon48.png` (48x48px)
- `assets/icons/icon128.png` (128x128px)

You can create simple icons using any design tool, or use an icon generator. The icons should represent focus, time, or blocking (e.g., a timer, clock, or focus symbol).

### Quick Icon Creation

You can use online tools like:
- [Favicon.io](https://favicon.io/)
- [Canva](https://www.canva.com/)
- Or any image editor

For a simple approach, create a square image with:
- Background: `#c97449` (terracotta)
- Icon: Clock or timer symbol in `#f5f1eb` (off-white)

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
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
└── README.md
```

## Development

### Testing

1. Add test domains like `example.com`
2. Set a short timer (1-2 minutes)
3. Visit the blocked domain to see the overlay
4. Test the override flow
5. Test preset saving and loading

### Common Issues

**Overlay not appearing:**
- Check if the domain is correctly added (no protocols or paths)
- Verify the timer is active (check popup)
- Refresh the page after starting the timer

**Timer not clearing:**
- The timer intentionally clears on browser restart
- Override clears the timer immediately

**Domain not blocking:**
- Make sure to include the base domain (e.g., `reddit.com` not `www.reddit.com`)
- The extension automatically handles subdomains

## Privacy

All data is stored locally on your device. This extension:
- Does NOT collect any data
- Does NOT send data to external servers
- Does NOT track your browsing
- Only accesses pages to check if they should be blocked

## License

MIT License - Feel free to modify and distribute

## Credits

- Font: [Manrope](https://fonts.google.com/specimen/Manrope) by Mikhail Sharanda
- Motivational quotes from various productivity experts and thought leaders

## Support

For issues or feature requests, please open an issue on the repository.

---

**Stay focused. Do more important work.**

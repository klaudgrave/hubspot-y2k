# hubspot-y2k

A Winamp-style skin for HubSpot. Brushed metal, chrome buttons, screws in the corners and glowing lime LCD screens where your tables used to be. Basically the CRM as it would have looked on a 2001 desktop.

It's a single Tampermonkey userscript. Purely cosmetic: it only changes how HubSpot looks in your browser and doesn't touch any data.

The story behind it: [Winampify HubSpot](https://klaudgrave.com/notes/winampify-hubspot)

## Setup

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. In Chrome, let Tampermonkey run scripts: right-click its icon → **Manage Extension** → turn on **Allow User Scripts**. On older Chrome versions, turn on **Developer mode** at `chrome://extensions` instead.
3. Open the Tampermonkey dashboard, create a new script, replace everything with the contents of [`userscript/hubspot-y2k.user.js`](userscript/hubspot-y2k.user.js) and save.
4. Reload HubSpot.

Press **Alt+Shift+Y** (**⌥⇧Y** on Mac) to switch the skin on and off.

Press **Alt+Shift+T** (**⌥⇧T** on Mac) to switch between the lime and copper themes.

If nothing changes, open the DevTools console and run `!!window.__fun00s`. If it says `false`, Tampermonkey isn't running the script, so check step 2.

## What gets skinned

- Top bar and left navigation, on every page
- List views and board (pipeline) views
- Record pages (companies, deals, contacts and the like)
- Dropdown menus

Settings, editors and the rest of HubSpot only get the top bar and nav for now.

## Heads up

HubSpot changes its UI all the time, so parts of this will break now and then. The script loads two fonts from Google Fonts; nothing else leaves your browser.

Not affiliated with HubSpot or Winamp.

// ==UserScript==
// @name         HubSpot Y2K — Winamp-era skins for HubSpot
// @namespace    https://github.com/klaudgrave/hubspot-y2k
// @license      MIT
// @version      0.7.0
// @description  Skins for HubSpot: chrome with a lime LCD, brushed copper with an amber LCD, a rusty biomechanical look with green vials, a 16-bit pixel quest look, and a classic Winamp 2 look with a stormy dark-blue twin. Purely cosmetic, client-side only. Toggle with Alt+Shift+Y (⌥⇧Y on Mac); cycle looks with Alt+Shift+T (⌥⇧T on Mac).
// @match        https://app.hubspot.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';
  if (window.__fun00s) return;
  window.__fun00s = true;

  const ROOT = document.documentElement;
  const STORE_KEY = 'fun00s:on';
  const THEME_KEY = 'fun00s:theme';
  // A look is a skin (html.s-<skin>, structure) plus an optional theme (html.f-<theme>, colour tokens).
  const LOOKS = { lime: {}, copper: { theme: 'copper' }, biomech: { skin: 'biomech' }, pixel: { skin: 'pixel' }, classic: { skin: 'winamp' }, storm: { skin: 'winamp', theme: 'storm' } };
  const look = () => { try { const v = localStorage.getItem(THEME_KEY); return v in LOOKS ? v : 'lime'; } catch { return 'lime'; } };
  const isOn = () => { try { return localStorage.getItem(STORE_KEY) !== '0'; } catch { return true; } };

  /* ------------------------------------------------------------------
   * CSS
   * html.fun00s           → shell (top bar + side nav), every page
   * html.fun00s.f-index   → object index pages (/objects/.../views/...)
 * html.fun00s.f-record  → record pages (/record/...)
   * ------------------------------------------------------------------ */
  const CSS = String.raw`
html.fun00s{
  --f-rgb:141,255,46; --f-rgb2:70,160,10;
  --f-lime:#8dff2e; --f-lime-hot:#c6ff7a; --f-lime-mid:#a6ff63; --f-pale:#e6ffcf;
  --f-on-gel:#071a03; --f-gel-edge:#1d4a05; --f-gel-ring:#c9ffa0; --f-eq-mid:#e6ff4a;
  --f-tab-on:linear-gradient(#162b0a,#071203);
  --f-tab:linear-gradient(#f5f6f7,#b5babd);
  --f-bevel:#f5f7f8 #4e5357 #3b3f42 #d2d6d9; --f-ring:#a7acb0; --f-plate:#9aa0a4; --f-glow:rgba(var(--f-rgb),.55); --f-dim:rgba(var(--f-rgb),.16);
  --f-lcd:#030a03; --f-lcd2:#071407; --f-ink:#0d0f10;
  --f-mono:"Share Tech Mono","Lucida Console",Monaco,monospace;
  --f-head:"Orbitron","Share Tech Mono",monospace;
  --f-ui:Tahoma,Verdana,"Segoe UI",sans-serif;
  --f-brush:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.0015 0.75' numOctaves='3' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  --f-sheen:linear-gradient(100deg,#71767a 0%,#c3c7ca 18%,#8b9094 34%,#dfe2e4 52%,#7d8286 70%,#b9bdc0 86%,#6b7074 100%);
  --f-lcd-bg:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px),radial-gradient(ellipse at 30% 20%,rgba(var(--f-rgb),.08),transparent 60%),linear-gradient(var(--f-lcd2),var(--f-lcd));
  --f-chrome:linear-gradient(#fbfcfc 0%,#d5d9dc 42%,#9ca1a5 50%,#c3c7ca 78%,#eceff0 100%);
  --f-gel:linear-gradient(#efffd0 0%,#b4ff55 30%,#6fdc12 50%,#4cb800 62%,#8cf035 100%);
  --f-dark:linear-gradient(#4b5054 0%,#2b2f32 46%,#121415 54%,#24272a 100%);
  --f-inset-border:#1a1c1d #c6cacd #e8ebed #2b2e30;
  --f-dark-ring:inset 0 1px 0 rgba(255,255,255,.3),0 0 0 2px var(--f-ring),0 0 0 3px #1c1e20,0 2px 4px rgba(0,0,0,.5);
}
/* ============ theme: copper (html.f-copper) — only overrides tokens ============ */
html.fun00s.f-copper{
  --f-rgb:255,178,58; --f-rgb2:150,80,10;
  --f-lime:#ffb23a; --f-lime-hot:#ffd98a; --f-lime-mid:#ffc766; --f-pale:#ffe9c4;
  --f-lcd:#0a0502; --f-lcd2:#170b04; --f-ink:#150d08;
  --f-on-gel:#2a1000; --f-gel-edge:#5a2606; --f-gel-ring:#ffd9a8; --f-eq-mid:#ffd86a;
  --f-tab-on:linear-gradient(#2e1808,#120803);
  --f-tab:linear-gradient(#f3d9c2,#b98a68);
  --f-bevel:#f7e4d2 #5a3a28 #432a1c #dcb99c; --f-ring:#b8845f; --f-plate:#a9795a;
  --f-sheen:linear-gradient(100deg,#7a4a30 0%,#d79a6c 18%,#9a5f3c 34%,#efbd94 52%,#8a5334 70%,#c98a5e 86%,#704228 100%);
  --f-chrome:linear-gradient(#fde9d6 0%,#e0a77d 42%,#a8683f 50%,#cf9568 78%,#f4d3b6 100%);
  --f-gel:linear-gradient(#fff0cf 0%,#ffcf75 30%,#f0951a 50%,#c26a00 62%,#ffb84d 100%);
  --f-dark:linear-gradient(#5b3a28 0%,#35200f 46%,#170c05 54%,#2c1a0e 100%);
  --f-inset-border:#1d0f07 #d9ae8c #f1d3b9 #33200f;
}
html.fun00s.f-copper body{background:#0c0806 radial-gradient(ellipse at 50% 0%,#2a1a12,#070403 70%) !important}
html.fun00s.f-copper button[data-test-id=hs-global-toolbar-copilot-list-item] svg{filter:drop-shadow(0 0 4px rgba(255,178,58,.8)) !important}
/* amber is the LCD colour here, so the "no upcoming" warning goes red instead */
html.fun00s.f-copper.f-index [data-test-id=cdb-card] :has(> [class*=Tag__ContentWrapper] [data-test-id=activity-chip-upcoming-empty]){
  border-color:rgba(255,92,70,.75) !important;background:rgba(255,92,70,.08) !important;box-shadow:0 0 6px rgba(255,92,70,.35) !important}
html.fun00s.f-copper.f-index [data-test-id=cdb-card] [class*=Tag__ContentWrapper]:has([data-test-id=activity-chip-upcoming-empty]) *{color:#ff8a70 !important;text-shadow:0 0 5px rgba(255,92,70,.7) !important}
/* ============ skin: pixel (html.s-pixel) — flat 16-bit look; tokens + structure overrides ============ */
html.fun00s.s-pixel{
  --f-rgb:248,216,88; --f-rgb2:176,120,24;
  --f-lime:#f8d858; --f-lime-hot:#fff0a0; --f-lime-mid:#f0c840; --f-pale:#fff6d0;
  --f-lcd:#080818; --f-lcd2:#10103a; --f-ink:#0a0a28;
  --f-on-gel:#2a1000; --f-gel-edge:#000; --f-gel-ring:#fff0a0; --f-eq-mid:#58a8f8;
  --f-tab-on:#080818; --f-tab:linear-gradient(#e8d8a0 0 50%,#c8b070 50%);
  --f-bevel:#000 #000 #000 #000; --f-ring:#58b858; --f-plate:#3a8a3a;
  --f-glow:transparent; --f-dim:rgba(248,216,88,.22);
  --f-mono:"VT323","Lucida Console",monospace; --f-head:"Press Start 2P","VT323",monospace; --f-ui:"VT323",Tahoma,sans-serif;
  --f-brush:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' fill='%23fff' fill-opacity='0'/%3E%3Crect width='8' height='8' fill='%23fff' fill-opacity='.07'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23fff' fill-opacity='.07'/%3E%3C/svg%3E");
  --f-sheen:linear-gradient(#2c6a2c,#2c6a2c);
  --f-lcd-bg:linear-gradient(#10103a,#080818);
  --f-chrome:linear-gradient(#e8d8a0 0 50%,#c8b070 50%);
  --f-gel:linear-gradient(#f8e878 0 50%,#d8a020 50%);
  --f-dark:#1c4020;
  --f-inset-border:#58b858 #58b858 #58b858 #58b858;
  --f-dark-ring:0 0 0 2px #58b858,0 0 0 4px #000;
}
html.fun00s.s-pixel body{background:#0f2a14 !important}
html.fun00s.s-pixel :is(#hs-global-toolbar,#hs-vertical-nav),
html.fun00s.s-pixel.f-index main{background-size:16px 16px,100% 100% !important;background-blend-mode:normal !important}
/* flat pixels: no rounded corners, no blur, hard drop shadows instead of glows */
html.fun00s.s-pixel *,html.fun00s.s-pixel *::before,html.fun00s.s-pixel *::after{border-radius:0 !important}
html.fun00s.s-pixel *{text-shadow:none !important}
html.fun00s.s-pixel :is(button,[data-button-use=primary],[data-test-id=cdb-card],[data-test-id^=framework-data-column-]){
  border-color:#000 !important;box-shadow:0 0 0 2px #58b858,4px 4px 0 2px #000 !important}
html.fun00s.s-pixel :is(#hs-global-toolbar,#hs-vertical-nav){border-color:#000 !important;box-shadow:0 4px 0 #000 !important}
/* side nav: dark navy panel, gold pixel-font labels, hover/current items flip to a gold bar */
html.fun00s.s-pixel #hs-vertical-nav{color:var(--f-lime) !important;background:#080818 !important;background-image:none !important;border-right:4px solid #000 !important;box-shadow:inset -4px 0 0 #58b858 !important}
html.fun00s.s-pixel #hs-vertical-nav :is(a,button,span,div,p,li,svg){color:var(--f-lime) !important;font-family:var(--f-head) !important;font-size:10px !important;line-height:1.6 !important;letter-spacing:0}
html.fun00s.s-pixel #hs-vertical-nav :is(a,button):hover,
html.fun00s.s-pixel #hs-vertical-nav :is(a,button):hover *,
html.fun00s.s-pixel #hs-vertical-nav :is([aria-current],[aria-selected=true]),
html.fun00s.s-pixel #hs-vertical-nav :is([aria-current],[aria-selected=true]) *{background:var(--f-lime) !important;color:var(--f-on-gel) !important;text-shadow:none !important}
html.fun00s.s-pixel #hs-vertical-nav svg{fill:currentColor !important}
html.fun00s.s-pixel #hs-vertical-nav li.isHighlighted > :is(a,button),
html.fun00s.s-pixel #hs-vertical-nav li.isHighlighted > :is(a,button) *{color:var(--f-on-gel) !important}
html.fun00s.s-pixel [data-test-id=framework-data-table-container] *{font-size:18px !important}
html.fun00s.s-pixel [data-test-id=cdb-card] *{font-size:17px !important}
html.fun00s.s-pixel .fun00s-marquee,html.fun00s.s-pixel .fun00s-marquee *{font-size:20px !important}
/* rivets become square nails, the grille becomes a row of hearts, the equalizer becomes stepped blue meters */
html.fun00s.s-pixel .fun00s-screw{width:8px;height:8px;background:#e8d8a0 !important;box-shadow:2px 2px 0 #000 !important}
html.fun00s.s-pixel .fun00s-grille{
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='20' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 2h6v2h2v2h4V4h2V2h6v2h2v6h-2v2h-2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2H8v-2H6v-2H4v-2H2V4z'/%3E%3Cpath fill='%23e8302a' d='M4 4h4v2h2v2h4V6h2V4h4v4h-2v2h-2v2h-2v2h-2v2h-2v-2H10v-2H8v-2H6v-2H4z'/%3E%3Cpath fill='%23fff' d='M6 6h2v2H6z'/%3E%3C/svg%3E") 0 50%/24px 20px repeat-x !important;
  box-shadow:none !important}
html.fun00s.s-pixel .fun00s-eq i{background:repeating-linear-gradient(0deg,#58a8f8 0 4px,transparent 4px 6px);box-shadow:none;animation-timing-function:steps(6)}
/* ============ skin: biomech (html.s-biomech) — rusted copper hull, green bio-LCD, glowing vials ============ */
html.fun00s.s-biomech{
  --f-rgb:110,255,60; --f-rgb2:30,120,10;
  --f-lime:#7dff3a; --f-lime-hot:#c8ff9a; --f-lime-mid:#9bff5e; --f-pale:#e4ffd0;
  --f-lcd:#020a02; --f-lcd2:#0a1a06; --f-ink:#1a0d08;
  --f-on-gel:#041a00; --f-gel-edge:#0d3a02; --f-gel-ring:#b8ff80; --f-eq-mid:#d4ff4a;
  --f-tab-on:linear-gradient(#0f2208,#030a02); --f-tab:linear-gradient(#d9a070,#6e3f26);
  --f-bevel:#e0b090 #2a140c #1c0d07 #b27a58; --f-ring:#8a5238; --f-plate:#7a4630;
  --f-glow:rgba(110,255,60,.6); --f-dim:rgba(110,255,60,.18);
  --f-brush:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300'%3E%3Cfilter id='n' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.035' numOctaves='4' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.05 0 0 0 0 0.02 0 0 0 0 0 0 0 0 1.1 -0.25'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  --f-sheen:linear-gradient(100deg,#3b2013 0%,#8f5435 16%,#4e2a1a 32%,#b87a52 50%,#5a3220 68%,#9a6040 84%,#35190e 100%);
  --f-lcd-bg:repeating-linear-gradient(0deg,rgba(0,0,0,.3) 0 1px,transparent 1px 3px),radial-gradient(ellipse at 30% 20%,rgba(110,255,60,.14),transparent 60%),linear-gradient(#0a1a06,#020a02);
  --f-chrome:linear-gradient(#e9c3a0 0%,#b5764d 42%,#6e3a20 50%,#a8683f 78%,#d9a47c 100%);
  --f-gel:linear-gradient(#e4ffb8 0%,#8cf03c 30%,#3fb008 52%,#1f7004 64%,#6fd424 100%);
  --f-dark:linear-gradient(#5a3624 0%,#2e170d 46%,#120805 54%,#26130a 100%);
  --f-inset-border:#080302 #7a4a30 #94603f #150a05;
}
html.fun00s.s-biomech body{background:#080403 radial-gradient(ellipse at 50% 0%,#2e170d,#040201 72%) !important}
/* top bar: a hull arch instead of a flat bar — the plate lives on ::before so popovers are not clipped */
html.fun00s.s-biomech #hs-global-toolbar{position:relative;isolation:isolate;background:none !important;border:0 !important;box-shadow:none !important}
html.fun00s.s-biomech #hs-global-toolbar::before{content:"";position:absolute;inset:0 0 -10px 0;z-index:-1;
  background:var(--f-brush),var(--f-sheen);background-blend-mode:overlay,normal;filter:drop-shadow(0 6px 6px rgba(0,0,0,.8));
  clip-path:polygon(0 0,100% 0,100% 60%,calc(100% - 46px) 100%,66% 100%,61% 78%,39% 78%,34% 100%,46px 100%,0 60%)}
/* main: a ribcage frame — piped tubes with knuckle joints and glowing eyes at the corners */
html.fun00s.s-biomech.f-index main{
  border:30px solid transparent !important;border-image:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cdefs%3E%3ClinearGradient id=%22h%22 x1=%220%22 y1=%220%22 x2=%220%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22%231c0d07%22/%3E%3Cstop offset=%22.3%22 stop-color=%22%23d49a6a%22/%3E%3Cstop offset=%22.65%22 stop-color=%22%236e3a20%22/%3E%3Cstop offset=%221%22 stop-color=%22%23150a05%22/%3E%3C/linearGradient%3E%3ClinearGradient id=%22v%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%220%22%3E%3Cstop offset=%220%22 stop-color=%22%231c0d07%22/%3E%3Cstop offset=%22.3%22 stop-color=%22%23d49a6a%22/%3E%3Cstop offset=%22.65%22 stop-color=%22%236e3a20%22/%3E%3Cstop offset=%221%22 stop-color=%22%23150a05%22/%3E%3C/linearGradient%3E%3ClinearGradient id=%22hb%22 x1=%220%22 y1=%221%22 x2=%220%22 y2=%220%22%3E%3Cstop offset=%220%22 stop-color=%22%231c0d07%22/%3E%3Cstop offset=%22.3%22 stop-color=%22%23d49a6a%22/%3E%3Cstop offset=%22.65%22 stop-color=%22%236e3a20%22/%3E%3Cstop offset=%221%22 stop-color=%22%23150a05%22/%3E%3C/linearGradient%3E%3ClinearGradient id=%22vr%22 x1=%221%22 y1=%220%22 x2=%220%22 y2=%220%22%3E%3Cstop offset=%220%22 stop-color=%22%231c0d07%22/%3E%3Cstop offset=%22.3%22 stop-color=%22%23d49a6a%22/%3E%3Cstop offset=%22.65%22 stop-color=%22%236e3a20%22/%3E%3Cstop offset=%221%22 stop-color=%22%23150a05%22/%3E%3C/linearGradient%3E%3CradialGradient id=%22k%22 cx=%22.38%22 cy=%22.32%22%3E%3Cstop offset=%220%22 stop-color=%22%23f0c9a0%22/%3E%3Cstop offset=%22.5%22 stop-color=%22%23a8683f%22/%3E%3Cstop offset=%221%22 stop-color=%22%232a140c%22/%3E%3C/radialGradient%3E%3CradialGradient id=%22e%22 cx=%22.4%22 cy=%22.35%22%3E%3Cstop offset=%220%22 stop-color=%22%23eaffc0%22/%3E%3Cstop offset=%22.45%22 stop-color=%22%236ee028%22/%3E%3Cstop offset=%221%22 stop-color=%22%230d3a02%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=%22120%22 height=%2222%22 fill=%22url%28%23h%29%22/%3E%3Crect y=%2298%22 width=%22120%22 height=%2222%22 fill=%22url%28%23hb%29%22/%3E%3Crect width=%2222%22 height=%22120%22 fill=%22url%28%23v%29%22/%3E%3Crect x=%2298%22 width=%2222%22 height=%22120%22 fill=%22url%28%23vr%29%22/%3E%3Cg fill=%22%230a0503%22%3E%3Crect x=%2251%22 width=%222%22 height=%2222%22/%3E%3Crect x=%2263%22 width=%222%22 height=%2222%22/%3E%3Crect x=%2251%22 y=%2298%22 width=%222%22 height=%2222%22/%3E%3Crect x=%2263%22 y=%2298%22 width=%222%22 height=%2222%22/%3E%3Crect y=%2251%22 width=%2222%22 height=%222%22/%3E%3Crect y=%2263%22 width=%2222%22 height=%222%22/%3E%3Crect x=%2298%22 y=%2251%22 width=%2222%22 height=%222%22/%3E%3Crect x=%2298%22 y=%2263%22 width=%2222%22 height=%222%22/%3E%3C/g%3E%3Cg stroke=%22%230a0503%22 stroke-width=%222%22 fill=%22url%28%23k%29%22%3E%3Ccircle cx=%2224%22 cy=%2224%22 r=%2222%22/%3E%3Ccircle cx=%2296%22 cy=%2224%22 r=%2222%22/%3E%3Ccircle cx=%2224%22 cy=%2296%22 r=%2222%22/%3E%3Ccircle cx=%2296%22 cy=%2296%22 r=%2222%22/%3E%3C/g%3E%3Cg stroke=%22%23052000%22 stroke-width=%222%22 fill=%22url%28%23e%29%22%3E%3Ccircle cx=%2224%22 cy=%2224%22 r=%228%22/%3E%3Ccircle cx=%2296%22 cy=%2224%22 r=%228%22/%3E%3Ccircle cx=%2224%22 cy=%2296%22 r=%228%22/%3E%3Ccircle cx=%2296%22 cy=%2296%22 r=%228%22/%3E%3C/g%3E%3C/svg%3E") 48 / 30px round !important;border-radius:0 !important;
  background-clip:padding-box !important;box-shadow:none !important;padding:6px 10px !important}
html.fun00s.s-biomech .fun00s-screw{display:none !important}
/* side nav: a glowing green spine runs down the plate */
html.fun00s.s-biomech #hs-vertical-nav{color:var(--f-lime) !important;border:0 !important;box-shadow:inset -3px 0 0 #000 !important;
  background-color:#120a06 !important;background-image:linear-gradient(90deg,transparent 21px,#0d3a02 21px 25px,#4ee01a 25px 27px,#0d3a02 27px 31px,transparent 31px),radial-gradient(ellipse at 0 50%,#2e170d,transparent 70%) !important;background-size:100% 100% !important;background-blend-mode:normal !important}
html.fun00s.s-biomech #hs-vertical-nav :is(a,button,span,div,p,li,svg){color:var(--f-lime) !important;font-family:var(--f-head) !important;font-size:11px !important;letter-spacing:1.5px;text-transform:uppercase;text-shadow:0 0 5px var(--f-glow);text-decoration:none !important}
html.fun00s.s-biomech #hs-vertical-nav :is(a,button):hover,
html.fun00s.s-biomech #hs-vertical-nav :is([aria-current],[aria-selected=true]){background:linear-gradient(90deg,#2e8a0c,#0d3a02) !important}
html.fun00s.s-biomech #hs-vertical-nav :is(a,button):hover *,
html.fun00s.s-biomech #hs-vertical-nav :is([aria-current],[aria-selected=true]) *{color:var(--f-lime-hot) !important}
html.fun00s.s-biomech #hs-vertical-nav li.isHighlighted > :is(a,button),
html.fun00s.s-biomech #hs-vertical-nav li.isHighlighted > :is(a,button) *{color:var(--f-on-gel) !important;text-shadow:none !important}
/* table: ribbed rows, spaced-out Orbitron headers, one organic corner pair */
html.fun00s.s-biomech.f-index [data-test-id=framework-data-table-container]{border-radius:2px 44px 2px 44px !important}
html.fun00s.s-biomech.f-index [data-test-id=framework-data-table] th{font-family:var(--f-head) !important;letter-spacing:3px;text-transform:uppercase;font-size:12px !important}
html.fun00s.s-biomech.f-index [data-test-id=framework-data-table] td{border-bottom:1px dashed rgba(110,255,60,.28) !important}
html.fun00s.s-biomech.f-index [data-test-id=framework-data-table] td:first-child{border-left:5px solid #2e8a0c !important}
/* board: columns are glass vials with metal caps; cards are chamfered tiles with a vein down the left */
html.fun00s.s-biomech.f-index [data-test-id^=framework-data-column-]{
  border:4px solid !important;border-color:#d49a6a #2a140c #150a05 #a8683f !important;border-radius:30px 30px 12px 12px !important;
  background:linear-gradient(90deg,rgba(255,255,255,.07),transparent 18%,rgba(0,0,0,.35)),linear-gradient(#0f2208,#030a02) !important;
  box-shadow:0 -5px 0 #6e3a20,0 5px 0 #6e3a20,0 0 14px rgba(110,255,60,.18) !important}
html.fun00s.s-biomech.f-index [data-test-id=cdb-card]{border:0 !important;border-radius:0 !important;
  clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));
  background:linear-gradient(135deg,rgba(110,255,60,.16),rgba(110,255,60,.03)) !important;box-shadow:inset 4px 0 0 #4ee01a !important}
html.fun00s.s-biomech.f-index :is([data-test-id=cdb-card],[data-test-id^=cdb-column-header-]){color:var(--f-lime) !important}
html.fun00s.s-biomech :is(button,[data-button-use],#hs-search-react,.fun00s-marquee){border-radius:20px 4px 20px 4px !important}
/* the grille becomes a ribbed conduit with a green node; the equalizer is a bank of glowing vials */
html.fun00s.s-biomech .fun00s-grille{
  background:radial-gradient(circle at 50% 50%,#d4ff9a 0 3px,#6ee028 4px 7px,transparent 8px) 50% 50%/26px 26px no-repeat,
    repeating-linear-gradient(90deg,#150a05 0 4px,#9a6040 4px 6px,#4e2a1a 6px 10px) !important;
  border-radius:13px !important;box-shadow:inset 0 2px 3px #000,0 0 8px rgba(110,255,60,.35) !important}
html.fun00s.s-biomech .fun00s-eq{background:linear-gradient(#050d03,#0f2208);border-color:#150a05 #b87a52 #d9a47c #150a05 !important;border-radius:16px 4px 16px 4px !important;gap:3px}
html.fun00s.s-biomech .fun00s-eq i{border-radius:3px 3px 1px 1px;background:linear-gradient(90deg,rgba(255,255,255,.35) 0 20%,transparent 20%),linear-gradient(0deg,#1f7004,#6ee028 55%,#d4ff4a);box-shadow:0 0 6px var(--f-glow);animation-timing-function:ease-in-out}
/* record pages (pixel + biomech): the cards become dark LCD panels, so every label flips to light text */
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record :is([data-transitional-component=Card]:not([data-test-id=middle-pane] *),[data-test-id=middle-pane] [data-transitional-component=Card],[data-test-id=middle-pane]){
  background-image:var(--f-lcd-bg) !important;background-color:var(--f-lcd) !important;background-size:auto !important;background-repeat:repeat !important;background-position:0 0 !important;background-blend-mode:normal !important}
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record :is([data-transitional-component=Card],[data-test-id=left-sidebar],[data-test-id=right-sidebar]) *{text-shadow:none !important}
:where(html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record) :is([data-transitional-component=Card],[data-test-id=middle-pane]) :where(p,span,label,li,div,a,dt,dd,strong,small,button,h1,h2,h3,h4,h5,h6){color:var(--f-lime) !important}
:where(html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record) [data-test-id=middle-pane] :where(div,section,article,ul,li){border-color:rgba(var(--f-rgb),.4) !important}
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record [data-transitional-component=Card] :is(h1,h2,h3,h4,h5,h6),
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record [data-test-id=middle-pane] [data-transitional-component=Card] :is(h1,h2,h3,h4),
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper],
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] *,
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record [data-test-id^=highlight-property-item-] > :first-child,
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record [data-test-id^=highlight-property-item-] > :first-child *{color:var(--f-lime-hot) !important;font-family:var(--f-head) !important}
html.fun00s.s-pixel.f-record [data-transitional-component=Card] :is(h1,h2,h3,h4,h5,h6),
html.fun00s.s-pixel.f-record [class*=FormControl__LabelWrapper],
html.fun00s.s-pixel.f-record [class*=FormControl__LabelWrapper] *{font-size:11px !important;line-height:1.6 !important}
html.fun00s:is(.s-pixel,.s-biomech,.s-winamp).f-record :is([data-test-id=left-sidebar],[data-test-id=right-sidebar]) a:not([class*=Tile] a){color:var(--f-lime-hot) !important}
html.fun00s.fun00s.s-winamp.f-record :is([data-transitional-component=Card],[data-test-id=middle-pane]){border-radius:0 !important;border:2px solid !important;border-color:var(--f-bevel) !important;box-shadow:none !important}
html.fun00s.fun00s.s-pixel.f-record :is([data-transitional-component=Card],[data-test-id=middle-pane]){border-radius:0 !important;border-color:#000 !important;box-shadow:0 0 0 2px #58b858,4px 4px 0 2px #000 !important}
:where(html.fun00s.s-pixel.f-record) [data-transitional-component=Card] :where(p,span,label,li,div,a,dt,dd,strong,small,button){font-family:var(--f-mono) !important;font-size:18px}
/* ============ skin: winamp (html.s-winamp) — Winamp 2 windows: title bars, bevels, black playlist rows ============ */
html.fun00s.s-winamp{
  --f-rgb:0,224,0; --f-rgb2:0,120,0;
  --f-lime:#00e000; --f-lime-hot:#7dff7d; --f-lime-mid:#00c800; --f-pale:#c8ffc8;
  --f-lcd:#000; --f-lcd2:#000; --f-ink:#0a0c14;
  --f-on-gel:#000; --f-gel-edge:#14172a; --f-gel-ring:#fff0a0; --f-eq-mid:#e0e000;
  --f-tab-on:#000; --f-tab:linear-gradient(#b4bbd0,#7d86a2);
  --f-bevel:#cfd5e8 #14172a #14172a #cfd5e8; --f-ring:#14172a; --f-plate:#4a526e;
  --f-glow:rgba(0,224,0,.35); --f-dim:rgba(0,224,0,.2);
  --f-mono:"Share Tech Mono","Lucida Console",monospace; --f-head:"VT323","Share Tech Mono",monospace; --f-ui:Tahoma,Verdana,Arial,sans-serif;
  --f-brush:linear-gradient(rgba(255,255,255,.05),rgba(0,0,0,.1));
  --f-sheen:linear-gradient(#5b6382,#3f4660);
  --f-lcd-bg:#000;
  --f-chrome:linear-gradient(#bcc3d8,#7d86a2);
  --f-gel:linear-gradient(#f4dc5a,#b89a10);
  --f-dark:linear-gradient(#3a4268,#1b2038);
  --f-inset-border:#14172a #cfd5e8 #cfd5e8 #14172a;
  --w-title:linear-gradient(#3a4268,#1b2038); --w-line:#d0b030; --w-select:#0000c6; --w-hover:#101070;
}
/* storm theme: dark blue-steel with lightning, yellow accents, same Winamp structure */
html.fun00s.s-winamp.f-storm{
  --f-lime:#3cdc3c; --f-lime-hot:#ffe21a; --f-lime-mid:#7ae87a; --f-pale:#dfffd8; --f-eq-mid:#ffe21a;
  --f-plate:#0e1540;
  --f-bevel:#8d9bd6 #04061a #04061a #8d9bd6; --f-inset-border:#04061a #8d9bd6 #8d9bd6 #04061a; --f-ring:#04061a;
  --f-brush:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300'%3E%3Cdefs%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3C/filter%3E%3C/defs%3E%3Cg fill='none' stroke-linejoin='round'%3E%3Cpolyline points='330,0 305,70 345,95 300,170 335,190 290,300' stroke='%237fb4ff' stroke-width='8' opacity='.55' filter='url%28%23b%29'/%3E%3Cpolyline points='330,0 305,70 345,95 300,170 335,190 290,300' stroke='%23eaf5ff' stroke-width='2'/%3E%3Cpolyline points='345,95 405,128 388,172' stroke='%23eaf5ff' stroke-width='1.5'/%3E%3Cpolyline points='90,0 110,60 80,110' stroke='%239cc4ff' stroke-width='1.5' opacity='.6'/%3E%3C/g%3E%3C/svg%3E");
  --f-sheen:radial-gradient(ellipse at 30% 0,#27368a,transparent 60%),linear-gradient(#141d4a,#070b22);
  --f-chrome:linear-gradient(#a9b0c4,#4c5470); --f-gel:linear-gradient(#fff07a,#d9b400);
  --f-tab:linear-gradient(#a9b0c4,#4c5470);
  --f-dark:linear-gradient(#1b2660,#070b22); --w-title:linear-gradient(#1b2660,#070b22); --w-line:#ffe21a; --w-select:#1c2ccc; --w-hover:#0c1260;
}
html.fun00s.s-winamp body{background:#080b1c !important}
html.fun00s.s-winamp.f-storm body{background:#02030c !important}
/* flat, square, no glow */
html.fun00s.s-winamp *,html.fun00s.s-winamp *::before,html.fun00s.s-winamp *::after{border-radius:0 !important}
html.fun00s.s-winamp :is(#hs-global-toolbar,#hs-vertical-nav),html.fun00s.s-winamp.f-index main{background-blend-mode:overlay,normal !important}
html.fun00s.s-winamp #hs-global-toolbar{border-bottom:2px solid #14172a !important;box-shadow:inset 0 1px 0 #cfd5e8,0 2px 0 #000 !important}
html.fun00s.s-winamp #hs-vertical-nav{border-right:2px solid #14172a !important;box-shadow:inset 1px 0 0 #cfd5e8,inset -1px 0 0 #000 !important}
html.fun00s.s-winamp :is(button,[data-button-use]){border:2px solid !important;border-color:var(--f-bevel) !important;box-shadow:none !important;font-family:var(--f-ui) !important}
html.fun00s.s-winamp :is(button,[data-button-use]):active{border-color:#14172a #cfd5e8 #cfd5e8 #14172a !important}
html.fun00s.s-winamp .fun00s-screw{display:none !important}
/* title bars: striped Winamp caption on the main window and on every board column */
html.fun00s.s-winamp.f-index main::before,
html.fun00s.s-winamp.f-index [data-test-id^=cdb-column-header-]{
  content:"HUBSPOT PLAYLIST";display:block;height:16px;margin:0 0 8px;text-align:center;
  font:400 15px/16px var(--f-head) !important;letter-spacing:3px;text-transform:uppercase;color:#e6eaf8 !important;
  background:repeating-linear-gradient(0deg,var(--w-line) 0 1px,transparent 1px 3px) 6px 50%/calc(50% - 96px) 9px no-repeat,repeating-linear-gradient(0deg,var(--w-line) 0 1px,transparent 1px 3px) calc(100% - 6px) 50%/calc(50% - 96px) 9px no-repeat,var(--w-title) !important;
  border:1px solid;border-color:var(--f-bevel)}
html.fun00s.s-winamp.f-index [data-test-id^=cdb-column-header-]{content:none;height:auto;min-height:16px;padding:0 6px !important;margin:0 0 6px !important;font-size:13px !important;
  background:var(--w-title) !important}
html.fun00s.s-winamp.f-index [data-test-id^=cdb-column-header-] *{color:#e6eaf8 !important;font-family:var(--f-head) !important;letter-spacing:2px;text-transform:uppercase;text-shadow:none !important}
/* playlist: black window, green rows, blue selection, white current track */
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table-container]{border:2px solid !important;border-color:var(--f-inset-border) !important;box-shadow:none !important;background:#000 !important}
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table-container] *{font-family:var(--f-ui) !important;font-size:13px !important;text-shadow:none !important}
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table] th,
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table] th *{font-family:var(--f-head) !important;font-size:15px !important;letter-spacing:2px;text-transform:uppercase;color:var(--f-lime-hot) !important}
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table] th{background:var(--w-title) !important;border-bottom:1px solid #14172a !important}
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table] td{border-color:transparent !important}
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table] tbody tr:hover > *{background:var(--w-hover) !important}
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table] tr[data-fun00s-playing] > *{background:var(--w-select) !important;border:0 !important;box-shadow:none !important}
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table] tr[data-fun00s-playing] > *,
html.fun00s.s-winamp.f-index [data-test-id=framework-data-table] tr[data-fun00s-playing] > * *{color:#fff !important}
/* board: columns are playlist windows, cards are numbered playlist rows */
html.fun00s.s-winamp.f-index [data-test-id^=framework-data-column-]{counter-reset:wpl;background:#000 !important;border:2px solid !important;border-color:var(--f-bevel) !important;box-shadow:none !important;padding:3px !important}
html.fun00s.s-winamp.f-index [data-test-id=cdb-card]{counter-increment:wpl;background:#000 !important;border:0 !important;border-bottom:1px solid #1a1a1a !important;box-shadow:none !important}
html.fun00s.s-winamp.f-index [data-test-id=cdb-card]::before{content:counter(wpl) ". ";font:13px var(--f-ui);color:var(--f-lime)}
html.fun00s.s-winamp.f-index :is([data-test-id^=framework-data-column-],[data-test-id=cdb-card]){border-radius:0 !important;color:var(--f-lime) !important}
html.fun00s.s-winamp.f-index [data-test-id^=cdb-column-header-]{color:#e6eaf8 !important}
html.fun00s.s-winamp.f-index [data-test-id=cdb-card]:hover{background:var(--w-hover) !important;box-shadow:none !important}
html.fun00s.s-winamp.f-index [data-test-id=cdb-card] *{font-family:var(--f-ui) !important;text-shadow:none !important}
/* side nav: a library tree — black rows, green text, blue selection */
html.fun00s.s-winamp #hs-vertical-nav{color:var(--f-lime) !important}
html.fun00s.s-winamp #hs-vertical-nav :is(a,button,span,div,p,li,svg){color:var(--f-lime) !important;font-family:var(--f-ui) !important;font-size:12px !important;text-shadow:none !important}
html.fun00s.s-winamp #hs-vertical-nav :is(a,button){background:#000 !important;border:0 !important;border-bottom:1px solid #1a1a1a !important}
html.fun00s.s-winamp #hs-vertical-nav :is(a,button):hover,html.fun00s.s-winamp #hs-vertical-nav :is(a,button):hover *{background:var(--w-hover) !important;color:#fff !important}
html.fun00s.s-winamp #hs-vertical-nav li.isHighlighted > :is(a,button),html.fun00s.s-winamp #hs-vertical-nav li.isHighlighted > :is(a,button) *{background:var(--w-select) !important;color:#fff !important}
html.fun00s.s-winamp #hs-vertical-nav svg{fill:currentColor !important}
/* the grille becomes the transport row, the equalizer a classic spectrum analyser */
html.fun00s.s-winamp .fun00s-grille{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='26' shape-rendering='crispEdges'%3E%3Crect x='1' y='2' width='17' height='22' fill='%23aab1c8' stroke='%2314172a'/%3E%3Cpath d='M2 23V3h15' stroke='%23eef1ff' fill='none'/%3E%3Cg fill='%23000'%3E%3Crect x='5' y='8' width='2' height='10'/%3E%3Cpolygon points='14,8 8,13 14,18'/%3E%3C/g%3E%3Crect x='20' y='2' width='17' height='22' fill='%23aab1c8' stroke='%2314172a'/%3E%3Cpath d='M21 23V3h15' stroke='%23eef1ff' fill='none'/%3E%3Cg fill='%23000'%3E%3Cpolygon points='26,7 33,13 26,19'/%3E%3C/g%3E%3Crect x='39' y='2' width='17' height='22' fill='%23aab1c8' stroke='%2314172a'/%3E%3Cpath d='M40 23V3h15' stroke='%23eef1ff' fill='none'/%3E%3Cg fill='%23000'%3E%3Crect x='44' y='8' width='3' height='10'/%3E%3Crect x='49' y='8' width='3' height='10'/%3E%3C/g%3E%3Crect x='58' y='2' width='17' height='22' fill='%23aab1c8' stroke='%2314172a'/%3E%3Cpath d='M59 23V3h15' stroke='%23eef1ff' fill='none'/%3E%3Cg fill='%23000'%3E%3Crect x='63' y='8' width='8' height='10'/%3E%3C/g%3E%3Crect x='77' y='2' width='17' height='22' fill='%23aab1c8' stroke='%2314172a'/%3E%3Cpath d='M78 23V3h15' stroke='%23eef1ff' fill='none'/%3E%3Cg fill='%23000'%3E%3Cpolygon points='81,8 87,13 81,18'/%3E%3Crect x='88' y='8' width='2' height='10'/%3E%3C/g%3E%3C/svg%3E") 0 0/96px 26px no-repeat !important;box-shadow:none !important}
html.fun00s.s-winamp .fun00s-eq{background:#000;border:2px solid;border-color:var(--f-inset-border) !important;box-shadow:none;gap:1px}
html.fun00s.s-winamp .fun00s-eq i{background:repeating-linear-gradient(0deg,transparent 0 1px,#000 1px 2px),linear-gradient(0deg,#00c800 0 50%,#e0e000 50% 75%,#e03000 75%);box-shadow:none;animation-timing-function:steps(8)}
html.fun00s body{background:#0b0c0d radial-gradient(ellipse at 50% 0%,#1d2124,#050606 70%) !important}
html.fun00s div:has(> main){background:transparent !important}

/* ============ shared materials ============ */
html.fun00s :is(#hs-global-toolbar,#hs-vertical-nav),
html.fun00s.f-index main{
  background-image:var(--f-brush),var(--f-sheen) !important;
  background-size:600px 300px,100% 100% !important;
  background-blend-mode:overlay,normal !important;
}

/* ============ top bar ============ */
html.fun00s #hs-global-toolbar{
  border-bottom:2px solid #3b3f42;
  box-shadow:inset 0 1px 0 #fff,inset 0 -1px 0 #d2d6d9,0 3px 8px rgba(0,0,0,.7);
}
html.fun00s #hs-search-react{
  background:var(--f-lcd-bg) !important;border:2px solid;border-color:var(--f-inset-border) !important;
  box-shadow:inset 0 3px 8px rgba(0,0,0,.95),0 1px 0 rgba(255,255,255,.4);
}
html.fun00s #hs-search-react *{color:var(--f-lime) !important;font-family:var(--f-mono) !important;text-shadow:0 0 4px var(--f-glow)}
html.fun00s #hs-search-react input::placeholder{color:var(--f-lime) !important;opacity:.85}
html.fun00s button[data-test-id=hs-global-toolbar-copilot-list-item]{
  background:var(--f-dark) !important;border:1px solid #000 !important;border-radius:16px !important;
  color:#eef1f3 !important;padding:0 14px !important;height:30px;box-shadow:var(--f-dark-ring) !important;
}
html.fun00s button[data-test-id=hs-global-toolbar-copilot-list-item] *{color:#eef1f3 !important}
html.fun00s button[data-test-id=hs-global-toolbar-copilot-list-item] svg{filter:drop-shadow(0 0 4px rgba(255,122,26,.8)) !important}
html.fun00s #hs-global-toolbar-icons{
  background:var(--f-dark);border:1px solid #000;border-radius:18px;padding:0 6px;height:34px;align-self:center;
  box-shadow:var(--f-dark-ring);
}
html.fun00s #hs-global-toolbar #hs-global-toolbar-icons li :is(a,button){background:transparent !important;border:0 !important;box-shadow:none !important;color:#eef1f3 !important}
html.fun00s #hs-global-toolbar-icons > li + li{border-left:1px solid #000;box-shadow:-1px 0 0 rgba(255,255,255,.12)}
html.fun00s #hs-global-toolbar-icons *{color:#eef1f3}
html.fun00s #hs-global-toolbar svg{color:var(--f-lime);filter:drop-shadow(0 0 3px var(--f-glow))}
html.fun00s [class*=GlobalToolbarSprocket__StyledLogoContainer]{position:relative}

/* ============ side nav ============ */
html.fun00s #hs-vertical-nav{border-right:2px solid #3b3f42;box-shadow:inset -1px 0 0 #d2d6d9,inset 1px 0 0 #fff}
html.fun00s li.primary-nav-menu-item{padding:2px 10px !important}
html.fun00s li.primary-nav-menu-item > :is(a,button){
  background:var(--f-dark) !important;border:1px solid #000 !important;border-radius:13px !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 0 0 2px var(--f-ring),0 0 0 3px #1c1e20,0 3px 5px rgba(0,0,0,.55) !important;
  color:#f1f3f4 !important;
}
html.fun00s li.primary-nav-menu-item > :is(a,button) *{color:inherit !important;font-family:var(--f-ui) !important;font-weight:700 !important}
html.fun00s li.primary-nav-menu-item > :is(a,button) svg{color:var(--f-lime) !important;filter:drop-shadow(0 0 3px var(--f-glow))}
html.fun00s li.primary-nav-menu-item > :is(a,button) *::before{background:transparent !important}
html.fun00s li.primary-nav-menu-item > :is(a,button):hover{filter:brightness(1.25)}
html.fun00s li.primary-nav-menu-item.isHighlighted > :is(a,button){
  background:var(--f-gel) !important;color:var(--f-on-gel) !important;
  box-shadow:inset 0 1px 0 #fff,0 0 0 2px var(--f-gel-ring),0 0 0 3px var(--f-gel-edge),0 0 16px var(--f-glow),0 3px 5px rgba(0,0,0,.55) !important;
}
html.fun00s li.primary-nav-menu-item.isHighlighted > :is(a,button) svg{color:var(--f-on-gel) !important;filter:none}
html.fun00s #hs-vertical-nav :is(hr,[data-test-id=sidebar-divider],[data-test-id=nav-divider]){border-color:#5d6266 !important;background:#5d6266 !important}
html.fun00s [data-test-id=sidebar-spotlight-expanded-card]{
  background:var(--f-lcd-bg) !important;border:2px solid;border-color:var(--f-inset-border) !important;box-shadow:inset 0 3px 8px #000 !important}
html.fun00s [data-test-id=sidebar-spotlight-expanded-card] *{color:var(--f-lime) !important;font-family:var(--f-mono) !important}
html.fun00s [data-test-id=sidebar-spotlight-expanded-card] :is(a,button){
  background:var(--f-gel) !important;border:1px solid var(--f-gel-edge) !important;border-radius:12px !important;box-shadow:inset 0 1px 0 #fff,0 0 8px var(--f-glow) !important}
html.fun00s [data-test-id=sidebar-spotlight-expanded-card] :is(a,button),
html.fun00s [data-test-id=sidebar-spotlight-expanded-card] :is(a,button) *{color:var(--f-on-gel) !important;text-shadow:none}
html.fun00s [data-test-id=sidebar-spotlight-expanded-card] :is(a,button):last-child{background:var(--f-dark) !important;border-color:#000 !important;box-shadow:0 0 0 1px #9ea3a7 !important}
html.fun00s [data-test-id=sidebar-spotlight-expanded-card] :is(a,button):last-child,
html.fun00s [data-test-id=sidebar-spotlight-expanded-card] :is(a,button):last-child *{color:#e9ecee !important}

/* ============ index page: chassis ============ */
html.fun00s.f-index main{
  position:relative;
  border:2px solid;border-color:var(--f-bevel) !important;
  box-shadow:0 0 0 1px #111,inset 0 0 0 1px rgba(255,255,255,.25),0 6px 16px rgba(0,0,0,.7) !important;
  color:var(--f-ink);
}
html.fun00s.f-index main :is(div,header,section,table,thead,tbody,tr,th,td,nav,ul,li,form){background-color:transparent !important}

/* title → LCD */
html.fun00s.f-index main header [data-button-use=control]{
  background:var(--f-lcd-bg) !important;border-radius:12px !important;padding:6px 16px !important;
  border:2px solid;border-color:var(--f-inset-border) !important;box-shadow:inset 0 3px 8px #000 !important;
}
html.fun00s.f-index main header [data-button-use=control] *{
  color:var(--f-lime-hot) !important;font-family:var(--f-head) !important;font-weight:800 !important;font-size:22px !important;
  letter-spacing:2px;line-height:1.2;text-shadow:0 0 8px var(--f-glow),0 0 2px #fff;
}

/* view tabs */
html.fun00s.f-index [data-test-id=view-tabs-container-lite] [data-button-use=transparent]{
  background:var(--f-tab) !important;border:1px solid #333 !important;border-radius:6px 6px 0 0 !important;box-shadow:inset 0 1px 0 #fff !important}
html.fun00s.f-index [data-test-id=view-tabs-container-lite] button:not([data-tab-current=true]) *{color:#111 !important;font-weight:700}
html.fun00s.f-index [data-test-id=view-tabs-container-lite] button[data-tab-current=true]{
  background:var(--f-tab-on) !important;border:2px solid var(--f-lime) !important;border-bottom:0 !important;
  box-shadow:0 0 12px var(--f-glow),inset 0 0 10px rgba(var(--f-rgb),.2) !important;
}
html.fun00s.f-index [data-test-id=view-tabs-container-lite] button[data-tab-current=true] *{color:var(--f-lime-hot) !important;text-shadow:0 0 6px var(--f-glow)}

/* chrome buttons */
html.fun00s.f-index main :is([data-button-use=tertiary-extra-light],[data-button-use=tertiary-transparent],[data-test-id=cdf-quick-filters-bar] [data-button-use=transparent]){
  background:var(--f-chrome) !important;border:1px solid #2b2e30 !important;color:var(--f-ink) !important;
  box-shadow:inset 0 1px 0 #fff,inset 0 -2px 3px rgba(0,0,0,.25),0 2px 4px rgba(0,0,0,.6) !important;
  text-shadow:0 1px 0 rgba(255,255,255,.6);
}
html.fun00s.f-index main :is([data-button-use=tertiary-extra-light],[data-button-use=tertiary-transparent],[data-test-id=cdf-quick-filters-bar] [data-button-use=transparent]) *{color:var(--f-ink) !important;font-weight:700}
html.fun00s.f-index main :is([data-button-use=tertiary-extra-light],[data-button-use=tertiary-transparent],[data-test-id=cdf-quick-filters-bar] [data-button-use=transparent]):hover{filter:brightness(1.08)}

/* primary → lime gel (everywhere: modals too) */
html.fun00s [data-button-use=primary]{
  background:var(--f-gel) !important;border:1px solid var(--f-gel-edge) !important;color:var(--f-on-gel) !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 0 14px var(--f-glow),0 2px 4px rgba(0,0,0,.6) !important;
}
html.fun00s [data-button-use=primary] *{color:var(--f-on-gel) !important;font-weight:700}

/* toolbar search → LCD */
html.fun00s.f-index [data-test-id=compact-toolbar-search] :is(input, div:has(> input)){
  background:var(--f-lcd-bg) !important;color:var(--f-lime) !important;font-family:var(--f-mono) !important;
  border-color:var(--f-inset-border) !important;box-shadow:inset 0 3px 8px #000 !important;text-shadow:0 0 4px var(--f-glow);
}
html.fun00s.f-index [data-test-id=compact-toolbar-search] input::placeholder{color:var(--f-lime) !important;opacity:.8}
html.fun00s.f-index [data-test-id=compact-toolbar-search] svg{color:var(--f-lime) !important}

/* active quick filter → lime gel chip */
html.fun00s.f-index [data-test-id=cdf-quick-filters-bar] div:has(> button[data-test-id$=-clear]){
  background:var(--f-gel) !important;border:1px solid var(--f-gel-edge);border-radius:8px;
  box-shadow:inset 0 1px 0 #fff,0 0 10px var(--f-glow),0 2px 3px rgba(0,0,0,.5);
}
html.fun00s.f-index [data-test-id=cdf-quick-filters-bar] div:has(> button[data-test-id$=-clear]) > button{background:transparent !important;border:0 !important;box-shadow:none !important}
html.fun00s.f-index [data-test-id=cdf-quick-filters-bar] div:has(> button[data-test-id$=-clear]) > button *{color:var(--f-on-gel) !important}

/* ============ index page: LCD table ("playlist") ============ */
html.fun00s.f-index [data-test-id=framework-data-table-container]{
  background:var(--f-lcd-bg) !important;border-radius:12px;overflow:hidden;
  border:2px solid;border-color:var(--f-inset-border) !important;
  box-shadow:inset 0 3px 8px rgba(0,0,0,.95),inset 0 0 0 1px rgba(var(--f-rgb),.15),0 1px 0 rgba(255,255,255,.4) !important;
}
html.fun00s.f-index [data-test-id=framework-data-table-container] *{font-family:var(--f-mono) !important;color:var(--f-lime) !important;text-shadow:0 0 4px var(--f-glow)}
html.fun00s.f-index [data-test-id=framework-data-table] th{border-bottom:1px solid rgba(var(--f-rgb),.45) !important}
html.fun00s.f-index [data-test-id=framework-data-table] th,
html.fun00s.f-index [data-test-id=framework-data-table] th *{color:var(--f-lime-hot) !important}
html.fun00s.f-index [data-test-id=framework-data-table] td{border-color:var(--f-dim) !important}
html.fun00s.f-index [data-test-id=framework-data-table] tbody tr:hover > *{background:rgba(var(--f-rgb),.08) !important}
html.fun00s.f-index [data-test-id=framework-data-table] a[data-link=true]{color:var(--f-pale) !important;text-decoration:none}
html.fun00s.f-index [data-test-id=framework-data-table] tr[data-fun00s-playing] > *{
  background:linear-gradient(rgba(var(--f-rgb),.38),rgba(var(--f-rgb2),.22)) !important;color:var(--f-pale) !important}
html.fun00s.f-index [data-test-id=framework-data-table] tr[data-fun00s-playing] > *:first-child{box-shadow:inset 4px 0 0 var(--f-lime-hot)}
html.fun00s.f-index [data-test-id=framework-data-table] tr[data-fun00s-playing] > *{border-top:1px solid var(--f-lime-mid) !important;border-bottom:1px solid var(--f-lime-mid) !important}
html.fun00s.f-index [data-test-id=framework-data-table-container] [class*=Checkbox__CheckboxIndicator]{
  background:transparent !important;border:2px solid rgba(var(--f-rgb),.75) !important;border-radius:4px !important;
  box-shadow:0 0 4px var(--f-glow),inset 0 0 4px rgba(var(--f-rgb),.25) !important;
}
html.fun00s.f-index [data-test-id=framework-data-table-container] input:checked + [class*=Checkbox__CheckboxIndicator]{background:var(--f-lime) !important}
html.fun00s.f-index [data-test-id=table-paginator] [aria-current]{
  background:transparent !important;border:2px solid var(--f-lime) !important;border-radius:5px !important;box-shadow:0 0 6px var(--f-glow) !important}

/* footer */
html.fun00s.f-index [data-test-id=viz-sync-footer]{position:relative}
html.fun00s.f-index [data-test-id=viz-sync-footer] [class*=Badge__StyledBadge]{
  background:var(--f-lcd-bg) !important;color:var(--f-lime) !important;font-family:var(--f-mono) !important;font-size:15px !important;
  padding:6px 18px !important;border-radius:16px !important;border:2px solid;border-color:var(--f-inset-border) !important;
  box-shadow:inset 0 3px 8px #000 !important;text-shadow:0 0 4px var(--f-glow);
}
html.fun00s.f-index [data-test-id=viz-sync-footer] [class*=Badge__StyledBadge] *{color:var(--f-lime) !important}

/* ============ board view: each pipeline stage = an LCD channel ============ */
html.fun00s.f-index [data-test-id=board-columns-container]{gap:10px}
html.fun00s.f-index [data-test-id^=framework-data-column-]{
  background:var(--f-lcd-bg) !important;border-radius:14px !important;
  border:2px solid;border-color:var(--f-inset-border) !important;
  box-shadow:inset 0 3px 10px rgba(0,0,0,.95),inset 0 0 0 1px rgba(var(--f-rgb),.14),0 1px 0 rgba(255,255,255,.5) !important;
}
html.fun00s.f-index [data-test-id^=framework-data-column-] *{font-family:var(--f-mono) !important}
html.fun00s.f-index [data-test-id^=cdb-column-header-]{border-bottom:1px solid rgba(var(--f-rgb),.35);padding-bottom:6px;margin-bottom:4px}
html.fun00s.f-index [data-test-id^=cdb-column-header-] *{color:var(--f-lime-hot) !important;text-shadow:0 0 6px var(--f-glow)}
html.fun00s.f-index [data-test-id=column-total-cards]{background:var(--f-lime) !important;border-radius:4px;padding:0 5px;box-shadow:0 0 6px var(--f-glow)}
html.fun00s.f-index [data-test-id^=cdb-column-header-] [data-test-id=column-total-cards],
html.fun00s.f-index [data-test-id^=cdb-column-header-] [data-test-id=column-total-cards] *{color:var(--f-on-gel) !important;text-shadow:none !important}
html.fun00s.f-index [data-test-id^=lane-drag-handle-] *{color:var(--f-lime) !important}

/* deal cards → glowing glass tiles */
html.fun00s.f-index [data-test-id=cdb-card]{
  background:linear-gradient(rgba(var(--f-rgb),.09),rgba(var(--f-rgb),.03)) !important;
  border:1px solid rgba(var(--f-rgb),.38) !important;border-radius:10px !important;
  box-shadow:0 0 8px rgba(var(--f-rgb),.12),inset 0 1px 0 rgba(198,255,122,.18) !important;transition:box-shadow .15s,border-color .15s;
}
html.fun00s.f-index [data-test-id=cdb-card]:hover{border-color:var(--f-lime-mid) !important;box-shadow:0 0 16px var(--f-glow),inset 0 1px 0 rgba(198,255,122,.3) !important}
html.fun00s.f-index [data-test-id=cdb-card] *{color:var(--f-lime) !important;text-shadow:0 0 4px var(--f-glow);background-color:transparent}
html.fun00s.f-index [data-test-id=cdb-card] svg{color:var(--f-lime) !important}
html.fun00s.f-index [data-test-id=cdb-card] [data-test-id=v3-title-link],
html.fun00s.f-index [data-test-id=cdb-card] [data-test-id=v3-title-link] *{color:var(--f-pale) !important;font-weight:700}
/* "No upcoming" → amber warning LED */
html.fun00s.f-index [data-test-id=cdb-card] :has(> [class*=Tag__ContentWrapper] [data-test-id=activity-chip-upcoming-empty]){
  border-color:rgba(255,190,40,.75) !important;background:rgba(255,190,40,.08) !important;box-shadow:0 0 6px rgba(255,190,40,.35) !important}
html.fun00s.f-index [data-test-id=cdb-card] [class*=Tag__ContentWrapper]:has([data-test-id=activity-chip-upcoming-empty]) *{color:#ffcf4a !important;text-shadow:0 0 5px rgba(255,190,40,.7) !important}

/* stage totals → LCD readout */
html.fun00s.f-index [data-test-id^=framework-data-column-] [class*=SummaryWrapper__SummaryRow]{
  border-top:1px solid rgba(var(--f-rgb),.4) !important;background:rgba(0,0,0,.35) !important;border-radius:0 0 12px 12px}
html.fun00s.f-index [data-test-id^=framework-data-column-] [class*=SummaryWrapper__SummaryRow] *{color:var(--f-lime) !important;text-shadow:0 0 4px var(--f-glow)}

/* pipeline switcher → chrome */
html.fun00s.f-index button[data-test-id=compact-toolbar-pipeline-switcher]{
  background:var(--f-chrome) !important;border:1px solid #2b2e30 !important;border-radius:14px !important;
  box-shadow:inset 0 1px 0 #fff,inset 0 -2px 3px rgba(0,0,0,.25),0 2px 4px rgba(0,0,0,.6) !important}
html.fun00s.f-index button[data-test-id=compact-toolbar-pipeline-switcher] *{color:var(--f-ink) !important;font-weight:700}

/* ============ stage (gray page background) ============ */
html.fun00s [data-fun00s-stage]{background:transparent !important}

/* ============ record page ============ */
html.fun00s{
  --f-screw:radial-gradient(circle at 35% 30%,#fff 0,#c9cdd0 22%,#6c7175 48%,#2c2f31 58%,rgba(0,0,0,.45) 64%,transparent 70%);
}
/* metal panels: sidebar cards + middle chassis, with gradient "screws" in the corners */
html.fun00s.f-record :is([data-transitional-component=Card]:not([data-test-id=middle-pane] *),[data-test-id=middle-pane]){
  background-image:var(--f-screw),var(--f-screw),var(--f-screw),var(--f-screw),var(--f-brush),var(--f-sheen) !important;
  background-size:14px 14px,14px 14px,14px 14px,14px 14px,600px 300px,100% 100% !important;
  background-position:7px 7px,calc(100% - 7px) 7px,7px calc(100% - 7px),calc(100% - 7px) calc(100% - 7px),0 0,0 0 !important;
  background-repeat:no-repeat,no-repeat,no-repeat,no-repeat,repeat,no-repeat !important;
  background-blend-mode:normal,normal,normal,normal,overlay,normal !important;
  background-color:var(--f-plate) !important;
  border:2px solid;border-color:var(--f-bevel) !important;border-radius:16px !important;
  box-shadow:0 0 0 1px #111,inset 0 0 0 1px rgba(255,255,255,.25),0 6px 14px rgba(0,0,0,.7) !important;
}
html.fun00s.f-record [data-test-id=middle-pane]{padding:10px 14px !important}
html.fun00s.f-record [data-transitional-component=Card] :is(div,section,header,ul,li,span,form):not([class*=Tile__StyledTile]):not([class*=Tag]){background-color:transparent !important}
html.fun00s.f-record [data-test-id=middle-pane] :is(div,section,header,ul,li,form,a){background-color:transparent !important}
html.fun00s.f-record [data-transitional-component=Card] :is(h1,h2,h3,h4,h5){color:#14171a !important;font-family:var(--f-ui) !important;text-shadow:0 1px 0 rgba(255,255,255,.6)}

/* record name → LCD */
html.fun00s.f-record [data-test-id=record-highlight-main-content] :is(h1,h2,h3,[data-test-id=highlight-record-label]){
  background:var(--f-lcd-bg) !important;color:var(--f-lime-hot) !important;font-family:var(--f-head) !important;font-weight:800 !important;
  padding:6px 14px !important;border-radius:10px;border:2px solid;border-color:var(--f-inset-border) !important;box-shadow:inset 0 3px 8px #000;
  text-shadow:0 0 8px var(--f-glow),0 0 2px #fff;letter-spacing:1px;
}
/* quick actions → chrome knobs */
html.fun00s.f-record [data-transitional-component=Card] [data-button-use=tertiary-light]{
  background:radial-gradient(circle at 50% 35%,#fff,#cfd3d6 35%,#80858a 75%,#3e4245) !important;border:0 !important;color:#111 !important;
  box-shadow:0 0 0 2px #1a1c1d,0 0 0 4px #9ba0a4,0 0 0 5px #222,0 4px 8px rgba(0,0,0,.6),inset 0 -3px 4px rgba(0,0,0,.35) !important;
}
html.fun00s.f-record [data-transitional-component=Card] [data-button-use=tertiary-light] *{color:#111 !important}

/* property rows: engraved label + recessed LCD value */
html.fun00s.f-record [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper]{color:#14171a !important;font-weight:700}
html.fun00s.f-record [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] *{color:#14171a !important;text-shadow:0 1px 0 rgba(255,255,255,.5)}
html.fun00s.f-record [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] ~ *{
  background:var(--f-lcd-bg) !important;border-radius:6px;padding:3px 10px !important;margin-top:3px;
  border:2px solid;border-color:var(--f-inset-border) !important;box-shadow:inset 0 2px 6px #000;
}
html.fun00s.f-record [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] ~ * *{
  color:var(--f-lime) !important;font-family:var(--f-mono) !important;text-shadow:0 0 4px var(--f-glow);background-color:transparent !important}
html.fun00s.f-record [data-test-id] [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] ~ * a,
html.fun00s.f-record [data-test-id] [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] ~ * a *{color:var(--f-lime-hot) !important;font-weight:400}

/* highlight card property rows (Amount, Close date, Pipeline, Stage, Domain…) → engraved label + compact LCD chip */
html.fun00s.f-record [data-test-id^=highlight-property-item-]{align-items:center !important;gap:8px;margin-bottom:4px}
html.fun00s.f-record [data-test-id^=highlight-property-item-] > :first-child,
html.fun00s.f-record [data-test-id^=highlight-property-item-] > :first-child *{color:#14171a !important;font-weight:700 !important;text-shadow:0 1px 0 rgba(255,255,255,.55)}
html.fun00s.f-record [data-test-id^=highlight-property-item-] > :last-child{
  background:var(--f-lcd-bg) !important;border:2px solid;border-color:var(--f-inset-border) !important;border-radius:6px;
  box-shadow:inset 0 2px 6px #000;padding:2px 10px !important;flex:1;min-width:0}
html.fun00s.f-record [data-test-id^=highlight-property-item-] > :last-child *{
  color:var(--f-lime) !important;font-family:var(--f-mono) !important;text-shadow:0 0 4px var(--f-glow);background:transparent !important}
html.fun00s.f-record [data-test-id^=highlight-property-item-] > :last-child [class*=FormControl__LabelWrapper] ~ *{
  border:0 !important;box-shadow:none !important;padding:0 !important;margin:0 !important}
html.fun00s.f-record [data-test-id^=highlight-property-item-] > :last-child button{border-color:transparent !important;box-shadow:none !important;background:transparent !important}

/* buttons inside an LCD value field (file lists, dropdown values) → no chrome; only "Add file" gets a lime outline */
html.fun00s.f-record [data-transitional-component=Card] [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] ~ * button{
  background:transparent !important;border:1px solid transparent !important;border-radius:6px !important;box-shadow:none !important}
html.fun00s.f-record [data-transitional-component=Card] [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] ~ * button[data-transitional-component=FileButton]{border-color:rgba(var(--f-rgb),.45) !important}
html.fun00s.f-record [data-transitional-component=Card] [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] ~ * button:hover{
  background:rgba(var(--f-rgb),.15) !important;border-color:var(--f-lime) !important}
html.fun00s.f-record [data-transitional-component=Card] [class*=FormControl__StyledFormControlHoverContentContainer] > [class*=FormControl__LabelWrapper] ~ * button *{color:var(--f-lime) !important}

/* cards inside the middle chassis → raised, bolted-on plates */
html.fun00s.f-record [data-test-id=middle-pane] [data-transitional-component=Card]{
  background-image:linear-gradient(170deg,rgba(255,255,255,.32),rgba(255,255,255,.08) 45%,rgba(0,0,0,.10)) !important;
  border:2px solid !important;border-color:#fbfcfd #555a5e #3e4246 #e3e6e8 !important;border-radius:14px !important;
  box-shadow:0 0 0 1px #15181a,inset 0 1px 0 rgba(255,255,255,.85),inset 0 -1px 0 rgba(0,0,0,.25),0 5px 12px rgba(0,0,0,.45),0 1px 2px rgba(0,0,0,.5) !important;
  margin-bottom:6px;
}
html.fun00s.f-record [data-test-id=middle-pane] [data-transitional-component=Card] :is(h1,h2,h3,h4){
  color:#0f1214 !important;text-shadow:0 1px 0 rgba(255,255,255,.75),0 -1px 0 rgba(0,0,0,.15) !important}
/* AI summary tiles → recessed LCD screens (keeps a faint pink edge for the AI hint) */
html.fun00s.f-record [data-test-id=middle-pane] [class*=BreezeTile__StyledBreezeTile]{
  background:var(--f-lcd-bg) !important;border:2px solid !important;border-color:var(--f-inset-border) !important;
  box-shadow:inset 0 3px 8px rgba(0,0,0,.95),inset 0 0 0 1px rgba(255,92,180,.35),0 1px 0 rgba(255,255,255,.6) !important;
}
html.fun00s.f-record [data-test-id=middle-pane] [class*=BreezeTile__StyledBreezeTile] *:not(button):not(button *){
  color:var(--f-lime) !important;font-family:var(--f-mono) !important;text-shadow:0 0 4px var(--f-glow);border-color:rgba(var(--f-rgb),.25) !important}
html.fun00s.f-record [data-test-id=middle-pane] [class*=BreezeTile__StyledBreezeTile] svg{color:var(--f-lime) !important}
html.fun00s.f-record [data-test-id=middle-pane] [class*=BreezeTile__StyledBreezeTile] button:not([data-test-id=chat-with-copilot-button]),
html.fun00s.f-record [data-test-id=middle-pane] [class*=BreezeTile__StyledBreezeTile] button:not([data-test-id=chat-with-copilot-button]) *{color:var(--f-lime) !important;font-family:var(--f-mono) !important;background-color:transparent !important}

/* middle tabs */
html.fun00s.f-record [data-test-id=middle-pane] a[data-tab-link]{
  background:var(--f-tab) !important;border:1px solid #333 !important;border-radius:8px 8px 0 0 !important;
  box-shadow:inset 0 1px 0 #fff !important;color:#111 !important;margin-right:4px;
}
html.fun00s.f-record [data-test-id=middle-pane] a[data-tab-link] *{color:#111 !important;font-weight:700}
html.fun00s.f-record [data-test-id=middle-pane] a[data-tab-link][data-tab-selected=true]{
  background:var(--f-tab-on) !important;border:2px solid var(--f-lime) !important;border-bottom:0 !important;
  box-shadow:0 0 12px var(--f-glow),inset 0 0 10px rgba(var(--f-rgb),.2) !important;
}
html.fun00s.f-record [data-test-id=middle-pane] a[data-tab-link][data-tab-selected=true],
html.fun00s.f-record [data-test-id=middle-pane] a[data-tab-link][data-tab-selected=true] *{color:var(--f-lime-hot) !important;text-shadow:0 0 6px var(--f-glow) !important}
html.fun00s.f-record [data-test-id=middle-pane] [data-transitional-component=Tabs] *{border-bottom-color:transparent}

/* gutter between middle and right column (left already has one) */
html.fun00s.f-record [data-test-id=right-sidebar]{padding-left:16px !important;box-sizing:border-box}

/* activity entries anywhere in the middle column → LCD sub-panels */
html.fun00s.f-record [data-test-id=middle-pane] article{
  background:var(--f-lcd-bg) !important;border:2px solid !important;border-color:var(--f-inset-border) !important;border-radius:10px !important;
  box-shadow:inset 0 3px 8px rgba(0,0,0,.9),inset 0 0 0 1px rgba(var(--f-rgb),.18),0 1px 0 rgba(255,255,255,.6) !important;
}
html.fun00s.f-record [data-test-id=middle-pane] article *{color:var(--f-lime) !important;font-family:var(--f-mono) !important;text-shadow:0 0 4px var(--f-glow);border-color:rgba(var(--f-rgb),.25) !important;background-color:transparent !important}
html.fun00s.f-record [data-test-id=middle-pane] article a,html.fun00s.f-record [data-test-id=middle-pane] article a *{color:var(--f-lime-hot) !important}

/* search inputs in the middle column → LCD */
html.fun00s.f-record [data-test-id=middle-pane] input:is([type=search],[type=text],:not([type])){
  background:var(--f-lcd-bg) !important;color:var(--f-lime) !important;font-family:var(--f-mono) !important;
  border:2px solid !important;border-color:var(--f-inset-border) !important;box-shadow:inset 0 3px 8px #000 !important;text-shadow:0 0 4px var(--f-glow);
}
html.fun00s.f-record [data-test-id=middle-pane] input::placeholder{color:var(--f-lime) !important;opacity:.75}
html.fun00s.f-record [data-test-id=middle-pane] [class*=SearchInput__Wrapper] svg{color:var(--f-lime) !important;position:relative;z-index:1}

/* filter chips on metal (Overview cards) → chrome chips */
html.fun00s.f-record [data-test-id=middle-pane] [data-transitional-component=Card] :is([data-selenium-test=timeline-filter-container] > button,button[data-test-id=date-range-presets-dropdown]),
html.fun00s.f-record [data-test-id=middle-pane] [data-test-id=cdf-quick-filters-bar] [data-button-use=transparent]{
  background:var(--f-chrome) !important;border:1px solid #2b2e30 !important;border-radius:8px !important;padding:0 10px !important;
  box-shadow:inset 0 1px 0 #fff,inset 0 -2px 3px rgba(0,0,0,.25),0 2px 4px rgba(0,0,0,.6) !important;
}
html.fun00s.f-record [data-test-id=middle-pane] [data-transitional-component=Card] :is([data-selenium-test=timeline-filter-container] > button,button[data-test-id=date-range-presets-dropdown]) *,
html.fun00s.f-record [data-test-id=middle-pane] [data-test-id=cdf-quick-filters-bar] [data-button-use=transparent] *{color:var(--f-ink) !important;font-weight:700}
html.fun00s.f-record [data-test-id=middle-pane] [data-test-id=cdf-quick-filters-bar] div:has(> button[data-test-id$=-clear]){
  background:var(--f-gel) !important;border:1px solid var(--f-gel-edge);border-radius:8px;box-shadow:inset 0 1px 0 #fff,0 0 10px var(--f-glow),0 2px 3px rgba(0,0,0,.5)}
html.fun00s.f-record [data-test-id=middle-pane] [data-test-id=cdf-quick-filters-bar] div:has(> button[data-test-id$=-clear]) > button{background:transparent !important;border:0 !important;box-shadow:none !important}
html.fun00s.f-record [data-test-id=middle-pane] [data-test-id=cdf-quick-filters-bar] div:has(> button[data-test-id$=-clear]) > button *{color:var(--f-on-gel) !important;text-shadow:none}

/* activity timeline → big LCD screen */
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"]{
  background:var(--f-lcd-bg) !important;border-radius:12px !important;padding:8px 14px !important;margin-top:8px;min-height:calc(100vh - 190px);
  border:2px solid;border-color:var(--f-inset-border) !important;
  box-shadow:inset 0 3px 8px rgba(0,0,0,.95),inset 0 0 0 1px rgba(var(--f-rgb),.15),0 1px 0 rgba(255,255,255,.4) !important;
}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] *{color:var(--f-lime) !important;font-family:var(--f-mono) !important;text-shadow:0 0 4px var(--f-glow)}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] article{
  background:rgba(var(--f-rgb),.05) !important;border:1px solid rgba(var(--f-rgb),.45) !important;border-radius:8px !important;box-shadow:0 0 10px rgba(var(--f-rgb),.15) !important}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] a{color:var(--f-lime-hot) !important}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] input{background:transparent !important;border-color:rgba(var(--f-rgb),.5) !important}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] input::placeholder{color:var(--f-lime) !important;opacity:.7}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] a[data-tab-link]{
  background:transparent !important;border:1px solid rgba(var(--f-rgb),.4) !important;border-radius:6px 6px 0 0 !important;box-shadow:none !important}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] a[data-tab-link],
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] a[data-tab-link] *{color:var(--f-lime) !important;font-weight:400 !important}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] a[data-tab-link][data-tab-selected=true]{background:rgba(var(--f-rgb),.18) !important;border:1px solid var(--f-lime) !important}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] [data-test-id=cdf-quick-filters-bar] [data-button-use=transparent]{
  background:transparent !important;border:1px solid rgba(var(--f-rgb),.5) !important;box-shadow:none !important}
html.fun00s.f-record [data-test-id^="card-wrapper-SINGLETON/"][data-test-id$="/RECORD_TIMELINE"] [data-test-id=cdf-quick-filters-bar] [data-button-use=transparent] *{color:var(--f-lime) !important}

/* association tiles → small LCD displays */
html.fun00s.f-record [class*=Tile__StyledTile]{
  background:var(--f-lcd-bg) !important;border:2px solid;border-color:var(--f-inset-border) !important;border-radius:10px !important;box-shadow:inset 0 3px 8px #000 !important}
html.fun00s.f-record [class*=Tile__StyledTile] *{color:var(--f-lime) !important;font-family:var(--f-mono) !important;text-shadow:0 0 4px var(--f-glow);background-color:transparent !important}
html.fun00s.f-record [class*=Tile__StyledTile] a{color:var(--f-lime-hot) !important}

/* buttons + links on record page */
html.fun00s.f-record :is([data-test-id=left-sidebar],[data-test-id=right-sidebar],[data-test-id=middle-pane]) :is([data-button-use=tertiary-extra-light],[data-button-use=control],[data-button-use=secondary]){
  background:var(--f-chrome) !important;border:1px solid #2b2e30 !important;border-radius:12px !important;
  box-shadow:inset 0 1px 0 #fff,inset 0 -2px 3px rgba(0,0,0,.25),0 2px 4px rgba(0,0,0,.6) !important;color:var(--f-ink) !important}
html.fun00s.f-record :is([data-test-id=left-sidebar],[data-test-id=right-sidebar]) a:not([class*=Tile] a){color:var(--f-on-gel) !important;font-weight:700}

/* ============ popovers / dropdown menus (portals, every page) ============ */
html.fun00s [class*=Popover__StyledPopoverContainer]{
  background:var(--f-lcd-bg) !important;border:2px solid;border-color:#d2d6d9 #3b3f42 #2b2e30 #c6cacd !important;
  box-shadow:0 0 0 1px #000,0 0 0 3px #8a8f93,0 0 0 4px #111,0 10px 24px rgba(0,0,0,.75),inset 0 0 0 1px rgba(var(--f-rgb),.2) !important;
}
html.fun00s [class*=Popover__StyledPopoverContainer] :is(div,ul,li,span){background-color:transparent !important}
html.fun00s [class*=Popover__StyledPopoverContainer] *{color:var(--f-lime) !important;font-family:var(--f-mono) !important;text-shadow:0 0 4px var(--f-glow)}
html.fun00s [class*=Popover__StyledPopoverContainer] :is(button,a,[role=option],[role=menuitem]){background:transparent !important;border:0 !important;box-shadow:none !important}
html.fun00s [class*=Popover__StyledPopoverContainer] :is(button,a,[role=option],[role=menuitem]):is(:hover,:focus-visible,[aria-selected=true]){
  background:linear-gradient(rgba(var(--f-rgb),.38),rgba(var(--f-rgb2),.22)) !important;outline:1px solid var(--f-lime-mid) !important;outline-offset:-1px}
html.fun00s [class*=Popover__StyledPopoverContainer] :is(button,a):hover *{color:var(--f-pale) !important}
html.fun00s [class*=Popover__StyledPopoverContainer] :is(hr,[role=separator]){border-color:rgba(var(--f-rgb),.3) !important;background:rgba(var(--f-rgb),.3) !important}
html.fun00s [class*=Popover__StyledPopoverContainer] input{background:transparent !important;border:1px solid rgba(var(--f-rgb),.5) !important}
html.fun00s [class*=Popover__StyledPopoverContainer] [data-button-use=primary]{background:var(--f-gel) !important}
html.fun00s [class*=Popover__StyledPopoverContainer] [data-button-use=primary] *{color:var(--f-on-gel) !important;text-shadow:none}
/* floating round buttons (scroll to top, hide/show the side panel): white by default, tagged from JS (see floaters()) */
html.fun00s [data-fun00s-fab]{background:var(--f-chrome) !important;border:1px solid #2b2e30 !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.8),0 2px 5px rgba(0,0,0,.7),0 0 8px var(--f-glow) !important}
html.fun00s [data-fun00s-fab] :is(svg,path){color:var(--f-ink) !important;fill:currentColor !important}
html.fun00s [data-fun00s-fab]:hover{filter:brightness(1.12)}
html.fun00s.s-pixel [data-fun00s-fab]{border:2px solid #000 !important;box-shadow:0 0 0 2px #58b858,3px 3px 0 2px #000 !important}
/* account menu: HubSpot gives it a plain white panel with no stable hook, so it is tagged from JS (see menus()) */
html.fun00s [data-fun00s-menu]{background:var(--f-lcd-bg) !important;border:2px solid !important;border-color:var(--f-inset-border) !important;box-shadow:0 10px 24px rgba(0,0,0,.75),0 0 0 1px var(--f-ring) !important}
html.fun00s [data-fun00s-menu] *{background-color:transparent !important;color:var(--f-lime) !important;font-family:var(--f-mono) !important;opacity:1 !important;text-shadow:0 0 4px var(--f-glow)}
html.fun00s [data-fun00s-menu] :is(a,button,[role=menuitem]):hover{background:rgba(var(--f-rgb),.16) !important}
html.fun00s [data-fun00s-menu] :is(a,button):hover *{color:var(--f-pale) !important}
html.fun00s [data-fun00s-menu] :is(hr,[role=separator]){border-color:rgba(var(--f-rgb),.3) !important;background:rgba(var(--f-rgb),.3) !important}
html.fun00s [data-fun00s-menu] :is(a,button) :is(svg,path){fill:currentColor}

/* ============ decorations (injected nodes) ============ */
html:not(.fun00s) .fun00s-deco{display:none !important}
.fun00s-deco{pointer-events:none}
.fun00s-screw{
  position:absolute;width:12px;height:12px;border-radius:50%;z-index:2;
  background:radial-gradient(circle at 35% 30%,#fff 0,#c9cdd0 30%,#6c7175 70%,#2c2f31 100%);
  box-shadow:0 1px 1px rgba(255,255,255,.6),inset 0 -1px 1px rgba(0,0,0,.5),0 0 0 1px rgba(0,0,0,.45);
}
.fun00s-screw::after{content:"";position:absolute;left:2px;right:2px;top:5px;height:2px;background:#33373a;border-radius:1px;transform:rotate(var(--r,35deg))}
.fun00s-screw.tl{top:6px;left:6px}.fun00s-screw.tr{top:6px;right:6px;--r:-20deg}
.fun00s-screw.bl{bottom:6px;left:6px;--r:80deg}.fun00s-screw.br{bottom:6px;right:6px}
.fun00s-grille{
  position:absolute;right:14px;top:9px;width:96px;height:26px;border-radius:4px;
  background:repeating-linear-gradient(90deg,#0a0b0c 0 4px,#8c9195 4px 5px,#3c4043 5px 8px);
  box-shadow:inset 0 2px 3px rgba(0,0,0,.9),0 1px 0 rgba(255,255,255,.5);
}
.fun00s-marquee{
  display:flex;align-items:center;height:32px;width:300px;margin-left:16px;flex:none;border-radius:16px;overflow:hidden;
  background:var(--f-lcd-bg);border:2px solid;border-color:var(--f-inset-border);box-shadow:inset 0 3px 8px #000;
  color:var(--f-lime);font:15px var(--f-mono);text-shadow:0 0 4px var(--f-glow);
}
html.fun00s #hs-global-toolbar .fun00s-marquee,html.fun00s #hs-global-toolbar .fun00s-marquee *{color:var(--f-lime) !important;font-family:var(--f-mono) !important}
html.fun00s #hs-global-toolbar .fun00s-marquee{margin-right:14px}
.fun00s-marquee .t{padding:0 10px;font-size:17px;border-right:1px solid rgba(var(--f-rgb),.35);height:100%;display:flex;align-items:center}
.fun00s-marquee .trk{position:relative;flex:1;height:100%;overflow:hidden}
.fun00s-marquee .trk span{position:absolute;top:50%;left:0;white-space:nowrap;animation:fun00s-marq 18s linear infinite}
@keyframes fun00s-marq{from{transform:translate(230px,-50%)}to{transform:translate(-100%,-50%)}}
.fun00s-eq{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:flex-end;gap:2px;
  width:240px;height:28px;padding:4px 8px;border-radius:6px;
  background:var(--f-lcd-bg);border:2px solid;border-color:var(--f-inset-border);box-shadow:inset 0 3px 8px #000;
}
.fun00s-eq i{flex:1;height:30%;background:linear-gradient(0deg,var(--f-lime) 0 60%,var(--f-eq-mid) 80%,#ff5a2a);box-shadow:0 0 4px var(--f-glow);animation:fun00s-eq 1.1s ease-in-out infinite alternate}
@keyframes fun00s-eq{0%{height:12%}100%{height:95%}}
@media (prefers-reduced-motion:reduce){.fun00s-eq i,.fun00s-marquee .trk span{animation:none}}
`;

  /* ------------------------------------------------------------------
   * Injection
   * ------------------------------------------------------------------ */
  function inject() {
    if (!document.getElementById('fun00s-css')) {
      const st = document.createElement('style');
      st.id = 'fun00s-css';
      st.textContent = CSS;
      (document.head || ROOT).appendChild(st);
    }
    if (!document.getElementById('fun00s-fonts') && document.head) {
      const l = document.createElement('link');
      l.id = 'fun00s-fonts';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@800&family=Press+Start+2P&family=VT323&display=swap';
      document.head.appendChild(l);
    }
  }

  const isIndex = () => /\/objects\/[^/]+\/views\//.test(location.pathname);
  const isRecord = () => /\/record\//.test(location.pathname);

  function applyClasses() {
    ROOT.classList.toggle('fun00s', isOn());
    const { skin, theme } = LOOKS[look()];
    for (const k of ['copper', 'storm']) ROOT.classList.toggle('f-' + k, theme === k);
    for (const k of ['biomech', 'pixel', 'winamp']) ROOT.classList.toggle('s-' + k, skin === k);
    ROOT.classList.toggle('f-index', isIndex());
    ROOT.classList.toggle('f-record', isRecord());
  }

  // The gray page background has no stable hook, so find it once from a known child and tag it.
  function stage() {
    if (document.querySelector('[data-fun00s-stage]')) return;
    let e = document.querySelector('[data-test-id=middle-pane], main');
    while (e && e !== document.body) {
      if (getComputedStyle(e).backgroundColor === 'rgb(240, 240, 240)') { e.setAttribute('data-fun00s-stage', ''); return; }
      e = e.parentElement;
    }
  }

  /* ------------------------------------------------------------------
   * Decorations — idempotent; re-run whenever React re-renders
   * ------------------------------------------------------------------ */
  const el = (tag, cls, html = '') => { const e = document.createElement(tag); e.className = 'fun00s-deco ' + cls; e.innerHTML = html; return e; };
  const has = (parent, cls) => parent.querySelector(':scope > .' + cls);

  function screws(host) {
    if (!host || has(host, 'fun00s-screw')) return;
    for (const p of ['tl', 'tr', 'bl', 'br']) host.appendChild(el('i', 'fun00s-screw ' + p));
  }

  function grille() {
    const logo = document.querySelector('[class*=GlobalToolbarSprocket__StyledLogoContainer]');
    if (logo && !has(logo, 'fun00s-grille')) logo.appendChild(el('div', 'fun00s-grille'));
  }

  function marquee() {
    const anchor = document.querySelector('[class*=GlobalToolbar__QuickCreateWrapper]');
    const wrap = anchor && anchor.parentElement;
    if (!wrap || has(wrap, 'fun00s-marquee')) return;
    anchor.after(el('div', 'fun00s-marquee', '<div class="t">--:--</div><div class="trk"><span></span></div>'));
    tickMarquee();
  }

  function tickMarquee() {
    const m = document.querySelector('.fun00s-marquee');
    if (!m) return;
    const now = new Date();
    m.querySelector('.t').textContent = now.toTimeString().slice(0, 5);
    const title = (document.title || 'HubSpot').split('|').map(s => s.trim()).filter(Boolean).join(' · ');
    const rows = document.querySelectorAll('[data-test-id=framework-data-table] tbody tr').length;
    const text = `★ NOW VIEWING: ${title.toUpperCase()}${rows ? ` · ${rows} RECORDS` : ''} · 128 KBPS · STEREO ★`;
    const span = m.querySelector('.trk span');
    if (span.textContent !== text) span.textContent = text;
  }

  function eq() {
    const footer = document.querySelector('[data-test-id=viz-sync-footer]');
    if (!footer || has(footer, 'fun00s-eq')) return;
    const box = el('div', 'fun00s-eq');
    for (let i = 0; i < 28; i++) {
      const b = document.createElement('i');
      b.style.animationDuration = (0.35 + Math.random() * 0.9).toFixed(2) + 's';
      b.style.animationDelay = (-Math.random() * 1.2).toFixed(2) + 's';
      box.appendChild(b);
    }
    footer.appendChild(box);
  }

  // "now playing" row — remembered by row test-id so it survives re-renders
  let playingId = null;
  function nowPlaying() {
    const rows = document.querySelectorAll('[data-test-id=framework-data-table] tbody tr');
    if (!rows.length) return;
    let target = playingId && document.querySelector(`[data-test-id=framework-data-table] tbody tr[data-test-id="${CSS_escape(playingId)}"]`);
    if (!target) target = rows[0];
    rows.forEach(r => { if (r !== target && r.hasAttribute('data-fun00s-playing')) r.removeAttribute('data-fun00s-playing'); });
    if (!target.hasAttribute('data-fun00s-playing')) target.setAttribute('data-fun00s-playing', '');
  }
  const CSS_escape = s => (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/"/g, '\\"');

  document.addEventListener('click', e => {
    const tr = e.target.closest && e.target.closest('[data-test-id=framework-data-table] tbody tr');
    if (!tr) return;
    playingId = tr.getAttribute('data-test-id');
    nowPlaying();
  }, true);

  // The account menu is a plain white panel with no stable hook: find it through its preferences link
  // and tag the outermost white ancestor that is still menu-sized.
  function menus() {
    for (const a of document.querySelectorAll('a[href*="user-preferences"]:not([data-fun00s-m])')) {
      a.setAttribute('data-fun00s-m', '');
      let best = null;
      for (let e = a, i = 0; e && e !== document.body && i < 14; e = e.parentElement, i++) {
        if (e.getBoundingClientRect().width > 600) break;
        if (getComputedStyle(e).backgroundColor === 'rgb(255, 255, 255)') best = e;
      }
      if (best) best.setAttribute('data-fun00s-menu', '');
    }
  }

  // Floating icon buttons (scroll to top, hide right panel) have no stable hook either: tag small, text-less,
  // white, absolutely/fixed positioned buttons once.
  function floaters() {
    for (const b of document.querySelectorAll('button:not([data-fun00s-f])')) {
      const r = b.getBoundingClientRect();
      if (!r.width) continue;                                   // not laid out yet: look again next pass
      b.setAttribute('data-fun00s-f', '');
      if (b.textContent.trim() || !b.querySelector('svg') || r.width < 18 || r.width > 60 || r.height < 18 || r.height > 60) continue;
      let floating = false;
      for (let e = b, i = 0; e && e !== document.body && i < 3; e = e.parentElement, i++) {
        const cs = getComputedStyle(e);
        floating = floating || /^(fixed|absolute|sticky)$/.test(cs.position);
        if (floating && cs.backgroundColor === 'rgb(255, 255, 255)' && e.getBoundingClientRect().width <= 60) { e.setAttribute('data-fun00s-fab', ''); break; }
      }
    }
  }

  function decorate() {
    applyClasses();
    if (!isOn()) return;
    inject();
    grille();
    marquee();
    stage();
    menus();
    floaters();
    if (isIndex()) {
      screws(document.querySelector('main'));
      eq();
      nowPlaying();
    }
  }

  /* ------------------------------------------------------------------
   * Boot + keep alive across SPA navigation / React re-renders
   * ------------------------------------------------------------------ */
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; decorate(); });
  };

  inject();
  applyClasses();
  const boot = () => {
    decorate();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    // HubSpot rewrites <html class="…"> during boot, wiping our classes — watch for that too.
    new MutationObserver(() => {
      if (isOn() && !ROOT.classList.contains('fun00s')) schedule();
    }).observe(ROOT, { attributes: true, attributeFilter: ['class'] });
    setInterval(tickMarquee, 1000);
  };
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);

  // Alt+Shift+Y toggles the skin, Alt+Shift+T cycles through the looks
  document.addEventListener('keydown', e => {
    if (!e.altKey || !e.shiftKey) return;
    if (e.code === 'KeyY') {
      try { localStorage.setItem(STORE_KEY, isOn() ? '0' : '1'); } catch {}
      decorate();
    } else if (e.code === 'KeyT') {
      const ids = Object.keys(LOOKS);
      try { localStorage.setItem(THEME_KEY, ids[(ids.indexOf(look()) + 1) % ids.length]); } catch {}
      decorate();
    }
  });
})();

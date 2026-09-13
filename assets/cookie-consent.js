(function () {
  var STORAGE_KEY = 'jarana_cookie_consent';

  function getStoredConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setStoredConsent(analyticsGranted) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: analyticsGranted, ts: Date.now() }));
    } catch (e) {}
  }

  function updateConsent(analyticsGranted) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('consent', 'update', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied'
    });
  }

  function injectStyle() {
    if (document.getElementById('cookie-consent-style')) return;
    var style = document.createElement('style');
    style.id = 'cookie-consent-style';
    style.textContent =
      '#cookie-consent-banner{position:fixed;left:0;right:0;bottom:0;z-index:1000;' +
      'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;' +
      'padding:22px 32px;background:var(--black,#0a0a0a);border-top:1px solid var(--gray-border,#3a3a3a);' +
      'font-family:"DM Sans",sans-serif;color:var(--white,#f2f0eb);' +
      'transform:translateY(100%);opacity:0;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.4s ease;}' +
      '#cookie-consent-banner.visible{transform:translateY(0);opacity:1;}' +
      '#cookie-consent-banner .cc-text{margin:0;max-width:560px;font-size:14px;line-height:1.6;color:rgba(242,240,235,0.75);}' +
      '#cookie-consent-banner .cc-link{color:var(--white,#f2f0eb);text-decoration:underline;text-underline-offset:2px;}' +
      '#cookie-consent-banner .cc-actions{display:flex;gap:12px;flex-wrap:wrap;flex-shrink:0;}' +
      '#cookie-consent-banner button.cc-btn{font-family:inherit;font-size:12px;font-weight:700;letter-spacing:0.5px;' +
      'text-transform:lowercase;padding:10px 22px;border-radius:30px;cursor:pointer;border:1px solid var(--gray-border,#3a3a3a);' +
      'background:transparent;color:var(--white,#f2f0eb);transition:opacity 0.2s ease;}' +
      '#cookie-consent-banner button.cc-btn:hover{opacity:0.75;}' +
      '#cookie-consent-banner button.cc-accept{background:var(--white,#f2f0eb);color:var(--black,#0a0a0a);border-color:var(--white,#f2f0eb);}' +
      '#cookie-consent-banner .cc-panel{width:100%;display:flex;flex-direction:column;gap:18px;}' +
      '#cookie-consent-banner .cc-option{display:flex;align-items:center;justify-content:space-between;gap:20px;' +
      'padding:14px 0;border-top:1px solid var(--gray-border,#3a3a3a);}' +
      '#cookie-consent-banner .cc-option:first-child{border-top:none;}' +
      '#cookie-consent-banner .cc-option strong{display:block;font-size:13px;text-transform:lowercase;margin-bottom:4px;}' +
      '#cookie-consent-banner .cc-option p{margin:0;font-size:13px;line-height:1.5;color:rgba(242,240,235,0.5);}' +
      '#cookie-consent-banner .cc-toggle{position:relative;flex-shrink:0;width:42px;height:24px;border-radius:30px;' +
      'border:1px solid var(--gray-border,#3a3a3a);background:transparent;cursor:pointer;padding:0;}' +
      '#cookie-consent-banner .cc-toggle::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;' +
      'border-radius:50%;background:rgba(242,240,235,0.5);transition:transform 0.2s ease,background 0.2s ease;}' +
      '#cookie-consent-banner .cc-toggle.on{border-color:var(--white,#f2f0eb);}' +
      '#cookie-consent-banner .cc-toggle.on::after{transform:translateX(18px);background:var(--white,#f2f0eb);}' +
      '#cookie-consent-banner .cc-toggle.cc-toggle-locked{opacity:0.5;cursor:not-allowed;}' +
      '#cookie-consent-banner .cc-panel-actions{display:flex;justify-content:flex-end;}' +
      '@media (max-width:640px){#cookie-consent-banner{padding:20px 24px;}' +
      '#cookie-consent-banner .cc-actions{width:100%;}#cookie-consent-banner .cc-actions button{flex:1;}}' +
      '.footer-legal-link{color:inherit;text-decoration:underline;text-underline-offset:2px;}' +
      '.footer-legal-link:hover{color:var(--white,#f2f0eb);}' +
      'button.footer-legal-link{background:none;border:none;padding:0;font:inherit;font-size:inherit;cursor:pointer;}';
    document.head.appendChild(style);
  }

  function buildBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<p class="cc-text">Usamos cookies necesarias para que la web funcione y, si lo aceptas, cookies analíticas ' +
      '(Google Analytics) para entender cómo se usa. <a href="/cookies/" class="cc-link">más información</a></p>' +
      '<div class="cc-actions" data-cc-main>' +
      '<button type="button" class="cc-btn cc-settings">configurar</button>' +
      '<button type="button" class="cc-btn cc-reject">rechazar</button>' +
      '<button type="button" class="cc-btn cc-accept">aceptar</button>' +
      '</div>' +
      '<div class="cc-panel" data-cc-panel style="display:none">' +
      '<div class="cc-option">' +
      '<div><strong>necesarias</strong><p>Imprescindibles para que la web funcione. Siempre activas.</p></div>' +
      '<span class="cc-toggle on cc-toggle-locked" aria-disabled="true"></span>' +
      '</div>' +
      '<div class="cc-option">' +
      '<div><strong>analíticas</strong><p>Google Analytics, para saber qué páginas se visitan más.</p></div>' +
      '<button type="button" class="cc-toggle" data-cc-analytics-toggle role="switch" aria-checked="false"></button>' +
      '</div>' +
      '<div class="cc-panel-actions"><button type="button" class="cc-btn cc-accept cc-save">guardar preferencias</button></div>' +
      '</div>';
    document.body.appendChild(banner);
    return banner;
  }

  function showBanner() {
    injectStyle();
    var existing = document.getElementById('cookie-consent-banner');
    var banner = existing || buildBanner();

    var mainActions = banner.querySelector('[data-cc-main]');
    var panel = banner.querySelector('[data-cc-panel]');
    var analyticsToggle = banner.querySelector('[data-cc-analytics-toggle]');
    var stored = getStoredConsent();
    var analyticsOn = !!(stored && stored.analytics);
    setToggleState(analyticsToggle, analyticsOn);

    mainActions.style.display = 'flex';
    panel.style.display = 'none';

    requestAnimationFrame(function () {
      banner.classList.add('visible');
    });

    function hideBanner() {
      banner.classList.remove('visible');
      setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 400);
    }

    function setToggleState(toggle, on) {
      toggle.classList.toggle('on', on);
      toggle.setAttribute('aria-checked', on ? 'true' : 'false');
    }

    banner.querySelector('.cc-settings').onclick = function () {
      mainActions.style.display = 'none';
      panel.style.display = 'flex';
    };

    banner.querySelector('.cc-reject').onclick = function () {
      setStoredConsent(false);
      updateConsent(false);
      hideBanner();
    };

    banner.querySelector('.cc-accept:not(.cc-save)').onclick = function () {
      setStoredConsent(true);
      updateConsent(true);
      hideBanner();
    };

    analyticsToggle.onclick = function () {
      setToggleState(analyticsToggle, !analyticsToggle.classList.contains('on'));
    };

    banner.querySelector('.cc-save').onclick = function () {
      var granted = analyticsToggle.classList.contains('on');
      setStoredConsent(granted);
      updateConsent(granted);
      hideBanner();
    };
  }

  window.openCookiePreferences = showBanner;

  document.addEventListener('DOMContentLoaded', function () {
    injectStyle();
    if (!getStoredConsent()) showBanner();
  });
})();

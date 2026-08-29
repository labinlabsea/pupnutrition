(function () {
  var STORAGE_KEY = 'pupnutrition-lang';
  var DEFAULT_LANG = 'zh-TW';
  var HTML_LANG = { 'zh-TW': 'zh-Hant', 'en-US': 'en' };

  function getSavedLang() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'zh-TW' || saved === 'en-US') return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function saveLang(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function applyLang(lang) {
    var dict = (window.PUPNUTRITION_I18N && window.PUPNUTRITION_I18N[lang]) || {};

    document.documentElement.setAttribute('lang', HTML_LANG[lang] || 'zh-Hant');

    var textNodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textNodes.length; i++) {
      var el = textNodes[i];
      var key = el.getAttribute('data-i18n');
      if (Object.prototype.hasOwnProperty.call(dict, key)) el.textContent = dict[key];
    }

    var htmlNodes = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlNodes.length; j++) {
      var el2 = htmlNodes[j];
      var key2 = el2.getAttribute('data-i18n-html');
      if (Object.prototype.hasOwnProperty.call(dict, key2)) el2.innerHTML = dict[key2];
    }

    var buttons = document.querySelectorAll('[data-lang-btn]');
    for (var k = 0; k < buttons.length; k++) {
      var btn = buttons[k];
      var isActive = btn.getAttribute('data-lang-btn') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  }

  function setLang(lang) {
    saveLang(lang);
    applyLang(lang);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(getSavedLang());

    var buttons = document.querySelectorAll('[data-lang-btn]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        setLang(this.getAttribute('data-lang-btn'));
      });
    }
  });
})();

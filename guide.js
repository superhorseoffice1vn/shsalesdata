/* SalesData user guides — language switch, contents list, back-to-app link */
(function () {
  var html = document.documentElement;
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var q = new URLSearchParams(location.search);
  var lang = q.get('lang') || get('sd_guide_lang') || html.getAttribute('data-default-lang') || 'vi';
  if (lang !== 'vi' && lang !== 'en') lang = 'vi';

  function buildToc() {
    var heads = document.querySelectorAll('main section > h2[id]');
    var links = Array.prototype.map.call(heads, function (h) {
      var txt = (h.querySelector('.' + lang) || h).textContent.trim();
      return '<a href="#' + h.id + '">' + txt.replace(/</g, '&lt;') + '</a>';
    }).join('');
    var t = document.getElementById('toc'), m = document.getElementById('mtoc');
    if (t) t.innerHTML = '<b>' + (lang === 'vi' ? 'Nội dung' : 'Contents') + '</b>' + links;
    if (m) m.innerHTML = '<summary>' + (lang === 'vi' ? 'Nội dung' : 'Contents') + '</summary>' + links;
  }
  function apply() {
    html.lang = lang;
    var b = document.getElementById('langBtn');
    if (b) b.textContent = lang === 'vi' ? 'English' : 'Tiếng Việt';
    var tt = document.querySelector('title[data-vi]');
    if (tt) document.title = tt.getAttribute('data-' + lang);
    buildToc();
  }
  document.addEventListener('DOMContentLoaded', function () {
    apply();
    var b = document.getElementById('langBtn');
    if (b) b.onclick = function () { lang = lang === 'vi' ? 'en' : 'vi'; set('sd_guide_lang', lang); apply(); };
    // "Back to app" when opened from inside an app
    var back = document.getElementById('backBtn');
    if (back && q.get('from') === 'app') back.style.display = '';
    // FAQ open/close all
    document.querySelectorAll('[data-faq]').forEach(function (btn) {
      btn.onclick = function () {
        var open = btn.getAttribute('data-faq') === 'open';
        btn.closest('section').querySelectorAll('details.q').forEach(function (d) { d.open = open; });
      };
    });
    // highlight current section in contents
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          document.querySelectorAll('#toc a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      document.querySelectorAll('main section > h2[id]').forEach(function (h) { io.observe(h); });
    }
    // close the mobile contents after a tap
    var m = document.getElementById('mtoc');
    if (m) m.addEventListener('click', function (e) { if (e.target.tagName === 'A') m.open = false; });
  });
})();

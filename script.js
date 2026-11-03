// Theme toggle. The initial theme is set inline in <head> before first paint;
// this only handles clicks, remembers the choice, and follows the system
// setting until the visitor picks one.
(function () {
  var root = document.documentElement;
  var button = document.querySelector('.theme-toggle');
  var system = window.matchMedia('(prefers-color-scheme: light)');

  function apply(theme) {
    root.dataset.theme = theme;
    button.setAttribute('aria-label', theme === 'dark' ? button.dataset.labelLight : button.dataset.labelDark);
  }

  function saved() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  apply(root.dataset.theme === 'light' ? 'light' : 'dark');

  button.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch (e) {}
    apply(next);
  });

  system.addEventListener('change', function (e) {
    if (!saved()) apply(e.matches ? 'light' : 'dark');
  });
})();

(function () {
  var canvas = document.querySelector('.starfield');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var vw = 0, vh = 0;
  var layers = [];
  var rafId = null;

  var LAYER_SPECS = [
    { count: 70, speed: 0.02, r: [0.5, 1.2], alpha: [0.25, 0.55] },
    { count: 45, speed: 0.05, r: [0.9, 1.6], alpha: [0.35, 0.7] },
    { count: 22, speed: 0.10, r: [1.3, 2.1], alpha: [0.45, 0.85] }
  ];

  function rand(min, max) { return min + Math.random() * (max - min); }
  function mod(n, m) { return ((n % m) + m) % m; }

  function buildStars() {
    layers = LAYER_SPECS.map(function (spec) {
      var stars = [];
      for (var i = 0; i < spec.count; i++) {
        stars.push({
          x: Math.random() * vw,
          y: Math.random() * vh,
          r: rand(spec.r[0], spec.r[1]),
          baseAlpha: rand(spec.alpha[0], spec.alpha[1]),
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: rand(0.4, 1.1)
        });
      }
      return { speed: spec.speed, stars: stars };
    });
  }

  function resize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = vw * dpr;
    canvas.height = vh * dpr;
    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
    if (reduceMotion) draw(0, 0);
  }

  function draw(time, scrollY) {
    ctx.clearRect(0, 0, vw, vh);
    layers.forEach(function (layer) {
      var offset = scrollY * layer.speed;
      layer.stars.forEach(function (star) {
        var y = mod(star.y - offset, vh);
        var alpha = star.baseAlpha;
        if (!reduceMotion) {
          alpha = star.baseAlpha * (0.5 + 0.5 * Math.sin(time * 0.001 * star.twinkleSpeed + star.phase));
        }
        ctx.beginPath();
        ctx.arc(star.x, y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, alpha).toFixed(3) + ')';
        ctx.fill();
      });
    });
  }

  function loop(time) {
    draw(time, window.scrollY || window.pageYOffset || 0);
    rafId = requestAnimationFrame(loop);
  }
  function start() { if (!rafId) rafId = requestAnimationFrame(loop); }
  function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () {
    if (reduceMotion) return;
    if (document.hidden) stop(); else start();
  });

  resize();
  if (!reduceMotion) start();
})();

(function () {
  'use strict';

  var el = document.querySelector('.hero-tagline');
  if (!el) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var taglines;
  try {
    taglines = JSON.parse(el.getAttribute('data-taglines') || '[]');
  } catch (e) {
    return;
  }
  if (!Array.isArray(taglines) || taglines.length < 2) return;

  var textEl = el.querySelector('.hero-tagline-text');
  if (!textEl) return;

  var TYPE_MS = 55;
  var DELETE_MS = 30;
  var HOLD_FULL_MS = 2200;
  var HOLD_EMPTY_MS = 400;

  var idx = 0;
  var current = taglines[0] || '';
  var pos = current.length;
  textEl.textContent = current;
  var deleting = true;
  var nextAt = performance.now() + HOLD_FULL_MS;
  var paused = false;

  function tick(now) {
    if (paused) {
      requestAnimationFrame(tick);
      return;
    }
    if (now < nextAt) {
      requestAnimationFrame(tick);
      return;
    }
    if (deleting) {
      pos -= 1;
      textEl.textContent = current.slice(0, pos);
      if (pos <= 0) {
        deleting = false;
        idx = (idx + 1) % taglines.length;
        current = taglines[idx];
        pos = 0;
        nextAt = now + HOLD_EMPTY_MS;
      } else {
        nextAt = now + DELETE_MS;
      }
    } else {
      pos += 1;
      textEl.textContent = current.slice(0, pos);
      if (pos >= current.length) {
        deleting = true;
        nextAt = now + HOLD_FULL_MS;
      } else {
        nextAt = now + TYPE_MS;
      }
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', function () {
    paused = document.visibilityState === 'hidden';
    if (!paused) nextAt = performance.now();
  });

  requestAnimationFrame(tick);
})();

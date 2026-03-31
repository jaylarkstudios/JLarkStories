document.addEventListener('DOMContentLoaded', function () {
  var nav = resolveNavLinks();
  if (!nav.prev && !nav.next) return;

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (document.activeElement.isContentEditable) return;

    var overlay = document.querySelector('.lightbox-overlay');
    if (overlay && overlay.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
      navigateTo(nav.prev, nav.prevEl);
    } else if (e.key === 'ArrowRight') {
      navigateTo(nav.next, nav.nextEl);
    }
  });

  // Swipe navigation
  var touchStartX = 0;
  var touchStartY = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var dx = touchStartX - e.changedTouches[0].screenX;
    var dy = touchStartY - e.changedTouches[0].screenY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        navigateTo(nav.next, nav.nextEl);
      } else {
        navigateTo(nav.prev, nav.prevEl);
      }
    }
  }, { passive: true });

  function resolveNavLinks() {
    // Priority 1: post-nav (chronological section nav on single pages)
    var postPrev = document.querySelector('a.post-nav-prev');
    var postNext = document.querySelector('a.post-nav-next');
    if (postPrev || postNext) {
      return { prev: postPrev && postPrev.href, next: postNext && postNext.href, prevEl: postPrev, nextEl: postNext };
    }

    // Priority 2: pagination (list pages — disabled state uses <span>, not <a>)
    var pagePrev = document.querySelector('a.pagination-prev');
    var pageNext = document.querySelector('a.pagination-next');
    if (pagePrev || pageNext) {
      return { prev: pagePrev && pagePrev.href, next: pageNext && pageNext.href, prevEl: pagePrev, nextEl: pageNext };
    }

    return { prev: null, next: null, prevEl: null, nextEl: null };
  }

  function navigateTo(url, el) {
    if (!url) return;
    if (el) {
      el.classList.add('nav-flash');
    }
    setTimeout(function () {
      window.location.href = url;
    }, 150);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.getElementById('gallery-carousel');
  if (!carousel) return;

  var track = carousel.querySelector('.carousel-track');
  var slides = carousel.querySelectorAll('.carousel-slide');
  var prevBtn = carousel.querySelector('.carousel-prev');
  var nextBtn = carousel.querySelector('.carousel-next');
  var dotsContainer = carousel.querySelector('.carousel-dots');

  if (slides.length === 0) return;

  var current = 0;
  var autoInterval = null;
  var autoDelay = 5000;

  // Build dot indicators
  for (var i = 0; i < slides.length; i++) {
    var dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  }

  var dots = dotsContainer.querySelectorAll('.carousel-dot');

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('active', i === current);
    }
  }

  function nextSlide() {
    showSlide(current + 1);
  }

  function prevSlide() {
    showSlide(current - 1);
  }

  // Button handlers
  prevBtn.addEventListener('click', function () {
    prevSlide();
    resetAuto();
  });

  nextBtn.addEventListener('click', function () {
    nextSlide();
    resetAuto();
  });

  // Dot handlers
  dotsContainer.addEventListener('click', function (e) {
    var dot = e.target.closest('.carousel-dot');
    if (dot) {
      showSlide(parseInt(dot.dataset.index, 10));
      resetAuto();
    }
  });

  // Auto-advance
  function startAuto() {
    autoInterval = setInterval(nextSlide, autoDelay);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Touch/swipe support
  var touchStartX = 0;
  var touchEndX = 0;

  carousel.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAuto();
    }
  }, { passive: true });

  // Keyboard navigation
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAuto();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAuto();
    }
  });

  // Start
  startAuto();
});

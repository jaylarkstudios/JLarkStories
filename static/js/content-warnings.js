document.addEventListener('DOMContentLoaded', function() {
  var hideableGroups = window.__HIDEABLE_TAGS__;
  if (!hideableGroups || !hideableGroups.length) return;

  var STORAGE_KEY = 'jls-hidden-tags';
  var SEEN_KEY = 'jls-prefs-seen';

  function getHiddenLabels() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch(e) { return []; }
  }

  function saveHiddenLabels(labels) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
    } catch(e) {}
  }

  function getHiddenTagSet() {
    var hiddenLabels = getHiddenLabels();
    var tagSet = {};
    hideableGroups.forEach(function(group) {
      if (hiddenLabels.indexOf(group.label) !== -1) {
        group.tags.forEach(function(tag) {
          tagSet[tag.toLowerCase()] = true;
        });
      }
    });
    return tagSet;
  }

  function getMatchingLabels(postTags) {
    var hiddenLabels = getHiddenLabels();
    var matches = [];
    hideableGroups.forEach(function(group) {
      if (hiddenLabels.indexOf(group.label) === -1) return;
      var hasMatch = group.tags.some(function(tag) {
        return postTags.indexOf(tag.toLowerCase()) !== -1;
      });
      if (hasMatch) matches.push(group.label);
    });
    return matches;
  }

  function parseTags(el) {
    var raw = el.getAttribute('data-tags');
    if (!raw) return [];
    return raw.split(',').map(function(t) { return t.trim().toLowerCase(); });
  }

  function shouldHide(el) {
    var tags = parseTags(el);
    if (!tags.length || (tags.length === 1 && tags[0] === '')) return false;
    var hiddenTags = getHiddenTagSet();
    return tags.some(function(t) { return hiddenTags[t]; });
  }

  function wrapImageWithBlur(img, matchingLabels) {
    if (img.closest('.cw-blur-wrapper')) return;

    var insideLink = !!img.closest('a');

    var wrapper = document.createElement('div');
    wrapper.className = 'cw-blur-wrapper cw-active';
    if (!insideLink) {
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('aria-label', 'Hidden content: ' + matchingLabels.join(', ') + '. Press to reveal.');
    }

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    var overlay = document.createElement('div');
    overlay.className = 'cw-overlay';
    overlay.innerHTML =
      '<span class="cw-overlay-icon">&#128065;&#xFE0E;</span>' +
      '<span class="cw-overlay-text">Hidden (' + matchingLabels.join(', ') + ')</span>' +
      (insideLink ? '' : '<span class="cw-overlay-action">Click to view</span>');
    wrapper.appendChild(overlay);

    if (insideLink) return;

    function reveal(e) {
      e.preventDefault();
      e.stopPropagation();
      wrapper.classList.remove('cw-active');
      wrapper.removeAttribute('role');
      wrapper.removeAttribute('tabindex');
      wrapper.removeAttribute('aria-label');
    }

    wrapper.addEventListener('click', reveal);
    wrapper.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        reveal(e);
      }
    });
  }

  // Apply hiding to post card thumbnails
  function processPostCards() {
    document.querySelectorAll('.post-card[data-tags]').forEach(function(card) {
      if (!shouldHide(card)) return;
      var matchingLabels = getMatchingLabels(parseTags(card));
      var img = card.querySelector('.post-card-thumbnail img');
      if (img) wrapImageWithBlur(img, matchingLabels);
    });
    document.querySelectorAll('.post-grid-card[data-tags]').forEach(function(card) {
      if (!shouldHide(card)) return;
      var matchingLabels = getMatchingLabels(parseTags(card));
      var img = card.querySelector('.post-grid-card-thumb img');
      if (img) wrapImageWithBlur(img, matchingLabels);
    });
    document.querySelectorAll('.featured-spread-large[data-tags], .featured-spread-small[data-tags]').forEach(function(card) {
      if (!shouldHide(card)) return;
      var matchingLabels = getMatchingLabels(parseTags(card));
      var img = card.querySelector('.featured-spread-thumb img');
      if (img) wrapImageWithBlur(img, matchingLabels);
    });
  }

  // Apply hiding to blog single page images
  function processBlogSingle() {
    var article = document.querySelector('.blog-single[data-tags]');
    if (!article || !shouldHide(article)) return;
    var matchingLabels = getMatchingLabels(parseTags(article));

    var thumbnail = article.querySelector('.blog-single-thumbnail');
    if (thumbnail) wrapImageWithBlur(thumbnail, matchingLabels);

    article.querySelectorAll('.blog-single-content img').forEach(function(img) {
      wrapImageWithBlur(img, matchingLabels);
    });
  }

  // Preferences modal
  function initModal() {
    var modal = document.getElementById('prefs-modal');
    var openBtn = document.getElementById('open-prefs-modal');
    var closeBtn = modal ? modal.querySelector('.prefs-modal-close') : null;
    var saveBtn = document.getElementById('prefs-save');
    var optionsContainer = document.getElementById('prefs-options');

    if (!modal || !openBtn || !optionsContainer) return;

    var hiddenLabels = getHiddenLabels();
    hideableGroups.forEach(function(group) {
      var label = document.createElement('label');
      label.className = 'prefs-checkbox-label';

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'prefs-checkbox';
      checkbox.value = group.label;
      checkbox.checked = hiddenLabels.indexOf(group.label) !== -1;

      var text = document.createElement('span');
      text.className = 'prefs-label-text';
      text.textContent = group.label;

      var toggleWrap = document.createElement('span');
      toggleWrap.className = 'prefs-toggle-wrap';

      var toggleText = document.createElement('span');
      toggleText.className = 'prefs-toggle-text';
      toggleText.textContent = checkbox.checked ? 'Hide' : 'Show';

      var toggle = document.createElement('span');
      toggle.className = 'prefs-toggle';

      toggleWrap.appendChild(toggleText);
      toggleWrap.appendChild(toggle);

      var desc = document.createElement('span');
      desc.className = 'prefs-description';
      desc.textContent = group.description || '';

      checkbox.addEventListener('change', function() {
        toggleText.textContent = this.checked ? 'Hide' : 'Show';
      });

      label.appendChild(checkbox);
      label.appendChild(text);
      label.appendChild(toggleWrap);
      label.appendChild(desc);
      optionsContainer.appendChild(label);
    });

    function openModal() {
      modal.hidden = false;
      var firstFocusable = modal.querySelector('input, button');
      if (firstFocusable) firstFocusable.focus();
      document.body.style.overflow = 'hidden';
    }

    var openedByButton = false;

    function dismissModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (openedByButton) openBtn.focus();
      openedByButton = false;
      try { localStorage.setItem(SEEN_KEY, '1'); } catch(e) {}
    }

    openBtn.addEventListener('click', function() {
      openedByButton = true;
      openModal();
    });
    if (closeBtn) closeBtn.addEventListener('click', dismissModal);

    modal.addEventListener('click', function(e) {
      if (e.target === modal) dismissModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !modal.hidden) {
        dismissModal();
      }
    });

    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        var checked = [];
        optionsContainer.querySelectorAll('.prefs-checkbox:checked').forEach(function(cb) {
          checked.push(cb.value);
        });
        saveHiddenLabels(checked);
        dismissModal();
        window.location.reload();
      });
    }

    // Show preferences banner for first-time visitors
    var banner = document.getElementById('prefs-banner');
    var bannerOpenBtn = document.getElementById('prefs-banner-open');
    var bannerCloseBtn = document.getElementById('prefs-banner-close');

    function dismissBanner() {
      if (banner) banner.hidden = true;
      try { localStorage.setItem(SEEN_KEY, '1'); } catch(e) {}
    }

    if (banner && bannerOpenBtn && bannerCloseBtn) {
      try {
        if (!localStorage.getItem(SEEN_KEY)) {
          banner.hidden = false;
        }
      } catch(e) {}

      bannerOpenBtn.addEventListener('click', function() {
        dismissBanner();
        openModal();
      });

      bannerCloseBtn.addEventListener('click', dismissBanner);
    }
  }

  processPostCards();
  processBlogSingle();
  initModal();
});

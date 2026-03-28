document.addEventListener('DOMContentLoaded', function () {
  // --- Search ---
  // --- Random Post ---
  document.querySelectorAll('.random-post-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        var urls = JSON.parse(link.getAttribute('data-urls'));
        if (urls && urls.length) {
          window.location.href = urls[Math.floor(Math.random() * urls.length)];
        }
      } catch (err) {}
    });
  });

  // --- Search ---
  var input = document.querySelector('.search-input');
  var resultsContainer = document.querySelector('.search-results');
  if (!input || !resultsContainer) return;

  var index = null;

  function loadIndex() {
    if (index) return Promise.resolve(index);
    return fetch('/index.json')
      .then(function (res) { return res.json(); })
      .then(function (data) { index = data; return data; });
  }

  function search(query) {
    if (!index || !query) return [];
    var q = query.toLowerCase();
    var terms = q.split(/\s+/).filter(Boolean);
    return index.filter(function (item) {
      var title = (item.title || '').toLowerCase();
      var summary = (item.summary || '').toLowerCase();
      var tags = (item.tags || []).join(' ').toLowerCase();
      var text = title + ' ' + summary + ' ' + tags;
      return terms.every(function (t) { return text.indexOf(t) !== -1; });
    }).slice(0, 10);
  }

  function renderResults(results, query) {
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
      resultsContainer.classList.add('active');
      return;
    }
    resultsContainer.innerHTML = results.map(function (item) {
      var tags = (item.tags || []).join(', ');
      return '<a href="' + item.url + '" class="search-result-item">' +
        '<span class="search-result-title">' + escapeHtml(item.title) + '</span>' +
        (tags ? '<span class="search-result-tags">' + escapeHtml(tags) + '</span>' : '') +
        '</a>';
    }).join('');
    resultsContainer.classList.add('active');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function closeResults() {
    resultsContainer.classList.remove('active');
    resultsContainer.innerHTML = '';
  }

  var debounceTimer;
  input.addEventListener('input', function () {
    var query = input.value.trim();
    clearTimeout(debounceTimer);
    if (!query) { closeResults(); return; }
    debounceTimer = setTimeout(function () {
      loadIndex().then(function () {
        var results = search(query);
        renderResults(results, query);
      });
    }, 200);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeResults();
      input.blur();
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-wrapper')) {
      closeResults();
    }
  });

});

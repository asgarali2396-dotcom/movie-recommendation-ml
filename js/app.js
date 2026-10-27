/**
 * CineMatch ML - Application Controller
 * Handles user interactions, reactive UI state, modal transitions, and recommendation rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    selectedGenres: new Set(["Action", "Sci-Fi"]),
    duration: "Medium",
    targetMins: 115,
    minRating: 7.5,
    extras: {
      language: "All",
      era: "All",
      vibe: "All",
      query: ""
    },
    activeTab: "matcher",
    currentModalMovie: null,
    deferredInstallPrompt: null
  };

  // DOM Elements References
  const elements = {
    // Navigation
    navPills: document.querySelectorAll('.nav-pill'),
    views: {
      matcher: document.getElementById('view-matcher'),
      explorer: document.getElementById('view-explorer'),
      studio: document.getElementById('view-studio'),
      watchlist: document.getElementById('view-watchlist')
    },
    watchlistCountBadge: document.getElementById('nav-watchlist-count'),
    
    // Sound & PWA
    toggleSoundBtn: document.getElementById('toggle-sound-btn'),
    soundIcon: document.getElementById('sound-icon'),
    pwaInstallBtn: document.getElementById('pwa-install-btn'),

    // Auth Controls
    authGuestControls: document.getElementById('auth-guest-controls'),
    authUserControls: document.getElementById('auth-user-controls'),
    authUserBadge: document.getElementById('auth-user-badge'),
    openLoginBtn: document.getElementById('open-login-btn'),
    logoutBtn: document.getElementById('logout-btn'),

    // Auth Modal (Campus Fix Dual-Slider Engine)
    authModal: document.getElementById('auth-page-modal'),
    closeLoginBtn: document.getElementById('close-login-btn'),
    authSliderContainer: document.getElementById('auth-slider-container'),
    btnSwitchToAdmin: document.getElementById('btn-switch-to-admin'),
    btnSwitchToUser: document.getElementById('btn-switch-to-user'),
    authBurstEffect: document.getElementById('auth-burst-effect'),
    burstEmblemIcon: document.getElementById('burst-emblem-icon'),
    panelUserBox: document.getElementById('panel-user-box'),
    panelAdminBox: document.getElementById('panel-admin-box'),
    userLoginForm: document.getElementById('user-login-form'),
    adminLoginForm: document.getElementById('admin-login-form'),
    quickFillUserBtn: document.getElementById('quick-fill-user-btn'),
    quickFillAdminBtn: document.getElementById('quick-fill-admin-btn'),
    toggleUserPassBtn: document.getElementById('toggle-user-pass-btn'),
    toggleAdminPassBtn: document.getElementById('toggle-admin-pass-btn'),
    loginUserPassword: document.getElementById('login-user-password'),
    loginAdminPassword: document.getElementById('login-admin-password'),
    loginUserError: document.getElementById('login-user-error-msg'),
    loginAdminError: document.getElementById('login-admin-error-msg'),

    // Matcher Form Elements
    genreChipsContainer: document.getElementById('genre-chips-container'),
    btnSelectAllGenres: document.getElementById('btn-select-all-genres'),
    btnClearGenres: document.getElementById('btn-clear-genres'),
    durationCards: document.querySelectorAll('.duration-choice-card'),
    runtimeSlider: document.getElementById('runtime-slider'),
    runtimeDisplay: document.getElementById('runtime-display'),
    ratingSlider: document.getElementById('rating-slider'),
    ratingDisplay: document.getElementById('rating-display'),
    toggleAdvancedBtn: document.getElementById('toggle-advanced-params'),
    advancedDrawer: document.getElementById('advanced-params-drawer'),
    advancedChevron: document.getElementById('advanced-chevron'),
    filterLanguage: document.getElementById('filter-language'),
    filterEra: document.getElementById('filter-era'),
    filterVibe: document.getElementById('filter-vibe'),
    filterQuery: document.getElementById('filter-query'),
    btnRunRecommendation: document.getElementById('btn-run-recommendation'),
    recommendationsGrid: document.getElementById('recommendations-grid'),
    resultsCountBadge: document.getElementById('results-count-badge'),

    // Explorer Elements
    explorerGrid: document.getElementById('explorer-grid'),
    explorerSearchInput: document.getElementById('explorer-search-input'),
    explorerSortSelect: document.getElementById('explorer-sort-select'),

    // Model Studio Elements
    weightGenreSlider: document.getElementById('weight-genre-slider'),
    weightGenreVal: document.getElementById('weight-genre-val'),
    weightDurationSlider: document.getElementById('weight-duration-slider'),
    weightDurationVal: document.getElementById('weight-duration-val'),
    weightRatingSlider: document.getElementById('weight-rating-slider'),
    weightRatingVal: document.getElementById('weight-rating-val'),
    weightEnhancedSlider: document.getElementById('weight-enhanced-slider'),
    weightEnhancedVal: document.getElementById('weight-enhanced-val'),
    btnSaveWeights: document.getElementById('btn-save-weights'),
    btnResetWeights: document.getElementById('btn-reset-weights'),
    btnRunBenchmark: document.getElementById('btn-run-benchmark'),
    bmDatasetSize: document.getElementById('bm-dataset-size'),
    bmFitness: document.getElementById('bm-fitness'),
    bmTestCases: document.getElementById('bm-test-cases'),

    // Watchlist Elements
    watchlistGrid: document.getElementById('watchlist-grid'),

    // Movie Detail Modal
    movieModal: document.getElementById('movie-detail-modal'),
    btnCloseMovieModal: document.getElementById('btn-close-movie-modal'),
    btnModalDismiss: document.getElementById('btn-modal-dismiss'),
    modalMatchBadge: document.getElementById('modal-match-badge'),
    modalYearBadge: document.getElementById('modal-year-badge'),
    modalDurationBadge: document.getElementById('modal-duration-badge'),
    modalMovieTitle: document.getElementById('modal-movie-title'),
    modalDirector: document.getElementById('modal-director'),
    modalGenres: document.getElementById('modal-genres'),
    modalSynopsis: document.getElementById('modal-synopsis'),
    modalCast: document.getElementById('modal-cast'),
    modalXaiReasons: document.getElementById('modal-xai-reasons'),
    modalStreaming: document.getElementById('modal-streaming'),
    modalWatchlistToggleBtn: document.getElementById('modal-watchlist-toggle-btn'),
    modalWatchlistIcon: document.getElementById('modal-watchlist-icon'),
    modalWatchlistText: document.getElementById('modal-watchlist-text')
  };

  // ==============================================================
  // INITIALIZATION
  // ==============================================================

  function initApp() {
    // Restore sound preference
    updateSoundUI();

    // Restore weights if customized
    const savedWeights = window.appStorage.loadWeights();
    if (savedWeights) {
      window.mlEngine.setWeights(savedWeights);
      elements.weightGenreSlider.value = savedWeights.genre;
      elements.weightGenreVal.textContent = savedWeights.genre.toFixed(2);
      elements.weightDurationSlider.value = savedWeights.duration;
      elements.weightDurationVal.textContent = savedWeights.duration.toFixed(2);
      elements.weightRatingSlider.value = savedWeights.rating;
      elements.weightRatingVal.textContent = savedWeights.rating.toFixed(2);
      elements.weightEnhancedSlider.value = savedWeights.enhanced;
      elements.weightEnhancedVal.textContent = savedWeights.enhanced.toFixed(2);
    }

    // Restore User Preferences if saved
    const savedPrefs = window.appStorage.loadUserPrefs();
    if (savedPrefs) {
      state.selectedGenres = new Set(savedPrefs.genres || ["Action", "Sci-Fi"]);
      state.duration = savedPrefs.duration || "Medium";
      state.targetMins = savedPrefs.targetMins || 115;
      state.minRating = savedPrefs.minRating || 7.5;
      if (savedPrefs.extras) state.extras = { ...savedPrefs.extras };

      elements.runtimeSlider.value = state.targetMins;
      elements.runtimeDisplay.textContent = `${state.targetMins} minutes`;
      elements.ratingSlider.value = state.minRating;
      elements.ratingDisplay.textContent = Number(state.minRating).toFixed(1);
    }

    // Render components
    renderGenreChips();
    syncDurationSelection(state.duration);
    syncAuthUI();
    updateWatchlistCount();
    
    // Initial Recommendation Run
    runRecommendations();

    // Populate Explorer Catalog
    renderExplorerCatalog();

    // Populate Initial Benchmark
    runBenchmarkDiagnostic();

    // Attach Event Listeners
    setupEventListeners();
  }

  // ==============================================================
  // UI RENDERING FUNCTIONS
  // ==============================================================

  // Render Genre Chips Matrix
  function renderGenreChips() {
    elements.genreChipsContainer.innerHTML = '';
    (window.GENRE_LIST || []).forEach(genre => {
      const isSelected = state.selectedGenres.has(genre);
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `genre-chip ${isSelected ? 'selected' : ''}`;
      chip.dataset.genre = genre;
      chip.innerHTML = `
        <span>${getGenreEmoji(genre)}</span>
        <span>${genre}</span>
        ${isSelected ? '<span class="text-xs">✓</span>' : ''}
      `;
      chip.addEventListener('click', () => {
        window.soundEngine.playClick();
        if (state.selectedGenres.has(genre)) {
          state.selectedGenres.delete(genre);
        } else {
          state.selectedGenres.add(genre);
        }
        renderGenreChips();
        persistCurrentPrefs();
      });
      elements.genreChipsContainer.appendChild(chip);
    });
  }

  function getGenreEmoji(genre) {
    const emojis = {
      Action: '💥',
      Comedy: '😂',
      Romance: '❤️',
      Thriller: '⚡',
      Drama: '🎭',
      'Sci-Fi': '🚀',
      Adventure: '🗺️',
      Animation: '✨',
      Crime: '🕵️',
      Fantasy: '🧙',
      Horror: '👻',
      Mystery: '🔍'
    };
    return emojis[genre] || '🎬';
  }

  // Synchronize Duration Selection Cards
  function syncDurationSelection(durationCat) {
    state.duration = durationCat;
    elements.durationCards.forEach(card => {
      if (card.dataset.duration === durationCat) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // Adjust target runtime if user switches category
    const targetMap = { Short: 80, Medium: 115, Long: 155 };
    state.targetMins = targetMap[durationCat] || 115;
    elements.runtimeSlider.value = state.targetMins;
    elements.runtimeDisplay.textContent = `${state.targetMins} minutes`;
    persistCurrentPrefs();
  }

  // Persist Current Preferences
  function persistCurrentPrefs() {
    window.appStorage.saveUserPrefs({
      genres: Array.from(state.selectedGenres),
      duration: state.duration,
      targetMins: state.targetMins,
      minRating: state.minRating,
      extras: state.extras
    });
  }

  // Calculate & Render Recommendations
  function runRecommendations() {
    const userPrefs = {
      genres: Array.from(state.selectedGenres),
      duration: state.duration,
      targetMins: parseInt(state.targetMins, 10),
      minRating: parseFloat(state.minRating),
      extras: {
        language: elements.filterLanguage.value,
        era: elements.filterEra.value,
        vibe: elements.filterVibe.value,
        query: elements.filterQuery.value
      }
    };

    const results = window.mlEngine.recommend(userPrefs, 16);
    elements.resultsCountBadge.textContent = `${results.length} Matches Found`;

    renderMovieCards(results, elements.recommendationsGrid, true);
  }

  // Render Movie Cards (Reusable for Recommendations, Explorer, Watchlist)
  function renderMovieCards(items, container, isRecMode = false) {
    container.innerHTML = '';

    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center glass-panel space-y-3">
          <div class="text-4xl">🎬</div>
          <h4 class="text-base font-bold text-white">No Matching Films Found</h4>
          <p class="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your genre filters, lowering your minimum rating bar, or broadening your runtime tolerance.
          </p>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const movie = isRecMode ? item.movie : item;
      const matchScore = isRecMode ? item.matchPercentage : null;
      const explanation = isRecMode ? item.explanation : null;
      const isInWatchlist = window.appStorage.isInWatchlist(movie.id);

      const card = document.createElement('div');
      card.className = 'movie-rec-card group cursor-pointer';

      // Match badge style
      let badgeHtml = '';
      if (matchScore !== null) {
        let badgeClass = 'match-badge-medium';
        if (matchScore >= 90) badgeClass = 'match-badge-ultra';
        else if (matchScore >= 75) badgeClass = 'match-badge-high';
        badgeHtml = `<span class="match-badge ${badgeClass}">${matchScore}% Match</span>`;
      }

      // XAI chips
      let xaiHtml = '';
      if (explanation && explanation.length > 0) {
        xaiHtml = `
          <div class="pt-2 border-t border-white/5 space-y-1">
            <div class="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <span>🧠</span> <span>ML Rationale</span>
            </div>
            <div class="text-[11px] text-slate-300 leading-tight">
              ${explanation[0]}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="relative h-44 overflow-hidden bg-slate-900">
          <img src="${movie.posterUrl}" alt="${movie.title}" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onerror="this.onerror=null; this.src='./icons/icon-512.png';">
          <div class="absolute inset-0 bg-gradient-to-t from-[#0E1424] via-[#0E1424]/40 to-transparent"></div>
          
          <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            ${badgeHtml}
          </div>

          <button type="button" class="btn-card-watchlist absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-sm hover:scale-110 transition-transform"
            data-movie-id="${movie.id}" title="${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}">
            <span>${isInWatchlist ? '★' : '☆'}</span>
          </button>

          <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
            <span class="text-[11px] font-mono-num font-semibold text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded border border-white/10">
              ${movie.duration}m • ${movie.durationCategory}
            </span>
            <div class="flex items-center gap-1 text-xs font-mono-num font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              <span>★</span>
              <span>${movie.rating}</span>
            </div>
          </div>
        </div>

        <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
          <div>
            <div class="flex items-center gap-1.5 text-[11px] text-indigo-300 font-semibold mb-1">
              <span>${movie.genres.slice(0, 2).join(' • ')}</span>
              <span class="text-slate-500">•</span>
              <span class="text-slate-400">${movie.year}</span>
            </div>
            <h4 class="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              ${movie.title}
            </h4>
            <p class="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
              ${movie.synopsis}
            </p>
          </div>

          ${xaiHtml}

          <div class="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
            <span class="text-[10px] text-slate-400">Dir. ${movie.director}</span>
            <span class="text-[11px] text-indigo-400 group-hover:text-indigo-300 font-bold flex items-center gap-1">
              Details <span>→</span>
            </span>
          </div>
        </div>
      `;

      // Handle Card Click (Opens Detail Modal)
      card.addEventListener('click', (e) => {
        // If clicking bookmark button, don't open modal
        if (e.target.closest('.btn-card-watchlist')) return;
        window.soundEngine.playClick();
        openMovieModal(movie, matchScore, explanation);
      });

      // Handle Bookmark Toggle Button
      const bookmarkBtn = card.querySelector('.btn-card-watchlist');
      if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isAdded = window.appStorage.toggleWatchlist(movie.id);
          window.soundEngine.playBookmark();
          bookmarkBtn.innerHTML = isAdded ? '★' : '☆';
          bookmarkBtn.title = isAdded ? 'Remove from Watchlist' : 'Add to Watchlist';
          updateWatchlistCount();

          // If currently in watchlist view, refresh it
          if (state.activeTab === 'watchlist') {
            renderWatchlistView();
          }
        });
      }

      container.appendChild(card);
    });
  }

  // Render Explorer Catalog
  function renderExplorerCatalog() {
    const query = (elements.explorerSearchInput.value || '').toLowerCase().trim();
    const sortMode = elements.explorerSortSelect.value;

    let list = [...(window.MOVIE_DATASET || [])];

    // Search filter
    if (query) {
      list = list.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.director.toLowerCase().includes(query) ||
        m.genres.some(g => g.toLowerCase().includes(query)) ||
        m.cast.some(a => a.toLowerCase().includes(query))
      );
    }

    // Sort order
    if (sortMode === 'rating-desc') list.sort((a, b) => b.rating - a.rating);
    else if (sortMode === 'year-desc') list.sort((a, b) => b.year - a.year);
    else if (sortMode === 'duration-asc') list.sort((a, b) => a.duration - b.duration);
    else if (sortMode === 'duration-desc') list.sort((a, b) => b.duration - a.duration);
    else if (sortMode === 'title-asc') list.sort((a, b) => a.title.localeCompare(b.title));

    renderMovieCards(list, elements.explorerGrid, false);
  }

  // Render Watchlist View
  function renderWatchlistView() {
    const list = window.appStorage.getWatchlistMovies(window.MOVIE_DATASET);
    renderMovieCards(list, elements.watchlistGrid, false);
  }

  // Update Watchlist Header Badge
  function updateWatchlistCount() {
    const count = window.appStorage.loadWatchlist().length;
    elements.watchlistCountBadge.textContent = count;
  }

  // Movie Details Modal
  function openMovieModal(movie, matchScore = null, xaiReasons = null) {
    state.currentModalMovie = movie;
    elements.modalMovieTitle.textContent = movie.title;
    elements.modalDirector.textContent = `Directed by ${movie.director} • ${movie.year} • ${movie.language}`;
    elements.modalYearBadge.textContent = movie.year;
    elements.modalDurationBadge.textContent = `${movie.duration} mins (${movie.durationCategory})`;
    elements.modalSynopsis.textContent = movie.synopsis;
    elements.modalCast.textContent = movie.cast.join(', ');

    // Match score badge in modal
    if (matchScore) {
      elements.modalMatchBadge.style.display = 'inline-flex';
      elements.modalMatchBadge.textContent = `${matchScore}% Match`;
    } else {
      elements.modalMatchBadge.style.display = 'none';
    }

    // Genres
    elements.modalGenres.innerHTML = movie.genres.map(g => 
      `<span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-white/10">${g}</span>`
    ).join('');

    // XAI Reasons
    if (xaiReasons && xaiReasons.length > 0) {
      elements.modalXaiReasons.innerHTML = xaiReasons.map(r => `<li>${r}</li>`).join('');
    } else {
      elements.modalXaiReasons.innerHTML = `
        <li>High audience acclaim (★ ${movie.rating}/10)</li>
        <li>Feature runtime of ${movie.duration} minutes aligns with cinematic catalog standards.</li>
      `;
    }

    // Streaming
    elements.modalStreaming.innerHTML = movie.streaming.map(p => 
      `<span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-700/50 text-indigo-200">📺 ${p}</span>`
    ).join('');

    // Watchlist button state
    syncModalWatchlistBtn(movie.id);

    elements.movieModal.classList.add('open');
    window.soundEngine.playModalOpen();
  }

  function closeMovieModal() {
    elements.movieModal.classList.remove('open');
    state.currentModalMovie = null;
  }

  function syncModalWatchlistBtn(movieId) {
    const isIn = window.appStorage.isInWatchlist(movieId);
    elements.modalWatchlistIcon.textContent = isIn ? '★' : '☆';
    elements.modalWatchlistText.textContent = isIn ? 'Saved in Watchlist' : 'Save to Watchlist';
  }

  // Model Studio Diagnostics Benchmark
  function runBenchmarkDiagnostic() {
    const res = window.mlEngine.runBenchmark();
    elements.bmDatasetSize.textContent = `${res.datasetSize} Feature Vectors`;
    elements.bmFitness.textContent = `${res.averageTopMatch}%`;

    elements.bmTestCases.innerHTML = res.testCases.map(tc => `
      <div class="flex justify-between py-1 border-b border-white/5">
        <span class="text-slate-400 truncate max-w-[200px]">${tc.query}</span>
        <span class="text-amber-300 font-bold">Top: ${tc.topMovie} (${tc.topScore}%)</span>
      </div>
    `).join('');
  }

  // Sound Engine UI Sync
  function updateSoundUI() {
    const isEnabled = window.soundEngine.isEnabled();
    elements.soundIcon.textContent = isEnabled ? '🔊' : '🔇';
    elements.toggleSoundBtn.title = isEnabled ? 'Audio Effects: ON (Click to mute)' : 'Audio Effects: MUTED (Click to enable)';
  }

  // Synchronize Authentication State
  function syncAuthUI() {
    const session = window.appStorage.session;

    if (session.isLoggedIn) {
      elements.authGuestControls.style.display = 'none';
      elements.authUserControls.style.display = 'flex';
      elements.authUserBadge.textContent = `${session.avatar} ${session.displayName}`;
      elements.authUserBadge.title = `Logged in as ${session.displayName} (${session.role})`;
    } else {
      elements.authGuestControls.style.display = 'flex';
      elements.authUserControls.style.display = 'none';
    }
  }

  // ==============================================================
  // EVENT LISTENERS SETUP
  // ==============================================================

  function setupEventListeners() {
    // Navigation Tabs Switching
    elements.navPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const tab = pill.dataset.tab;
        switchTab(tab);
      });
    });

    // Sound Toggle
    elements.toggleSoundBtn.addEventListener('click', () => {
      window.soundEngine.toggle();
      updateSoundUI();
    });

    // Select All / Clear Genres
    elements.btnSelectAllGenres.addEventListener('click', () => {
      window.soundEngine.playClick();
      (window.GENRE_LIST || []).forEach(g => state.selectedGenres.add(g));
      renderGenreChips();
      persistCurrentPrefs();
    });

    elements.btnClearGenres.addEventListener('click', () => {
      window.soundEngine.playClick();
      state.selectedGenres.clear();
      renderGenreChips();
      persistCurrentPrefs();
    });

    // Duration Category Choice Cards
    elements.durationCards.forEach(card => {
      card.addEventListener('click', () => {
        window.soundEngine.playClick();
        syncDurationSelection(card.dataset.duration);
      });
    });

    // Runtime Range Slider
    elements.runtimeSlider.addEventListener('input', (e) => {
      state.targetMins = parseInt(e.target.value, 10);
      elements.runtimeDisplay.textContent = `${state.targetMins} minutes`;
      persistCurrentPrefs();
    });

    // Rating Slider
    elements.ratingSlider.addEventListener('input', (e) => {
      state.minRating = parseFloat(e.target.value);
      elements.ratingDisplay.textContent = state.minRating.toFixed(1);
      persistCurrentPrefs();
    });

    // Advanced Parameters Toggle Accordion
    elements.toggleAdvancedBtn.addEventListener('click', () => {
      window.soundEngine.playClick();
      const isHidden = elements.advancedDrawer.classList.contains('hidden');
      if (isHidden) {
        elements.advancedDrawer.classList.remove('hidden');
        elements.advancedChevron.style.transform = 'rotate(180deg)';
      } else {
        elements.advancedDrawer.classList.add('hidden');
        elements.advancedChevron.style.transform = 'rotate(0deg)';
      }
    });

    // Big Calculate Recommendations Button
    elements.btnRunRecommendation.addEventListener('click', () => {
      window.soundEngine.playRecommend();
      
      // Temporary loading micro-animation
      elements.btnRunRecommendation.disabled = true;
      elements.btnRunRecommendation.classList.add('opacity-80');
      const originalText = elements.btnRunRecommendation.innerHTML;
      elements.btnRunRecommendation.innerHTML = `
        <span class="inline-block animate-spin mr-2">⚙️</span>
        <span>COMPUTING VECTOR SIMILARITIES...</span>
      `;

      setTimeout(() => {
        elements.btnRunRecommendation.disabled = false;
        elements.btnRunRecommendation.classList.remove('opacity-80');
        elements.btnRunRecommendation.innerHTML = originalText;
        runRecommendations();

        // Smooth scroll to results
        const target = document.getElementById('recommendation-results-anchor');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    });

    // Explorer Search and Sort
    elements.explorerSearchInput.addEventListener('input', () => {
      renderExplorerCatalog();
    });

    elements.explorerSortSelect.addEventListener('change', () => {
      window.soundEngine.playClick();
      renderExplorerCatalog();
    });

    // Model Studio Weight Sliders
    const handleWeightChange = () => {
      const g = parseFloat(elements.weightGenreSlider.value);
      const d = parseFloat(elements.weightDurationSlider.value);
      const r = parseFloat(elements.weightRatingSlider.value);
      const e = parseFloat(elements.weightEnhancedSlider.value);

      elements.weightGenreVal.textContent = g.toFixed(2);
      elements.weightDurationVal.textContent = d.toFixed(2);
      elements.weightRatingVal.textContent = r.toFixed(2);
      elements.weightEnhancedVal.textContent = e.toFixed(2);

      window.mlEngine.setWeights({ genre: g, duration: d, rating: r, enhanced: e });
    };

    elements.weightGenreSlider.addEventListener('input', handleWeightChange);
    elements.weightDurationSlider.addEventListener('input', handleWeightChange);
    elements.weightRatingSlider.addEventListener('input', handleWeightChange);
    elements.weightEnhancedSlider.addEventListener('input', handleWeightChange);

    // Save Weights Button
    elements.btnSaveWeights.addEventListener('click', () => {
      window.soundEngine.playSuccess();
      window.appStorage.saveWeights(window.mlEngine.weights);
      runBenchmarkDiagnostic();
      alert('Hyperparameter weights calibrated and saved successfully to device storage.');
    });

    // Reset Weights Button
    elements.btnResetWeights.addEventListener('click', () => {
      window.soundEngine.playClick();
      elements.weightGenreSlider.value = 0.40;
      elements.weightDurationSlider.value = 0.30;
      elements.weightRatingSlider.value = 0.20;
      elements.weightEnhancedSlider.value = 0.10;
      handleWeightChange();
      window.appStorage.saveWeights(null);
      runBenchmarkDiagnostic();
    });

    // Run Benchmark Button
    elements.btnRunBenchmark.addEventListener('click', () => {
      window.soundEngine.playRecommend();
      runBenchmarkDiagnostic();
    });

    // Movie Detail Modal Close
    elements.btnCloseMovieModal.addEventListener('click', closeMovieModal);
    elements.btnModalDismiss.addEventListener('click', closeMovieModal);
    elements.movieModal.addEventListener('click', (e) => {
      if (e.target === elements.movieModal) closeMovieModal();
    });

    // Modal Watchlist Toggle Button
    elements.modalWatchlistToggleBtn.addEventListener('click', () => {
      if (!state.currentModalMovie) return;
      const isAdded = window.appStorage.toggleWatchlist(state.currentModalMovie.id);
      window.soundEngine.playBookmark();
      syncModalWatchlistBtn(state.currentModalMovie.id);
      updateWatchlistCount();

      // Refresh cards in background
      if (state.activeTab === 'matcher') runRecommendations();
      else if (state.activeTab === 'explorer') renderExplorerCatalog();
      else if (state.activeTab === 'watchlist') renderWatchlistView();
    });

    // ============================================================
    // AUTH MODAL & DUAL-SLIDER CONTROLS (MATCHING ALAMDAR ARCHITECTURE)
    // ============================================================

    elements.openLoginBtn.addEventListener('click', () => {
      window.soundEngine.playModalOpen();
      elements.authModal.classList.add('open');
      elements.loginUserError.style.display = 'none';
      elements.loginAdminError.style.display = 'none';
    });

    elements.closeLoginBtn.addEventListener('click', () => {
      window.soundEngine.playClick();
      elements.authModal.classList.remove('open');
    });

    elements.authModal.addEventListener('click', (e) => {
      if (e.target === elements.authModal) {
        elements.authModal.classList.remove('open');
      }
    });

    // Campus Fix Sliding Panel Mode Switcher
    function setAuthSliderMode(mode) {
      window.soundEngine.playClick();
      if (mode === 'user') {
        elements.authSliderContainer.classList.add('right-panel-active');
      } else {
        elements.authSliderContainer.classList.remove('right-panel-active');
      }
    }

    if (elements.btnSwitchToAdmin) {
      elements.btnSwitchToAdmin.addEventListener('click', () => setAuthSliderMode('admin'));
    }
    if (elements.btnSwitchToUser) {
      elements.btnSwitchToUser.addEventListener('click', () => setAuthSliderMode('user'));
    }

    // Campus Fix Celebratory Login Animation Burst Trigger
    function triggerLoginBurst(role, callback) {
      if (elements.burstEmblemIcon) {
        elements.burstEmblemIcon.textContent = role === 'admin' ? '⚙️' : '🎬';
      }
      if (elements.authBurstEffect) {
        elements.authBurstEffect.classList.add('active');
      }
      window.soundEngine.playSuccess();

      setTimeout(() => {
        if (elements.authBurstEffect) {
          elements.authBurstEffect.classList.remove('active');
        }
        if (callback) callback();
      }, 1200);
    }

    // Password visibility eye toggles
    elements.toggleUserPassBtn.addEventListener('click', () => {
      const type = elements.loginUserPassword.type === 'password' ? 'text' : 'password';
      elements.loginUserPassword.type = type;
    });

    elements.toggleAdminPassBtn.addEventListener('click', () => {
      const type = elements.loginAdminPassword.type === 'password' ? 'text' : 'password';
      elements.loginAdminPassword.type = type;
    });

    // 1-Click Fill User Demo
    elements.quickFillUserBtn.addEventListener('click', () => {
      window.soundEngine.playClick();
      document.getElementById('login-user-name').value = 'sarth';
      elements.loginUserPassword.value = 'movie123';
    });

    // 1-Click Fill Admin Demo
    elements.quickFillAdminBtn.addEventListener('click', () => {
      window.soundEngine.playClick();
      document.getElementById('login-admin-user').value = 'admin';
      elements.loginAdminPassword.value = 'cinematch@2026';
    });

    // Cinephile User Sign-in Submission with Campus Fix Burst Transition
    elements.userLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('login-user-name').value.trim();
      const pass = elements.loginUserPassword.value;

      if (!user || !pass) {
        showAuthError(elements.loginUserError, 'Please enter both username and password.');
        return;
      }

      // Trigger celebratory burst animation like Campus Fix
      triggerLoginBurst('user', () => {
        window.appStorage.saveSession({
          isLoggedIn: true,
          role: 'user',
          username: user,
          displayName: user.charAt(0).toUpperCase() + user.slice(1),
          avatar: '👤'
        });

        syncAuthUI();
        elements.authModal.classList.remove('open');
      });
    });

    // Data Scientist / Admin Sign-in Submission with Campus Fix Burst Transition
    elements.adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const adminUser = document.getElementById('login-admin-user').value.trim();
      const adminPass = elements.loginAdminPassword.value;

      if (adminUser === 'admin' && adminPass === 'cinematch@2026') {
        triggerLoginBurst('admin', () => {
          window.appStorage.saveSession({
            isLoggedIn: true,
            role: 'admin',
            username: 'admin',
            displayName: 'Research Lead (Admin)',
            avatar: '⚙️'
          });

          syncAuthUI();
          elements.authModal.classList.remove('open');
        });
      } else {
        showAuthError(elements.loginAdminError, 'Invalid Research Committee Credentials. Use admin / cinematch@2026');
      }
    });

    // Logout
    elements.logoutBtn.addEventListener('click', () => {
      window.soundEngine.playClick();
      window.appStorage.clearSession();
      syncAuthUI();
    });

    // PWA Install prompt capture
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredInstallPrompt = e;
      elements.pwaInstallBtn.classList.remove('hidden');
    });

    elements.pwaInstallBtn.addEventListener('click', async () => {
      if (!state.deferredInstallPrompt) return;
      state.deferredInstallPrompt.prompt();
      const { outcome } = await state.deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        elements.pwaInstallBtn.classList.add('hidden');
      }
      state.deferredInstallPrompt = null;
    });

    // Keyboard ESC to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (elements.movieModal.classList.contains('open')) closeMovieModal();
        if (elements.authModal.classList.contains('open')) elements.authModal.classList.remove('open');
      }
    });
  }

  function showAuthError(targetEl, msg) {
    targetEl.textContent = msg;
    targetEl.style.display = 'block';
  }

  // Switch Active Tab View
  function switchTab(tabId) {
    state.activeTab = tabId;
    window.soundEngine.playClick();

    // Update nav pills
    elements.navPills.forEach(p => {
      if (p.dataset.tab === tabId) p.classList.add('active');
      else p.classList.remove('active');
    });

    // Show selected view
    Object.keys(elements.views).forEach(key => {
      if (key === tabId) {
        elements.views[key].classList.remove('hidden');
      } else {
        elements.views[key].classList.add('hidden');
      }
    });

    // Render corresponding view data
    if (tabId === 'explorer') renderExplorerCatalog();
    else if (tabId === 'watchlist') renderWatchlistView();
    else if (tabId === 'studio') runBenchmarkDiagnostic();
  }

  // Launch app
  initApp();
});

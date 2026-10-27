/**
 * CineMatch ML - Storage and State Management
 * Handles session authentication, persistent watchlists, and model configuration.
 */

const STORAGE_KEYS = {
  AUTH_SESSION: 'cinematch_auth_session',
  WATCHLIST: 'cinematch_watchlist',
  MODEL_WEIGHTS: 'cinematch_model_weights',
  USER_PREFS: 'cinematch_user_prefs'
};

class AppStorage {
  constructor() {
    this.session = this.loadSession();
    this.watchlist = this.loadWatchlist();
  }

  // Session Management
  loadSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      isLoggedIn: false,
      role: 'guest', // 'guest' | 'user' | 'admin'
      username: 'Guest',
      displayName: 'Audience Explorer',
      avatar: '🎬'
    };
  }

  saveSession(sessionData) {
    this.session = sessionData;
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(sessionData));
  }

  clearSession() {
    this.session = {
      isLoggedIn: false,
      role: 'guest',
      username: 'Guest',
      displayName: 'Audience Explorer',
      avatar: '🎬'
    };
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    return this.session;
  }

  // Watchlist Management
  loadWatchlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      if (data) return JSON.parse(data);
    } catch (e) {}
    // Pre-populate with a couple of default favorites for demo richness
    return ["mov_01", "mov_07"];
  }

  saveWatchlist(list) {
    this.watchlist = list;
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
  }

  toggleWatchlist(movieId) {
    let list = this.loadWatchlist();
    const index = list.indexOf(movieId);
    let isAdded = false;

    if (index > -1) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.push(movieId);
      isAdded = true;
    }

    this.saveWatchlist(list);
    return isAdded;
  }

  isInWatchlist(movieId) {
    return this.watchlist.includes(movieId);
  }

  getWatchlistMovies(dataset = window.MOVIE_DATASET) {
    const list = this.loadWatchlist();
    return (dataset || []).filter(m => list.includes(m.id));
  }

  // Model Weights Persistence
  loadWeights() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MODEL_WEIGHTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
  }

  saveWeights(weights) {
    localStorage.setItem(STORAGE_KEYS.MODEL_WEIGHTS, JSON.stringify(weights));
  }

  // Last User Preferences
  loadUserPrefs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      genres: ["Sci-Fi", "Action"],
      duration: "Medium",
      targetMins: 115,
      minRating: 7.5,
      extras: {
        language: "All",
        era: "All",
        query: "",
        vibe: "All"
      }
    };
  }

  saveUserPrefs(prefs) {
    localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(prefs));
  }
}

if (typeof window !== 'undefined') {
  window.appStorage = new AppStorage();
}

(() => {
  'use strict';

  const APP_VERSION = '16.0.0-profiles-reports';
  const DATA_VERSION = 16;
  const KEY = 'lifeos.v16.profiles.reports';
  const LEGACY_KEYS = ['lifeos.v15.modules','lifeos.v14.active','lifeos.v13.today','lifeos.v12.stability','lifeos.v11.v8base.complete','lifeos.v10.stable','lifeos.v9.complete','lifeos.v8.rings','lifeos.v7.design', 'lifeos.v5.configurable', 'lifeos.v4.final', 'lifeos.v3', 'lifeosData', 'lifeos-pwa-data'];
  const DEFAULT_START = '2026-07-03';
  const DEFAULT_END = '2026-08-31';
  const DAY_LABELS = [
    ['1', 'Пн'], ['2', 'Вт'], ['3', 'Ср'], ['4', 'Чт'], ['5', 'Пт'], ['6', 'Сб'], ['0', 'Вс']
  ];
  const DEFAULT_WORK_CONFIG = {
    startDate: DEFAULT_START,
    endDate: DEFAULT_END,
    targetWorkoutsPerWeek: 3,
    schedule: {
      0: { enabled: false, start: '10:00', end: '14:00' },
      1: { enabled: true, start: '10:00', end: '17:00' },
      2: { enabled: true, start: '10:00', end: '17:00' },
      3: { enabled: true, start: '10:00', end: '17:00' },
      4: { enabled: true, start: '10:00', end: '17:00' },
      5: { enabled: true, start: '10:00', end: '17:00' },
      6: { enabled: true, start: '10:00', end: '14:00' }
    }
  };
  const THEME_OPTIONS = [
    ['system', 'Системная', 'Автоматически под устройство'],
    ['light', 'iOS Light', 'Чистая светлая тема'],
    ['dark', 'iOS Dark', 'Тёмный режим'],
    ['midnight', 'Midnight', 'Глубокий синий и фиолетовый'],
    ['aurora', 'Aurora', 'Светлая северная палитра'],
    ['fitness', 'Apple Fitness', 'Кольца, энергия, контраст'],
    ['music', 'Apple Music', 'Градиенты и неоновые акценты'],
    ['journal', 'Apple Journal', 'Тёплая дневниковая тема'],
    ['ios7', 'iOS 7 Frost', 'Лёгкое матовое стекло'],
    ['ios13', 'iOS 13', 'Системный серо-синий стиль'],
    ['ios17', 'iOS 17 Pro', 'Глубина, blur, мягкие карточки'],
    ['ios18', 'iOS 18 Liquid', 'Насыщенный liquid glass'],
    ['aqua', 'Classic Aqua', 'Старый macOS Aqua вайб'],
    ['graphite', 'Graphite', 'Строгий графитовый стиль'],
    ['ipod', 'iPod', 'Белый минимализм и синий акцент'],
    ['snitch', 'Стукач', 'Пасхальная тема']
  ];

  const DEFAULT_PROFILES = [
    { id: 'work', name: 'Рабочий режим', icon: '💼', theme: 'ios17', ringSlots: ['work','sport','self'], workoutTarget: 3, selfTargetMinutes: 60, templates: [] },
    { id: 'study', name: 'Учёба', icon: '📚', theme: 'journal', ringSlots: ['self','work','sport'], workoutTarget: 2, selfTargetMinutes: 120, templates: [{ name: 'Учёба 45 мин', type: 'Саморазвитие: Курс', start: '19:00', end: '19:45', note: 'Учёба / курс', icon: '🎓' }] },
    { id: 'summer', name: 'Лето', icon: '☀️', theme: 'aurora', ringSlots: ['work','sport','self'], workoutTarget: 4, selfTargetMinutes: 45, templates: [{ name: 'Прогулка', type: 'Прогулка', start: '20:00', end: '21:00', note: 'Активность на улице', icon: '🚶' }] },
    { id: 'intensive', name: 'Интенсив', icon: '🔥', theme: 'fitness', ringSlots: ['work','self','sport'], workoutTarget: 5, selfTargetMinutes: 120, templates: [{ name: 'Deep work', type: 'Саморазвитие: Проект', start: '20:00', end: '22:00', note: 'Глубокая работа над задачей', icon: '🧠' }] },
    { id: 'minimal', name: 'Минимализм', icon: '◌', theme: 'graphite', ringSlots: ['work','sport','self'], workoutTarget: 2, selfTargetMinutes: 30, templates: [] }
  ];
  const MOODS = [
    ['🔥', 'мощно'],
    ['🙂', 'нормально'],
    ['😐', 'ровно'],
    ['😵', 'хаос'],
    ['🧊', 'холодно']
  ];
  const BASE_TYPES = [
    'Работа', 'Учёба', 'GitHub-проект', 'Фокус-сессия', 'Перерыв', 'Обед', 'Дорога', 'Телефон', 'Отдых',
    'Спорт', 'Прогулка', 'Здоровье', 'Домашние дела', 'Покупки', 'Встреча', 'Документы',
    'Саморазвитие', 'Саморазвитие: Проект', 'Саморазвитие: Книга', 'Саморазвитие: Курс', 'Саморазвитие: Практика',
    'Творчество', 'Музыка', 'Семья', 'Друзья', 'Сон', 'Прочее', 'Другое'
  ];
  const BASE_SPORT_TYPES = ['Зал', 'Кардио', 'Бег', 'Прогулка', 'Растяжка', 'Футбол', 'Велосипед', 'Бассейн', 'Домашняя тренировка', 'Свой спорт'];
  const BASE_SELF_TYPES = ['Проект', 'Книга', 'Курс', 'Практика', 'Конспект', 'Язык', 'Кодинг', 'Ableton', 'Финансы', 'Свой вариант'];
  const SELF_QUICK_TEMPLATES = [
    { activity: 'Проект', start: '20:00', end: '21:00', note: 'Работа над личным проектом', icon: '🛠️' },
    { activity: 'Книга', start: '21:00', end: '21:40', note: 'Чтение и заметки', icon: '📖' },
    { activity: 'Курс', start: '19:30', end: '20:30', note: 'Курс / урок / лекция', icon: '🎓' },
    { activity: 'Кодинг', start: '18:30', end: '20:00', note: 'Кодинг и практика', icon: '💻' },
    { activity: 'Ableton', start: '21:00', end: '22:00', note: 'Музыка / Ableton / аранжировка', icon: '🎛️' }
  ];
  const SPORT_QUICK_TEMPLATES = [
    { activity: 'Зал', start: '18:00', end: '19:15', intensity: 'Высокая', calories: 450, note: 'Силовая тренировка', icon: '🏋️' },
    { activity: 'Бег', start: '19:00', end: '19:40', intensity: 'Высокая', calories: 380, note: 'Бег / кардио', icon: '🏃' },
    { activity: 'Прогулка', start: '20:00', end: '21:00', intensity: 'Лёгкая', calories: 180, note: 'Прогулка и восстановление', icon: '🚶' },
    { activity: 'Растяжка', start: '21:30', end: '21:50', intensity: 'Лёгкая', calories: 70, note: 'Растяжка / мобилити', icon: '🧘' }
  ];
  const QUICK_TEMPLATES = [
    { type: 'Работа', start: '10:00', end: '17:00', note: 'Полный рабочий день по выбранному графику', icon: '💼' },
    { type: 'Работа', start: '10:00', end: '14:00', note: 'Короткий рабочий день по выбранному графику', icon: '🧩' },
    { type: 'Обед', start: '13:00', end: '13:30', note: 'Перерыв на обед', icon: '🍽️' },
    { type: 'Спорт', start: '18:00', end: '19:00', note: 'Спорт / тренировка', icon: '🏋️' },
    { type: 'Прогулка', start: '20:00', end: '21:00', note: 'Прогулка', icon: '🚶' },
    { type: 'GitHub-проект', start: '18:00', end: '20:00', note: 'Работа над проектом', icon: '🚀' },
    { type: 'Учёба', start: '19:00', end: '20:30', note: 'Учёба / повторение', icon: '📚' },
    { type: 'Прочее', start: '15:00', end: '15:30', note: 'Прочее дело', icon: '🗂️' },
    { type: 'Другое', start: '15:00', end: '15:30', note: 'Свой вариант', icon: '✍️' }
  ];
  const DEFAULT_HABITS = [
    { id: 'h-work', name: 'Работа по графику', desc: 'Закрыть рабочий план дня' },
    { id: 'h-note', name: 'Заметка дня', desc: 'Коротко зафиксировать итог' },
    { id: 'h-focus', name: 'Фокус-сессия', desc: 'Хотя бы один Pomodoro' },
    { id: 'h-sport', name: 'Спорт / активность', desc: 'Тренировка, прогулка или растяжка' },
    { id: 'h-backup', name: 'Бэкап данных', desc: 'Экспорт JSON раз в неделю' }
  ];
  const DEFAULT_PROJECTS = [
    { id: uid(), name: 'LifeOS', status: 'В работе', progress: 90, deadline: DEFAULT_END, repo: '', live: '', notes: 'PWA-панель дня, работы, денег, проектов и привычек.' }
  ];
  const DEFAULT_BOOKS = [];
  const DEFAULT_COURSES = [];

  let memoryStore = null;
  let storageDriver = detectStorageDriver();
  let storageOk = storageDriver !== 'memory';
  let deferredInstallPrompt = null;
  let calendarFilter = 'all';
  let lastReportHtml = '';
  let timer = { seconds: 25 * 60, total: 25 * 60, running: false, mode: 'focus', startedAt: null, interval: null };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-5);
  }

  function canUseWebStorage(name) {
    try {
      const storage = window[name];
      const probe = '__lifeos_probe__';
      storage.setItem(probe, '1');
      storage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }

  function canUseCookie() {
    try {
      document.cookie = 'lifeos_probe=1; path=/; max-age=60; SameSite=Lax';
      const ok = document.cookie.includes('lifeos_probe=1');
      document.cookie = 'lifeos_probe=; path=/; max-age=0; SameSite=Lax';
      return ok;
    } catch {
      return false;
    }
  }

  function detectStorageDriver() {
    if (canUseWebStorage('localStorage')) return 'localStorage';
    if (canUseWebStorage('sessionStorage')) return 'sessionStorage';
    if (canUseCookie()) return 'cookie';
    return 'memory';
  }

  function cookieGet(name) {
    try {
      const row = document.cookie.split('; ').find((item) => item.startsWith(`${name}=`));
      return row ? decodeURIComponent(row.slice(name.length + 1)) : null;
    } catch {
      return null;
    }
  }

  function cookieSet(name, value) {
    try {
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
      return cookieGet(name) === value;
    } catch {
      return false;
    }
  }

  function idbOpen() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
      const request = indexedDB.open('LifeOSDatabase', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('state')) db.createObjectStore('state');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
      request.onblocked = () => reject(new Error('IndexedDB blocked'));
    });
  }

  async function idbGet(key = KEY) {
    const db = await idbOpen();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('state', 'readonly');
      const request = tx.objectStore('state').get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('IndexedDB get failed'));
      tx.oncomplete = () => db.close();
      tx.onerror = () => db.close();
    });
  }

  async function idbSet(value, key = KEY) {
    const db = await idbOpen();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('state', 'readwrite');
      tx.objectStore('state').put(value, key);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error('IndexedDB set failed')); };
    });
  }

  function storageGet(key = KEY) {
    try {
      if (storageDriver === 'localStorage') return localStorage.getItem(key);
      if (storageDriver === 'sessionStorage') return sessionStorage.getItem(key);
      if (storageDriver === 'cookie') return cookieGet(key);
      return memoryStore;
    } catch {
      storageDriver = 'memory';
      storageOk = false;
      return memoryStore;
    }
  }

  function storageSet(value, key = KEY) {
    try {
      if (storageDriver === 'localStorage') return localStorage.setItem(key, value);
      if (storageDriver === 'sessionStorage') return sessionStorage.setItem(key, value);
      if (storageDriver === 'cookie') {
        if (cookieSet(key, value)) return;
        storageDriver = canUseWebStorage('sessionStorage') ? 'sessionStorage' : 'memory';
        storageOk = storageDriver !== 'memory';
        return storageSet(value, key);
      }
      memoryStore = value;
    } catch {
      memoryStore = value;
      storageDriver = 'memory';
      storageOk = false;
      toast('Постоянное хранилище недоступно. Сделай экспорт JSON после работы.');
    }
  }

  function updateStorageBanner() {
    const banner = $('#storageBanner');
    const text = $('#storageBannerText');
    if (!banner || !text) return;
    if (storageDriver === 'localStorage' || storageDriver === 'cookie' || storageDriver === 'sessionStorage') {
      banner.hidden = true;
      return;
    }
    banner.hidden = false;
    text.textContent = 'Постоянное хранилище браузера ограничено. LifeOS сохраняет резервную копию в IndexedDB, но на всякий случай делай JSON-бэкап.';
  }

  function cloneWorkConfig(config = DEFAULT_WORK_CONFIG) {
    const source = config || DEFAULT_WORK_CONFIG;
    const schedule = {};
    DAY_LABELS.forEach(([day]) => {
      schedule[day] = { ...DEFAULT_WORK_CONFIG.schedule[day], ...((source.schedule || {})[day] || {}) };
      if (timeToMinutes(schedule[day].end) <= timeToMinutes(schedule[day].start)) schedule[day].end = DEFAULT_WORK_CONFIG.schedule[day].end;
    });
    const startDate = source.startDate || DEFAULT_START;
    const endDate = (source.endDate || DEFAULT_END) < startDate ? startDate : (source.endDate || DEFAULT_END);
    return {
      startDate,
      endDate,
      targetWorkoutsPerWeek: Number.isFinite(Number(source.targetWorkoutsPerWeek)) ? Number(source.targetWorkoutsPerWeek) : 3,
      schedule
    };
  }

  function defaultState() {
    const workConfig = cloneWorkConfig(DEFAULT_WORK_CONFIG);
    return {
      version: DATA_VERSION,
      appVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
      health: { lastSaveAt: '', lastAutoBackupAt: '', lastDiagnosticsAt: '', lastError: '' },
      onboardingDone: false,
      workConfig,
      theme: 'system',
      ui: { glassOpacity: 68, glassBlur: 20, animationLevel: 'normal', selfDevTargetMinutes: 60 },
      selectedDate: clampDate(todayKey(), workConfig),
      entries: [],
      dayMeta: {},
      customTypes: ['Документы', 'Встреча', 'Покупки'],
      customCategories: [
        { id: 'cat-serbian', name: 'Сербский', icon: '🇷🇸', kind: 'self', targetMinutes: 30, inRings: true },
        { id: 'cat-ableton', name: 'Ableton', icon: '🎛️', kind: 'self', targetMinutes: 45, inRings: true }
      ],
      ringSlots: ['work', 'sport', 'self'],
      homeWidgets: { todayCenter: true, miniMode: true, planner: true, weeklyRings: true, eveningReport: true, timeline: true, quickTemplates: true, insights: true, mood: true },
      profiles: DEFAULT_PROFILES.map((profile) => ({ ...profile, workConfig: cloneWorkConfig(DEFAULT_WORK_CONFIG) })),
      activeProfileId: 'work',
      miniMode: false,
      customTemplates: [],
      eveningReports: {},
      sportTypes: [],
      selfDevTypes: [],
      habits: DEFAULT_HABITS.map((h) => ({ ...h })),
      habitChecks: {},
      goals: [
        { id: uid(), name: 'Закрыть рабочий период', current: 0, target: Math.round(totalPlannedMinutes(workConfig) / 60), unit: 'часов', auto: 'workHours' },
        { id: uid(), name: 'Серия 10 полных рабочих дней', current: 0, target: 10, unit: 'дней', auto: 'streak' }
      ],
      projects: DEFAULT_PROJECTS.map((p) => ({ ...p, id: uid() })),
      books: DEFAULT_BOOKS.map((b) => ({ ...b, id: uid(), sessions: [] })),
      courses: DEFAULT_COURSES.map((c) => ({ ...c, id: uid(), sessions: [] })),
      focusSessions: [],
      finance: { hourRate: 350, fullDayBonus: 0, missPenalty: 0, moneyTarget: 0 },
      notifications: { enabled: false, lastFired: {} },
      activeTimer: { running: false, paused: false, category: '', type: '', startedAt: '', pausedAt: '', accumulatedMs: 0, note: '', source: 'today' },
      activeTimerHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  let state = loadState();

  function normalizeLoadedState(parsed) {
    const base = defaultState();
    const workConfig = cloneWorkConfig(parsed.workConfig || parsed.config || DEFAULT_WORK_CONFIG);
    const selectedDate = clampDate(parsed.selectedDate || todayKey(), workConfig);
    return {
      ...base,
      ...parsed,
      version: DATA_VERSION,
      appVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
      health: { ...base.health, ...(parsed.health || {}) },
      ui: { ...base.ui, ...(parsed.ui || {}) },
      onboardingDone: Boolean(parsed.onboardingDone),
      workConfig,
      selectedDate,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      dayMeta: parsed.dayMeta || {},
      customTypes: Array.isArray(parsed.customTypes) ? parsed.customTypes : base.customTypes,
      customCategories: Array.isArray(parsed.customCategories) ? parsed.customCategories : base.customCategories,
      ringSlots: Array.isArray(parsed.ringSlots) && parsed.ringSlots.length === 3 ? parsed.ringSlots : base.ringSlots,
      homeWidgets: { ...base.homeWidgets, ...(parsed.homeWidgets || {}) },
      profiles: Array.isArray(parsed.profiles) && parsed.profiles.length ? parsed.profiles.map((profile) => ({ ...profile, workConfig: cloneWorkConfig(profile.workConfig || workConfig) })) : base.profiles,
      activeProfileId: parsed.activeProfileId || base.activeProfileId,
      miniMode: Boolean(parsed.miniMode),
      customTemplates: Array.isArray(parsed.customTemplates) ? parsed.customTemplates : base.customTemplates,
      eveningReports: parsed.eveningReports || {},
      sportTypes: Array.isArray(parsed.sportTypes) ? parsed.sportTypes : base.sportTypes,
      selfDevTypes: Array.isArray(parsed.selfDevTypes) ? parsed.selfDevTypes : base.selfDevTypes,
      habits: Array.isArray(parsed.habits) && parsed.habits.length ? parsed.habits : base.habits,
      habitChecks: parsed.habitChecks || {},
      goals: Array.isArray(parsed.goals) && parsed.goals.length ? parsed.goals : base.goals,
      projects: Array.isArray(parsed.projects) ? parsed.projects : base.projects,
      books: Array.isArray(parsed.books) ? parsed.books : base.books,
      courses: Array.isArray(parsed.courses) ? parsed.courses : base.courses,
      focusSessions: Array.isArray(parsed.focusSessions) ? parsed.focusSessions : [],
      finance: { ...base.finance, ...(parsed.finance || {}) },
      notifications: { ...base.notifications, ...(parsed.notifications || {}) },
      activeTimer: { ...base.activeTimer, ...(parsed.activeTimer || {}) },
      activeTimerHistory: Array.isArray(parsed.activeTimerHistory) ? parsed.activeTimerHistory : []
    };
  }

  function loadState() {
    const raw = storageGet(KEY);
    if (raw) {
      try { return normalizeLoadedState(JSON.parse(raw)); }
      catch (error) { console.warn('LifeOS state parse error', error); }
    }
    for (const key of LEGACY_KEYS) {
      const legacyRaw = storageGet(key);
      if (!legacyRaw) continue;
      try {
        const migrated = normalizeLoadedState(JSON.parse(legacyRaw));
        migrated.onboardingDone = true;
        storageSet(JSON.stringify(migrated), KEY);
        return migrated;
      } catch { /* ignore legacy parse */ }
    }
    return defaultState();
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();
    state.version = DATA_VERSION;
    state.dataVersion = DATA_VERSION;
    state.appVersion = APP_VERSION;
    state.health = state.health || {};
    state.health.lastSaveAt = new Date().toISOString();
    const payload = JSON.stringify(state);
    storageSet(payload);
    idbSet(payload).catch(() => { /* IndexedDB is an optional persistent backup. */ });
    safeAutoBackup(payload);
  }


  function safeAutoBackup(payload) {
    try {
      const now = Date.now();
      const last = Number(localStorageSafeGet('lifeos.autoBackupAt') || 0);
      const sixHours = 6 * 60 * 60 * 1000;
      if (now - last < sixHours) return;
      localStorageSafeSet('lifeos.autoBackupAt', String(now));
      localStorageSafeSet('lifeos.autoBackupSize', String(payload.length));
      idbSet(payload, `${KEY}.autoBackup`).catch(() => {});
      state.health = state.health || {};
      state.health.lastAutoBackupAt = new Date(now).toISOString();
    } catch (error) {
      console.warn('Auto backup skipped', error);
    }
  }

  function bytesLabel(bytes) {
    const n = Number(bytes || 0);
    if (n < 1024) return `${n} Б`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} КБ`;
    return `${(n / 1024 / 1024).toFixed(2)} МБ`;
  }

  function setHealthError(error) {
    try {
      state.health = state.health || {};
      state.health.lastError = `${new Date().toISOString()} — ${error?.message || error || 'unknown error'}`;
      const snapshot = JSON.stringify(state);
      storageSet(snapshot);
      idbSet(snapshot).catch(() => {});
    } catch { /* avoid recursive failure */ }
  }

  async function collectDiagnostics() {
    const diag = {
      appVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
      key: KEY,
      storageDriver,
      localStorage: canUseWebStorage('localStorage'),
      sessionStorage: canUseWebStorage('sessionStorage'),
      cookies: canUseCookie(),
      indexedDB: false,
      serviceWorker: 'serviceWorker' in navigator,
      serviceWorkerRegistrations: 0,
      caches: [],
      displayMode: (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true ? 'standalone' : 'browser',
      userAgent: navigator.userAgent,
      stateBytes: 0,
      entries: state?.entries?.length || 0,
      goals: state?.goals?.length || 0,
      projects: state?.projects?.length || 0,
      updatedAt: state?.updatedAt || '',
      lastSaveAt: state?.health?.lastSaveAt || '',
      lastAutoBackupAt: state?.health?.lastAutoBackupAt || '',
      lastError: state?.health?.lastError || ''
    };
    try {
      await idbSet(JSON.stringify(state), `${KEY}.diagnosticProbe`);
      diag.indexedDB = Boolean(await idbGet(`${KEY}.diagnosticProbe`));
    } catch { diag.indexedDB = false; }
    try { diag.stateBytes = JSON.stringify(state || {}).length; } catch { diag.stateBytes = 0; }
    try { if ('caches' in window) diag.caches = await caches.keys(); } catch { diag.caches = ['ошибка чтения']; }
    try { if ('serviceWorker' in navigator) diag.serviceWorkerRegistrations = (await navigator.serviceWorker.getRegistrations()).length; } catch { diag.serviceWorkerRegistrations = -1; }
    state.health = state.health || {};
    state.health.lastDiagnosticsAt = new Date().toISOString();
    return diag;
  }

  function diagnosticRows(diag) {
    const ok = (value, good = true) => value === good ? 'ok' : 'warn';
    return [
      ['Версия приложения', diag.appVersion, 'ok'],
      ['Версия данных', diag.dataVersion, 'ok'],
      ['Основное хранилище', diag.storageDriver, diag.storageDriver === 'memory' ? 'bad' : 'ok'],
      ['localStorage', diag.localStorage ? 'доступен' : 'недоступен', ok(diag.localStorage)],
      ['sessionStorage', diag.sessionStorage ? 'доступен' : 'недоступен', ok(diag.sessionStorage)],
      ['IndexedDB backup', diag.indexedDB ? 'работает' : 'недоступен', ok(diag.indexedDB)],
      ['Service Worker', diag.serviceWorker ? `${diag.serviceWorkerRegistrations} рег.` : 'нет поддержки', diag.serviceWorker ? 'ok' : 'warn'],
      ['Cache Storage', diag.caches.length ? diag.caches.join(', ') : 'пусто', 'ok'],
      ['Режим запуска', diag.displayMode, 'ok'],
      ['Размер данных', bytesLabel(diag.stateBytes), 'ok'],
      ['Записей', String(diag.entries), 'ok'],
      ['Последнее сохранение', diag.lastSaveAt ? formatDateTime(diag.lastSaveAt) : 'нет', diag.lastSaveAt ? 'ok' : 'warn'],
      ['Автобэкап', diag.lastAutoBackupAt ? formatDateTime(diag.lastAutoBackupAt) : 'ожидает', 'ok'],
      ['Последняя ошибка', diag.lastError || 'нет', diag.lastError ? 'warn' : 'ok']
    ];
  }

  function formatDateTime(iso) {
    try { return new Date(iso).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }); }
    catch { return String(iso || ''); }
  }

  async function renderDiagnostics() {
    const box = $('#diagnosticsBox');
    const summary = $('#diagnosticsSummary');
    if (!box && !summary) return;
    const diag = await collectDiagnostics();
    const rows = diagnosticRows(diag);
    const badCount = rows.filter((row) => row[2] === 'bad').length;
    const warnCount = rows.filter((row) => row[2] === 'warn').length;
    if (summary) summary.innerHTML = `Диагностика: ${badCount ? 'есть критические проблемы' : warnCount ? 'есть предупреждения' : 'всё стабильно'} · данные: ${bytesLabel(diag.stateBytes)} · режим: ${escapeHtml(diag.displayMode)}`;
    if (box) box.innerHTML = rows.map(([label, value, status]) => `
      <div class="diag-row ${status}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `).join('');
    saveState();
  }

  async function repairPwaWithoutDeletingData() {
    const snapshot = JSON.stringify(state, null, 2);
    await idbSet(snapshot, `${KEY}.repairBackup`).catch(() => {});
    storageSet(JSON.stringify(state), KEY);
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.allSettled(names.map((name) => caches.delete(name)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(regs.map((reg) => reg.unregister()));
    }
    toast('PWA-кэш и service worker удалены. Данные сохранены. Обнови страницу.');
    renderDiagnostics();
  }

  function resetInterfaceKeepData() {
    state.theme = 'system';
    state.ui = { glassOpacity: 68, glassBlur: 20, animationLevel: 'normal', selfDevTargetMinutes: state.ui?.selfDevTargetMinutes || 60 };
    state.homeWidgets = { todayCenter: true, planner: true, weeklyRings: true, eveningReport: true, timeline: true, quickTemplates: true, insights: true, mood: true };
    state.ringSlots = ['work', 'sport', 'self'];
    calendarFilter = 'all';
    saveState();
    renderAll();
    toast('Интерфейс сброшен, данные сохранены.');
  }

  async function exportDiagnosticFile() {
    const diag = await collectDiagnostics();
    const payload = {
      diagnostics: diag,
      statePreview: {
        version: state.version,
        dataVersion: state.dataVersion,
        selectedDate: state.selectedDate,
        workConfig: state.workConfig,
        entriesCount: state.entries?.length || 0,
        goalsCount: state.goals?.length || 0,
        projectsCount: state.projects?.length || 0,
        updatedAt: state.updatedAt
      }
    };
    downloadFile(`lifeos-diagnostics-${todayKey()}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
    toast('Диагностический файл скачан.');
  }

  function showFatalError(error) {
    const message = error?.message || String(error || 'Неизвестная ошибка');
    console.error('LifeOS fatal error', error);
    setHealthError(error);
    const panel = $('#fatalErrorPanel');
    const text = $('#fatalErrorText');
    if (panel && text) {
      text.textContent = message;
      panel.hidden = false;
    } else {
      const fallback = document.createElement('div');
      fallback.style.cssText = 'position:fixed;inset:20px;z-index:99999;padding:18px;border-radius:24px;background:#111827;color:#fff;font:16px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;overflow:auto';
      fallback.innerHTML = `<h2>LifeOS восстановление</h2><p>${escapeHtml(message)}</p><button onclick="location.reload()" style="font:inherit;padding:12px 16px;border-radius:14px">Обновить</button>`;
      document.body.appendChild(fallback);
    }
  }

  function toDate(key) {
    return new Date(`${key}T00:00:00`);
  }

  function dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function activeConfig(config = state?.workConfig) {
    return cloneWorkConfig(config || DEFAULT_WORK_CONFIG);
  }

  function periodStart(config = state?.workConfig) {
    return activeConfig(config).startDate;
  }

  function periodEnd(config = state?.workConfig) {
    return activeConfig(config).endDate;
  }

  function clampDate(key, config = state?.workConfig) {
    const start = periodStart(config);
    const end = periodEnd(config);
    if (!key || key < start) return start;
    if (key > end) return end;
    return key;
  }

  function formatDate(key, options = {}) {
    return toDate(key).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short', ...options });
  }

  function formatPeriodTitle() {
    const start = toDate(periodStart());
    const end = toDate(periodEnd());
    const compact = window.matchMedia && window.matchMedia('(max-width: 520px)').matches;
    if (compact) {
      const s = start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');
      const e = end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '');
      return `${s} — ${e}`;
    }
    return `${formatDate(periodStart(), { year: 'numeric' })} — ${formatDate(periodEnd(), { year: 'numeric' })}`;
  }

  function addDays(key, amount) {
    const d = toDate(key);
    d.setDate(d.getDate() + amount);
    return dateKey(d);
  }

  function allDates(config = state?.workConfig) {
    const out = [];
    const start = periodStart(config);
    const end = periodEnd(config);
    let cursor = start;
    while (cursor <= end) {
      out.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return out;
  }

  function timeToMinutes(value) {
    if (!value || !value.includes(':')) return 0;
    const [h, m] = value.split(':').map(Number);
    return h * 60 + m;
  }

  function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function hm(minutes, compact = true) {
    minutes = Math.max(0, Math.round(minutes));
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (compact) {
      if (h && m) return `${h}ч ${m}м`;
      if (h) return `${h}ч`;
      return `${m}м`;
    }
    return `${h} ч ${m} мин`;
  }

  function percent(part, total) {
    if (!total) return 0;
    return Math.max(0, Math.min(100, Math.round((part / total) * 100)));
  }

  function workPlan(date, config = state?.workConfig) {
    const d = toDate(date);
    const day = String(d.getDay());
    const cfg = activeConfig(config);
    const item = cfg.schedule?.[day] || DEFAULT_WORK_CONFIG.schedule[day];
    if (!item?.enabled) return { minutes: 0, start: null, end: null, label: 'Выходной' };
    const start = item.start || '10:00';
    const end = item.end || '17:00';
    const minutes = Math.max(0, timeToMinutes(end) - timeToMinutes(start));
    const label = `${DAY_LABELS.find(([id]) => id === day)?.[1] || ''} ${start}–${end}`;
    return { minutes, start, end, label };
  }

  function totalPlannedMinutes(config = state?.workConfig) {
    return allDates(config).reduce((sum, date) => sum + workPlan(date, config).minutes, 0);
  }

  function scheduleSummary(config = state?.workConfig) {
    const cfg = activeConfig(config);
    const enabled = DAY_LABELS.filter(([day]) => cfg.schedule[day]?.enabled);
    if (!enabled.length) return 'Рабочие дни не выбраны';
    return enabled.map(([day, label]) => `${label}: ${cfg.schedule[day].start}–${cfg.schedule[day].end}`).join(' · ');
  }

  function isPastOrToday(key) {
    return key <= todayKey();
  }

  function getMeta(date = state.selectedDate) {
    if (!state.dayMeta[date]) state.dayMeta[date] = { mood: '', note: '', openedAt: '', closedAt: '' };
    return state.dayMeta[date];
  }

  function normalizeType(type) {
    return String(type || '').trim();
  }

  function isWorkType(type) {
    return normalizeType(type).toLowerCase().includes('работ');
  }

  function dayEntries(date = state.selectedDate) {
    return state.entries
      .filter((entry) => entry.date === date)
      .sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
  }

  function mergeIntervals(intervals) {
    const sorted = intervals
      .filter((x) => x.end > x.start)
      .sort((a, b) => a.start - b.start);
    const merged = [];
    for (const interval of sorted) {
      const last = merged[merged.length - 1];
      if (!last || interval.start > last.end) merged.push({ ...interval });
      else last.end = Math.max(last.end, interval.end);
    }
    return merged;
  }

  function workMinutesForDay(date) {
    const plan = workPlan(date);
    if (!plan.minutes) return 0;
    const planStart = timeToMinutes(plan.start);
    const planEnd = timeToMinutes(plan.end);
    const intervals = dayEntries(date)
      .filter((entry) => isWorkType(entry.type))
      .map((entry) => ({
        start: Math.max(timeToMinutes(entry.start), planStart),
        end: Math.min(timeToMinutes(entry.end), planEnd)
      }));
    const merged = mergeIntervals(intervals);
    return Math.min(plan.minutes, merged.reduce((sum, item) => sum + item.end - item.start, 0));
  }

  function totalMinutesForDay(date) {
    const intervals = dayEntries(date).map((entry) => ({ start: timeToMinutes(entry.start), end: timeToMinutes(entry.end) }));
    return mergeIntervals(intervals).reduce((sum, item) => sum + item.end - item.start, 0);
  }

  function typeMinutesForDay(date) {
    const map = new Map();
    dayEntries(date).forEach((entry) => {
      const mins = Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start));
      map.set(entry.type, (map.get(entry.type) || 0) + mins);
    });
    return map;
  }

  function dayStatus(date) {
    const plan = workPlan(date);
    const work = workMinutesForDay(date);
    if (!plan.minutes) return { status: 'off', label: 'Выходной', plan, work, pct: 100 };
    if (work >= plan.minutes) return { status: 'done', label: 'Полный рабочий день', plan, work, pct: 100 };
    if (work > 0) return { status: 'partial', label: 'Частично закрыто', plan, work, pct: percent(work, plan.minutes) };
    if (isPastOrToday(date)) return { status: 'missed', label: 'Пустой рабочий день', plan, work, pct: 0 };
    return { status: 'future', label: 'Запланировано', plan, work, pct: 0 };
  }

  function periodStats() {
    const dates = allDates();
    let plan = 0;
    let planPast = 0;
    let work = 0;
    let workPast = 0;
    let fullDays = 0;
    let partialDays = 0;
    let missedDays = 0;
    let workDays = 0;
    let futureWorkDays = 0;
    let best = { date: '', minutes: 0 };
    const today = todayKey();

    dates.forEach((date) => {
      const p = workPlan(date).minutes;
      const w = workMinutesForDay(date);
      plan += p;
      work += w;
      if (p) workDays++;
      if (date <= today) {
        planPast += p;
        workPast += w;
      } else if (p) futureWorkDays++;
      const st = dayStatus(date).status;
      if (st === 'done') fullDays++;
      if (st === 'partial') partialDays++;
      if (st === 'missed') missedDays++;
      if (w > best.minutes) best = { date, minutes: w };
    });

    return {
      plan,
      planPast,
      work,
      workPast,
      left: Math.max(0, plan - work),
      lostPast: Math.max(0, planPast - workPast),
      fullDays,
      partialDays,
      missedDays,
      workDays,
      futureWorkDays,
      best,
      pct: percent(work, plan),
      pctPast: percent(workPast, planPast)
    };
  }

  function currentStreak() {
    let date = clampDate(todayKey());
    let streak = 0;
    while (date >= periodStart()) {
      const st = dayStatus(date);
      if (!st.plan.minutes) {
        date = addDays(date, -1);
        continue;
      }
      if (st.status !== 'done') break;
      streak++;
      date = addDays(date, -1);
    }
    return streak;
  }

  function remainingWorkdaysFrom(dateKeyValue = todayKey()) {
    return allDates().filter((d) => d >= dateKeyValue && workPlan(d).minutes > 0).length;
  }

  function earnedXp() {
    const stats = periodStats();
    const focus = state.focusSessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
    const sport = sportEntries().reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const self = selfDevEntries().reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const notes = Object.values(state.dayMeta).filter((m) => m.note && m.note.trim()).length;
    const habitChecks = Object.values(state.habitChecks).reduce((sum, checks) => sum + Object.values(checks || {}).filter(Boolean).length, 0);
    const backups = Number(localStorageSafeGet('lifeos.lastBackupCount') || 0);
    return Math.round(stats.fullDays * 90 + stats.partialDays * 35 + Math.floor(focus / 25) * 25 + Math.floor(sport / 30) * 12 + Math.floor(self / 30) * 14 + notes * 10 + habitChecks * 8 + backups * 40);
  }

  function levelFromXp(xp) {
    const level = Math.max(1, Math.floor(Math.sqrt(xp / 85)) + 1);
    const currentBase = 85 * (level - 1) * (level - 1);
    const nextBase = 85 * level * level;
    return { level, currentBase, nextBase, into: xp - currentBase, need: nextBase - currentBase, pct: percent(xp - currentBase, nextBase - currentBase) };
  }

  function localStorageSafeGet(key) {
    return storageGet(key);
  }

  function localStorageSafeSet(key, value) {
    storageSet(value, key);
  }

  function setSelectedDate(date) {
    state.selectedDate = clampDate(date);
    $('#selectedDate').value = state.selectedDate;
    $('#entryDate').value = state.selectedDate;
    if ($('#sportDate')) $('#sportDate').value = state.selectedDate;
    if ($('#selfDate')) $('#selfDate').value = state.selectedDate;
    if ($('#bookDate')) $('#bookDate').value = state.selectedDate;
    if ($('#courseDate')) $('#courseDate').value = state.selectedDate;
    saveState();
    renderAll();
  }

  function toast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    el.classList.add('show');
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => {
      el.classList.remove('show');
      el.hidden = true;
    }, 2600);
  }

  function downloadFile(filename, content, type = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  function applyTheme() {
    const theme = state.theme || 'system';
    const ui = state.ui || {};
    document.body.dataset.theme = theme;
    document.body.dataset.animation = ui.animationLevel || 'normal';
    document.documentElement.style.setProperty('--glass-alpha', String(Math.max(35, Math.min(92, Number(ui.glassOpacity ?? 68))) / 100));
    document.documentElement.style.setProperty('--blur', `${Math.max(6, Math.min(34, Number(ui.glassBlur ?? 20)))}px`);
    if ($('#themeSelect')) $('#themeSelect').value = theme;
    if ($('#settingsThemeSelect')) $('#settingsThemeSelect').value = theme;
  }

  function renderScheduleGrid(containerSelector, prefix, config = state.workConfig) {
    const container = $(containerSelector);
    if (!container) return;
    const cfg = activeConfig(config);
    container.innerHTML = DAY_LABELS.map(([day, label]) => {
      const item = cfg.schedule[day] || DEFAULT_WORK_CONFIG.schedule[day];
      return `
        <div class="schedule-row" data-day="${day}">
          <label class="schedule-toggle"><input type="checkbox" id="${prefix}Day${day}" ${item.enabled ? 'checked' : ''}> <strong>${label}</strong></label>
          <label class="schedule-time"><span>Начало</span><input class="input" type="time" id="${prefix}Start${day}" value="${escapeHtml(item.start)}" step="60"></label>
          <label class="schedule-time"><span>Конец</span><input class="input" type="time" id="${prefix}End${day}" value="${escapeHtml(item.end)}" step="60"></label>
        </div>
      `;
    }).join('');
  }

  function fillConfigForm(prefix, config = state.workConfig) {
    const cfg = activeConfig(config);
    const start = $(`#${prefix}StartDate`);
    const end = $(`#${prefix}EndDate`);
    const workouts = $(`#${prefix}WorkoutTarget`);
    if (start) start.value = cfg.startDate;
    if (end) end.value = cfg.endDate;
    if (workouts) workouts.value = cfg.targetWorkoutsPerWeek;
    renderScheduleGrid(prefix === 'setup' ? '#setupScheduleGrid' : '#settingsScheduleGrid', prefix, cfg);
  }

  function readConfigForm(prefix) {
    const startDate = $(`#${prefix}StartDate`)?.value || DEFAULT_START;
    const endDate = $(`#${prefix}EndDate`)?.value || DEFAULT_END;
    const schedule = {};
    DAY_LABELS.forEach(([day]) => {
      const enabled = Boolean($(`#${prefix}Day${day}`)?.checked);
      let start = $(`#${prefix}Start${day}`)?.value || DEFAULT_WORK_CONFIG.schedule[day].start;
      let end = $(`#${prefix}End${day}`)?.value || DEFAULT_WORK_CONFIG.schedule[day].end;
      if (timeToMinutes(end) <= timeToMinutes(start)) end = minutesToTime(Math.min(23 * 60 + 59, timeToMinutes(start) + 60));
      schedule[day] = { enabled, start, end };
    });
    const targetWorkoutsPerWeek = Math.max(0, Math.min(14, Number($(`#${prefix}WorkoutTarget`)?.value || 0)));
    const normalized = cloneWorkConfig({ startDate, endDate: endDate < startDate ? startDate : endDate, targetWorkoutsPerWeek, schedule });
    return normalized;
  }

  function applyWorkConfig(config, onboardingDone = state.onboardingDone) {
    state.workConfig = cloneWorkConfig(config);
    state.onboardingDone = onboardingDone;
    state.selectedDate = clampDate(state.selectedDate || todayKey());
    const workGoal = state.goals.find((goal) => goal.auto === 'workHours');
    if (workGoal) workGoal.target = Math.max(1, Math.round(totalPlannedMinutes() / 60));
    saveState();
    renderAll();
  }

  function renderConfigForms() {
    fillConfigForm('setup');
    fillConfigForm('config');
  }

  function renderOnboarding() {
    const panel = $('#onboarding');
    if (!panel) return;
    panel.classList.toggle('hidden', Boolean(state.onboardingDone));
  }

  function renderAll() {
    applyTheme();
    updateStorageBanner();
    renderDiagnostics().catch(() => {});
    renderOnboarding();
    renderHero();
    renderRings();
    renderWeeklyRings();
    renderDashboard();
    renderWork();
    renderDay();
    renderCalendar();
    renderJournal();
    renderGoals();
    renderHabits();
    renderFocus();
    renderActiveTimers();
    renderSport();
    renderSelfDev();
    renderBooks();
    renderCourses();
    renderMoney();
    renderProjects();
    renderAchievements();
    renderFinanceForm();
    renderConfigForms();
    renderCustomTypeSettings();
    renderEntryTypeOptions();
    renderSportTypeOptions();
    renderSelfTypeOptions();
    renderDesignSettings();
    renderEnhancementSettings();
    renderHistoryDays();
    renderMiniMode();
    renderProfileSettings();
    renderReportPreview(false);
  }

  function renderHero() {
    const stats = periodStats();
    const xp = earnedXp();
    const lvl = levelFromXp(xp);
    $('#metricPercent').textContent = `${stats.pct}%`;
    $('#metricWork').textContent = hm(stats.work);
    $('#metricLeft').textContent = hm(stats.left);
    $('#metricLevel').textContent = `Lv. ${lvl.level}`;
    $('#heroPeriodTitle').textContent = formatPeriodTitle();
    $('#heroScheduleSummary').textContent = `${scheduleSummary()} · спорт: ${activeConfig().targetWorkoutsPerWeek} трен./нед.`;
    $('#reportPeriodTitle').textContent = `${periodStart()} — ${periodEnd()}`;
    syncDateInputs();
    const need = stats.futureWorkDays ? Math.ceil(stats.left / stats.futureWorkDays) : stats.left;
    const delta = stats.workPast - stats.planPast;
    const statusText = delta >= 0
      ? `Идёшь по плану: запас ${hm(delta)}. Всего закрыто ${hm(stats.work)} из ${hm(stats.plan)}.`
      : `Антихаос: отставание ${hm(Math.abs(delta))}. Нужно в среднем ${hm(need)} в каждый оставшийся рабочий день.`;
    $('#heroAlert').textContent = statusText;
  }

  function syncDateInputs() {
    ['#selectedDate', '#entryDate', '#sportDate', '#selfDate', '#bookDate', '#courseDate'].forEach((selector) => {
      const input = $(selector);
      if (!input) return;
      input.min = periodStart();
      input.max = periodEnd();
      if (!input.value || input.value < periodStart() || input.value > periodEnd()) input.value = state.selectedDate;
    });
  }

  function renderDashboard() {
    const date = state.selectedDate;
    const st = dayStatus(date);
    const meta = getMeta(date);
    $('#selectedDate').value = date;
    $('#entryDate').value = date;
    $('#todayHeading').textContent = formatDate(date, { year: 'numeric' });
    $('#dayPercent').textContent = st.plan.minutes ? `${st.pct}%` : 'OFF';
    $('#dayOrb').style.background = `conic-gradient(${statusColor(st.status)} ${st.pct}%, rgba(148,163,184,.22) 0)`;
    $('#dayStatusTitle').textContent = st.label;
    $('#dayStatusText').textContent = dayStatusText(date);
    $('#dayPlanFact').textContent = `${hm(st.work)} / ${hm(st.plan.minutes)}`;
    $('#dayProgress').style.width = `${st.pct}%`;
    $('#startDayBtn').textContent = meta.openedAt ? 'День открыт' : 'Начать день';
    $('#closeDayBtn').textContent = meta.closedAt ? 'День закрыт' : 'Закрыть день';
    $('#fillWorkDayBtn').disabled = !st.plan.minutes;
    renderMood();
    $('#dailyNote').value = meta.note || '';
    renderInsights();
    renderPlanner();
    renderEveningReport();
    applyWidgetVisibility();
    renderQuickTemplates();
    renderTimelineVisual('#dashboardTimeline', date);
    renderEntries('#dashboardEntries', dayEntries(date).slice(0, 6), true);
    renderTodayCenter();
  }

  function statusColor(status) {
    return ({ done: 'var(--good)', partial: 'var(--warn)', missed: 'var(--bad)', future: 'var(--future)', off: 'var(--off)' })[status] || 'var(--accent)';
  }

  function dayStatusText(date) {
    const st = dayStatus(date);
    const meta = getMeta(date);
    if (!st.plan.minutes) return 'Воскресенье — выходной. Можно записывать личные дела, фокус или проекты без рабочего плана.';
    const lost = Math.max(0, st.plan.minutes - st.work);
    const flags = [];
    if (meta.openedAt) flags.push(`день открыт ${new Date(meta.openedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`);
    if (meta.closedAt) flags.push(`закрыт ${new Date(meta.closedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`);
    if (st.status === 'done') return `План закрыт. ${flags.join(' · ') || 'Можно добавить заметку и закрыть день.'}`;
    if (st.status === 'partial') return `Не хватает ${hm(lost)} до плана. ${flags.join(' · ')}`;
    if (st.status === 'future') return `План на день: ${st.plan.label}. Пока это будущий рабочий день.`;
    return `Записей работы нет. План: ${st.plan.label}.`;
  }


  function activeTimerInfo() {
    const active = state.activeTimer || {};
    if ((!active.running && !active.paused) || !active.startedAt) return null;
    const started = new Date(active.startedAt);
    const now = new Date();
    const accumulated = Number(active.accumulatedMs || 0);
    const liveMs = active.paused ? 0 : Math.max(0, now - started);
    const elapsedMs = Math.max(0, accumulated + liveMs);
    const elapsed = Math.max(0, Math.floor(elapsedMs / 60000));
    const seconds = Math.max(0, Math.floor(elapsedMs / 1000));
    const startMin = started.getHours() * 60 + started.getMinutes();
    return {
      ...active,
      started,
      date: dateKey(started),
      start: minutesToTime(startMin),
      elapsed,
      seconds,
      elapsedMs,
      label: active.category === 'work' ? 'Работа' : active.category === 'sport' ? 'Спорт' : active.category === 'self' ? 'Саморазвитие' : active.category === 'break' ? 'Перерыв' : (active.type || 'Активность')
    };
  }

  function formatHms(totalSeconds) {
    const sec = Math.max(0, Number(totalSeconds || 0));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function nextActionForToday(date = state.selectedDate) {
    const st = dayStatus(date);
    const active = activeTimerInfo();
    if (active) return `${active.paused ? 'Пауза' : 'Идёт'}: ${active.label.toLowerCase()} · ${formatHms(active.seconds)}. Сохрани интервал, когда закончишь.`;
    if (st.plan.minutes && st.work < st.plan.minutes) return `Добей работу: осталось ${hm(st.plan.minutes - st.work)} до плана дня.`;
    const sportTarget = Math.max(0, Number(activeConfig().targetWorkoutsPerWeek || 0));
    const sportWeek = weekEntriesFrom(sportEntries(), date).length;
    if (sportTarget && sportWeek < sportTarget) return `Спорт: осталось ${sportTarget - sportWeek} трен. до недельной цели.`;
    const selfLeft = Math.max(0, selfDevTargetMinutes() - minutesForEntries(entriesForCategoryId('self', date)));
    if (selfLeft > 0) return `Саморазвитие: можно закрыть ещё ${hm(selfLeft)} — книга, курс, проект или свой вариант.`;
    if (!getMeta(date).note) return 'День почти собран. Добавь короткую заметку как в Apple Journal.';
    return 'Сегодня закрыт ровно. Можно посмотреть историю дня или сделать бэкап.';
  }

  function renderTodayCenter() {
    const box = $('#todayCenter');
    if (!box) return;
    const date = state.selectedDate;
    const data = ringStats(date);
    const pcts = data.map((item) => Math.min(100, Math.max(0, item.pct || 0)));
    const avg = Math.round(pcts.reduce((a, b) => a + b, 0) / Math.max(1, pcts.length));
    const active = activeTimerInfo();
    $('#todayCenterTitle').textContent = formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' });
    $('#todayNextAction').textContent = nextActionForToday(date);
    const mini = $('#todayMiniRings');
    mini.style.setProperty('--work-pct', `${pcts[0] || 0}%`);
    mini.style.setProperty('--sport-pct', `${pcts[1] || 0}%`);
    mini.style.setProperty('--self-pct', `${pcts[2] || 0}%`);
    $('#todayMiniCenter').textContent = `${avg}%`;
    $('#todayRingRows').innerHTML = data.map((item, index) => `
      <div class="today-ring-row ring-${index}">
        <span class="ring-dot"></span>
        <div><strong>${escapeHtml(item.icon)} ${escapeHtml(item.label)}</strong><p>${escapeHtml(item.value)} · ${escapeHtml(item.sub)}</p></div>
      </div>
    `).join('');
    $('#todayActiveState').innerHTML = active ? `
      <div class="active-session running ${active.paused ? 'paused' : ''}">
        <div><strong>${active.paused ? 'Пауза' : 'Сейчас'}: ${escapeHtml(active.label)}</strong><p>Старт ${escapeHtml(active.start)} · ${escapeHtml(formatHms(active.seconds))}</p></div>
        <div class="button-row mini-actions">
          <button class="soft-btn" data-jump="timers" type="button">Открыть таймер</button>
          <button class="primary-btn" id="finishActiveTimerBtn" type="button">Сохранить</button>
          <button class="soft-btn" id="cancelActiveTimerBtn" type="button">Отменить</button>
        </div>
      </div>
    ` : `
      <div class="active-session">
        <div><strong>Активного интервала нет</strong><p>Запусти живой таймер: работа, спорт или саморазвитие. При завершении запись попадёт в журнал.</p></div>
        <button class="soft-btn" data-jump="timers" type="button">Открыть таймеры</button>
      </div>
    `;
  }

  function studioOptionsForCategory(category) {
    if (category === 'sport') return [...BASE_SPORT_TYPES, ...(state.sportTypes || [])];
    if (category === 'self') return [...BASE_SELF_TYPES, ...(state.selfDevTypes || [])];
    if (category === 'break') return ['Перерыв', 'Обед', 'Прогулка', 'Отдых'];
    if (category === 'custom') return [...BASE_TYPES, ...(state.customTypes || []), 'Другое'];
    return ['Работа', 'GitHub-проект', 'Фокус-сессия', 'Документы', 'Встреча'];
  }

  function renderStudioTypeOptions() {
    const select = $('#studioType');
    if (!select) return;
    const category = $('#studioCategory')?.value || state.activeTimer?.category || 'work';
    const current = select.value;
    select.innerHTML = studioOptionsForCategory(category).map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
    if (current && Array.from(select.options).some((opt) => opt.value === current)) select.value = current;
    if (category === 'custom') select.value = select.value || 'Другое';
    $('#studioCustomWrap')?.classList.toggle('hidden', category !== 'custom' && select.value !== 'Другое' && select.value !== 'Свой вариант' && select.value !== 'Свой спорт');
  }

  function renderActiveTimers() {
    renderStudioTypeOptions();
    const active = activeTimerInfo();
    const label = $('#studioStateLabel');
    const elapsed = $('#studioElapsed');
    const sub = $('#studioSubline');
    if (label && elapsed && sub) {
      if (active) {
        label.textContent = active.paused ? 'Пауза активного интервала' : `Идёт: ${active.label}`;
        elapsed.textContent = formatHms(active.seconds);
        sub.textContent = `${active.type || active.label} · старт ${active.start} · ${active.note || 'без заметки'}`;
      } else {
        label.textContent = 'Активного интервала нет';
        elapsed.textContent = '00:00:00';
        sub.textContent = 'Выбери тип активности и запусти таймер.';
      }
    }
    $('#studioStartBtn')?.toggleAttribute('disabled', Boolean(active && !active.paused));
    $('#studioPauseBtn')?.toggleAttribute('disabled', Boolean(!active || active.paused));
    $('#studioResumeBtn')?.toggleAttribute('disabled', Boolean(!active || !active.paused));
    $('#studioFinishBtn')?.toggleAttribute('disabled', Boolean(!active));
    $('#studioCancelBtn')?.toggleAttribute('disabled', Boolean(!active));
    const history = (state.activeTimerHistory || []).slice().sort((a, b) => (b.endedAt || '').localeCompare(a.endedAt || '')).slice(0, 12).map((s) => ({
      id: s.id, date: s.date, start: s.start, end: s.end, type: s.type || s.label || 'Таймер', note: `${s.label || 'Активность'} · ${hm(s.minutes || 0)} · ${s.saved ? 'сохранено в журнал' : 'без записи'}`
    }));
    renderEntries('#activeTimerHistory', history, true);
  }

  function startActiveTimer(category, type, note = '') {
    const active = activeTimerInfo();
    if (active && !active.paused) return toast('Сначала сохрани или поставь на паузу текущий интервал.');
    if (active && active.paused) return resumeActiveTimer();
    state.activeTimer = { running: true, paused: false, category, type, startedAt: new Date().toISOString(), pausedAt: '', accumulatedMs: 0, note: note || 'Живой таймер LifeOS v14', source: 'active-timer' };
    saveState(); renderAll(); toast(`${type} запущено.`);
  }

  function pauseActiveTimer() {
    const active = state.activeTimer || {};
    if (!active.running || active.paused || !active.startedAt) return toast('Нет активного таймера для паузы.');
    const elapsedLive = Math.max(0, Date.now() - new Date(active.startedAt).getTime());
    state.activeTimer = { ...active, running: false, paused: true, pausedAt: new Date().toISOString(), accumulatedMs: Number(active.accumulatedMs || 0) + elapsedLive };
    saveState(); renderAll(); toast('Таймер на паузе.');
  }

  function resumeActiveTimer() {
    const active = state.activeTimer || {};
    if (!active.paused) return toast('Таймер не на паузе.');
    state.activeTimer = { ...active, running: true, paused: false, startedAt: new Date().toISOString(), pausedAt: '' };
    saveState(); renderAll(); toast('Таймер продолжен.');
  }

  function startBreakTimer() {
    const active = activeTimerInfo();
    if (active && !active.paused) pauseActiveTimer();
    startActiveTimer('break', 'Перерыв', 'Перерыв из Active Timer');
  }

  function pushTimerHistory(active, end, saved) {
    state.activeTimerHistory = Array.isArray(state.activeTimerHistory) ? state.activeTimerHistory : [];
    state.activeTimerHistory.push({
      id: uid(),
      date: active.date,
      category: active.category,
      type: active.type,
      label: active.label,
      start: active.start,
      end,
      minutes: Math.max(1, active.elapsed),
      seconds: active.seconds,
      startedAt: active.started.toISOString(),
      endedAt: new Date().toISOString(),
      note: active.note || '',
      saved: Boolean(saved)
    });
    state.activeTimerHistory = state.activeTimerHistory.slice(-80);
  }

  function finishActiveTimer() {
    const active = activeTimerInfo();
    if (!active) return toast('Активного интервала нет.');
    const now = new Date();
    const end = minutesToTime(now.getHours() * 60 + now.getMinutes());
    const start = active.start;
    const validWallClock = timeToMinutes(end) > timeToMinutes(start);
    let saved = false;
    if (validWallClock && active.elapsed >= 1) {
      if (active.category === 'sport') {
        addSportEntry({ date: active.date, start, end, activity: active.type || 'Тренировка', intensity: 'Средняя', calories: 0, note: active.note || 'Живой таймер спорта' });
      } else if (active.category === 'self') {
        addSelfEntry({ date: active.date, start, end, activity: active.type || 'Саморазвитие', note: active.note || 'Живой таймер саморазвития' });
      } else if (active.category === 'break') {
        addEntry({ date: active.date, start, end, type: active.type || 'Перерыв', note: active.note || 'Живой таймер перерыва' });
      } else {
        addEntry({ date: active.date, start, end, type: active.type || 'Работа', note: active.note || 'Живой таймер работы' });
      }
      saved = true;
    }
    pushTimerHistory(active, end, saved);
    state.activeTimer = { running: false, paused: false, category: '', type: '', startedAt: '', pausedAt: '', accumulatedMs: 0, note: '', source: '' };
    saveState(); renderAll(); toast(saved ? 'Интервал завершён и сохранён.' : 'Интервал завершён. Запись не добавлена: слишком коротко или переход через полночь.');
  }

  function cancelActiveTimer() {
    const active = activeTimerInfo();
    if (active) pushTimerHistory(active, minutesToTime(new Date().getHours() * 60 + new Date().getMinutes()), false);
    state.activeTimer = { running: false, paused: false, category: '', type: '', startedAt: '', pausedAt: '', accumulatedMs: 0, note: '', source: '' };
    saveState(); renderAll(); toast('Активный интервал отменён.');
  }

  function startStudioPreset(preset) {
    const map = {
      work: ['work', 'Работа', 'Рабочий интервал'],
      sport: ['sport', 'Тренировка', 'Тренировка из быстрого запуска'],
      'self-project': ['self', 'Проект', 'Саморазвитие: проект'],
      book: ['self', 'Книга', 'Чтение / заметки'],
      course: ['self', 'Курс', 'Курс / урок'],
      break: ['break', 'Перерыв', 'Перерыв']
    };
    const item = map[preset];
    if (!item) return;
    $('#studioCategory') && ($('#studioCategory').value = item[0]);
    renderStudioTypeOptions();
    $('#studioType') && ($('#studioType').value = item[1]);
    $('#studioNote') && ($('#studioNote').value = item[2]);
    startActiveTimer(item[0], item[1], item[2]);
  }

  function renderMood() {
    const meta = getMeta(state.selectedDate);
    $('#moodRow').innerHTML = MOODS.map(([emoji, label]) => `
      <button class="mood-btn ${meta.mood === label ? 'active' : ''}" data-mood="${label}" title="${label}">${emoji}</button>
    `).join('');
  }

  function renderInsights() {
    const stats = periodStats();
    const date = state.selectedDate;
    const st = dayStatus(date);
    const today = todayKey();
    const items = [];

    if (st.plan.minutes && st.status === 'missed') {
      items.push(['Рабочий день пустой', `На ${formatDate(date)} нет записей работы. Добавь интервал или засчитай план дня.`]);
    }
    if (st.plan.minutes && st.status === 'partial') {
      items.push(['День не добит', `Не хватает ${hm(st.plan.minutes - st.work)} до полного зачёта.`]);
    }
    if (stats.lostPast > 0) {
      const remaining = Math.max(1, remainingWorkdaysFrom(today));
      items.push(['Антихаос', `Отставание от текущего темпа: ${hm(stats.lostPast)}. Для выравнивания нужно добавить примерно ${hm(Math.ceil(stats.lostPast / remaining))} в каждый оставшийся рабочий день.`]);
    } else {
      items.push(['Темп нормальный', `По текущей дате план не проседает. Запас: ${hm(Math.max(0, stats.workPast - stats.planPast))}.`]);
    }
    const emptyWorkDays = allDates().filter((d) => d <= today && workPlan(d).minutes && workMinutesForDay(d) === 0).length;
    if (emptyWorkDays) items.push(['Пустые дни', `Найдено рабочих дней без записей: ${emptyWorkDays}. Они отмечены красным в календаре.`]);
    const lastBackup = localStorageSafeGet('lifeos.lastBackupAt');
    if (!lastBackup || Date.now() - new Date(lastBackup).getTime() > 7 * 24 * 60 * 60 * 1000) {
      items.push(['Бэкап', 'Давно не было экспорта JSON. Сделай резервную копию, чтобы не потерять локальные данные.']);
    }
    items.push(['До 31 августа', `Осталось рабочих дней: ${stats.futureWorkDays}. Остаток периода: ${hm(stats.left)}.`]);

    $('#insightList').innerHTML = items.map(([title, text]) => `<div class="insight"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div>`).join('');
  }

  function widgetEnabled(name) {
    return (state.homeWidgets || {})[name] !== false;
  }

  function applyWidgetVisibility() {
    $$('[data-widget]').forEach((el) => {
      const name = el.dataset.widget;
      el.hidden = !widgetEnabled(name);
    });
    const quickPanel = $('#quickTemplates')?.closest('.panel');
    if (quickPanel) quickPanel.hidden = !widgetEnabled('quickTemplates');
    const moodPanel = $('#moodRow')?.closest('.panel');
    if (moodPanel) moodPanel.hidden = !widgetEnabled('mood');
    const insightPanel = $('#insightList')?.closest('.panel');
    if (insightPanel) insightPanel.hidden = !widgetEnabled('insights');
  }

  function smartPlanItems(date = state.selectedDate) {
    const plan = workPlan(date);
    const items = [];
    if (plan.minutes) {
      items.push({ icon: '💼', title: 'Работа', time: plan.label, note: 'Основной план рабочего дня' });
      const start = timeToMinutes(plan.start);
      const end = timeToMinutes(plan.end);
      const lunch = Math.min(end - 20, Math.max(start + 180, 13 * 60));
      if (end - start > 240) items.push({ icon: '🍽️', title: 'Перерыв', time: `${minutesToTime(lunch)}–${minutesToTime(Math.min(end, lunch + 30))}`, note: 'Не считается работой, но помогает держать ритм' });
    } else {
      items.push({ icon: '🧊', title: 'Выходной от работы', time: 'без рабочего плана', note: 'Можно закрыть спорт, книгу, курс или проект' });
    }
    const sportWeek = weekEntriesFrom(sportEntries(), date).length;
    const sportTarget = Math.max(0, Number(activeConfig().targetWorkoutsPerWeek || 0));
    if (sportTarget && sportWeek < sportTarget) items.push({ icon: '🏋️', title: 'Спорт', time: '30–60 мин', note: `Осталось тренировок на неделю: ${sportTarget - sportWeek}` });
    const selfMins = minutesForEntries(entriesForCategoryId('self', date));
    if (selfMins < selfDevTargetMinutes()) items.push({ icon: '✦', title: 'Саморазвитие', time: `${hm(selfDevTargetMinutes() - selfMins)}`, note: 'Книга, курс, проект, язык, кодинг или свой вариант' });
    return items;
  }

  function renderPlanner() {
    const box = $('#plannerBox');
    if (!box) return;
    const items = smartPlanItems();
    box.innerHTML = items.map((item) => `
      <div class="planner-item">
        <span>${escapeHtml(item.icon)}</span>
        <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.note)}</p></div>
        <b>${escapeHtml(item.time)}</b>
      </div>
    `).join('');
  }

  function acceptSmartPlan() {
    const plan = workPlan(state.selectedDate);
    if (plan.minutes && !workMinutesForDay(state.selectedDate)) {
      state.entries.push({ id: uid(), date: state.selectedDate, start: plan.start, end: plan.end, type: 'Работа', note: 'Добавлено из умного плана', auto: true, createdAt: new Date().toISOString() });
    }
    const meta = getMeta(state.selectedDate);
    meta.openedAt = meta.openedAt || new Date().toISOString();
    saveState(); renderAll(); toast('План дня принят.');
  }

  function renderEveningReport() {
    const box = $('#eveningReportBox');
    if (!box) return;
    const st = dayStatus(state.selectedDate);
    const sportMins = minutesForEntries(entriesForCategoryId('sport', state.selectedDate));
    const selfMins = minutesForEntries(entriesForCategoryId('self', state.selectedDate));
    const meta = getMeta(state.selectedDate);
    const ready = st.pct >= 100 || sportMins > 0 || selfMins > 0 || (meta.note || '').trim();
    box.innerHTML = `
      <div class="evening-grid">
        <div><span>Работа</span><strong>${hm(st.work)} / ${hm(st.plan.minutes)}</strong></div>
        <div><span>Спорт</span><strong>${hm(sportMins)}</strong></div>
        <div><span>Саморазвитие</span><strong>${hm(selfMins)}</strong></div>
      </div>
      <div class="journal-note">
        <strong>${ready ? 'День можно закрывать' : 'День пока пустой'}</strong>
        <p>${escapeHtml(meta.note || 'Добавь заметку дня, спорт или саморазвитие — отчёт станет информативнее.')}</p>
      </div>
    `;
  }

  function saveEveningReport() {
    const st = dayStatus(state.selectedDate);
    state.eveningReports = state.eveningReports || {};
    state.eveningReports[state.selectedDate] = {
      savedAt: new Date().toISOString(),
      work: st.work,
      workPlan: st.plan.minutes,
      sport: minutesForEntries(entriesForCategoryId('sport', state.selectedDate)),
      self: minutesForEntries(entriesForCategoryId('self', state.selectedDate)),
      note: getMeta(state.selectedDate).note || ''
    };
    getMeta(state.selectedDate).closedAt = getMeta(state.selectedDate).closedAt || new Date().toISOString();
    saveState(); renderAll(); toast('Вечерний отчёт сохранён.');
  }

  function renderHistoryDays() {
    const box = $('#historyList');
    if (!box) return;
    const dates = allDates().filter((date) => date <= todayKey()).reverse().slice(0, 45);
    box.innerHTML = dates.map((date) => {
      const st = dayStatus(date);
      const sport = minutesForEntries(entriesForCategoryId('sport', date));
      const self = minutesForEntries(entriesForCategoryId('self', date));
      const meta = getMeta(date);
      const count = dayEntries(date).length;
      return `
        <article class="journal-day ${st.status}" data-date="${date}">
          <div class="journal-day-head"><strong>${escapeHtml(formatDate(date, { year: 'numeric' }))}</strong><button class="mini-btn" data-date="${date}">Открыть</button></div>
          <div class="journal-day-metrics"><span>💼 ${hm(st.work)}</span><span>🏋️ ${hm(sport)}</span><span>✦ ${hm(self)}</span><span>${count} зап.</span></div>
          <p>${escapeHtml(meta.note || 'Заметки дня нет.')}</p>
        </article>
      `;
    }).join('');
  }

  function timeEatersData(days = 7) {
    const end = state.selectedDate;
    const startDateObj = toDate(end);
    startDateObj.setDate(startDateObj.getDate() - days + 1);
    const start = dateKey(startDateObj);
    const map = new Map();
    state.entries.filter((entry) => entry.date >= start && entry.date <= end).forEach((entry) => {
      const key = isSportType(entry.type) ? 'Спорт' : isSelfDevType(entry.type) ? 'Саморазвитие' : normalizeType(entry.type);
      map.set(key, (map.get(key) || 0) + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)));
    });
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]);
  }

  function renderQuickTemplates() {
    const plan = workPlan(state.selectedDate);
    const templates = [...QUICK_TEMPLATES, ...(state.customTemplates || [])];
    $('#quickTemplates').innerHTML = templates.map((template, index) => {
      const start = template.type === 'Работа' && plan.start ? plan.start : template.start;
      const end = template.type === 'Работа' && plan.end ? plan.end : template.end;
      const note = template.type === 'Работа' ? (plan.minutes ? plan.label : 'Сегодня выходной по графику') : template.note;
      return `
        <button class="quick-card" data-template="${index}">
          <strong>${template.icon} ${escapeHtml(template.type)}</strong>
          <span>${start}–${end}</span>
          <span>${escapeHtml(note)}</span>
        </button>
      `;
    }).join('');
  }

  function renderTimelineVisual(selector, date) {
    const container = $(selector);
    if (!container) return;
    const entries = dayEntries(date);
    const plan = workPlan(date);
    if (!entries.length && !plan.minutes) {
      container.innerHTML = '<div class="empty-state">Выходной. Записи появятся здесь после добавления интервалов.</div>';
      return;
    }
    if (!entries.length) {
      container.innerHTML = `<div class="empty-state">План ${plan.label}. Записей пока нет.</div>`;
      return;
    }
    const rawStart = Math.min(...entries.map((e) => timeToMinutes(e.start)), plan.start ? timeToMinutes(plan.start) : 24 * 60);
    const rawEnd = Math.max(...entries.map((e) => timeToMinutes(e.end)), plan.end ? timeToMinutes(plan.end) : 0);
    const start = Math.max(0, Math.floor(rawStart / 60) * 60);
    const end = Math.min(24 * 60, Math.ceil(rawEnd / 60) * 60);
    const total = Math.max(1, end - start);
    const segments = entries.map((entry) => {
      const s = timeToMinutes(entry.start);
      const e = timeToMinutes(entry.end);
      const left = ((s - start) / total) * 100;
      const width = ((e - s) / total) * 100;
      return `<div class="timebar-segment" title="${escapeHtml(entry.type)} ${entry.start}–${entry.end}" style="left:${left}%;width:${Math.max(width, 1.5)}%;background:${segmentBackground(entry.type)}">${width > 13 ? escapeHtml(entry.type) : ''}</div>`;
    }).join('');
    container.innerHTML = `
      <div class="timebar">${segments}</div>
      <div class="timeline-labels"><span>${minutesToTime(start)}</span><span>${minutesToTime(end)}</span></div>
    `;
  }

  function segmentBackground(type) {
    if (isWorkType(type)) return 'linear-gradient(90deg,var(--good),#22c55e)';
    if (type === 'Обед' || type === 'Отдых') return 'linear-gradient(90deg,var(--warn),#f97316)';
    if (type === 'Телефон' || type === 'Сон') return 'linear-gradient(90deg,var(--bad),#fb7185)';
    if (isSportType(type)) return 'linear-gradient(90deg,#06b6d4,#22c55e)';
    if (type === 'Прочее' || type === 'Другое') return 'linear-gradient(90deg,#94a3b8,#64748b)';
    return 'linear-gradient(90deg,var(--accent),var(--accent2))';
  }

  function renderEntries(selector, entries, compact = false) {
    const el = $(selector);
    if (!el) return;
    if (!entries.length) {
      el.innerHTML = '<div class="empty-state">Записей пока нет.</div>';
      return;
    }
    el.innerHTML = entries.map((entry) => entryCard(entry, compact)).join('');
  }

  function entryCard(entry, compact = false) {
    const minutes = Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start));
    return `
      <article class="entry-card" data-entry-id="${entry.id}">
        <div>
          <strong>${escapeHtml(entry.type)} · ${entry.start}–${entry.end} · ${hm(minutes)}</strong>
          <p>${formatDate(entry.date)}${entry.auto ? ' · авто-зачёт' : ''}${entry.sportActivity ? ' · ' + escapeHtml(entry.sportActivity) : ''}${entry.selfDevActivity ? ' · ' + escapeHtml(entry.selfDevActivity) : ''}${entry.intensity ? ' · ' + escapeHtml(entry.intensity) : ''}${entry.calories ? ' · ' + Number(entry.calories) + ' ккал' : ''}${entry.note ? ' · ' + escapeHtml(entry.note) : ''}</p>
        </div>
        ${compact ? '' : `<div class="entry-actions"><button class="mini-btn" data-duplicate-entry="${entry.id}">Дубль</button><button class="mini-btn" data-delete-entry="${entry.id}">Удалить</button></div>`}
      </article>
    `;
  }

  function renderWork() {
    const stats = periodStats();
    const remaining = Math.max(1, stats.futureWorkDays);
    const needPerDay = Math.ceil(stats.left / remaining);
    const delta = stats.workPast - stats.planPast;
    const metrics = [
      ['План', hm(stats.plan), 'весь период'],
      ['Факт', hm(stats.work), `${stats.pct}% выполнения`],
      ['Осталось', hm(stats.left), `~${hm(needPerDay)} / раб. день`],
      ['Полных дней', String(stats.fullDays), `из ${stats.workDays}`],
      ['Частичных', String(stats.partialDays), 'нужно добить'],
      ['Отставание', delta < 0 ? hm(Math.abs(delta)) : '0м', delta >= 0 ? `запас ${hm(delta)}` : 'от текущего плана']
    ];
    $('#workMetricGrid').innerHTML = metrics.map(([a, b, c]) => `<article class="metric"><span>${a}</span><strong>${b}</strong><span>${c}</span></article>`).join('');
    $('#workPeriodText').textContent = `${stats.pct}%`;
    $('#workPeriodProgress').style.width = `${stats.pct}%`;

    const problems = allDates()
      .map((date) => ({ date, ...dayStatus(date) }))
      .filter((item) => item.plan.minutes && ['missed', 'partial'].includes(item.status))
      .slice(0, 14);
    $('#problemDays').innerHTML = problems.length ? problems.map((item) => `
      <button class="problem-item day-pick" data-date="${item.date}">
        <strong>${formatDate(item.date)} — ${item.label}</strong>
        <p>${hm(item.work)} / ${hm(item.plan.minutes)} · не хватает ${hm(item.plan.minutes - item.work)}</p>
      </button>
    `).join('') : '<div class="empty-state">Проблемных рабочих дней пока нет.</div>';

    renderReasonStats();
  }

  function renderReasonStats() {
    const map = new Map();
    state.entries.forEach((entry) => {
      const mins = Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start));
      map.set(entry.type, (map.get(entry.type) || 0) + mins);
    });
    const rows = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const max = rows[0]?.[1] || 1;
    $('#reasonStats').innerHTML = rows.length ? rows.map(([type, mins]) => `
      <div class="reason-item"><strong>${escapeHtml(type)}</strong><span>${hm(mins)}</span><div class="reason-bar"><span style="width:${percent(mins, max)}%"></span></div></div>
    `).join('') : '<div class="empty-state">Статистика появится после записей.</div>';
  }

  function renderDay() {
    const date = state.selectedDate;
    const st = dayStatus(date);
    const meta = getMeta(date);
    $('#entryDate').value = date;
    $('#dayPanelTitle').textContent = formatDate(date, { year: 'numeric' });
    const typeMap = typeMinutesForDay(date);
    const typeRows = Array.from(typeMap.entries()).map(([type, mins]) => `<div class="plan-row"><span>${escapeHtml(type)}</span><strong>${hm(mins)}</strong></div>`).join('');
    $('#dayPlanBox').innerHTML = `
      <div class="plan-row"><span>График</span><strong>${st.plan.label}</strong></div>
      <div class="plan-row"><span>Работа</span><strong>${hm(st.work)} / ${hm(st.plan.minutes)}</strong></div>
      <div class="plan-row"><span>Потерянное рабочее время</span><strong>${hm(Math.max(0, st.plan.minutes - st.work))}</strong></div>
      <div class="plan-row"><span>Всего записано</span><strong>${hm(totalMinutesForDay(date))}</strong></div>
      <div class="plan-row"><span>День открыт</span><strong>${meta.openedAt ? new Date(meta.openedAt).toLocaleString('ru-RU') : 'нет'}</strong></div>
      <div class="plan-row"><span>День закрыт</span><strong>${meta.closedAt ? new Date(meta.closedAt).toLocaleString('ru-RU') : 'нет'}</strong></div>
      ${typeRows}
    `;
    renderTimelineVisual('#dayTimeline', date);
    renderEntries('#dayEntries', dayEntries(date));
  }

  function renderCalendar() {
    const dates = allDates();
    const filtered = dates.filter((date) => {
      const st = dayStatus(date);
      if (calendarFilter === 'all') return true;
      if (calendarFilter === 'work') return st.plan.minutes > 0;
      return st.status === calendarFilter;
    });
    $('#heatmap').innerHTML = dates.map((date) => {
      const st = dayStatus(date);
      return `<button class="heat-cell ${st.status} ${date === state.selectedDate ? 'active' : ''}" title="${formatDate(date)} · ${st.label}" data-date="${date}"></button>`;
    }).join('');
    $('#calendarGrid').innerHTML = filtered.map((date) => {
      const st = dayStatus(date);
      const meta = getMeta(date);
      return `
        <button class="day-card ${st.status} ${date === state.selectedDate ? 'active' : ''}" data-date="${date}">
          <span class="date">${formatDate(date)}</span>
          <small>${st.label}</small>
          <strong>${hm(st.work)} / ${hm(st.plan.minutes)}</strong>
          <small>${meta.mood ? 'Настроение: ' + escapeHtml(meta.mood) : 'Заметка: ' + (meta.note ? 'есть' : 'нет')}</small>
        </button>
      `;
    }).join('');
  }

  function allTypes() {
    const set = new Set([...BASE_TYPES, ...(state.customTypes || []), ...customCategories().map((cat) => cat.name)]);
    state.entries.forEach((entry) => set.add(entry.type));
    return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b, 'ru'));
  }

  function allSportTypes() {
    const set = new Set([...BASE_SPORT_TYPES, ...(state.sportTypes || [])]);
    sportEntries().forEach((entry) => {
      if (entry.sportActivity) set.add(entry.sportActivity);
      else if (entry.type.startsWith('Спорт: ')) set.add(entry.type.replace('Спорт: ', ''));
    });
    return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b, 'ru'));
  }

  function isSportType(type) {
    const normalized = normalizeType(type).toLowerCase();
    return normalized === 'спорт' || normalized === 'прогулка' || normalized.startsWith('спорт:');
  }

  function sportEntries() {
    return state.entries.filter((entry) => isSportType(entry.type) || entry.sportActivity);
  }

  function allSelfTypes() {
    const set = new Set([...BASE_SELF_TYPES, ...(state.selfDevTypes || [])]);
    selfDevEntries().forEach((entry) => {
      if (entry.selfDevActivity) set.add(entry.selfDevActivity);
      else if (entry.type.startsWith('Саморазвитие: ')) set.add(entry.type.replace('Саморазвитие: ', ''));
    });
    return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b, 'ru'));
  }

  function isSelfDevType(type) {
    const normalized = normalizeType(type).toLowerCase();
    return normalized === 'саморазвитие' || normalized.includes('саморазвит') || normalized.includes('книга') || normalized.includes('курс') || normalized.includes('проект') || normalized.includes('кодинг');
  }

  function selfDevEntries() {
    return state.entries.filter((entry) => isSelfDevType(entry.type) || entry.selfDevActivity);
  }

  function selfDevTargetMinutes() {
    return Math.max(0, Number(state.ui?.selfDevTargetMinutes ?? 60));
  }

  function customCategories() {
    return Array.isArray(state.customCategories) ? state.customCategories : [];
  }

  function entriesForCategoryId(id, date = state.selectedDate) {
    if (id === 'work') return dayEntries(date).filter((entry) => normalizeType(entry.type) === 'Работа');
    if (id === 'sport') return sportEntries().filter((entry) => entry.date === date);
    if (id === 'self') return selfDevEntries().filter((entry) => entry.date === date);
    const cat = customCategories().find((item) => item.id === id);
    if (!cat) return [];
    const name = normalizeType(cat.name).toLowerCase();
    return dayEntries(date).filter((entry) => {
      const type = normalizeType(entry.type).toLowerCase();
      const note = String(entry.note || '').toLowerCase();
      const sport = String(entry.sportActivity || '').toLowerCase();
      const self = String(entry.selfDevActivity || '').toLowerCase();
      return type === name || type.includes(name) || sport === name || self === name || note.includes(name);
    });
  }

  function minutesForEntries(entries) {
    return entries.reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
  }

  function categoryDescriptor(id, date = state.selectedDate) {
    const plan = workPlan(date);
    if (id === 'work') {
      const work = workMinutesForDay(date);
      const target = plan.minutes || 0;
      return { id, label: 'Работа', icon: '💼', pct: target ? percent(work, target) : 100, value: `${hm(work)} / ${hm(target)}`, sub: target ? plan.label : 'выходной', minutes: work, targetMinutes: target, color: 'work' };
    }
    if (id === 'sport') {
      const week = weekEntriesFrom(sportEntries(), date);
      const today = entriesForCategoryId('sport', date);
      const target = Math.max(1, Number(activeConfig().targetWorkoutsPerWeek || 1));
      return { id, label: 'Спорт', icon: '🏋️', pct: percent(week.length, target), value: `${week.length}/${target} нед.`, sub: today.length ? `${today.length} сегодня` : 'тренировки недели', minutes: minutesForEntries(today), targetMinutes: target * 45, color: 'sport' };
    }
    if (id === 'self') {
      const today = entriesForCategoryId('self', date);
      const minutes = minutesForEntries(today);
      const target = Math.max(1, selfDevTargetMinutes());
      return { id, label: 'Саморазвитие', icon: '✦', pct: percent(minutes, target), value: `${hm(minutes)} / ${hm(target)}`, sub: today.length ? `${today.length} сесс.` : 'проекты, книги, курсы', minutes, targetMinutes: target, color: 'self' };
    }
    const cat = customCategories().find((item) => item.id === id) || { name: 'Своя цель', icon: '✨', targetMinutes: 30, kind: 'other' };
    const entries = entriesForCategoryId(id, date);
    const minutes = minutesForEntries(entries);
    const target = Math.max(1, Number(cat.targetMinutes || 30));
    return { id, label: cat.name, icon: cat.icon || '✨', pct: percent(minutes, target), value: `${hm(minutes)} / ${hm(target)}`, sub: entries.length ? `${entries.length} сесс.` : 'свой трекер', minutes, targetMinutes: target, color: cat.kind || 'other' };
  }

  function ringSlotIds() {
    const slots = Array.isArray(state.ringSlots) && state.ringSlots.length === 3 ? state.ringSlots : ['work', 'sport', 'self'];
    return slots.map((slot, index) => slot || ['work','sport','self'][index]);
  }

  function weekEntriesFrom(entries, date = state.selectedDate) {
    return entries.filter((entry) => {
      const diff = Math.floor((toDate(date) - toDate(entry.date)) / (24 * 60 * 60 * 1000));
      return diff >= 0 && diff < 7;
    });
  }

  function ringStats(date = state.selectedDate) {
    const slots = ringSlotIds();
    return slots.map((slot) => categoryDescriptor(slot, date));
  }

  function renderRings() {
    const ring = $('#tripleRings');
    const list = $('#ringsList');
    if (!ring || !list) return;
    const data = ringStats();
    const pcts = data.map((item) => Math.min(100, Math.max(0, item.pct || 0)));
    ring.style.setProperty('--work-pct', `${pcts[0] || 0}%`);
    ring.style.setProperty('--sport-pct', `${pcts[1] || 0}%`);
    ring.style.setProperty('--self-pct', `${pcts[2] || 0}%`);
    const avg = Math.round(pcts.reduce((a, b) => a + b, 0) / Math.max(1, pcts.length));
    $('#ringsCenterLabel').textContent = `${avg}%`;
    list.innerHTML = data.map((item, index) => `
      <div class="ring-row ring-${index}">
        <span class="ring-dot"></span>
        <div><strong>${escapeHtml(item.icon)} ${escapeHtml(item.label)}</strong><p>${escapeHtml(item.sub)}</p></div>
        <b>${escapeHtml(item.value)}</b>
      </div>
    `).join('');
  }

  function currentWeekRange(date = state.selectedDate) {
    const d = toDate(date);
    const day = d.getDay() || 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: dateKey(monday), end: dateKey(sunday) };
  }

  function datesBetween(start, end) {
    const out = [];
    let d = toDate(start);
    const last = toDate(end);
    while (d <= last) { out.push(dateKey(d)); d.setDate(d.getDate() + 1); }
    return out;
  }

  function renderWeeklyRings() {
    const box = $('#weeklyRings');
    if (!box) return;
    const range = currentWeekRange();
    const dates = datesBetween(range.start, range.end);
    const workPlanWeek = dates.reduce((sum, d) => sum + workPlan(d).minutes, 0);
    const workFactWeek = dates.reduce((sum, d) => sum + workMinutesForDay(d), 0);
    const sportCount = sportEntries().filter((entry) => entry.date >= range.start && entry.date <= range.end).length;
    const sportTarget = Math.max(1, Number(activeConfig().targetWorkoutsPerWeek || 1));
    const selfMinutesWeek = selfDevEntries().filter((entry) => entry.date >= range.start && entry.date <= range.end).reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const selfTargetWeek = Math.max(1, selfDevTargetMinutes() * 7);
    const rows = [
      { icon: '💼', label: 'Работа недели', pct: percent(workFactWeek, workPlanWeek), value: `${hm(workFactWeek)} / ${hm(workPlanWeek)}` },
      { icon: '🏋️', label: 'Тренировки недели', pct: percent(sportCount, sportTarget), value: `${sportCount} / ${sportTarget}` },
      { icon: '✦', label: 'Саморазвитие недели', pct: percent(selfMinutesWeek, selfTargetWeek), value: `${hm(selfMinutesWeek)} / ${hm(selfTargetWeek)}` }
    ];
    box.innerHTML = rows.map((row, index) => `
      <article class="week-ring ring-${index}">
        <div class="mini-ring" style="--pct:${Math.min(100, row.pct)}%"><span>${row.icon}</span></div>
        <div><strong>${escapeHtml(row.label)}</strong><p>${escapeHtml(row.value)}</p></div>
      </article>
    `).join('');
  }

  function renderJournal() {
    const filterType = $('#filterType');
    const currentType = filterType.value || 'all';
    filterType.innerHTML = '<option value="all">Все типы</option>' + allTypes().map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
    filterType.value = allTypes().includes(currentType) ? currentType : 'all';

    const date = $('#filterDate').value;
    const type = filterType.value;
    const search = ($('#filterSearch').value || '').trim().toLowerCase();
    const entries = state.entries
      .filter((entry) => !date || entry.date === date)
      .filter((entry) => type === 'all' || entry.type === type)
      .filter((entry) => !search || `${entry.type} ${entry.note || ''}`.toLowerCase().includes(search))
      .sort((a, b) => b.date.localeCompare(a.date) || b.start.localeCompare(a.start));
    renderEntries('#journalList', entries);
  }

  function renderGoals() {
    const stats = periodStats();
    const streak = currentStreak();
    $('#goalsList').innerHTML = state.goals.map((goal) => {
      const current = goal.auto === 'workHours' ? Math.round(stats.work / 60) : goal.auto === 'streak' ? streak : Number(goal.current || 0);
      const pct = percent(current, Number(goal.target || 1));
      return `
        <article class="list-card">
          <strong>${escapeHtml(goal.name)}</strong>
          <p>${current} / ${goal.target} ${escapeHtml(goal.unit || '')}</p>
          <div class="progress"><span style="width:${pct}%"></span></div>
          ${goal.auto ? '<p>Автоматическая цель</p>' : `<div class="button-row"><button class="mini-btn" data-goal-inc="${goal.id}">+1</button><button class="mini-btn" data-goal-dec="${goal.id}">-1</button><button class="mini-btn" data-goal-del="${goal.id}">Удалить</button></div>`}
        </article>
      `;
    }).join('');
  }

  function renderHabits() {
    const date = state.selectedDate;
    const checks = state.habitChecks[date] || {};
    $('#habitList').innerHTML = state.habits.map((habit) => {
      const active = Boolean(checks[habit.id]);
      return `
        <article class="list-card">
          <label class="habit-row"><input type="checkbox" data-habit-check="${habit.id}" ${active ? 'checked' : ''}> <strong>${escapeHtml(habit.name)}</strong></label>
          <p>${escapeHtml(habit.desc || '')}</p>
          ${habit.id.startsWith('custom-') ? `<button class="mini-btn" data-habit-del="${habit.id}">Удалить</button>` : ''}
        </article>
      `;
    }).join('');
  }

  function renderFocus() {
    $('#timerDisplay').textContent = `${String(Math.floor(timer.seconds / 60)).padStart(2, '0')}:${String(timer.seconds % 60).padStart(2, '0')}`;
    const total = state.focusSessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
    const today = state.focusSessions.filter((s) => s.date === state.selectedDate).reduce((sum, s) => sum + (s.minutes || 0), 0);
    const stats = [
      ['Всего фокуса', hm(total), 'за период'],
      ['Сегодня', hm(today), 'выбранная дата'],
      ['Сессии', String(state.focusSessions.length), 'сохранено'],
      ['Средняя', state.focusSessions.length ? hm(total / state.focusSessions.length) : '0м', 'на сессию']
    ];
    $('#focusStats').innerHTML = stats.map(([a, b, c]) => `<article class="metric"><span>${a}</span><strong>${b}</strong><span>${c}</span></article>`).join('');
    const entries = state.focusSessions.slice().sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 10).map((s) => ({ id: s.id, date: s.date, start: s.start || '00:00', end: s.end || '00:00', type: 'Фокус-сессия', note: s.note || `${hm(s.minutes)} фокуса` }));
    renderEntries('#focusHistory', entries, true);
  }

  function sportStats() {
    const entries = sportEntries();
    const total = entries.reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const today = entries.filter((entry) => entry.date === state.selectedDate).reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const calories = entries.reduce((sum, entry) => sum + Number(entry.calories || 0), 0);
    const map = new Map();
    entries.forEach((entry) => {
      const activity = entry.sportActivity || (entry.type.startsWith('Спорт: ') ? entry.type.replace('Спорт: ', '') : entry.type);
      const mins = Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start));
      map.set(activity, (map.get(activity) || 0) + mins);
    });
    const favorite = Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0];
    return { entries, total, today, calories, favorite, byActivity: map };
  }

  function renderSport() {
    const box = $('#sportStats');
    if (!box) return;
    $('#sportDate').value = state.selectedDate;
    renderSportTypeOptions();
    renderSportQuickGrid();
    const stats = sportStats();
    const weekEntries = stats.entries.filter((entry) => {
      const diff = Math.floor((toDate(state.selectedDate) - toDate(entry.date)) / (24 * 60 * 60 * 1000));
      return diff >= 0 && diff < 7;
    });
    const thisWeek = weekEntries.reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const targetWorkouts = Number(activeConfig().targetWorkoutsPerWeek || 0);
    const metrics = [
      ['Всего спорта', hm(stats.total), `${stats.entries.length} записей`],
      ['Сегодня', hm(stats.today), 'выбранная дата'],
      ['За 7 дней', hm(thisWeek), `${weekEntries.length}/${targetWorkouts} трен.`],
      ['Недельная цель', `${percent(weekEntries.length, Math.max(1, targetWorkouts))}%`, targetWorkouts ? `${weekEntries.length} из ${targetWorkouts}` : 'цель выключена'],
      ['Калории', stats.calories ? `${stats.calories} ккал` : '—', 'по введённым данным'],
      ['Любимое', stats.favorite ? stats.favorite[0] : '—', stats.favorite ? hm(stats.favorite[1]) : 'нет данных'],
      ['Активности', String(stats.byActivity.size), 'видов спорта']
    ];
    box.innerHTML = metrics.map(([a, b, c]) => `<article class="metric"><span>${escapeHtml(a)}</span><strong>${escapeHtml(b)}</strong><span>${escapeHtml(c)}</span></article>`).join('');

    const insights = [];
    if (!stats.entries.length) insights.push(['Старт', 'Добавь первую тренировку, прогулку или растяжку — она попадёт в общий журнал и отчёты.']);
    else {
      insights.push(['Ритм', `Всего спортивной активности: ${hm(stats.total, false)}. Средняя сессия: ${hm(stats.total / stats.entries.length)}.`]);
      if (stats.today === 0) insights.push(['Сегодня', 'На выбранную дату спорта пока нет. Можно добавить через шаблон или форму.']);
      else insights.push(['Сегодня', `На выбранную дату уже есть ${hm(stats.today, false)} активности.`]);
      if (targetWorkouts && weekEntries.length < targetWorkouts) insights.push(['Недельная цель', `Нужно ещё ${targetWorkouts - weekEntries.length} трен. до цели ${targetWorkouts}/нед.`]);
      if (thisWeek < 120) insights.push(['Рекомендация', 'За последние 7 выбранных дней спорта меньше 2 часов. Добавь прогулку или лёгкую тренировку.']);
    }
    $('#sportInsight').innerHTML = insights.map(([t, p]) => `<div class="insight"><strong>${escapeHtml(t)}</strong><p>${escapeHtml(p)}</p></div>`).join('');

    const history = stats.entries
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date) || b.start.localeCompare(a.start))
      .slice(0, 30);
    renderEntries('#sportHistory', history);
  }

  function renderSportQuickGrid() {
    const grid = $('#sportQuickGrid');
    if (!grid) return;
    grid.innerHTML = SPORT_QUICK_TEMPLATES.map((template, index) => `
      <button class="quick-card sport-template" data-sport-template="${index}">
        <strong>${template.icon} ${escapeHtml(template.activity)}</strong>
        <span>${template.start}–${template.end} · ${escapeHtml(template.intensity)}</span>
        <span>${escapeHtml(template.note)}</span>
      </button>
    `).join('');
  }

  function selfDevStats() {
    const entries = selfDevEntries();
    const total = entries.reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const today = entries.filter((entry) => entry.date === state.selectedDate).reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const weekEntries = weekEntriesFrom(entries);
    const week = weekEntries.reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const map = new Map();
    entries.forEach((entry) => {
      const activity = entry.selfDevActivity || (entry.type.startsWith('Саморазвитие: ') ? entry.type.replace('Саморазвитие: ', '') : entry.type);
      const mins = Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start));
      map.set(activity, (map.get(activity) || 0) + mins);
    });
    const favorite = Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0];
    return { entries, total, today, week, weekEntries, favorite, byActivity: map };
  }

  function renderSelfDev() {
    const box = $('#selfStats');
    if (!box) return;
    $('#selfDate').value = state.selectedDate;
    renderSelfTypeOptions();
    renderSelfQuickGrid();
    const stats = selfDevStats();
    const target = selfDevTargetMinutes();
    const metrics = [
      ['Всего', hm(stats.total), `${stats.entries.length} сессий`],
      ['Сегодня', hm(stats.today), `${percent(stats.today, Math.max(1, target))}% цели`],
      ['За 7 дней', hm(stats.week), `${stats.weekEntries.length} сесс.`],
      ['Дневная цель', target ? hm(target) : 'выкл.', target ? 'настраивается в дизайне' : 'цель выключена'],
      ['Любимое', stats.favorite ? stats.favorite[0] : '—', stats.favorite ? hm(stats.favorite[1]) : 'нет данных'],
      ['Направления', String(stats.byActivity.size), 'проект, книги, курсы и другое']
    ];
    box.innerHTML = metrics.map(([a, b, c]) => `<article class="metric"><span>${escapeHtml(a)}</span><strong>${escapeHtml(b)}</strong><span>${escapeHtml(c)}</span></article>`).join('');
    const insights = [];
    if (!stats.entries.length) insights.push(['Старт', 'Добавь проект, книгу, курс или свой вариант — LifeOS начнёт считать третье кольцо.']);
    else {
      insights.push(['Темп', `Всего саморазвития: ${hm(stats.total, false)}. Средняя сессия: ${hm(stats.total / stats.entries.length)}.`]);
      if (stats.today < target) insights.push(['Сегодня', `До дневной цели не хватает ${hm(Math.max(0, target - stats.today), false)}.`]);
      else insights.push(['Сегодня', 'Кольцо саморазвития закрыто на выбранную дату.']);
    }
    $('#selfInsight').innerHTML = insights.map(([t, p]) => `<div class="insight"><strong>${escapeHtml(t)}</strong><p>${escapeHtml(p)}</p></div>`).join('');
    const history = stats.entries.slice().sort((a, b) => b.date.localeCompare(a.date) || b.start.localeCompare(a.start)).slice(0, 30);
    renderEntries('#selfHistory', history);
  }

  function renderSelfQuickGrid() {
    const grid = $('#selfQuickGrid');
    if (!grid) return;
    grid.innerHTML = SELF_QUICK_TEMPLATES.map((template, index) => `
      <button class="quick-card self-template" data-self-template="${index}">
        <strong>${template.icon} ${escapeHtml(template.activity)}</strong>
        <span>${template.start}–${template.end}</span>
        <span>${escapeHtml(template.note)}</span>
      </button>
    `).join('');
  }

  function renderEntryTypeOptions() {
    const select = $('#entryType');
    if (!select) return;
    const current = select.value || 'Работа';
    select.innerHTML = allTypes().map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
    select.value = allTypes().includes(current) ? current : 'Работа';
    $('#customTypeWrap')?.classList.toggle('hidden', select.value !== 'Другое');
  }

  function renderSportTypeOptions() {
    const select = $('#sportType');
    if (!select) return;
    const current = select.value || 'Зал';
    select.innerHTML = allSportTypes().map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
    select.value = allSportTypes().includes(current) ? current : 'Зал';
    $('#sportCustomWrap')?.classList.toggle('hidden', select.value !== 'Свой спорт');
  }

  function renderSelfTypeOptions() {
    const select = $('#selfType');
    if (!select) return;
    const current = select.value || 'Проект';
    select.innerHTML = allSelfTypes().map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
    select.value = allSelfTypes().includes(current) ? current : 'Проект';
    $('#selfCustomWrap')?.classList.toggle('hidden', select.value !== 'Свой вариант');
  }

  function renderDesignSettings() {
    if (!$('#designForm')) return;
    const ui = state.ui || {};
    $('#settingsThemeSelect').value = state.theme || 'system';
    $('#selfTargetMinutes').value = Number(ui.selfDevTargetMinutes ?? 60);
    $('#glassOpacity').value = Number(ui.glassOpacity ?? 68);
    $('#glassBlur').value = Number(ui.glassBlur ?? 20);
    $('#animationLevel').value = ui.animationLevel || 'normal';
    $('#glassOpacityValue').textContent = `${$('#glassOpacity').value}%`;
    $('#glassBlurValue').textContent = `${$('#glassBlur').value}px`;
    const themeList = $('#themeList');
    if (themeList) themeList.innerHTML = THEME_OPTIONS.map(([value, name, desc]) => `
      <button class="theme-tile ${state.theme === value ? 'active' : ''}" type="button" data-theme-pick="${value}">
        <span class="theme-swatch" data-theme-swatch="${value}"></span>
        <strong>${escapeHtml(name)}</strong>
        <small>${escapeHtml(desc)}</small>
      </button>
    `).join('');
  }

  function renderCustomTypeSettings() {
    const list = $('#customTypeList');
    if (!list) return;
    const custom = state.customTypes || [];
    list.innerHTML = custom.length ? custom.map((type) => `
      <button class="chip" data-custom-type-del="${escapeHtml(type)}">${escapeHtml(type)} ×</button>
    `).join('') : '<div class="empty-state">Свои варианты пока не добавлены.</div>';
  }

  function ringOptionList() {
    return [
      ['work', '💼 Работа'], ['sport', '🏋️ Спорт'], ['self', '✦ Саморазвитие'],
      ...customCategories().filter((cat) => cat.inRings !== false).map((cat) => [cat.id, `${cat.icon || '✨'} ${cat.name}`])
    ];
  }

  function renderEnhancementSettings() {
    renderRingSettings();
    renderWidgetSettings();
    renderCustomCategorySettings();
    renderCustomTemplateSettings();
  }

  function renderRingSettings() {
    const options = ringOptionList();
    ringSlotIds().forEach((slot, index) => {
      const select = $(`#ringSlot${index}`);
      if (!select) return;
      select.innerHTML = options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join('');
      select.value = options.some(([value]) => value === slot) ? slot : ['work','sport','self'][index];
    });
  }

  function renderWidgetSettings() {
    const box = $('#widgetSettings');
    if (!box) return;
    const widgets = [
      ['todayCenter', 'Центр сегодня'], ['planner', 'Умный планировщик'], ['weeklyRings', 'Кольца недели'], ['eveningReport', 'Вечерний отчёт'],
      ['quickTemplates', 'Быстрые шаблоны'], ['timeline', 'Таймлайн'], ['insights', 'Антихаос'], ['mood', 'Настроение и заметка']
    ];
    box.innerHTML = widgets.map(([key, label]) => `<label class="check-row"><input type="checkbox" data-widget-toggle="${key}" ${widgetEnabled(key) ? 'checked' : ''}> ${escapeHtml(label)}</label>`).join('');
  }

  function renderCustomCategorySettings() {
    const box = $('#customCategoryList');
    if (!box) return;
    const cats = customCategories();
    box.innerHTML = cats.length ? cats.map((cat) => `
      <article class="category-card">
        <div><strong>${escapeHtml(cat.icon || '✨')} ${escapeHtml(cat.name)}</strong><p>${escapeHtml(cat.kind || 'other')} · цель ${hm(Number(cat.targetMinutes || 0))}/день · ${cat.inRings !== false ? 'можно в кольцах' : 'без кольца'}</p></div>
        <button class="mini-btn" data-category-del="${escapeHtml(cat.id)}">Удалить</button>
      </article>
    `).join('') : '<div class="empty-state">Создай свои категории: Сербский, Ableton, сон, учёба, автосим и т.д.</div>';
  }

  function renderCustomTemplateSettings() {
    const box = $('#customTemplateList');
    if (!box) return;
    const items = state.customTemplates || [];
    box.innerHTML = items.length ? items.map((tpl, index) => `<button class="chip" data-template-del="${index}">${escapeHtml(tpl.icon || '⚡')} ${escapeHtml(tpl.type)} ${escapeHtml(tpl.start)}–${escapeHtml(tpl.end)} ×</button>`).join('') : '<div class="empty-state">Свои быстрые шаблоны пока не добавлены.</div>';
  }

  function addCustomCategory(data) {
    const name = String(data.name || '').trim();
    if (!name) return toast('Введи название категории.');
    state.customCategories = customCategories();
    const exists = state.customCategories.some((cat) => cat.name.toLowerCase() === name.toLowerCase());
    if (exists) return toast('Такая категория уже есть.');
    state.customCategories.push({ id: `cat-${uid()}`, name, icon: String(data.icon || '✨').trim() || '✨', kind: data.kind || 'other', targetMinutes: Math.max(0, Number(data.targetMinutes || 30)), inRings: data.inRings !== false });
    addCustomType(name);
    saveState(); renderAll(); toast('Категория добавлена.');
  }

  function addCustomTemplate(data) {
    const type = String(data.type || data.name || '').trim();
    if (!type) return toast('Введи тип шаблона.');
    let start = data.start || '20:00';
    let end = data.end || minutesToTime(Math.min(23 * 60 + 59, timeToMinutes(start) + 30));
    if (timeToMinutes(end) <= timeToMinutes(start)) end = minutesToTime(Math.min(23 * 60 + 59, timeToMinutes(start) + 30));
    state.customTemplates = state.customTemplates || [];
    state.customTemplates.push({ type, start, end, note: String(data.note || 'Свой быстрый шаблон').trim(), icon: '⚡' });
    saveState(); renderAll(); toast('Быстрый шаблон добавлен.');
  }

  function addCustomType(name) {
    const type = String(name || '').trim();
    if (!type) return false;
    state.customTypes = state.customTypes || [];
    const exists = allTypes().some((x) => x.toLowerCase() === type.toLowerCase());
    if (exists) {
      toast('Такой вариант уже есть.');
      return false;
    }
    state.customTypes.push(type);
    saveState(); renderAll(); toast('Свой вариант добавлен.');
    return true;
  }

  function addSportType(name) {
    const type = String(name || '').trim();
    if (!type) return false;
    state.sportTypes = state.sportTypes || [];
    const exists = allSportTypes().some((x) => x.toLowerCase() === type.toLowerCase());
    if (exists) {
      toast('Такая активность уже есть.');
      return false;
    }
    state.sportTypes.push(type);
    saveState(); renderAll(); toast('Спортивная активность добавлена.');
    return true;
  }

  function addSelfType(name) {
    const type = String(name || '').trim();
    if (!type) return false;
    state.selfDevTypes = state.selfDevTypes || [];
    const exists = allSelfTypes().some((x) => x.toLowerCase() === type.toLowerCase());
    if (exists) {
      toast('Такой вариант саморазвития уже есть.');
      return false;
    }
    state.selfDevTypes.push(type);
    saveState(); renderAll(); toast('Вариант саморазвития добавлен.');
    return true;
  }

  function addSportEntry(data) {
    const activity = String(data.activity || 'Спорт').trim();
    const type = activity === 'Прогулка' ? 'Прогулка' : `Спорт: ${activity}`;
    return addEntry({
      date: data.date,
      start: data.start,
      end: data.end,
      type,
      sportActivity: activity,
      intensity: data.intensity || 'Средняя',
      calories: Number(data.calories || 0),
      note: [data.note, data.intensity ? `интенсивность: ${data.intensity}` : '', data.calories ? `${data.calories} ккал` : ''].filter(Boolean).join(' · ')
    });
  }

  function addSelfEntry(data) {
    const activity = String(data.activity || 'Саморазвитие').trim();
    const type = activity === 'Саморазвитие' ? 'Саморазвитие' : `Саморазвитие: ${activity}`;
    return addEntry({
      date: data.date,
      start: data.start,
      end: data.end,
      type,
      selfDevActivity: activity,
      note: data.note || ''
    });
  }


  function sessionWindowFromMinutes(date, minutes, preferredEnd = null) {
    const mins = Math.max(1, Math.min(1439, Number(minutes || 0) || 1));
    const now = new Date();
    let endMinutes;
    if (date === todayKey()) endMinutes = now.getHours() * 60 + now.getMinutes();
    else if (preferredEnd) endMinutes = timeToMinutes(preferredEnd);
    else endMinutes = 21 * 60;
    endMinutes = Math.max(mins, Math.min(23 * 60 + 59, endMinutes));
    const startMinutes = Math.max(0, endMinutes - mins);
    return { start: minutesToTime(startMinutes), end: minutesToTime(endMinutes) };
  }

  function upsertBook(data) {
    const title = String(data.title || '').trim();
    if (!title) return toast('Введи название книги.');
    state.books = Array.isArray(state.books) ? state.books : [];
    let book = state.books.find((item) => item.title.toLowerCase() === title.toLowerCase());
    if (!book) {
      book = { id: uid(), title, author: '', status: 'Читаю', totalPages: 0, currentPage: 0, sessions: [], notes: '' };
      state.books.unshift(book);
    }
    const pagesToday = Math.max(0, Number(data.pagesToday || 0));
    const totalPages = Math.max(0, Number(data.totalPages || book.totalPages || 0));
    const currentPageInput = Math.max(0, Number(data.currentPage || 0));
    book.author = String(data.author || book.author || '').trim();
    book.status = String(data.status || book.status || 'Читаю');
    book.totalPages = totalPages;
    book.currentPage = Math.min(totalPages || Math.max(currentPageInput, Number(book.currentPage || 0) + pagesToday), Math.max(currentPageInput, Number(book.currentPage || 0) + pagesToday));
    if (currentPageInput) book.currentPage = totalPages ? Math.min(totalPages, currentPageInput) : currentPageInput;
    book.notes = String(data.note || book.notes || '').trim();
    const minutes = Math.max(0, Number(data.minutes || 0));
    const date = data.date || state.selectedDate;
    const session = { id: uid(), date, pages: pagesToday, minutes, note: String(data.note || '').trim(), createdAt: new Date().toISOString() };
    book.sessions = Array.isArray(book.sessions) ? book.sessions : [];
    book.sessions.unshift(session);
    if (minutes > 0) {
      const win = sessionWindowFromMinutes(date, minutes);
      state.entries.push({ id: uid(), date, start: win.start, end: win.end, type: 'Саморазвитие: Книга', selfDevActivity: 'Книга', note: `${title}${pagesToday ? ` · ${pagesToday} стр.` : ''}${data.note ? ` · ${data.note}` : ''}`, createdAt: new Date().toISOString(), module: 'book', moduleId: book.id });
    }
    saveState(); renderAll(); toast('Книга обновлена и зачтена в саморазвитие.');
  }

  function upsertCourse(data) {
    const title = String(data.title || '').trim();
    if (!title) return toast('Введи название курса.');
    state.courses = Array.isArray(state.courses) ? state.courses : [];
    let course = state.courses.find((item) => item.title.toLowerCase() === title.toLowerCase());
    if (!course) {
      course = { id: uid(), title, link: '', status: 'В процессе', totalLessons: 0, doneLessons: 0, sessions: [], notes: '' };
      state.courses.unshift(course);
    }
    const lessonsToday = Math.max(0, Number(data.lessonsToday || 0));
    const totalLessons = Math.max(0, Number(data.totalLessons || course.totalLessons || 0));
    const doneInput = Math.max(0, Number(data.doneLessons || 0));
    course.link = String(data.link || course.link || '').trim();
    course.status = String(data.status || course.status || 'В процессе');
    course.totalLessons = totalLessons;
    course.doneLessons = Math.min(totalLessons || Math.max(doneInput, Number(course.doneLessons || 0) + lessonsToday), Math.max(doneInput, Number(course.doneLessons || 0) + lessonsToday));
    if (doneInput) course.doneLessons = totalLessons ? Math.min(totalLessons, doneInput) : doneInput;
    course.notes = String(data.note || course.notes || '').trim();
    const minutes = Math.max(0, Number(data.minutes || 0));
    const date = data.date || state.selectedDate;
    const session = { id: uid(), date, lessons: lessonsToday, minutes, note: String(data.note || '').trim(), createdAt: new Date().toISOString() };
    course.sessions = Array.isArray(course.sessions) ? course.sessions : [];
    course.sessions.unshift(session);
    if (minutes > 0) {
      const win = sessionWindowFromMinutes(date, minutes);
      state.entries.push({ id: uid(), date, start: win.start, end: win.end, type: 'Саморазвитие: Курс', selfDevActivity: 'Курс', note: `${title}${lessonsToday ? ` · ${lessonsToday} урок.` : ''}${data.note ? ` · ${data.note}` : ''}`, createdAt: new Date().toISOString(), module: 'course', moduleId: course.id });
    }
    saveState(); renderAll(); toast('Курс обновлён и зачтён в саморазвитие.');
  }

  function renderBooks() {
    const books = Array.isArray(state.books) ? state.books : [];
    const totalBooks = books.length;
    const finished = books.filter((b) => b.status === 'Закончил' || (Number(b.totalPages || 0) > 0 && Number(b.currentPage || 0) >= Number(b.totalPages || 0))).length;
    const pages = books.reduce((sum, b) => sum + Number(b.currentPage || 0), 0);
    const minutes = books.reduce((sum, b) => sum + (Array.isArray(b.sessions) ? b.sessions.reduce((s, x) => s + Number(x.minutes || 0), 0) : 0), 0);
    const statsBox = $('#bookStats');
    if (statsBox) statsBox.innerHTML = [
      ['Книг', totalBooks, 'в библиотеке'],
      ['Завершено', finished, 'книг'],
      ['Страниц', pages, 'прочитано'],
      ['Время', hm(minutes), 'на чтение']
    ].map(([a,b,c]) => `<article class="metric"><span>${a}</span><strong>${b}</strong><span>${c}</span></article>`).join('');
    const list = $('#bookList');
    if (list) list.innerHTML = books.length ? books.map((b) => {
      const pct = Number(b.totalPages || 0) ? percent(Number(b.currentPage || 0), Number(b.totalPages || 0)) : 0;
      return `<article class="list-card module-card"><strong>📖 ${escapeHtml(b.title)} · ${escapeHtml(b.status || 'Читаю')}</strong><p>${escapeHtml(b.author || '')}${b.totalPages ? ` · ${Number(b.currentPage || 0)} / ${Number(b.totalPages || 0)} стр.` : ' · страницы не заданы'}</p><div class="progress"><span style="width:${pct}%"></span></div><p>${pct}%${b.notes ? ` · ${escapeHtml(b.notes)}` : ''}</p><div class="button-row"><button class="mini-btn" data-book-plus="${escapeHtml(b.id)}">+10 стр.</button><button class="mini-btn" data-book-finish="${escapeHtml(b.id)}">Готово</button><button class="mini-btn" data-book-del="${escapeHtml(b.id)}">Удалить</button></div></article>`;
    }).join('') : '<div class="empty-state">Добавь книгу — она будет учитывать страницы, время и кольцо саморазвития.</div>';
    const history = $('#bookHistory');
    if (history) {
      const sessions = books.flatMap((b) => (b.sessions || []).map((s) => ({ ...s, title: b.title }))).sort((a,b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 20);
      history.innerHTML = sessions.length ? sessions.map((s) => `<article class="feed-item"><strong>${formatDate(s.date)} · ${escapeHtml(s.title)}</strong><p>${s.pages ? `${s.pages} стр. · ` : ''}${hm(s.minutes || 0)}${s.note ? ` · ${escapeHtml(s.note)}` : ''}</p></article>`).join('') : '<div class="empty-state">История чтения пока пустая.</div>';
    }
    const dateInput = $('#bookDate');
    if (dateInput && !dateInput.value) dateInput.value = state.selectedDate;
  }

  function renderCourses() {
    const courses = Array.isArray(state.courses) ? state.courses : [];
    const totalCourses = courses.length;
    const finished = courses.filter((c) => c.status === 'Закончил' || (Number(c.totalLessons || 0) > 0 && Number(c.doneLessons || 0) >= Number(c.totalLessons || 0))).length;
    const lessons = courses.reduce((sum, c) => sum + Number(c.doneLessons || 0), 0);
    const minutes = courses.reduce((sum, c) => sum + (Array.isArray(c.sessions) ? c.sessions.reduce((s, x) => s + Number(x.minutes || 0), 0) : 0), 0);
    const statsBox = $('#courseStats');
    if (statsBox) statsBox.innerHTML = [
      ['Курсов', totalCourses, 'в списке'],
      ['Завершено', finished, 'курсов'],
      ['Уроков', lessons, 'пройдено'],
      ['Время', hm(minutes), 'на обучение']
    ].map(([a,b,c]) => `<article class="metric"><span>${a}</span><strong>${b}</strong><span>${c}</span></article>`).join('');
    const list = $('#courseList');
    if (list) list.innerHTML = courses.length ? courses.map((c) => {
      const pct = Number(c.totalLessons || 0) ? percent(Number(c.doneLessons || 0), Number(c.totalLessons || 0)) : 0;
      const link = c.link && String(c.link).startsWith('http') ? ` · <a href="${escapeHtml(c.link)}" target="_blank" rel="noreferrer">ссылка</a>` : c.link ? ` · ${escapeHtml(c.link)}` : '';
      return `<article class="list-card module-card"><strong>🎓 ${escapeHtml(c.title)} · ${escapeHtml(c.status || 'В процессе')}</strong><p>${c.totalLessons ? `${Number(c.doneLessons || 0)} / ${Number(c.totalLessons || 0)} урок.` : 'уроки не заданы'}${link}</p><div class="progress"><span style="width:${pct}%"></span></div><p>${pct}%${c.notes ? ` · ${escapeHtml(c.notes)}` : ''}</p><div class="button-row"><button class="mini-btn" data-course-plus="${escapeHtml(c.id)}">+1 урок</button><button class="mini-btn" data-course-finish="${escapeHtml(c.id)}">Готово</button><button class="mini-btn" data-course-del="${escapeHtml(c.id)}">Удалить</button></div></article>`;
    }).join('') : '<div class="empty-state">Добавь курс — он будет учитывать уроки, время и кольцо саморазвития.</div>';
    const history = $('#courseHistory');
    if (history) {
      const sessions = courses.flatMap((c) => (c.sessions || []).map((s) => ({ ...s, title: c.title }))).sort((a,b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 20);
      history.innerHTML = sessions.length ? sessions.map((s) => `<article class="feed-item"><strong>${formatDate(s.date)} · ${escapeHtml(s.title)}</strong><p>${s.lessons ? `${s.lessons} урок. · ` : ''}${hm(s.minutes || 0)}${s.note ? ` · ${escapeHtml(s.note)}` : ''}</p></article>`).join('') : '<div class="empty-state">История курсов пока пустая.</div>';
    }
    const dateInput = $('#courseDate');
    if (dateInput && !dateInput.value) dateInput.value = state.selectedDate;
  }

  function renderFinanceForm() {
    const f = state.finance;
    $('#hourRate').value = f.hourRate ?? 0;
    $('#fullDayBonus').value = f.fullDayBonus ?? 0;
    $('#missPenalty').value = f.missPenalty ?? 0;
    $('#moneyTarget').value = f.moneyTarget ?? 0;
  }

  function renderMoney() {
    const stats = periodStats();
    const f = state.finance;
    const earned = (stats.work / 60) * Number(f.hourRate || 0) + stats.fullDays * Number(f.fullDayBonus || 0);
    const lost = (stats.lostPast / 60) * Number(f.missPenalty || 0);
    const projected = (stats.plan / 60) * Number(f.hourRate || 0) + stats.workDays * Number(f.fullDayBonus || 0) - lost;
    const target = Number(f.moneyTarget || 0);
    const metrics = [
      ['Заработано', rub(earned), `${hm(stats.work)} × ставка`],
      ['Потеряно', rub(lost), `${hm(stats.lostPast)} отставания`],
      ['Прогноз', rub(projected), 'при закрытии плана'],
      ['Цель', target ? `${percent(earned, target)}%` : '—', target ? rub(target) : 'цель не задана']
    ];
    $('#moneyStats').innerHTML = metrics.map(([a, b, c]) => `<article class="metric"><span>${a}</span><strong>${b}</strong><span>${c}</span></article>`).join('');
    const insights = [];
    if (target) insights.push(['До денежной цели', earned >= target ? 'Цель закрыта.' : `Осталось ${rub(target - earned)}.`]);
    if (lost > 0) insights.push(['Цена пропусков', `По заданному штрафу/потере уже потеряно ${rub(lost)}.`]);
    insights.push(['Ставка', `Каждый полный будний день даёт примерно ${rub((420 / 60) * Number(f.hourRate || 0) + Number(f.fullDayBonus || 0))}.`]);
    $('#moneyInsight').innerHTML = insights.map(([t, p]) => `<div class="insight"><strong>${t}</strong><p>${p}</p></div>`).join('');
  }

  function rub(value) {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(Math.max(0, Number(value || 0)));
  }

  function renderProjects() {
    $('#projectList').innerHTML = state.projects.length ? state.projects.map((p) => `
      <article class="list-card">
        <strong>${escapeHtml(p.name)} · ${escapeHtml(p.status)}</strong>
        <p>${p.deadline ? 'Дедлайн: ' + escapeHtml(p.deadline) + ' · ' : ''}${escapeHtml(p.notes || '')}</p>
        <div class="progress"><span style="width:${Number(p.progress || 0)}%"></span></div>
        <p>${Number(p.progress || 0)}%${p.repo ? ` · <a href="${escapeHtml(p.repo)}" target="_blank" rel="noreferrer">repo</a>` : ''}${p.live ? ` · <a href="${escapeHtml(p.live)}" target="_blank" rel="noreferrer">live</a>` : ''}</p>
        <div class="button-row"><button class="mini-btn" data-project-progress="${p.id}">+10%</button><button class="mini-btn" data-project-del="${p.id}">Удалить</button></div>
      </article>
    `).join('') : '<div class="empty-state">Проекты пока не добавлены.</div>';
  }

  function nextMilestones(value, step, count = 4, start = step) {
    const done = Math.floor(value / step) * step;
    const rows = [];
    for (let i = 0; i < count; i++) rows.push(Math.max(start, done + step * i));
    return Array.from(new Set(rows)).filter((n) => n > 0).slice(0, count);
  }

  function achievementCatalog() {
    const stats = periodStats();
    const focus = state.focusSessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
    const entries = state.entries.length;
    const booksDone = (state.books || []).filter((b) => b.status === 'Закончил' || (Number(b.totalPages || 0) > 0 && Number(b.currentPage || 0) >= Number(b.totalPages || 0))).length;
    const coursesDone = (state.courses || []).filter((c) => c.status === 'Закончил' || (Number(c.totalLessons || 0) > 0 && Number(c.doneLessons || 0) >= Number(c.totalLessons || 0))).length;
    const bookPages = (state.books || []).reduce((sum, b) => sum + Number(b.currentPage || 0), 0);
    const courseLessons = (state.courses || []).reduce((sum, c) => sum + Number(c.doneLessons || 0), 0);
    const projectsDone = state.projects.filter((p) => Number(p.progress || 0) >= 100 || p.status === 'Готово').length;
    const sports = sportStats();
    const sportMinutes = sports.total;
    const selfDev = selfDevStats();
    const selfMinutes = selfDev.total;
    const notes = Object.values(state.dayMeta).filter((m) => m.note && m.note.trim()).length;
    const jsonBackups = Number(localStorageSafeGet('lifeos.lastBackupCount') || 0);
    const targetPerWeek = Math.max(0, Number(activeConfig().targetWorkoutsPerWeek || 0));
    const catalog = [
      ['Первый след', entries >= 1, entries, 1, 'Добавить первую запись времени.'],
      ['Полный рабочий день', stats.fullDays >= 1, stats.fullDays, 1, 'Закрыть один рабочий день на 100%.'],
      ['Период под контролем', stats.pct >= 100, stats.work, stats.plan, 'Закрыть весь выбранный рабочий план.'],
      ['Архивариус', jsonBackups >= 1, jsonBackups, 1, 'Сделать экспорт JSON.'],
      ['Календарик стукача', state.theme === 'snitch', state.theme === 'snitch' ? 1 : 0, 1, 'Включить пасхальную тему.']
    ];
    nextMilestones(Math.floor(stats.work / 60), 10, 6).forEach((target) => catalog.push([`Рабочие часы ×${target}`, Math.floor(stats.work / 60) >= target, Math.floor(stats.work / 60), target, `Накопить ${target} часов зачтённой работы.`]));
    nextMilestones(stats.fullDays, 5, 6).forEach((target) => catalog.push([`Полные дни ×${target}`, stats.fullDays >= target, stats.fullDays, target, `Закрыть ${target} полных рабочих дней.`]));
    nextMilestones(Math.floor(focus / 60), 2, 5).forEach((target) => catalog.push([`Фокус ×${target}ч`, Math.floor(focus / 60) >= target, Math.floor(focus / 60), target, `Накопить ${target} часов фокуса.`]));
    nextMilestones(Math.floor(sportMinutes / 60), 2, 5).forEach((target) => catalog.push([`Спорт ×${target}ч`, Math.floor(sportMinutes / 60) >= target, Math.floor(sportMinutes / 60), target, `Накопить ${target} часов спорта или прогулок.`]));
    nextMilestones(sports.entries.length, Math.max(1, targetPerWeek), 5).forEach((target) => catalog.push([`Тренировки ×${target}`, sports.entries.length >= target, sports.entries.length, target, `Сделать ${target} спортивных активностей. Цель: ${targetPerWeek}/нед.`]));
    nextMilestones(Math.floor(selfMinutes / 60), 2, 6).forEach((target) => catalog.push([`Саморазвитие ×${target}ч`, Math.floor(selfMinutes / 60) >= target, Math.floor(selfMinutes / 60), target, `Накопить ${target} часов книг, курсов, проектов или практики.`]));
    nextMilestones(selfDev.entries.length, 5, 6).forEach((target) => catalog.push([`Сессии роста ×${target}`, selfDev.entries.length >= target, selfDev.entries.length, target, `Провести ${target} сессий саморазвития.`]));
    nextMilestones(notes, 7, 5).forEach((target) => catalog.push([`Дневник ×${target}`, notes >= target, notes, target, `Оставить ${target} заметок дня.`]));
    nextMilestones(state.projects.length, 3, 4).forEach((target) => catalog.push([`Проекты ×${target}`, state.projects.length >= target, state.projects.length, target, `Добавить ${target} проектов.`]));
    nextMilestones(bookPages, 100, 4).forEach((target) => catalog.push([`Страницы ×${target}`, bookPages >= target, bookPages, target, `Прочитать ${target} страниц.`]));
    nextMilestones(booksDone, 1, 4).forEach((target) => catalog.push([`Книги ×${target}`, booksDone >= target, booksDone, target, `Завершить ${target} книг.`]));
    nextMilestones(courseLessons, 10, 4).forEach((target) => catalog.push([`Уроки ×${target}`, courseLessons >= target, courseLessons, target, `Пройти ${target} уроков.`]));
    nextMilestones(coursesDone, 1, 4).forEach((target) => catalog.push([`Курсы ×${target}`, coursesDone >= target, coursesDone, target, `Завершить ${target} курсов.`]));
    nextMilestones(projectsDone, 1, 4).forEach((target) => catalog.push([`Релизы ×${target}`, projectsDone >= target, projectsDone, target, `Закрыть ${target} проектов на 100% или статусом Готово.`]));
    return catalog;
  }

  function renderAchievements() {
    const xp = earnedXp();
    const lvl = levelFromXp(xp);
    $('#xpBox').innerHTML = `
      <div class="xp-level">Lv. ${lvl.level}</div>
      <p class="muted">${xp} XP · до следующего уровня ${Math.max(0, lvl.need - lvl.into)} XP</p>
      <div class="progress big"><span style="width:${lvl.pct}%"></span></div>
      <p class="muted small">Ачивки бесконечные: LifeOS генерирует новые рубежи по часам, дням, спорту, саморазвитию, фокусу, заметкам и проектам.</p>
    `;
    const rows = achievementCatalog()
      .sort((a, b) => Number(b[1]) - Number(a[1]) || (a[3] - b[3]))
      .slice(0, 42);
    $('#achievementList').innerHTML = rows.map(([name, unlocked, current, target, desc]) => {
      const pct = percent(current, target);
      return `
        <article class="list-card achievement ${unlocked ? 'unlocked' : 'locked'}">
          <strong>${unlocked ? '✅' : '🔒'} ${escapeHtml(name)}</strong>
          <p>${escapeHtml(desc)} · ${Math.min(current, target)} / ${target}</p>
          <div class="progress"><span style="width:${pct}%"></span></div>
        </article>
      `;
    }).join('');
  }


  function profileList() {
    if (!Array.isArray(state.profiles) || !state.profiles.length) {
      state.profiles = DEFAULT_PROFILES.map((profile) => ({ ...profile, workConfig: cloneWorkConfig(state.workConfig || DEFAULT_WORK_CONFIG) }));
    }
    return state.profiles;
  }

  function activeProfile() {
    return profileList().find((profile) => profile.id === state.activeProfileId) || profileList()[0];
  }

  function profileSnapshot(name = '', icon = '') {
    return {
      id: uid(),
      name: name || 'Новый профиль',
      icon: icon || '✨',
      theme: state.theme || 'system',
      workConfig: cloneWorkConfig(state.workConfig),
      ringSlots: [...ringSlotIds()],
      workoutTarget: Number(activeConfig().targetWorkoutsPerWeek || 0),
      selfTargetMinutes: selfDevTargetMinutes(),
      templates: [...(state.customTemplates || [])],
      widgets: { ...(state.homeWidgets || {}) },
      ui: { ...(state.ui || {}) }
    };
  }

  function renderProfileSettings() {
    const box = $('#profileList');
    if (!box) return;
    box.innerHTML = profileList().map((profile) => {
      const active = profile.id === state.activeProfileId;
      const cfg = cloneWorkConfig(profile.workConfig || state.workConfig);
      const ringLabels = (profile.ringSlots || ['work','sport','self']).map((slot) => ringLabel(slot)).join(' · ');
      return `<article class="profile-card ${active ? 'active' : ''}">
        <div class="profile-head"><span>${escapeHtml(profile.icon || '✨')}</span><div><strong>${escapeHtml(profile.name)}</strong><p>${escapeHtml(THEME_OPTIONS.find(([v]) => v === profile.theme)?.[1] || profile.theme || 'system')}</p></div></div>
        <p>${formatDate(cfg.startDate)} — ${formatDate(cfg.endDate)} · спорт ${Number(profile.workoutTarget ?? cfg.targetWorkoutsPerWeek ?? 0)}/нед.</p>
        <p class="muted small">Кольца: ${escapeHtml(ringLabels)}</p>
        <div class="button-row"><button class="mini-btn" data-profile-apply="${escapeHtml(profile.id)}">Применить</button><button class="mini-btn" data-profile-save="${escapeHtml(profile.id)}">Обновить</button>${profile.id.startsWith('custom-') ? `<button class="mini-btn" data-profile-del="${escapeHtml(profile.id)}">Удалить</button>` : ''}</div>
      </article>`;
    }).join('');
  }

  function applyProfile(profileId) {
    const profile = profileList().find((p) => p.id === profileId);
    if (!profile) return toast('Профиль не найден.');
    state.activeProfileId = profile.id;
    state.theme = profile.theme || state.theme || 'system';
    state.workConfig = cloneWorkConfig(profile.workConfig || state.workConfig);
    state.workConfig.targetWorkoutsPerWeek = Number(profile.workoutTarget ?? state.workConfig.targetWorkoutsPerWeek ?? 3);
    state.ringSlots = Array.isArray(profile.ringSlots) && profile.ringSlots.length === 3 ? [...profile.ringSlots] : state.ringSlots;
    state.customTemplates = Array.isArray(profile.templates) ? [...profile.templates] : state.customTemplates;
    state.homeWidgets = { ...(state.homeWidgets || {}), ...(profile.widgets || {}) };
    state.ui = { ...(state.ui || {}), ...(profile.ui || {}) };
    if (profile.selfTargetMinutes !== undefined) state.ui.selfDevTargetMinutes = Number(profile.selfTargetMinutes || 0);
    saveState();
    renderAll();
    toast(`Профиль «${profile.name}» применён.`);
  }

  function saveIntoProfile(profileId) {
    const list = profileList();
    const index = list.findIndex((p) => p.id === profileId);
    if (index < 0) return toast('Профиль не найден.');
    const previous = list[index];
    list[index] = { ...profileSnapshot(previous.name, previous.icon), id: previous.id };
    state.profiles = list;
    state.activeProfileId = previous.id;
    saveState(); renderAll(); toast('Профиль обновлён текущими настройками.');
  }

  function duplicateActiveProfile() {
    const base = activeProfile();
    const copy = { ...profileSnapshot(`${base.name} · копия`, base.icon || '✨'), id: `custom-${uid()}` };
    state.profiles = [...profileList(), copy];
    state.activeProfileId = copy.id;
    saveState(); renderAll(); toast('Создана копия профиля.');
  }

  function renderMiniMode() {
    const card = $('#miniTodayCard');
    if (!card) return;
    card.classList.toggle('is-enabled', Boolean(state.miniMode));
    document.body.dataset.mini = state.miniMode ? 'on' : 'off';
    const st = dayStatus(state.selectedDate);
    const sports = weekEntriesFrom(sportEntries(), state.selectedDate).length;
    const target = Number(activeConfig().targetWorkoutsPerWeek || 0);
    const self = minutesForEntries(entriesForCategoryId('self', state.selectedDate));
    $('#miniWorkText').textContent = `${hm(st.work)} / ${hm(st.plan.minutes)}`;
    $('#miniSportText').textContent = target ? `${sports} / ${target}` : `${sports}`;
    $('#miniSelfText').textContent = `${hm(self)}`;
    $('#miniCloseText').textContent = getMeta(state.selectedDate).closedAt ? 'закрыт' : 'закрыть';
  }

  function reportPlainText() {
    const stats = periodStats();
    const sports = sportStats();
    const self = selfDevStats();
    const best = stats.best.date ? `${formatDate(stats.best.date, { year: 'numeric' })} — ${hm(stats.best.minutes, false)}` : 'нет данных';
    return [
      'LifeOS Report',
      `Период: ${periodStart()} — ${periodEnd()}`,
      `Работа: ${hm(stats.work, false)} / ${hm(stats.plan, false)} (${stats.pct}%)`,
      `Спорт: ${sports.entries.length} тренировок · ${hm(sports.total, false)}`,
      `Саморазвитие: ${hm(self.total, false)} · ${self.entries.length} сессий`,
      `Лучший день: ${best}`,
      `Полных рабочих дней: ${stats.fullDays}`,
      `Частичных рабочих дней: ${stats.partialDays}`,
      `Пустых рабочих дней: ${stats.missedDays}`,
      `Самая длинная серия: ${longestFullWorkStreak()} дней`,
      `Активный профиль: ${activeProfile()?.name || 'Рабочий режим'}`
    ].join('\n');
  }

  function longestFullWorkStreak() {
    let best = 0;
    let cur = 0;
    datesBetween(periodStart(), periodEnd()).forEach((date) => {
      const st = dayStatus(date);
      if (!st.plan.minutes) return;
      if (st.status === 'done') { cur += 1; best = Math.max(best, cur); }
      else cur = 0;
    });
    return best;
  }

  function reportJsonPayload() {
    const stats = periodStats();
    return {
      app: 'LifeOS',
      version: APP_VERSION,
      generatedAt: new Date().toISOString(),
      activeProfile: activeProfile(),
      period: { start: periodStart(), end: periodEnd() },
      summary: {
        plannedWorkMinutes: stats.plan,
        actualWorkMinutes: stats.work,
        completionPercent: stats.pct,
        fullWorkDays: stats.fullDays,
        partialWorkDays: stats.partialDays,
        missedWorkDays: stats.missedDays,
        longestFullWorkStreak: longestFullWorkStreak(),
        sportSessions: sportEntries().length,
        selfDevelopmentMinutes: selfDevStats().total
      },
      entries: state.entries,
      books: state.books || [],
      courses: state.courses || [],
      projects: state.projects || []
    };
  }

  function reportCsv() {
    const rows = [['metric','value'], ...Object.entries(reportJsonPayload().summary).map(([k,v]) => [k, v])];
    return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  function renderReportPreview(force = true) {
    if (!force && !lastReportHtml) {
      $('#reportPreview').innerHTML = '<div class="empty-state">Нажми «Сформировать отчёт», чтобы увидеть итог периода.</div>';
      return;
    }
    if (!lastReportHtml) lastReportHtml = buildReportHtml(false);
    $('#reportPreview').innerHTML = lastReportHtml;
  }

  function buildReportHtml(fullDocument = true) {
    const stats = periodStats();
    const f = state.finance;
    const earned = (stats.work / 60) * Number(f.hourRate || 0) + stats.fullDays * Number(f.fullDayBonus || 0);
    const sports = sportStats();
    const selfDev = selfDevStats();
    const typeRows = Array.from(typeMinutesAll().entries()).sort((a, b) => b[1] - a[1]);
    const body = `
      <h2>LifeOS Report</h2>
      <p><strong>Период:</strong> ${periodStart()} — ${periodEnd()}</p>
      <p><strong>План:</strong> ${hm(stats.plan, false)} · <strong>Факт:</strong> ${hm(stats.work, false)} · <strong>Выполнение:</strong> ${stats.pct}%</p>
      <p><strong>Осталось:</strong> ${hm(stats.left, false)} · <strong>Отставание по текущей дате:</strong> ${hm(stats.lostPast, false)}</p>
      <p><strong>Полных дней:</strong> ${stats.fullDays} · <strong>Частичных:</strong> ${stats.partialDays} · <strong>Пустых:</strong> ${stats.missedDays}</p>
      <p><strong>Лучший день:</strong> ${stats.best.date ? formatDate(stats.best.date, { year: 'numeric' }) + ' — ' + hm(stats.best.minutes, false) : 'нет данных'}</p>
      <p><strong>Заработано по настройкам:</strong> ${rub(earned)}</p>
      <p><strong>Спорт:</strong> ${hm(sports.total, false)} · <strong>Тренировок/активностей:</strong> ${sports.entries.length} · <strong>Ккал:</strong> ${sports.calories || 0}</p>
      <p><strong>Саморазвитие:</strong> ${hm(selfDev.total, false)} · <strong>Сессий:</strong> ${selfDev.entries.length} · <strong>Любимое направление:</strong> ${selfDev.favorite ? escapeHtml(selfDev.favorite[0]) : 'нет данных'}</p>
      <h3>Категории времени</h3>
      <ul>${typeRows.map(([type, mins]) => `<li><strong>${escapeHtml(type)}:</strong> ${hm(mins, false)}</li>`).join('')}</ul>
      <h3>Книги</h3>
      <ul>${(state.books || []).map((b) => `<li><strong>${escapeHtml(b.title)}</strong> — ${escapeHtml(b.status || 'Читаю')}, ${Number(b.currentPage || 0)} / ${Number(b.totalPages || 0)} стр.</li>`).join('') || '<li>Книги не добавлены.</li>'}</ul>
      <h3>Курсы</h3>
      <ul>${(state.courses || []).map((c) => `<li><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.status || 'В процессе')}, ${Number(c.doneLessons || 0)} / ${Number(c.totalLessons || 0)} урок.</li>`).join('') || '<li>Курсы не добавлены.</li>'}</ul>
      <h3>Проекты</h3>
      <ul>${state.projects.map((p) => `<li><strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.status)}, ${Number(p.progress || 0)}%</li>`).join('') || '<li>Проекты не добавлены.</li>'}</ul>
      <h3>Вывод</h3>
      <p>${stats.pct >= 100 ? 'План периода закрыт полностью.' : `Для полного закрытия нужно добрать ${hm(stats.left, false)}.`}</p>
    `;
    if (!fullDocument) return body;
    return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LifeOS Report</title><style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;max-width:860px;margin:40px auto;padding:0 18px;line-height:1.55;color:#0f172a}h2{font-size:42px;letter-spacing:-.05em}li{margin:6px 0}</style></head><body>${body}</body></html>`;
  }

  function typeMinutesAll() {
    const map = new Map();
    state.entries.forEach((entry) => {
      const mins = Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start));
      map.set(entry.type, (map.get(entry.type) || 0) + mins);
    });
    return map;
  }

  function addEntry(entry) {
    if (timeToMinutes(entry.end) <= timeToMinutes(entry.start)) {
      toast('Конец интервала должен быть позже начала.');
      return false;
    }
    state.entries.push({ id: uid(), date: state.selectedDate, start: '10:00', end: '11:00', type: 'Работа', note: '', auto: false, createdAt: new Date().toISOString(), ...entry });
    saveState();
    renderAll();
    return true;
  }

  function fillWorkDay(date = state.selectedDate) {
    const plan = workPlan(date);
    if (!plan.minutes) return toast('В выбранный день нет рабочего плана.');
    state.entries = state.entries.filter((entry) => !(entry.date === date && entry.auto && isWorkType(entry.type)));
    addEntry({ date, start: plan.start, end: plan.end, type: 'Работа', note: 'Авто-зачёт полного рабочего дня', auto: true });
    toast('Рабочий план засчитан.');
  }

  function removeAutoWork(date = state.selectedDate) {
    const before = state.entries.length;
    state.entries = state.entries.filter((entry) => !(entry.date === date && entry.auto && isWorkType(entry.type)));
    saveState();
    renderAll();
    toast(before === state.entries.length ? 'Авто-зачёта на этот день нет.' : 'Авто-зачёт снят.');
  }

  function copyYesterday() {
    const date = state.selectedDate;
    const prev = addDays(date, -1);
    const prevEntries = dayEntries(prev);
    if (!prevEntries.length) return toast('Во вчерашнем дне нет записей.');
    prevEntries.forEach((entry) => {
      state.entries.push({ ...entry, id: uid(), date, createdAt: new Date().toISOString(), note: entry.note ? `${entry.note} · копия` : 'Копия вчерашнего интервала' });
    });
    saveState();
    renderAll();
    toast('Записи вчерашнего дня скопированы.');
  }

  function exportJson() {
    const payload = JSON.stringify(state, null, 2);
    downloadFile(`lifeos-backup-${todayKey()}.json`, payload, 'application/json;charset=utf-8');
    const count = Number(localStorageSafeGet('lifeos.lastBackupCount') || 0) + 1;
    localStorageSafeSet('lifeos.lastBackupCount', String(count));
    localStorageSafeSet('lifeos.lastBackupAt', new Date().toISOString());
    renderAll();
    toast('JSON-бэкап создан.');
  }

  function exportCsv() {
    const rows = [['date', 'start', 'end', 'type', 'sport_activity', 'selfdev_activity', 'intensity', 'calories', 'minutes', 'note', 'auto']];
    state.entries.sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)).forEach((entry) => {
      rows.push([entry.date, entry.start, entry.end, entry.type, entry.sportActivity || '', entry.selfDevActivity || '', entry.intensity || '', entry.calories || '', String(timeToMinutes(entry.end) - timeToMinutes(entry.start)), entry.note || '', entry.auto ? '1' : '0']);
    });
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    downloadFile(`lifeos-journal-${todayKey()}.csv`, csv, 'text/csv;charset=utf-8');
    toast('CSV экспортирован.');
  }

  function requestNotificationPermission() {
    if (!('Notification' in window)) return toast('Браузер не поддерживает уведомления.');
    Notification.requestPermission().then((permission) => {
      state.notifications.enabled = permission === 'granted';
      saveState();
      toast(permission === 'granted' ? 'Локальные уведомления включены.' : 'Уведомления не разрешены.');
      if (permission === 'granted') new Notification('LifeOS', { body: 'Уведомления включены. PWA сможет напоминать, пока приложение открыто.' });
    });
  }

  function fireReminder(key, title, body) {
    const today = todayKey();
    const fullKey = `${today}:${key}`;
    if (state.notifications.lastFired?.[fullKey]) return;
    state.notifications.lastFired = state.notifications.lastFired || {};
    state.notifications.lastFired[fullKey] = new Date().toISOString();
    saveState();
    toast(`${title}: ${body}`);
    if (state.notifications.enabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: './icons/icon-192.png' });
    }
  }

  function checkReminders() {
    const now = new Date();
    const date = todayKey();
    if (date < periodStart() || date > periodEnd()) return;
    const plan = workPlan(date);
    if (!plan.minutes) return;
    const mins = now.getHours() * 60 + now.getMinutes();
    if (mins >= timeToMinutes(plan.start) && mins <= timeToMinutes(plan.start) + 20 && workMinutesForDay(date) === 0) {
      fireReminder('start-work', 'LifeOS', 'Рабочий день начался, а записей ещё нет.');
    }
    if (mins >= timeToMinutes(plan.end) - 15 && mins <= timeToMinutes(plan.end) + 20 && !getMeta(date).closedAt) {
      fireReminder('close-day', 'LifeOS', 'Пора закрыть день и добавить заметку.');
    }
  }

  function initEvents() {
    $$('.tab').forEach((button) => {
      button.addEventListener('click', () => {
        $$('.tab').forEach((b) => b.classList.remove('active'));
        $$('.view').forEach((v) => v.classList.remove('active'));
        button.classList.add('active');
        $(`#${button.dataset.tab}`)?.classList.add('active');
      });
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('button, a, input');
      if (!target) return;

      if (target.dataset.jump) {
        $(`.tab[data-tab="${target.dataset.jump}"]`)?.click();
      }
      if (target.dataset.activeStart) {
        const category = target.dataset.activeStart;
        const type = category === 'work' ? 'Работа' : category === 'sport' ? 'Тренировка' : 'Саморазвитие';
        startActiveTimer(category, type);
      }
      if (target.id === 'finishActiveTimerBtn') finishActiveTimer();
      if (target.id === 'cancelActiveTimerBtn') cancelActiveTimer();
      if (target.id === 'studioStartBtn') {
        const category = $('#studioCategory')?.value || 'work';
        let type = $('#studioType')?.value || (category === 'work' ? 'Работа' : category === 'sport' ? 'Тренировка' : category === 'self' ? 'Саморазвитие' : 'Активность');
        const custom = $('#studioCustomType')?.value.trim();
        if ((category === 'custom' || type === 'Другое' || type === 'Свой вариант' || type === 'Свой спорт') && custom) type = custom;
        startActiveTimer(category, type, $('#studioNote')?.value.trim() || '');
      }
      if (target.id === 'studioPauseBtn') pauseActiveTimer();
      if (target.id === 'studioResumeBtn') resumeActiveTimer();
      if (target.id === 'studioBreakBtn') startBreakTimer();
      if (target.id === 'studioFinishBtn') finishActiveTimer();
      if (target.id === 'studioCancelBtn') cancelActiveTimer();
      if (target.dataset.studioPreset) startStudioPreset(target.dataset.studioPreset);
      if (target.dataset.todayQuick) {
        const kind = target.dataset.todayQuick;
        if (kind === 'work') fillWorkDay();
        if (kind === 'sport') addSportEntry({ date: state.selectedDate, start: '18:00', end: '19:00', activity: 'Тренировка', intensity: 'Средняя', calories: 0, note: 'Быстрая отметка с Today Screen' });
        if (kind === 'book') addSelfEntry({ date: state.selectedDate, start: '20:00', end: '20:30', activity: 'Книга', note: 'Чтение / саморазвитие с Today Screen' });
        if (kind === 'course') addSelfEntry({ date: state.selectedDate, start: '20:00', end: '20:45', activity: 'Курс', note: 'Курс / урок с Today Screen' });
        if (kind === 'custom') $(`.tab[data-tab="day"]`)?.click();
      }
      if (target.dataset.sportTemplate !== undefined) {
        const t = SPORT_QUICK_TEMPLATES[Number(target.dataset.sportTemplate)];
        addSportEntry({ date: state.selectedDate, start: t.start, end: t.end, activity: t.activity, intensity: t.intensity, calories: t.calories, note: t.note });
      }
      if (target.dataset.selfTemplate !== undefined) {
        const t = SELF_QUICK_TEMPLATES[Number(target.dataset.selfTemplate)];
        addSelfEntry({ date: state.selectedDate, start: t.start, end: t.end, activity: t.activity, note: t.note });
      }
      if (target.dataset.themePick) {
        state.theme = target.dataset.themePick;
        saveState(); renderAll(); toast('Тема обновлена.');
      }
      if (target.dataset.template !== undefined) {
        const templates = [...QUICK_TEMPLATES, ...(state.customTemplates || [])];
        const t = templates[Number(target.dataset.template)];
        if (!t) return;
        if (t.type === 'Работа') {
          const plan = workPlan(state.selectedDate);
          addEntry({ date: state.selectedDate, start: plan.start || t.start, end: plan.end || t.end, type: 'Работа', note: t.note });
        } else if (t.type === 'Другое') {
          $('#entryStart').value = t.start;
          $('#entryEnd').value = t.end;
          $('#entryType').value = 'Другое';
          $('#entryNote').value = t.note;
          $('#customTypeWrap').classList.remove('hidden');
          $(`.tab[data-tab="day"]`)?.click();
        } else {
          addEntry({ date: state.selectedDate, start: t.start, end: t.end, type: t.type, note: t.note });
        }
      }
      if (target.dataset.date) setSelectedDate(target.dataset.date);
      if (target.dataset.calendarFilter) {
        calendarFilter = target.dataset.calendarFilter;
        renderCalendar();
      }
      if (target.dataset.deleteEntry) {
        state.entries = state.entries.filter((entry) => entry.id !== target.dataset.deleteEntry);
        saveState(); renderAll(); toast('Запись удалена.');
      }
      if (target.dataset.duplicateEntry) {
        const entry = state.entries.find((x) => x.id === target.dataset.duplicateEntry);
        if (entry) addEntry({ ...entry, id: uid(), createdAt: new Date().toISOString(), note: entry.note ? `${entry.note} · дубль` : 'Дубль записи' });
      }
      if (target.dataset.goalInc || target.dataset.goalDec || target.dataset.goalDel) {
        const id = target.dataset.goalInc || target.dataset.goalDec || target.dataset.goalDel;
        const goal = state.goals.find((g) => g.id === id);
        if (target.dataset.goalDel) state.goals = state.goals.filter((g) => g.id !== id);
        else if (goal && target.dataset.goalInc) goal.current = Number(goal.current || 0) + 1;
        else if (goal && target.dataset.goalDec) goal.current = Math.max(0, Number(goal.current || 0) - 1);
        saveState(); renderAll();
      }
      if (target.dataset.habitDel) {
        state.habits = state.habits.filter((h) => h.id !== target.dataset.habitDel);
        saveState(); renderAll();
      }
      if (target.dataset.projectDel) {
        state.projects = state.projects.filter((p) => p.id !== target.dataset.projectDel);
        saveState(); renderAll();
      }
      if (target.dataset.projectProgress) {
        const p = state.projects.find((x) => x.id === target.dataset.projectProgress);
        if (p) p.progress = Math.min(100, Number(p.progress || 0) + 10);
        saveState(); renderAll();
      }
      if (target.dataset.bookDel) {
        state.books = (state.books || []).filter((b) => b.id !== target.dataset.bookDel);
        saveState(); renderAll(); toast('Книга удалена. Записи времени сохранены.');
      }
      if (target.dataset.bookPlus) {
        const b = (state.books || []).find((x) => x.id === target.dataset.bookPlus);
        if (b) { b.currentPage = Number(b.currentPage || 0) + 10; b.sessions = b.sessions || []; b.sessions.unshift({ id: uid(), date: state.selectedDate, pages: 10, minutes: 0, note: 'Быстро +10 страниц', createdAt: new Date().toISOString() }); }
        saveState(); renderAll();
      }
      if (target.dataset.bookFinish) {
        const b = (state.books || []).find((x) => x.id === target.dataset.bookFinish);
        if (b) { b.status = 'Закончил'; if (Number(b.totalPages || 0)) b.currentPage = Number(b.totalPages || 0); }
        saveState(); renderAll(); toast('Книга завершена.');
      }
      if (target.dataset.courseDel) {
        state.courses = (state.courses || []).filter((c) => c.id !== target.dataset.courseDel);
        saveState(); renderAll(); toast('Курс удалён. Записи времени сохранены.');
      }
      if (target.dataset.coursePlus) {
        const c = (state.courses || []).find((x) => x.id === target.dataset.coursePlus);
        if (c) { c.doneLessons = Number(c.doneLessons || 0) + 1; c.sessions = c.sessions || []; c.sessions.unshift({ id: uid(), date: state.selectedDate, lessons: 1, minutes: 0, note: 'Быстро +1 урок', createdAt: new Date().toISOString() }); }
        saveState(); renderAll();
      }
      if (target.dataset.courseFinish) {
        const c = (state.courses || []).find((x) => x.id === target.dataset.courseFinish);
        if (c) { c.status = 'Закончил'; if (Number(c.totalLessons || 0)) c.doneLessons = Number(c.totalLessons || 0); }
        saveState(); renderAll(); toast('Курс завершён.');
      }
      if (target.dataset.customTypeDel) {
        state.customTypes = (state.customTypes || []).filter((type) => type !== target.dataset.customTypeDel);
        saveState(); renderAll(); toast('Свой вариант удалён из списка. Старые записи сохранены.');
      }
      if (target.dataset.categoryDel) {
        state.customCategories = customCategories().filter((cat) => cat.id !== target.dataset.categoryDel);
        state.ringSlots = ringSlotIds().map((slot, index) => slot === target.dataset.categoryDel ? ['work','sport','self'][index] : slot);
        saveState(); renderAll(); toast('Категория удалена. Старые записи сохранены.');
      }
      if (target.dataset.templateDel !== undefined) {
        state.customTemplates = (state.customTemplates || []).filter((_, index) => index !== Number(target.dataset.templateDel));
        saveState(); renderAll(); toast('Шаблон удалён.');
      }
      if (target.dataset.selfTypeDel) {
        state.selfDevTypes = (state.selfDevTypes || []).filter((type) => type !== target.dataset.selfTypeDel);
        saveState(); renderAll(); toast('Вариант саморазвития удалён. Старые записи сохранены.');
      }
      if (target.dataset.profileApply) {
        applyProfile(target.dataset.profileApply);
      }
      if (target.dataset.profileSave) {
        saveIntoProfile(target.dataset.profileSave);
      }
      if (target.dataset.profileDel) {
        state.profiles = profileList().filter((profile) => profile.id !== target.dataset.profileDel);
        if (!state.profiles.some((p) => p.id === state.activeProfileId)) state.activeProfileId = state.profiles[0]?.id || 'work';
        saveState(); renderAll(); toast('Профиль удалён.');
      }
      if (target.dataset.miniAction) {
        const action = target.dataset.miniAction;
        if (action === 'work') fillWorkDay();
        if (action === 'sport') addSportEntry({ date: state.selectedDate, start: '18:00', end: '19:00', activity: 'Тренировка', intensity: 'Средняя', calories: 0, note: 'Мини-отметка спорта' });
        if (action === 'self') addSelfEntry({ date: state.selectedDate, start: '20:00', end: '21:00', activity: 'Саморазвитие', note: 'Мини-отметка саморазвития' });
        if (action === 'quick') { $(`.tab[data-tab="journal"]`)?.click(); toast('Открыл журнал для быстрой записи.'); }
        if (action === 'close') { getMeta().closedAt = new Date().toISOString(); saveState(); renderAll(); toast('День закрыт.'); }
      }
    });

    document.addEventListener('change', (event) => {
      const widgetToggle = event.target.closest('[data-widget-toggle]');
      if (widgetToggle) {
        state.homeWidgets = state.homeWidgets || {};
        state.homeWidgets[widgetToggle.dataset.widgetToggle] = widgetToggle.checked;
        saveState(); renderAll();
        return;
      }
      const habit = event.target.closest('[data-habit-check]');
      if (habit) {
        state.habitChecks[state.selectedDate] = state.habitChecks[state.selectedDate] || {};
        state.habitChecks[state.selectedDate][habit.dataset.habitCheck] = habit.checked;
        saveState(); renderAll();
      }
    });

    $('#selectedDate').addEventListener('change', (e) => setSelectedDate(e.target.value));
    $('#acceptPlannerBtn')?.addEventListener('click', acceptSmartPlan);
    $('#saveEveningReportBtn')?.addEventListener('click', saveEveningReport);
    $('#historyTodayBtn')?.addEventListener('click', () => setSelectedDate(todayKey()));
    $('#themeSelect').addEventListener('change', (e) => { state.theme = e.target.value; saveState(); renderAll(); });
    $('#settingsThemeSelect')?.addEventListener('change', (e) => { state.theme = e.target.value; saveState(); renderAll(); });
    $('#studioCategory')?.addEventListener('change', renderStudioTypeOptions);
    $('#studioType')?.addEventListener('change', renderStudioTypeOptions);
    $('#studioNote')?.addEventListener('input', () => { if (state.activeTimer && (state.activeTimer.running || state.activeTimer.paused)) { state.activeTimer.note = $('#studioNote').value; saveState(); } });
    $('#dailyNote').addEventListener('input', (e) => { getMeta().note = e.target.value; saveState(); renderHero(); renderAchievements(); });
    $('#moodRow').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mood]');
      if (!btn) return;
      getMeta().mood = getMeta().mood === btn.dataset.mood ? '' : btn.dataset.mood;
      saveState(); renderAll();
    });
    $('#startDayBtn').addEventListener('click', () => { getMeta().openedAt = getMeta().openedAt || new Date().toISOString(); saveState(); renderAll(); toast('День открыт.'); });
    $('#closeDayBtn').addEventListener('click', () => { getMeta().closedAt = new Date().toISOString(); saveState(); renderAll(); toast('День закрыт.'); });
    $('#fillWorkDayBtn').addEventListener('click', () => fillWorkDay());
    $('#quickCompleteWorkBtn')?.addEventListener('click', () => fillWorkDay());
    $('#quickCompleteSportBtn')?.addEventListener('click', () => {
      addSportEntry({ date: state.selectedDate, start: '18:00', end: '19:00', activity: 'Тренировка', intensity: 'Средняя', calories: 0, note: 'Быстрая отметка спорта' });
      toast('Спорт отмечен.');
    });
    $('#quickCompleteSelfBtn')?.addEventListener('click', () => {
      addSelfEntry({ date: state.selectedDate, start: '20:00', end: '21:00', activity: 'Саморазвитие', note: 'Быстрая отметка саморазвития' });
      toast('Саморазвитие отмечено.');
    });
    $('#removeAutoWorkBtn').addEventListener('click', () => removeAutoWork());
    $('#copyYesterdayBtn').addEventListener('click', copyYesterday);

    $('#setupDefaultBtn')?.addEventListener('click', () => fillConfigForm('setup', DEFAULT_WORK_CONFIG));
    $('#configDefaultBtn')?.addEventListener('click', () => fillConfigForm('config', DEFAULT_WORK_CONFIG));
    $('#setupForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      applyWorkConfig(readConfigForm('setup'), true);
      toast('LifeOS настроен. График можно изменить в настройках.');
    });
    $('#configForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      applyWorkConfig(readConfigForm('config'), true);
      toast('График и спортивная цель обновлены.');
    });

    $('#entryType').addEventListener('change', (e) => $('#customTypeWrap').classList.toggle('hidden', e.target.value !== 'Другое'));
    $('#addQuickCustomTypeBtn').addEventListener('click', () => {
      const input = $('#quickCustomType');
      if (addCustomType(input.value)) input.value = '';
    });
    $('#customTypeForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (addCustomType($('#newCustomType').value)) e.target.reset();
    });
    $('#sportType')?.addEventListener('change', (e) => $('#sportCustomWrap').classList.toggle('hidden', e.target.value !== 'Свой спорт'));
    $('#sportCustomForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (addSportType($('#newSportType').value)) e.target.reset();
    });
    $('#sportForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = $('#sportType').value;
      const custom = $('#sportCustomType').value.trim();
      const activity = raw === 'Свой спорт' ? (custom || 'Свой спорт') : raw;
      const ok = addSportEntry({
        date: $('#sportDate').value,
        start: $('#sportStart').value,
        end: $('#sportEnd').value,
        activity,
        intensity: $('#sportIntensity').value,
        calories: Number($('#sportCalories').value || 0),
        note: $('#sportNote').value.trim()
      });
      if (ok) { $('#sportNote').value = ''; $('#sportCalories').value = ''; $('#sportCustomType').value = ''; }
    });
    $('#selfType')?.addEventListener('change', (e) => $('#selfCustomWrap').classList.toggle('hidden', e.target.value !== 'Свой вариант'));
    $('#selfCustomForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (addSelfType($('#newSelfType').value)) e.target.reset();
    });
    $('#selfForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = $('#selfType').value;
      const custom = $('#selfCustomType').value.trim();
      const activity = raw === 'Свой вариант' ? (custom || 'Свой вариант') : raw;
      const ok = addSelfEntry({ date: $('#selfDate').value, start: $('#selfStart').value, end: $('#selfEnd').value, activity, note: $('#selfNote').value.trim() });
      if (ok) { $('#selfNote').value = ''; $('#selfCustomType').value = ''; }
    });
    $('#entryForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const rawType = $('#entryType').value;
      const custom = $('#entryCustomType').value.trim();
      const type = rawType === 'Другое' ? (custom || 'Другое') : rawType;
      const ok = addEntry({ date: $('#entryDate').value, start: $('#entryStart').value, end: $('#entryEnd').value, type, note: $('#entryNote').value.trim() });
      if (ok) {
        $('#entryNote').value = '';
        $('#entryCustomType').value = '';
      }
    });

    $('#filterDate').addEventListener('change', renderJournal);
    $('#filterType').addEventListener('change', renderJournal);
    $('#filterSearch').addEventListener('input', renderJournal);
    $('#resetFiltersBtn').addEventListener('click', () => { $('#filterDate').value = ''; $('#filterType').value = 'all'; $('#filterSearch').value = ''; renderJournal(); });
    $('#exportCsvBtn').addEventListener('click', exportCsv);
    $('#exportFullCsvBtn').addEventListener('click', exportCsv);
    $('#exportJsonBtn').addEventListener('click', exportJson);
    $('#quickBackupBtn').addEventListener('click', exportJson);

    $('#goalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      state.goals.push({ id: uid(), name: $('#goalName').value.trim(), current: Number($('#goalCurrent').value || 0), target: Number($('#goalTarget').value || 1), unit: $('#goalUnit').value.trim() });
      e.target.reset(); $('#goalCurrent').value = 0; $('#goalTarget').value = 10;
      saveState(); renderAll(); toast('Цель добавлена.');
    });
    $('#habitForm').addEventListener('submit', (e) => {
      e.preventDefault();
      state.habits.push({ id: `custom-${uid()}`, name: $('#habitName').value.trim(), desc: $('#habitDesc').value.trim() });
      e.target.reset(); saveState(); renderAll(); toast('Привычка добавлена.');
    });
    $('#financeForm').addEventListener('submit', (e) => {
      e.preventDefault();
      state.finance = { hourRate: Number($('#hourRate').value || 0), fullDayBonus: Number($('#fullDayBonus').value || 0), missPenalty: Number($('#missPenalty').value || 0), moneyTarget: Number($('#moneyTarget').value || 0) };
      saveState(); renderAll(); toast('Финансовый модуль обновлён.');
    });
    ['glassOpacity','glassBlur'].forEach((id) => {
      const el = $('#' + id);
      el?.addEventListener('input', () => {
        state.ui = state.ui || {};
        if (id === 'glassOpacity') state.ui.glassOpacity = Number(el.value);
        if (id === 'glassBlur') state.ui.glassBlur = Number(el.value);
        applyTheme();
        renderDesignSettings();
      });
    });
    $('#animationLevel')?.addEventListener('change', (e) => { state.ui = state.ui || {}; state.ui.animationLevel = e.target.value; saveState(); renderAll(); });
    $('#designForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.ui = state.ui || {};
      state.theme = $('#settingsThemeSelect').value;
      state.ui.selfDevTargetMinutes = Math.max(0, Number($('#selfTargetMinutes').value || 0));
      state.ui.glassOpacity = Number($('#glassOpacity').value || 68);
      state.ui.glassBlur = Number($('#glassBlur').value || 20);
      state.ui.animationLevel = $('#animationLevel').value || 'normal';
      saveState(); renderAll(); toast('Визуал и цели сохранены.');
    });
    $('#bookForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      upsertBook({
        date: $('#bookDate').value || state.selectedDate,
        title: $('#bookTitle').value,
        author: $('#bookAuthor').value,
        totalPages: $('#bookTotalPages').value,
        currentPage: $('#bookCurrentPage').value,
        pagesToday: $('#bookPagesToday').value,
        minutes: $('#bookMinutes').value,
        status: $('#bookStatus').value,
        note: $('#bookNote').value.trim()
      });
      $('#bookPagesToday').value = ''; $('#bookMinutes').value = '30'; $('#bookNote').value = '';
    });
    $('#courseForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      upsertCourse({
        date: $('#courseDate').value || state.selectedDate,
        title: $('#courseTitle').value,
        link: $('#courseLink').value,
        totalLessons: $('#courseTotalLessons').value,
        doneLessons: $('#courseDoneLessons').value,
        lessonsToday: $('#courseLessonsToday').value,
        minutes: $('#courseMinutes').value,
        status: $('#courseStatus').value,
        note: $('#courseNote').value.trim()
      });
      $('#courseLessonsToday').value = ''; $('#courseMinutes').value = '45'; $('#courseNote').value = '';
    });
    $('#projectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      state.projects.push({ id: uid(), name: $('#projectName').value.trim(), status: $('#projectStatus').value, progress: Number($('#projectProgress').value || 0), deadline: $('#projectDeadline').value, repo: $('#projectRepo').value.trim(), live: $('#projectLive').value.trim(), notes: $('#projectNotes').value.trim() });
      e.target.reset(); $('#projectProgress').value = 0; saveState(); renderAll(); toast('Проект добавлен.');
    });

    $('#generateReportBtn').addEventListener('click', () => { lastReportHtml = buildReportHtml(false); renderReportPreview(true); toast('Отчёт сформирован.'); });
    $('#downloadReportBtn').addEventListener('click', () => downloadFile(`lifeos-report-${todayKey()}.html`, buildReportHtml(true), 'text/html;charset=utf-8'));
    $('#downloadReportCsvBtn')?.addEventListener('click', () => downloadFile(`lifeos-report-summary-${todayKey()}.csv`, reportCsv(), 'text/csv;charset=utf-8'));
    $('#downloadReportJsonBtn')?.addEventListener('click', () => downloadFile(`lifeos-report-summary-${todayKey()}.json`, JSON.stringify(reportJsonPayload(), null, 2), 'application/json;charset=utf-8'));
    $('#copyReportTextBtn')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(reportPlainText()); toast('Текст отчёта скопирован.'); }
      catch { downloadFile(`lifeos-report-${todayKey()}.txt`, reportPlainText(), 'text/plain;charset=utf-8'); toast('Буфер недоступен — скачал TXT.'); }
    });
    $('#downloadTemplateBtn').addEventListener('click', () => downloadFile('lifeos-empty-template.json', JSON.stringify(defaultState(), null, 2), 'application/json;charset=utf-8'));
    $('#importJsonInput').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        state = normalizeLoadedState(parsed);
        saveState(); renderAll(); toast('JSON импортирован.');
      } catch (error) {
        toast('Не удалось импортировать JSON.');
      } finally {
        e.target.value = '';
      }
    });

    $('#timerStartBtn').addEventListener('click', startTimer);
    $('#timerPauseBtn').addEventListener('click', pauseTimer);
    $('#timerResetBtn').addEventListener('click', resetTimer);
    $('#saveFocusBtn').addEventListener('click', saveFocusSession);
    $('#focusMinutes').addEventListener('change', resetTimer);
    $('#breakMinutes').addEventListener('change', resetTimer);

    $('#customCategoryForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      addCustomCategory({ name: $('#catName').value, icon: $('#catIcon').value, kind: $('#catKind').value, targetMinutes: $('#catTarget').value, inRings: $('#catInRings').checked });
      e.target.reset();
      $('#catTarget').value = 30;
      $('#catInRings').checked = true;
    });

    $('#ringSettingsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.ringSlots = [$('#ringSlot0').value, $('#ringSlot1').value, $('#ringSlot2').value];
      saveState(); renderAll(); toast('Кольца обновлены.');
    });

    $('#customTemplateForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      addCustomTemplate({ name: $('#tplName').value, type: $('#tplType').value || $('#tplName').value, start: $('#tplStart').value, end: $('#tplEnd').value, note: $('#tplNote').value });
      e.target.reset();
      $('#tplStart').value = '20:00';
      $('#tplEnd').value = '20:30';
    });

    $('#saveProfileBtn')?.addEventListener('click', () => saveIntoProfile(state.activeProfileId || activeProfile().id));
    $('#duplicateProfileBtn')?.addEventListener('click', duplicateActiveProfile);
    $('#toggleMiniModeBtn')?.addEventListener('click', () => { state.miniMode = !state.miniMode; saveState(); renderAll(); toast(state.miniMode ? 'Мини-режим включён.' : 'Мини-режим выключен.'); });
    $('#miniModeOffBtn')?.addEventListener('click', () => { state.miniMode = false; saveState(); renderAll(); });

    $('#enableNotificationsBtn').addEventListener('click', requestNotificationPermission);
    $('#runDiagnosticsBtn')?.addEventListener('click', () => renderDiagnostics().then(() => toast('Диагностика обновлена.')));
    $('#repairPwaBtn')?.addEventListener('click', () => repairPwaWithoutDeletingData().catch(showFatalError));
    $('#resetUiKeepDataBtn')?.addEventListener('click', resetInterfaceKeepData);
    $('#downloadDiagnosticsBtn')?.addEventListener('click', () => exportDiagnosticFile().catch(showFatalError));
    $('#safetyBackupBtn')?.addEventListener('click', exportJson);
    $('#resetDataBtn').addEventListener('click', () => {
      if (!confirm('Точно сбросить все данные LifeOS? Перед этим лучше сделать экспорт JSON.')) return;
      state = defaultState();
      saveState(); renderAll(); toast('Данные сброшены.');
    });
    $('#clearCacheBtn').addEventListener('click', async () => {
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.update()));
      }
      toast('Кэш PWA очищен. Обнови страницу.');
    });
  }

  function startTimer() {
    if (timer.running) return;
    timer.running = true;
    timer.startedAt = timer.startedAt || new Date();
    timer.interval = setInterval(() => {
      timer.seconds = Math.max(0, timer.seconds - 1);
      renderFocus();
      if (timer.seconds <= 0) {
        pauseTimer();
        const isFocus = timer.mode === 'focus';
        fireReminder('timer-done-' + Date.now(), 'LifeOS Timer', isFocus ? 'Фокус-сессия завершена.' : 'Перерыв завершён.');
      }
    }, 1000);
  }

  function pauseTimer() {
    timer.running = false;
    clearInterval(timer.interval);
    timer.interval = null;
    renderFocus();
  }

  function resetTimer() {
    pauseTimer();
    const minutes = Number($('#focusMinutes').value || 25);
    timer = { seconds: minutes * 60, total: minutes * 60, running: false, mode: 'focus', startedAt: null, interval: null };
    renderFocus();
  }

  function saveFocusSession() {
    const total = Number($('#focusMinutes').value || 25) * 60;
    const done = Math.max(60, total - timer.seconds);
    const minutes = Math.round(done / 60);
    const now = new Date();
    const start = timer.startedAt || new Date(now.getTime() - done * 1000);
    const session = { id: uid(), date: state.selectedDate, minutes, startedAt: start.toISOString(), endedAt: now.toISOString(), start: minutesToTime(start.getHours() * 60 + start.getMinutes()), end: minutesToTime(now.getHours() * 60 + now.getMinutes()), note: 'Сохранено из Pomodoro' };
    state.focusSessions.push(session);
    state.entries.push({ id: uid(), date: state.selectedDate, start: session.start, end: session.end, type: 'Фокус-сессия', note: `${minutes} минут фокуса`, createdAt: new Date().toISOString() });
    resetTimer();
    saveState(); renderAll(); toast('Фокус-сессия сохранена.');
  }

  function updateStandaloneClass() {
    const standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
    document.documentElement.classList.toggle('pwa-standalone', Boolean(standalone));
  }

  function initPwa() {
    updateStandaloneClass();
    if (window.matchMedia) window.matchMedia('(display-mode: standalone)').addEventListener?.('change', updateStandaloneClass);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch((error) => console.warn('SW registration failed', error));
    }
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $('#installBtn').hidden = false;
    });
    $('#installBtn').addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $('#installBtn').hidden = true;
    });
  }

  function migrateOldData() {
    // Миграция уже выполняется в loadState через текущий storageDriver.
  }

  async function restoreFromIndexedDbIfNeeded() {
    try {
      const hasPrimaryState = Boolean(storageGet(KEY));
      if (hasPrimaryState) {
        idbSet(JSON.stringify(state)).catch(() => {});
        return;
      }
      let raw = await idbGet(KEY).catch(() => null);
      if (!raw) {
        for (const legacyKey of LEGACY_KEYS) {
          raw = await idbGet(legacyKey).catch(() => null);
          if (raw) break;
        }
      }
      if (!raw) return;
      const restored = normalizeLoadedState(JSON.parse(raw));
      state = restored;
      storageSet(JSON.stringify(state));
      storageDriver = storageDriver === 'memory' && canUseWebStorage('sessionStorage') ? 'sessionStorage' : storageDriver;
      storageOk = storageDriver !== 'memory';
    } catch (error) {
      console.warn('IndexedDB restore skipped', error);
    }
  }

  async function bootstrap() {
    await restoreFromIndexedDbIfNeeded();
    updateStorageBanner();
    migrateOldData();
    applyTheme();
    initEvents();
    initPwa();
    $('#selectedDate').value = state.selectedDate;
    $('#entryDate').value = state.selectedDate;
    $('#entryStart').value = '10:00';
    $('#entryEnd').value = '11:00';
    if ($('#sportDate')) $('#sportDate').value = state.selectedDate;
    if ($('#selfDate')) $('#selfDate').value = state.selectedDate;
    if ($('#bookDate')) $('#bookDate').value = state.selectedDate;
    if ($('#courseDate')) $('#courseDate').value = state.selectedDate;
    renderAll();
    checkReminders();
    setInterval(checkReminders, 60 * 1000);
    setInterval(() => { if (activeTimerInfo()) { renderTodayCenter(); renderActiveTimers(); } }, 1000);
  }

  let resizeRerenderTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeRerenderTimer);
    resizeRerenderTimer = setTimeout(() => {
      if (state) renderHero();
    }, 120);
  });

  window.addEventListener('error', (event) => showFatalError(event.error || event.message));
  window.addEventListener('unhandledrejection', (event) => showFatalError(event.reason || 'Unhandled promise rejection'));
  document.addEventListener('DOMContentLoaded', () => bootstrap().catch(showFatalError));
})();

(() => {
  'use strict';

  const KEY = 'lifeos.v4.final';
  const START = '2026-07-03';
  const END = '2026-08-31';
  const TOTAL_PLAN_MINUTES = 330 * 60;
  const MOODS = [
    ['🔥', 'мощно'],
    ['🙂', 'нормально'],
    ['😐', 'ровно'],
    ['😵', 'хаос'],
    ['🧊', 'холодно']
  ];
  const BASE_TYPES = [
    'Работа', 'Учёба', 'GitHub-проект', 'Фокус-сессия', 'Обед', 'Дорога', 'Телефон', 'Отдых',
    'Спорт', 'Прогулка', 'Здоровье', 'Домашние дела', 'Покупки', 'Встреча', 'Документы',
    'Творчество', 'Музыка', 'Семья', 'Друзья', 'Сон', 'Прочее', 'Другое'
  ];
  const BASE_SPORT_TYPES = ['Зал', 'Кардио', 'Бег', 'Прогулка', 'Растяжка', 'Футбол', 'Велосипед', 'Бассейн', 'Домашняя тренировка', 'Свой спорт'];
  const SPORT_QUICK_TEMPLATES = [
    { activity: 'Зал', start: '18:00', end: '19:15', intensity: 'Высокая', calories: 450, note: 'Силовая тренировка', icon: '🏋️' },
    { activity: 'Бег', start: '19:00', end: '19:40', intensity: 'Высокая', calories: 380, note: 'Бег / кардио', icon: '🏃' },
    { activity: 'Прогулка', start: '20:00', end: '21:00', intensity: 'Лёгкая', calories: 180, note: 'Прогулка и восстановление', icon: '🚶' },
    { activity: 'Растяжка', start: '21:30', end: '21:50', intensity: 'Лёгкая', calories: 70, note: 'Растяжка / мобилити', icon: '🧘' }
  ];
  const QUICK_TEMPLATES = [
    { type: 'Работа', start: '10:00', end: '17:00', note: 'Полный рабочий день', icon: '💼' },
    { type: 'Работа', start: '10:00', end: '14:00', note: 'Субботний рабочий день', icon: '🧩' },
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
    { id: uid(), name: 'LifeOS', status: 'В работе', progress: 90, deadline: '2026-08-31', repo: '', live: '', notes: 'PWA-панель дня, работы, денег, проектов и привычек.' }
  ];

  let memoryStore = null;
  let storageOk = true;
  let deferredInstallPrompt = null;
  let calendarFilter = 'all';
  let lastReportHtml = '';
  let timer = { seconds: 25 * 60, total: 25 * 60, running: false, mode: 'focus', startedAt: null, interval: null };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-5);
  }

  function storageGet() {
    if (!storageOk) return memoryStore;
    try {
      return localStorage.getItem(KEY);
    } catch (error) {
      storageOk = false;
      $('#storageBanner')?.removeAttribute('hidden');
      return memoryStore;
    }
  }

  function storageSet(value) {
    if (!storageOk) {
      memoryStore = value;
      return;
    }
    try {
      localStorage.setItem(KEY, value);
    } catch (error) {
      storageOk = false;
      memoryStore = value;
      $('#storageBanner')?.removeAttribute('hidden');
      toast('localStorage недоступен. Включён временный режим.');
    }
  }

  function defaultState() {
    return {
      version: 4,
      theme: 'system',
      selectedDate: clampDate(todayKey()),
      entries: [],
      dayMeta: {},
      customTypes: ['Документы', 'Встреча', 'Покупки'],
      sportTypes: [],
      habits: DEFAULT_HABITS.map((h) => ({ ...h })),
      habitChecks: {},
      goals: [
        { id: uid(), name: 'Закрыть рабочий период', current: 0, target: 330, unit: 'часов', auto: 'workHours' },
        { id: uid(), name: 'Серия 10 полных рабочих дней', current: 0, target: 10, unit: 'дней', auto: 'streak' }
      ],
      projects: DEFAULT_PROJECTS.map((p) => ({ ...p, id: uid() })),
      focusSessions: [],
      finance: { hourRate: 350, fullDayBonus: 0, missPenalty: 0, moneyTarget: 0 },
      notifications: { enabled: false, lastFired: {} },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  let state = loadState();

  function loadState() {
    const raw = storageGet();
    if (!raw) return defaultState();
    try {
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return {
        ...base,
        ...parsed,
        entries: Array.isArray(parsed.entries) ? parsed.entries : [],
        dayMeta: parsed.dayMeta || {},
        customTypes: Array.isArray(parsed.customTypes) ? parsed.customTypes : base.customTypes,
        sportTypes: Array.isArray(parsed.sportTypes) ? parsed.sportTypes : base.sportTypes,
        habits: Array.isArray(parsed.habits) && parsed.habits.length ? parsed.habits : base.habits,
        habitChecks: parsed.habitChecks || {},
        goals: Array.isArray(parsed.goals) && parsed.goals.length ? parsed.goals : base.goals,
        projects: Array.isArray(parsed.projects) ? parsed.projects : base.projects,
        focusSessions: Array.isArray(parsed.focusSessions) ? parsed.focusSessions : [],
        finance: { ...base.finance, ...(parsed.finance || {}) },
        notifications: { ...base.notifications, ...(parsed.notifications || {}) },
        selectedDate: clampDate(parsed.selectedDate || todayKey())
      };
    } catch (error) {
      console.warn('LifeOS state parse error', error);
      return defaultState();
    }
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();
    storageSet(JSON.stringify(state));
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

  function clampDate(key) {
    if (!key || key < START) return START;
    if (key > END) return END;
    return key;
  }

  function formatDate(key, options = {}) {
    return toDate(key).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short', ...options });
  }

  function addDays(key, amount) {
    const d = toDate(key);
    d.setDate(d.getDate() + amount);
    return dateKey(d);
  }

  function allDates() {
    const out = [];
    let cursor = START;
    while (cursor <= END) {
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

  function workPlan(date) {
    const d = toDate(date);
    const day = d.getDay();
    if (day === 0) return { minutes: 0, start: null, end: null, label: 'Выходной' };
    if (day === 6) return { minutes: 240, start: '10:00', end: '14:00', label: 'Суббота 10:00–14:00' };
    return { minutes: 420, start: '10:00', end: '17:00', label: 'Будни 10:00–17:00' };
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
    while (date >= START) {
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
    const notes = Object.values(state.dayMeta).filter((m) => m.note && m.note.trim()).length;
    const habitChecks = Object.values(state.habitChecks).reduce((sum, checks) => sum + Object.values(checks || {}).filter(Boolean).length, 0);
    const backups = Number(localStorageSafeGet('lifeos.lastBackupCount') || 0);
    return Math.round(stats.fullDays * 90 + stats.partialDays * 35 + Math.floor(focus / 25) * 25 + Math.floor(sport / 30) * 12 + notes * 10 + habitChecks * 8 + backups * 40);
  }

  function levelFromXp(xp) {
    const level = Math.max(1, Math.floor(Math.sqrt(xp / 85)) + 1);
    const currentBase = 85 * (level - 1) * (level - 1);
    const nextBase = 85 * level * level;
    return { level, currentBase, nextBase, into: xp - currentBase, need: nextBase - currentBase, pct: percent(xp - currentBase, nextBase - currentBase) };
  }

  function localStorageSafeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function localStorageSafeSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  }

  function setSelectedDate(date) {
    state.selectedDate = clampDate(date);
    $('#selectedDate').value = state.selectedDate;
    $('#entryDate').value = state.selectedDate;
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
    document.body.dataset.theme = state.theme || 'system';
    if ($('#themeSelect')) $('#themeSelect').value = state.theme || 'system';
  }

  function renderAll() {
    applyTheme();
    renderHero();
    renderDashboard();
    renderWork();
    renderDay();
    renderCalendar();
    renderJournal();
    renderGoals();
    renderHabits();
    renderFocus();
    renderSport();
    renderMoney();
    renderProjects();
    renderAchievements();
    renderFinanceForm();
    renderCustomTypeSettings();
    renderEntryTypeOptions();
    renderSportTypeOptions();
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
    const need = stats.futureWorkDays ? Math.ceil(stats.left / stats.futureWorkDays) : stats.left;
    const delta = stats.workPast - stats.planPast;
    const statusText = delta >= 0
      ? `Идёшь по плану: запас ${hm(delta)}. Всего закрыто ${hm(stats.work)} из ${hm(stats.plan)}.`
      : `Антихаос: отставание ${hm(Math.abs(delta))}. Нужно в среднем ${hm(need)} в каждый оставшийся рабочий день.`;
    $('#heroAlert').textContent = statusText;
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
    renderQuickTemplates();
    renderTimelineVisual('#dashboardTimeline', date);
    renderEntries('#dashboardEntries', dayEntries(date).slice(0, 6), true);
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

  function renderQuickTemplates() {
    $('#quickTemplates').innerHTML = QUICK_TEMPLATES.map((template, index) => `
      <button class="quick-card" data-template="${index}">
        <strong>${template.icon} ${escapeHtml(template.type)}</strong>
        <span>${template.start}–${template.end}</span>
        <span>${escapeHtml(template.note)}</span>
      </button>
    `).join('');
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
          <p>${formatDate(entry.date)}${entry.auto ? ' · авто-зачёт' : ''}${entry.sportActivity ? ' · ' + escapeHtml(entry.sportActivity) : ''}${entry.intensity ? ' · ' + escapeHtml(entry.intensity) : ''}${entry.calories ? ' · ' + Number(entry.calories) + ' ккал' : ''}${entry.note ? ' · ' + escapeHtml(entry.note) : ''}</p>
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
    const set = new Set([...BASE_TYPES, ...(state.customTypes || [])]);
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
    const thisWeek = stats.entries.filter((entry) => {
      const diff = Math.floor((toDate(state.selectedDate) - toDate(entry.date)) / (24 * 60 * 60 * 1000));
      return diff >= 0 && diff < 7;
    }).reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const metrics = [
      ['Всего спорта', hm(stats.total), `${stats.entries.length} записей`],
      ['Сегодня', hm(stats.today), 'выбранная дата'],
      ['За 7 дней', hm(thisWeek), 'от выбранной даты назад'],
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

  function renderCustomTypeSettings() {
    const list = $('#customTypeList');
    if (!list) return;
    const custom = state.customTypes || [];
    list.innerHTML = custom.length ? custom.map((type) => `
      <button class="chip" data-custom-type-del="${escapeHtml(type)}">${escapeHtml(type)} ×</button>
    `).join('') : '<div class="empty-state">Свои варианты пока не добавлены.</div>';
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

  function achievements() {
    const stats = periodStats();
    const focus = state.focusSessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
    const entries = state.entries.length;
    const projectsDone = state.projects.filter((p) => Number(p.progress || 0) >= 100 || p.status === 'Готово').length;
    const sportMinutes = sportEntries().reduce((sum, entry) => sum + Math.max(0, timeToMinutes(entry.end) - timeToMinutes(entry.start)), 0);
    const notes = Object.values(state.dayMeta).filter((m) => m.note && m.note.trim()).length;
    const jsonBackups = Number(localStorageSafeGet('lifeos.lastBackupCount') || 0);
    return [
      ['Первый след', entries >= 1, 'Добавить первую запись времени.'],
      ['Полный рабочий день', stats.fullDays >= 1, 'Закрыть один рабочий день на 100%.'],
      ['Стабильный', stats.fullDays >= 5, 'Закрыть 5 полных рабочих дней.'],
      ['Машина', stats.fullDays >= 20, 'Закрыть 20 полных рабочих дней.'],
      ['Период под контролем', stats.pct >= 100, 'Закрыть весь план 330 часов.'],
      ['Фокусник', focus >= 120, 'Накопить 2 часа фокус-сессий.'],
      ['Спорт включён', sportEntries().length >= 1, 'Добавить первую спортивную активность.'],
      ['Движение', sportMinutes >= 300, 'Накопить 5 часов спорта или прогулок.'],
      ['Архивариус', jsonBackups >= 1, 'Сделать экспорт JSON.'],
      ['Дневник живёт', notes >= 7, 'Оставить 7 заметок дня.'],
      ['Проектный режим', state.projects.length >= 3, 'Добавить 3 проекта.'],
      ['Довёл до релиза', projectsDone >= 1, 'Закрыть проект на 100% или статусом Готово.'],
      ['Календарик стукача', state.theme === 'snitch', 'Включить пасхальную тему.' ]
    ];
  }

  function renderAchievements() {
    const xp = earnedXp();
    const lvl = levelFromXp(xp);
    $('#xpBox').innerHTML = `
      <div class="xp-level">Lv. ${lvl.level}</div>
      <p class="muted">${xp} XP · до следующего уровня ${Math.max(0, lvl.need - lvl.into)} XP</p>
      <div class="progress big"><span style="width:${lvl.pct}%"></span></div>
    `;
    $('#achievementList').innerHTML = achievements().map(([name, unlocked, desc]) => `
      <article class="list-card achievement ${unlocked ? 'unlocked' : 'locked'}">
        <strong>${unlocked ? '✅' : '🔒'} ${escapeHtml(name)}</strong>
        <p>${escapeHtml(desc)}</p>
      </article>
    `).join('');
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
    const typeRows = Array.from(typeMinutesAll().entries()).sort((a, b) => b[1] - a[1]);
    const body = `
      <h2>LifeOS Report</h2>
      <p><strong>Период:</strong> 03.07.2026 — 31.08.2026</p>
      <p><strong>План:</strong> ${hm(stats.plan, false)} · <strong>Факт:</strong> ${hm(stats.work, false)} · <strong>Выполнение:</strong> ${stats.pct}%</p>
      <p><strong>Осталось:</strong> ${hm(stats.left, false)} · <strong>Отставание по текущей дате:</strong> ${hm(stats.lostPast, false)}</p>
      <p><strong>Полных дней:</strong> ${stats.fullDays} · <strong>Частичных:</strong> ${stats.partialDays} · <strong>Пустых:</strong> ${stats.missedDays}</p>
      <p><strong>Лучший день:</strong> ${stats.best.date ? formatDate(stats.best.date, { year: 'numeric' }) + ' — ' + hm(stats.best.minutes, false) : 'нет данных'}</p>
      <p><strong>Заработано по настройкам:</strong> ${rub(earned)}</p>
      <p><strong>Спорт:</strong> ${hm(sports.total, false)} · <strong>Тренировок/активностей:</strong> ${sports.entries.length} · <strong>Ккал:</strong> ${sports.calories || 0}</p>
      <h3>Категории времени</h3>
      <ul>${typeRows.map(([type, mins]) => `<li><strong>${escapeHtml(type)}:</strong> ${hm(mins, false)}</li>`).join('')}</ul>
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
    const rows = [['date', 'start', 'end', 'type', 'sport_activity', 'intensity', 'calories', 'minutes', 'note', 'auto']];
    state.entries.sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)).forEach((entry) => {
      rows.push([entry.date, entry.start, entry.end, entry.type, entry.sportActivity || '', entry.intensity || '', entry.calories || '', String(timeToMinutes(entry.end) - timeToMinutes(entry.start)), entry.note || '', entry.auto ? '1' : '0']);
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
    if (date < START || date > END) return;
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
      if (target.dataset.sportTemplate !== undefined) {
        const t = SPORT_QUICK_TEMPLATES[Number(target.dataset.sportTemplate)];
        addSportEntry({ date: state.selectedDate, start: t.start, end: t.end, activity: t.activity, intensity: t.intensity, calories: t.calories, note: t.note });
      }
      if (target.dataset.template !== undefined) {
        const t = QUICK_TEMPLATES[Number(target.dataset.template)];
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
      if (target.dataset.customTypeDel) {
        state.customTypes = (state.customTypes || []).filter((type) => type !== target.dataset.customTypeDel);
        saveState(); renderAll(); toast('Свой вариант удалён из списка. Старые записи сохранены.');
      }
    });

    document.addEventListener('change', (event) => {
      const habit = event.target.closest('[data-habit-check]');
      if (habit) {
        state.habitChecks[state.selectedDate] = state.habitChecks[state.selectedDate] || {};
        state.habitChecks[state.selectedDate][habit.dataset.habitCheck] = habit.checked;
        saveState(); renderAll();
      }
    });

    $('#selectedDate').addEventListener('change', (e) => setSelectedDate(e.target.value));
    $('#themeSelect').addEventListener('change', (e) => { state.theme = e.target.value; saveState(); renderAll(); });
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
    $('#removeAutoWorkBtn').addEventListener('click', () => removeAutoWork());
    $('#copyYesterdayBtn').addEventListener('click', copyYesterday);

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
    $('#projectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      state.projects.push({ id: uid(), name: $('#projectName').value.trim(), status: $('#projectStatus').value, progress: Number($('#projectProgress').value || 0), deadline: $('#projectDeadline').value, repo: $('#projectRepo').value.trim(), live: $('#projectLive').value.trim(), notes: $('#projectNotes').value.trim() });
      e.target.reset(); $('#projectProgress').value = 0; saveState(); renderAll(); toast('Проект добавлен.');
    });

    $('#generateReportBtn').addEventListener('click', () => { lastReportHtml = buildReportHtml(false); renderReportPreview(true); toast('Отчёт сформирован.'); });
    $('#downloadReportBtn').addEventListener('click', () => downloadFile(`lifeos-report-${todayKey()}.html`, buildReportHtml(true), 'text/html;charset=utf-8'));
    $('#downloadTemplateBtn').addEventListener('click', () => downloadFile('lifeos-empty-template.json', JSON.stringify(defaultState(), null, 2), 'application/json;charset=utf-8'));
    $('#importJsonInput').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        state = { ...defaultState(), ...parsed, selectedDate: clampDate(parsed.selectedDate || todayKey()) };
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

    $('#enableNotificationsBtn').addEventListener('click', requestNotificationPermission);
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

  function initPwa() {
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
    // Мягкая миграция из ранних сборок LifeOS, если пользователь уже что-то ввёл.
    const oldKeys = ['lifeos.v3', 'lifeosData', 'lifeos-pwa-data'];
    if (storageGet()) return;
    for (const key of oldKeys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const old = JSON.parse(raw);
        state = { ...defaultState(), ...old, selectedDate: clampDate(old.selectedDate || todayKey()) };
        saveState();
        toast('Старые данные LifeOS найдены и перенесены.');
        break;
      } catch { /* ignore */ }
    }
  }

  function bootstrap() {
    if (!storageOk) $('#storageBanner')?.removeAttribute('hidden');
    migrateOldData();
    applyTheme();
    initEvents();
    initPwa();
    $('#selectedDate').value = state.selectedDate;
    $('#entryDate').value = state.selectedDate;
    $('#entryStart').value = '10:00';
    $('#entryEnd').value = '11:00';
    if ($('#sportDate')) $('#sportDate').value = state.selectedDate;
    renderAll();
    checkReminders();
    setInterval(checkReminders, 60 * 1000);
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();

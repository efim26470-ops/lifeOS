(() => {
  'use strict';

  const APP_KEY = 'lifeos:v1';
  const START = '2026-07-03';
  const END = '2026-08-31';
  const DEFAULT_HABITS = [
    { id: 'habit-serbian', title: 'Учёба 20 минут', createdAt: new Date().toISOString() },
    { id: 'habit-github', title: 'GitHub-проект 30 минут', createdAt: new Date().toISOString() },
    { id: 'habit-water', title: 'Вода и перерыв без телефона', createdAt: new Date().toISOString() }
  ];

  const els = {
    tabs: document.querySelectorAll('.tab'),
    views: document.querySelectorAll('.view'),
    themeSelect: document.getElementById('themeSelect'),
    selectedDate: document.getElementById('selectedDate'),
    todayTitle: document.getElementById('todayTitle'),
    workTaskBox: document.getElementById('workTaskBox'),
    workTaskTitle: document.getElementById('workTaskTitle'),
    workTaskText: document.getElementById('workTaskText'),
    toggleWorkDoneBtn: document.getElementById('toggleWorkDoneBtn'),
    dayProgressText: document.getElementById('dayProgressText'),
    dayProgressBar: document.getElementById('dayProgressBar'),
    todayEntries: document.getElementById('todayEntries'),
    quickLogForm: document.getElementById('quickLogForm'),
    logDate: document.getElementById('logDate'),
    logStart: document.getElementById('logStart'),
    logEnd: document.getElementById('logEnd'),
    logType: document.getElementById('logType'),
    customTypeLabel: document.getElementById('customTypeLabel'),
    customType: document.getElementById('customType'),
    logNote: document.getElementById('logNote'),
    calendarGrid: document.getElementById('calendarGrid'),
    filterDate: document.getElementById('filterDate'),
    filterType: document.getElementById('filterType'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    logList: document.getElementById('logList'),
    datePlanBox: document.getElementById('datePlanBox'),
    habitForm: document.getElementById('habitForm'),
    habitInput: document.getElementById('habitInput'),
    habitList: document.getElementById('habitList'),
    heroPercent: document.getElementById('heroPercent'),
    heroStreak: document.getElementById('heroStreak'),
    heroHours: document.getElementById('heroHours'),
    levelValue: document.getElementById('levelValue'),
    levelTitle: document.getElementById('levelTitle'),
    levelText: document.getElementById('levelText'),
    xpBar: document.getElementById('xpBar'),
    xpText: document.getElementById('xpText'),
    statPlannedDays: document.getElementById('statPlannedDays'),
    statPlannedHours: document.getElementById('statPlannedHours'),
    statLoggedWork: document.getElementById('statLoggedWork'),
    statTotalLogged: document.getElementById('statTotalLogged'),
    categoryStats: document.getElementById('categoryStats'),
    bars14: document.getElementById('bars14'),
    exportBtn: document.getElementById('exportBtn'),
    importInput: document.getElementById('importInput'),
    resetBtn: document.getElementById('resetBtn'),
    installBtn: document.getElementById('installBtn'),
    iosHelpBtn: document.getElementById('iosHelpBtn'),
    iosDialog: document.getElementById('iosDialog'),
    closeIosDialog: document.getElementById('closeIosDialog'),
    toast: document.getElementById('toast')
  };

  let deferredInstallPrompt = null;
  let state = loadState();
  let selectedDate = getInitialDate();

  init();

  function init() {
    applyTheme();
    els.themeSelect.value = state.theme || 'system';
    els.selectedDate.value = selectedDate;
    els.logDate.value = selectedDate;
    setupEvents();
    prefillWorkInterval(selectedDate);
    renderAll();
    registerServiceWorker();
  }

  function setupEvents() {
    els.tabs.forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    els.themeSelect.addEventListener('change', () => {
      state.theme = els.themeSelect.value;
      saveState();
      applyTheme();
      toast('Тема обновлена');
    });

    els.selectedDate.addEventListener('change', () => {
      selectedDate = clampDate(els.selectedDate.value || START);
      els.selectedDate.value = selectedDate;
      els.logDate.value = selectedDate;
      prefillWorkInterval(selectedDate);
      renderAll();
    });

    els.logDate.addEventListener('change', () => {
      const value = clampDate(els.logDate.value || selectedDate);
      els.logDate.value = value;
      prefillWorkInterval(value);
    });

    els.logType.addEventListener('change', () => {
      els.customTypeLabel.classList.toggle('hidden', els.logType.value !== 'Другое');
      if (els.logType.value !== 'Другое') els.customType.value = '';
    });

    els.quickLogForm.addEventListener('submit', addEntryFromForm);

    els.toggleWorkDoneBtn.addEventListener('click', () => {
      const schedule = getWorkSchedule(selectedDate);
      if (!schedule.isWorkday) {
        toast('Это выходной день');
        return;
      }
      state.doneDays[selectedDate] = !state.doneDays[selectedDate];
      saveState();
      renderAll();
      toast(state.doneDays[selectedDate] ? 'Рабочий день отмечен выполненным' : 'Отметка снята');
    });

    els.filterDate.addEventListener('change', renderLogList);
    els.filterType.addEventListener('change', renderLogList);
    els.clearFiltersBtn.addEventListener('click', () => {
      els.filterDate.value = '';
      els.filterType.value = 'all';
      renderLogList();
    });

    els.habitForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = els.habitInput.value.trim();
      if (!title) return;
      state.habits.unshift({ id: uid(), title, createdAt: new Date().toISOString() });
      els.habitInput.value = '';
      saveState();
      renderAll();
      toast('Привычка добавлена');
    });

    els.exportBtn.addEventListener('click', exportData);
    els.importInput.addEventListener('change', importData);
    els.resetBtn.addEventListener('click', resetData);

    els.iosHelpBtn.addEventListener('click', () => els.iosDialog.showModal());
    els.closeIosDialog.addEventListener('click', () => els.iosDialog.close());

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      els.installBtn.hidden = false;
    });

    els.installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      els.installBtn.hidden = true;
    });
  }

  function switchTab(tabId) {
    els.tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabId));
    els.views.forEach((view) => view.classList.toggle('active', view.id === tabId));
  }

  function renderAll() {
    renderToday();
    renderCalendar();
    renderLogFilters();
    renderLogList();
    renderDatePlan();
    renderHabits();
    renderStats();
    renderLevel();
    renderHero();
  }

  function renderToday() {
    const schedule = getWorkSchedule(selectedDate);
    const dateLabel = formatDateLong(selectedDate);
    els.todayTitle.textContent = dateLabel;

    if (schedule.isWorkday) {
      els.workTaskTitle.textContent = 'Работа';
      els.workTaskText.textContent = `${weekdayName(selectedDate)} · ${schedule.start}–${schedule.end} · план ${formatMinutes(schedule.minutes)}`;
      els.toggleWorkDoneBtn.disabled = false;
      els.toggleWorkDoneBtn.textContent = state.doneDays[selectedDate] ? 'Снять отметку' : 'Выполнено';
    } else {
      els.workTaskTitle.textContent = 'Выходной';
      els.workTaskText.textContent = 'Воскресенье не входит в рабочий график. Можно вести обычный журнал времени.';
      els.toggleWorkDoneBtn.disabled = true;
      els.toggleWorkDoneBtn.textContent = 'Выходной';
    }

    const progress = getDayProgress(selectedDate);
    els.dayProgressText.textContent = `${Math.round(progress.percent)}%`;
    els.dayProgressBar.style.width = `${Math.min(100, Math.round(progress.percent))}%`;

    const entries = getEntriesForDate(selectedDate).slice().sort(sortEntriesAsc);
    if (!entries.length) {
      els.todayEntries.innerHTML = '<div class="empty">Пока нет записей за этот день.</div>';
      return;
    }

    els.todayEntries.innerHTML = entries.map(entryTemplate).join('');
    bindEntryButtons(els.todayEntries);
  }

  function renderCalendar() {
    const dates = getDateRange(START, END);
    els.calendarGrid.innerHTML = dates.map((dateStr) => {
      const schedule = getWorkSchedule(dateStr);
      const status = getDayStatus(dateStr);
      const progress = getDayProgress(dateStr);
      const label = statusLabel(status);
      const month = parseYMD(dateStr).toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '');
      return `
        <button class="day-card" data-date="${dateStr}" aria-label="${formatDateLong(dateStr)}">
          <span>
            <strong>${parseYMD(dateStr).getDate()}</strong>
            <small>${month} · ${weekdayShort(dateStr)}</small>
          </span>
          <span>
            <span class="badge ${status}">${label}</span>
            <small>${schedule.isWorkday ? `${schedule.start}–${schedule.end}` : 'выходной'} · ${Math.round(progress.percent)}%</small>
          </span>
        </button>
      `;
    }).join('');

    els.calendarGrid.querySelectorAll('.day-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedDate = card.dataset.date;
        els.selectedDate.value = selectedDate;
        els.logDate.value = selectedDate;
        prefillWorkInterval(selectedDate);
        switchTab('today');
        renderAll();
      });
    });
  }

  function renderLogFilters() {
    const types = [...new Set(state.entries.map((entry) => entry.type))].sort((a, b) => a.localeCompare(b, 'ru'));
    const current = els.filterType.value || 'all';
    els.filterType.innerHTML = '<option value="all">Все типы</option>' + types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
    els.filterType.value = types.includes(current) ? current : 'all';
  }

  function renderLogList() {
    const dateFilter = els.filterDate.value;
    const typeFilter = els.filterType.value;
    let entries = state.entries.slice().sort((a, b) => `${b.date} ${b.start}`.localeCompare(`${a.date} ${a.start}`));

    if (dateFilter) entries = entries.filter((entry) => entry.date === dateFilter);
    if (typeFilter && typeFilter !== 'all') entries = entries.filter((entry) => entry.type === typeFilter);

    if (!entries.length) {
      els.logList.innerHTML = '<div class="empty">Записей по выбранным условиям нет.</div>';
      return;
    }

    els.logList.innerHTML = entries.map(entryTemplate).join('');
    bindEntryButtons(els.logList);
  }

  function renderDatePlan() {
    const schedule = getWorkSchedule(selectedDate);
    const entries = getEntriesForDate(selectedDate);
    const totals = getTotalsByType(entries);
    const progress = getDayProgress(selectedDate);

    const categories = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([type, minutes]) => `<li><strong>${escapeHtml(type)}</strong> — ${formatMinutes(minutes)}</li>`)
      .join('') || '<li>Пока нет записей.</li>';

    els.datePlanBox.innerHTML = `
      <h4>${formatDateLong(selectedDate)}</h4>
      <p>${schedule.isWorkday ? `План работы: <strong>${schedule.start}–${schedule.end}</strong> (${formatMinutes(schedule.minutes)}).` : 'Рабочий план отсутствует: выходной.'}</p>
      <p>Прогресс работы: <strong>${Math.round(progress.percent)}%</strong>.</p>
      <ul>${categories}</ul>
    `;
  }

  function renderHabits() {
    if (!state.habits.length) {
      els.habitList.innerHTML = '<div class="empty">Добавь привычку, чтобы отслеживать её каждый день.</div>';
      return;
    }

    const dayChecks = state.habitChecks[selectedDate] || {};
    els.habitList.innerHTML = state.habits.map((habit) => {
      const done = Boolean(dayChecks[habit.id]);
      return `
        <div class="habit-item">
          <button class="habit-check ${done ? 'done' : ''}" data-habit-toggle="${habit.id}" aria-label="Отметить привычку"></button>
          <span class="habit-title ${done ? 'done' : ''}">${escapeHtml(habit.title)}</span>
          <button class="icon-btn" data-habit-delete="${habit.id}" aria-label="Удалить привычку">×</button>
        </div>
      `;
    }).join('');

    els.habitList.querySelectorAll('[data-habit-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.habitToggle;
        state.habitChecks[selectedDate] ||= {};
        state.habitChecks[selectedDate][id] = !state.habitChecks[selectedDate][id];
        saveState();
        renderAll();
      });
    });

    els.habitList.querySelectorAll('[data-habit-delete]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.habitDelete;
        state.habits = state.habits.filter((habit) => habit.id !== id);
        Object.values(state.habitChecks).forEach((checks) => delete checks[id]);
        saveState();
        renderAll();
        toast('Привычка удалена');
      });
    });
  }

  function renderStats() {
    const dates = getDateRange(START, END);
    const workDates = dates.filter((dateStr) => getWorkSchedule(dateStr).isWorkday);
    const plannedMinutes = workDates.reduce((sum, dateStr) => sum + getWorkSchedule(dateStr).minutes, 0);
    const workLogged = state.entries.filter((entry) => entry.type === 'Работа').reduce((sum, entry) => sum + entry.minutes, 0);
    const totalLogged = state.entries.reduce((sum, entry) => sum + entry.minutes, 0);

    els.statPlannedDays.textContent = String(workDates.length);
    els.statPlannedHours.textContent = formatMinutesShort(plannedMinutes);
    els.statLoggedWork.textContent = formatMinutesShort(workLogged);
    els.statTotalLogged.textContent = formatMinutesShort(totalLogged);

    const totals = getTotalsByType(state.entries);
    const max = Math.max(1, ...Object.values(totals));
    const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    els.categoryStats.innerHTML = rows.length ? rows.map(([type, minutes]) => `
      <div class="category-row">
        <div class="category-row-head"><span>${escapeHtml(type)}</span><span>${formatMinutes(minutes)}</span></div>
        <div class="category-track"><span style="width:${Math.max(4, minutes / max * 100)}%"></span></div>
      </div>
    `).join('') : '<div class="empty">Категории появятся после первых записей.</div>';

    renderBars14();
  }

  function renderBars14() {
    const anchor = clampDate(selectedDate || getInitialDate());
    const anchorDate = parseYMD(anchor);
    const dates = [];
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(anchorDate);
      d.setDate(anchorDate.getDate() - i);
      const ymd = toYMD(d);
      if (ymd >= START && ymd <= END) dates.push(ymd);
    }
    const max = Math.max(60, ...dates.map((dateStr) => getEntriesForDate(dateStr).reduce((sum, entry) => sum + entry.minutes, 0)));
    els.bars14.innerHTML = dates.map((dateStr) => {
      const minutes = getEntriesForDate(dateStr).reduce((sum, entry) => sum + entry.minutes, 0);
      const height = Math.max(6, minutes / max * 170);
      return `<div class="bar-item"><div class="bar" style="height:${height}px"></div><span>${parseYMD(dateStr).getDate()}</span></div>`;
    }).join('') || '<div class="empty">Недостаточно дат для графика.</div>';
  }

  function renderLevel() {
    const xp = calculateXP();
    const level = Math.floor(xp / 100) + 1;
    const current = xp % 100;
    els.levelValue.textContent = String(level);
    els.xpBar.style.width = `${current}%`;
    els.xpText.textContent = `${current} / 100 XP · всего ${xp} XP`;

    const titles = [
      'Новичок системы',
      'Стабильный режим',
      'Оператор дня',
      'Архитектор недели',
      'LifeOS Pro',
      'Системный мастер'
    ];
    els.levelTitle.textContent = titles[Math.min(titles.length - 1, level - 1)];
    els.levelText.textContent = `Уровень растёт за выполненные рабочие дни, привычки и записи в журнале.`;
  }

  function renderHero() {
    const dates = getDateRange(START, END).filter((dateStr) => getWorkSchedule(dateStr).isWorkday);
    const completed = dates.filter((dateStr) => getDayStatus(dateStr) === 'done').length;
    const percent = dates.length ? Math.round(completed / dates.length * 100) : 0;
    const workLogged = state.entries.filter((entry) => entry.type === 'Работа').reduce((sum, entry) => sum + entry.minutes, 0);

    els.heroPercent.textContent = `${percent}%`;
    els.heroStreak.textContent = String(getStreak());
    els.heroHours.textContent = formatMinutesShort(workLogged);
  }

  function addEntryFromForm(event) {
    event.preventDefault();
    const date = clampDate(els.logDate.value || selectedDate);
    const start = els.logStart.value;
    const end = els.logEnd.value;
    const minutes = getDurationMinutes(start, end);
    let type = els.logType.value;
    const note = els.logNote.value.trim();

    if (type === 'Другое') {
      const custom = els.customType.value.trim();
      if (!custom) {
        toast('Впиши свой вариант времяпрепровождения');
        els.customType.focus();
        return;
      }
      type = custom;
    }

    if (!start || !end || minutes <= 0) {
      toast('Проверь время: конец должен быть позже начала');
      return;
    }

    state.entries.push({ id: uid(), date, start, end, type, note, minutes, createdAt: new Date().toISOString() });
    state.entries.sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
    saveState();

    selectedDate = date;
    els.selectedDate.value = selectedDate;
    els.logNote.value = '';
    els.customType.value = '';
    if (els.logType.value === 'Другое') {
      els.logType.value = 'Работа';
      els.customTypeLabel.classList.add('hidden');
    }
    prefillWorkInterval(date);
    renderAll();
    toast('Интервал записан');
  }

  function entryTemplate(entry) {
    return `
      <div class="entry" data-entry-id="${entry.id}">
        <div>
          <h4>${escapeHtml(entry.type)}</h4>
          <small>${formatDateShort(entry.date)} · ${entry.start}–${entry.end} · ${formatMinutes(entry.minutes)}</small>
          ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ''}
        </div>
        <div class="entry-actions">
          <button class="icon-btn" data-delete-entry="${entry.id}" aria-label="Удалить запись">×</button>
        </div>
      </div>
    `;
  }

  function bindEntryButtons(root) {
    root.querySelectorAll('[data-delete-entry]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.deleteEntry;
        state.entries = state.entries.filter((entry) => entry.id !== id);
        saveState();
        renderAll();
        toast('Запись удалена');
      });
    });
  }

  function prefillWorkInterval(dateStr) {
    const schedule = getWorkSchedule(dateStr);
    if (schedule.isWorkday) {
      els.logStart.value = schedule.start;
      els.logEnd.value = schedule.end;
      els.logType.value = 'Работа';
    } else {
      els.logStart.value = '10:00';
      els.logEnd.value = '11:00';
    }
    els.customTypeLabel.classList.toggle('hidden', els.logType.value !== 'Другое');
  }

  function getDayProgress(dateStr) {
    const schedule = getWorkSchedule(dateStr);
    if (!schedule.isWorkday) return { percent: 100, workMinutes: 0 };
    if (state.doneDays[dateStr]) return { percent: 100, workMinutes: schedule.minutes };
    const workMinutes = getEntriesForDate(dateStr)
      .filter((entry) => entry.type === 'Работа')
      .reduce((sum, entry) => sum + entry.minutes, 0);
    return { percent: Math.min(100, workMinutes / schedule.minutes * 100), workMinutes };
  }

  function getDayStatus(dateStr) {
    const schedule = getWorkSchedule(dateStr);
    if (!schedule.isWorkday) return 'off';
    const progress = getDayProgress(dateStr).percent;
    if (progress >= 100 || state.doneDays[dateStr]) return 'done';
    if (progress > 0) return 'partial';
    return 'missed';
  }

  function statusLabel(status) {
    return {
      done: 'выполнено',
      partial: 'частично',
      missed: 'пусто',
      off: 'выходной'
    }[status] || status;
  }

  function getWorkSchedule(dateStr) {
    const d = parseYMD(dateStr);
    const day = d.getDay();
    if (day === 0) return { isWorkday: false, start: null, end: null, minutes: 0 };
    if (day === 6) return { isWorkday: true, start: '10:00', end: '14:00', minutes: 240 };
    return { isWorkday: true, start: '10:00', end: '17:00', minutes: 420 };
  }

  function calculateXP() {
    const workDoneXP = getDateRange(START, END).filter((dateStr) => getDayStatus(dateStr) === 'done').length * 40;
    const entriesXP = state.entries.length * 5;
    const habitXP = Object.values(state.habitChecks).reduce((sum, checks) => sum + Object.values(checks).filter(Boolean).length * 10, 0);
    return workDoneXP + entriesXP + habitXP;
  }

  function getStreak() {
    const dates = getDateRange(START, selectedDate).filter((dateStr) => getWorkSchedule(dateStr).isWorkday).reverse();
    let streak = 0;
    for (const dateStr of dates) {
      if (getDayStatus(dateStr) === 'done') streak += 1;
      else break;
    }
    return streak;
  }

  function getInitialDate() {
    const today = toYMD(new Date());
    return clampDate(today);
  }

  function clampDate(dateStr) {
    if (!dateStr || dateStr < START) return START;
    if (dateStr > END) return END;
    return dateStr;
  }

  function getDateRange(start, end) {
    const out = [];
    const cursor = parseYMD(start);
    const endDate = parseYMD(end);
    while (cursor <= endDate) {
      out.push(toYMD(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return out;
  }

  function parseYMD(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function toYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getDurationMinutes(start, end) {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  }

  function getEntriesForDate(dateStr) {
    return state.entries.filter((entry) => entry.date === dateStr);
  }

  function getTotalsByType(entries) {
    return entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + entry.minutes;
      return acc;
    }, {});
  }

  function sortEntriesAsc(a, b) {
    return `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`);
  }

  function formatDateLong(dateStr) {
    return parseYMD(dateStr).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatDateShort(dateStr) {
    return parseYMD(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function weekdayName(dateStr) {
    return parseYMD(dateStr).toLocaleDateString('ru-RU', { weekday: 'long' });
  }

  function weekdayShort(dateStr) {
    return parseYMD(dateStr).toLocaleDateString('ru-RU', { weekday: 'short' }).replace('.', '');
  }

  function formatMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return `${m} мин`;
    if (!m) return `${h} ч`;
    return `${h} ч ${m} мин`;
  }

  function formatMinutesShort(minutes) {
    const h = minutes / 60;
    return `${Number.isInteger(h) ? h : h.toFixed(1)}ч`;
  }

  function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(APP_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return normalizeState(parsed);
    } catch (error) {
      console.warn('LifeOS state load failed', error);
      return normalizeState(null);
    }
  }

  function normalizeState(value) {
    return {
      theme: value?.theme || 'system',
      entries: Array.isArray(value?.entries) ? value.entries.filter(isValidEntry) : [],
      doneDays: value?.doneDays && typeof value.doneDays === 'object' ? value.doneDays : {},
      habits: Array.isArray(value?.habits) ? value.habits : DEFAULT_HABITS,
      habitChecks: value?.habitChecks && typeof value.habitChecks === 'object' ? value.habitChecks : {}
    };
  }

  function isValidEntry(entry) {
    return entry && entry.id && entry.date && entry.start && entry.end && entry.type && Number.isFinite(entry.minutes);
  }

  function saveState() {
    localStorage.setItem(APP_KEY, JSON.stringify(state));
  }

  function applyTheme() {
    const theme = state.theme || 'system';
    if (theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }

  function exportData() {
    const payload = {
      app: 'LifeOS',
      version: 1,
      period: { start: START, end: END },
      exportedAt: new Date().toISOString(),
      data: state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifeos-backup-${toYMD(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Резервная копия создана');
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        state = normalizeState(parsed.data || parsed);
        saveState();
        renderAll();
        toast('Данные импортированы');
      } catch (error) {
        toast('Не удалось импортировать JSON');
      } finally {
        els.importInput.value = '';
      }
    };
    reader.readAsText(file);
  }

  function resetData() {
    const ok = window.confirm('Сбросить все записи, привычки и отметки LifeOS?');
    if (!ok) return;
    localStorage.removeItem(APP_KEY);
    state = normalizeState(null);
    selectedDate = getInitialDate();
    els.selectedDate.value = selectedDate;
    els.logDate.value = selectedDate;
    prefillWorkInterval(selectedDate);
    applyTheme();
    renderAll();
    toast('Данные сброшены');
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => els.toast.classList.remove('show'), 2200);
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((error) => console.warn('SW registration failed', error));
      });
    }
  }
})();

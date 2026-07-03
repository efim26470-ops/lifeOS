(() => {
  'use strict';

  const APP_KEY = 'lifeos:v1';
  const START = '2026-07-03';
  const END = '2026-08-31';

  const DEFAULT_HABITS = [
    { id: 'habit-work-ready', title: 'Начать рабочий день вовремя', createdAt: new Date().toISOString() },
    { id: 'habit-study', title: 'Учёба 20 минут', createdAt: new Date().toISOString() },
    { id: 'habit-github', title: 'GitHub-проект 30 минут', createdAt: new Date().toISOString() },
    { id: 'habit-water', title: 'Вода и перерыв без телефона', createdAt: new Date().toISOString() }
  ];

  const DEFAULT_GOALS = [
    { id: 'goal-work-period', title: 'Закрыть рабочий период без пропусков', target: 51, current: 0, unit: 'дней', deadline: END, createdAt: new Date().toISOString() }
  ];

  const MOODS = [
    { key: 'bad', label: 'Плохо', icon: '😵' },
    { key: 'tired', label: 'Устал', icon: '😐' },
    { key: 'ok', label: 'Норм', icon: '🙂' },
    { key: 'good', label: 'Хорошо', icon: '😎' },
    { key: 'fire', label: 'Огонь', icon: '🔥' }
  ];

  const TEMPLATES = [
    { title: 'Работа', type: 'Работа', start: '10:00', end: '17:00', note: 'Рабочий день по графику' },
    { title: 'Суббота', type: 'Работа', start: '10:00', end: '14:00', note: 'Рабочая суббота по графику' },
    { title: 'Учёба', type: 'Учёба', start: '19:00', end: '19:30', note: 'Учёба / язык / конспект' },
    { title: 'GitHub', type: 'GitHub-проект', start: '20:00', end: '20:45', note: 'Доработка проекта' },
    { title: 'Обед', type: 'Обед', start: '13:00', end: '13:30', note: 'Перерыв' },
    { title: 'Другое', type: 'Другое', start: '18:00', end: '18:30', note: '' }
  ];

  const els = {
    tabs: document.querySelectorAll('.tab'),
    views: document.querySelectorAll('.view'),
    themeSelect: document.getElementById('themeSelect'),
    selectedDate: document.getElementById('selectedDate'),
    dashTitle: document.getElementById('dashTitle'),
    heroInline: document.getElementById('heroInline'),
    heroPercent: document.getElementById('heroPercent'),
    heroStreak: document.getElementById('heroStreak'),
    heroHours: document.getElementById('heroHours'),
    heroBalance: document.getElementById('heroBalance'),
    statusOrb: document.getElementById('statusOrb'),
    statusPercent: document.getElementById('statusPercent'),
    statusTitle: document.getElementById('statusTitle'),
    statusText: document.getElementById('statusText'),
    dayProgressText: document.getElementById('dayProgressText'),
    dayProgressBar: document.getElementById('dayProgressBar'),
    toggleWorkDoneBtn: document.getElementById('toggleWorkDoneBtn'),
    addWorkIntervalBtn: document.getElementById('addWorkIntervalBtn'),
    jumpToTodayBtn: document.getElementById('jumpToTodayBtn'),
    moodRow: document.getElementById('moodRow'),
    dailyNote: document.getElementById('dailyNote'),
    quickTemplates: document.getElementById('quickTemplates'),
    dashboardEntries: document.getElementById('dashboardEntries'),
    openDayTabBtn: document.getElementById('openDayTabBtn'),
    todayTitle: document.getElementById('todayTitle'),
    todayEntries: document.getElementById('todayEntries'),
    datePlanBox: document.getElementById('datePlanBox'),
    quickLogForm: document.getElementById('quickLogForm'),
    logDate: document.getElementById('logDate'),
    logStart: document.getElementById('logStart'),
    logEnd: document.getElementById('logEnd'),
    logType: document.getElementById('logType'),
    customTypeLabel: document.getElementById('customTypeLabel'),
    customType: document.getElementById('customType'),
    logNote: document.getElementById('logNote'),
    clearLogFormBtn: document.getElementById('clearLogFormBtn'),
    calendarGrid: document.getElementById('calendarGrid'),
    showAllDaysBtn: document.getElementById('showAllDaysBtn'),
    showOnlyMissedBtn: document.getElementById('showOnlyMissedBtn'),
    showOnlyWorkBtn: document.getElementById('showOnlyWorkBtn'),
    filterDate: document.getElementById('filterDate'),
    filterType: document.getElementById('filterType'),
    filterSearch: document.getElementById('filterSearch'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    logList: document.getElementById('logList'),
    goalForm: document.getElementById('goalForm'),
    goalTitle: document.getElementById('goalTitle'),
    goalTarget: document.getElementById('goalTarget'),
    goalUnit: document.getElementById('goalUnit'),
    goalDeadline: document.getElementById('goalDeadline'),
    goalList: document.getElementById('goalList'),
    habitForm: document.getElementById('habitForm'),
    habitInput: document.getElementById('habitInput'),
    habitList: document.getElementById('habitList'),
    habitTodaySummary: document.getElementById('habitTodaySummary'),
    timerValue: document.getElementById('timerValue'),
    timerMode: document.getElementById('timerMode'),
    startTimerBtn: document.getElementById('startTimerBtn'),
    pauseTimerBtn: document.getElementById('pauseTimerBtn'),
    resetTimerBtn: document.getElementById('resetTimerBtn'),
    focusMinutes: document.getElementById('focusMinutes'),
    breakMinutes: document.getElementById('breakMinutes'),
    focusLabel: document.getElementById('focusLabel'),
    focusHistory: document.getElementById('focusHistory'),
    levelValue: document.getElementById('levelValue'),
    levelTitle: document.getElementById('levelTitle'),
    xpText: document.getElementById('xpText'),
    xpBar: document.getElementById('xpBar'),
    achievementGrid: document.getElementById('achievementGrid'),
    statPlannedDays: document.getElementById('statPlannedDays'),
    statPlannedHours: document.getElementById('statPlannedHours'),
    statLoggedWork: document.getElementById('statLoggedWork'),
    statTotalLogged: document.getElementById('statTotalLogged'),
    statMissingHours: document.getElementById('statMissingHours'),
    statBestDay: document.getElementById('statBestDay'),
    categoryStats: document.getElementById('categoryStats'),
    bars14: document.getElementById('bars14'),
    profileName: document.getElementById('profileName'),
    requestNotifyBtn: document.getElementById('requestNotifyBtn'),
    exportBtn: document.getElementById('exportBtn'),
    exportCsvBtn2: document.getElementById('exportCsvBtn2'),
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
  let calendarFilter = 'all';
  let timer = createTimerState();
  let noteSaveTimer = null;

  init();

  function init() {
    applyTheme();
    els.themeSelect.value = state.theme || 'system';
    els.selectedDate.value = selectedDate;
    els.logDate.value = selectedDate;
    els.focusMinutes.value = state.settings.focusMinutes;
    els.breakMinutes.value = state.settings.breakMinutes;
    els.profileName.value = state.profileName || '';
    setupEvents();
    prefillWorkInterval(selectedDate);
    renderAll();
    registerServiceWorker();
  }

  function setupEvents() {
    els.tabs.forEach((tab) => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

    els.themeSelect.addEventListener('change', () => {
      state.theme = els.themeSelect.value;
      saveState();
      applyTheme();
      toast('Тема обновлена');
    });

    els.selectedDate.addEventListener('change', () => setSelectedDate(els.selectedDate.value || START));
    els.jumpToTodayBtn.addEventListener('click', () => setSelectedDate(getInitialDate()));
    els.openDayTabBtn.addEventListener('click', () => switchTab('today'));

    els.dailyNote.addEventListener('input', () => {
      clearTimeout(noteSaveTimer);
      noteSaveTimer = setTimeout(() => {
        const value = els.dailyNote.value.trim();
        if (value) state.notes[selectedDate] = value;
        else delete state.notes[selectedDate];
        saveState();
        renderDatePlan();
      }, 240);
    });

    els.moodRow.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-mood]');
      if (!btn) return;
      const key = btn.dataset.mood;
      if (state.moods[selectedDate] === key) delete state.moods[selectedDate];
      else state.moods[selectedDate] = key;
      saveState();
      renderMood();
      renderAchievements();
      renderDatePlan();
    });

    els.quickTemplates.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-template]');
      if (!btn) return;
      const template = TEMPLATES[Number(btn.dataset.template)];
      if (!template) return;
      fillLogForm(template);
      switchTab('today');
      toast('Шаблон перенесён в форму');
    });

    els.addWorkIntervalBtn.addEventListener('click', () => {
      const schedule = getWorkSchedule(selectedDate);
      if (!schedule.isWorkday) {
        toast('На выбранную дату нет рабочего графика');
        return;
      }
      fillLogForm({ type: 'Работа', start: schedule.start, end: schedule.end, note: 'Рабочий день по графику' });
      switchTab('today');
      toast('Рабочий интервал подготовлен');
    });

    els.toggleWorkDoneBtn.addEventListener('click', () => {
      const schedule = getWorkSchedule(selectedDate);
      if (!schedule.isWorkday) {
        toast('Это выходной день');
        return;
      }
      state.doneDays[selectedDate] = !state.doneDays[selectedDate];
      syncWorkGoal();
      saveState();
      renderAll();
      toast(state.doneDays[selectedDate] ? 'Рабочий день закрыт' : 'Отметка рабочего дня снята');
    });

    els.logDate.addEventListener('change', () => {
      const value = clampDate(els.logDate.value || selectedDate);
      els.logDate.value = value;
      prefillWorkInterval(value);
    });

    els.logType.addEventListener('change', syncCustomTypeVisibility);
    els.quickLogForm.addEventListener('submit', addEntryFromForm);
    els.clearLogFormBtn.addEventListener('click', () => {
      els.quickLogForm.reset();
      els.logDate.value = selectedDate;
      prefillWorkInterval(selectedDate);
      syncCustomTypeVisibility();
    });

    document.addEventListener('click', handleDocumentActions);

    els.showAllDaysBtn.addEventListener('click', () => setCalendarFilter('all'));
    els.showOnlyMissedBtn.addEventListener('click', () => setCalendarFilter('missed'));
    els.showOnlyWorkBtn.addEventListener('click', () => setCalendarFilter('work'));

    els.filterDate.addEventListener('change', renderLogList);
    els.filterType.addEventListener('change', renderLogList);
    els.filterSearch.addEventListener('input', renderLogList);
    els.clearFiltersBtn.addEventListener('click', () => {
      els.filterDate.value = '';
      els.filterType.value = 'all';
      els.filterSearch.value = '';
      renderLogList();
    });

    els.goalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = els.goalTitle.value.trim();
      const target = Number(els.goalTarget.value);
      const unit = els.goalUnit.value.trim();
      const deadline = els.goalDeadline.value;
      if (!title || !Number.isFinite(target) || target <= 0 || !unit) return;
      state.goals.unshift({ id: uid(), title, target, current: 0, unit, deadline, createdAt: new Date().toISOString() });
      els.goalForm.reset();
      saveState();
      renderAll();
      toast('Цель добавлена');
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

    els.startTimerBtn.addEventListener('click', startTimer);
    els.pauseTimerBtn.addEventListener('click', pauseTimer);
    els.resetTimerBtn.addEventListener('click', resetTimer);
    els.focusMinutes.addEventListener('change', saveTimerSettings);
    els.breakMinutes.addEventListener('change', saveTimerSettings);

    els.profileName.addEventListener('input', () => {
      state.profileName = els.profileName.value.trim();
      saveState();
      renderHero();
    });

    els.requestNotifyBtn.addEventListener('click', requestNotifications);
    els.exportBtn.addEventListener('click', exportJson);
    els.exportCsvBtn.addEventListener('click', exportCsv);
    els.exportCsvBtn2.addEventListener('click', exportCsv);
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

  function handleDocumentActions(event) {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    const { action, id, date, habit } = btn.dataset;

    if (action === 'delete-entry') deleteEntry(id);
    if (action === 'duplicate-entry') duplicateEntry(id);
    if (action === 'use-entry') useEntryAsTemplate(id);
    if (action === 'goal-plus') adjustGoal(id, 1);
    if (action === 'goal-minus') adjustGoal(id, -1);
    if (action === 'goal-delete') deleteGoal(id);
    if (action === 'habit-toggle') toggleHabit(habit, date);
    if (action === 'habit-delete') deleteHabit(id);
  }

  function switchTab(tabId) {
    els.tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabId));
    els.views.forEach((view) => view.classList.toggle('active', view.id === tabId));
  }

  function setSelectedDate(dateStr) {
    selectedDate = clampDate(dateStr);
    els.selectedDate.value = selectedDate;
    els.logDate.value = selectedDate;
    prefillWorkInterval(selectedDate);
    renderAll();
  }

  function renderAll() {
    syncWorkGoal();
    renderDashboard();
    renderMood();
    renderQuickTemplates();
    renderToday();
    renderCalendar();
    renderLogFilters();
    renderLogList();
    renderGoals();
    renderHabits();
    renderFocusHistory();
    renderTimer();
    renderLevel();
    renderAchievements();
    renderAnalytics();
    renderHero();
  }

  function renderHero() {
    const summary = getSummary();
    const percent = summary.workDays ? Math.round(summary.completedDays / summary.workDays * 100) : 0;
    els.heroPercent.textContent = `${percent}%`;
    els.heroStreak.textContent = summary.streak;
    els.heroHours.textContent = formatMinutesShort(summary.creditedWorkMinutes);
    els.heroBalance.textContent = formatMinutesShort(Math.max(0, summary.plannedMinutes - summary.creditedWorkMinutes));
    const name = state.profileName ? `${escapeHtml(state.profileName)}, ` : '';
    const schedule = getWorkSchedule(selectedDate);
    els.heroInline.textContent = schedule.isWorkday
      ? `${name}${formatDateShort(selectedDate)} · ${schedule.start}–${schedule.end} · ${getDayStatusText(selectedDate)}`
      : `${name}${formatDateShort(selectedDate)} · выходной день`;
  }

  function renderDashboard() {
    const schedule = getWorkSchedule(selectedDate);
    const progress = getDayProgress(selectedDate);
    els.dashTitle.textContent = formatDateLong(selectedDate);
    els.statusPercent.textContent = `${Math.round(progress.percent)}%`;
    els.dayProgressText.textContent = `${Math.round(progress.percent)}%`;
    els.dayProgressBar.style.width = `${Math.min(100, Math.round(progress.percent))}%`;
    els.statusOrb.style.background = `radial-gradient(circle at 45% 45%, var(--glass-strong), var(--glass)), conic-gradient(var(--primary) 0deg ${Math.min(100, progress.percent) * 3.6}deg, rgba(148,163,184,.28) ${Math.min(100, progress.percent) * 3.6}deg 360deg)`;

    if (schedule.isWorkday) {
      els.statusTitle.textContent = state.doneDays[selectedDate] || progress.percent >= 100 ? 'Рабочий день закрыт' : 'Рабочий день в процессе';
      els.statusText.textContent = `${weekdayName(selectedDate)} · график ${schedule.start}–${schedule.end}. Записано работы: ${formatMinutes(progress.workLogged)} из ${formatMinutes(schedule.minutes)}.`;
      els.toggleWorkDoneBtn.disabled = false;
      els.toggleWorkDoneBtn.textContent = state.doneDays[selectedDate] ? 'Снять отметку' : 'Закрыть день';
    } else {
      els.statusTitle.textContent = 'Выходной';
      els.statusText.textContent = 'Рабочего графика нет, но можно вести личный журнал, привычки, цели и фокус-сессии.';
      els.toggleWorkDoneBtn.disabled = true;
      els.toggleWorkDoneBtn.textContent = 'Выходной';
    }

    renderEntriesInto(els.dashboardEntries, getEntriesForDate(selectedDate).slice().sort(sortEntriesAsc), 'Пока нет записей за выбранный день.');
  }

  function renderMood() {
    const current = state.moods[selectedDate];
    els.moodRow.innerHTML = MOODS.map((mood) => `
      <button class="mood-btn ${current === mood.key ? 'active' : ''}" data-mood="${mood.key}" title="${escapeHtml(mood.label)}" aria-label="${escapeHtml(mood.label)}">
        ${mood.icon}
      </button>
    `).join('');
    els.dailyNote.value = state.notes[selectedDate] || '';
  }

  function renderQuickTemplates() {
    els.quickTemplates.innerHTML = TEMPLATES.map((item, index) => `
      <button class="template-btn" data-template="${index}">
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.start)}–${escapeHtml(item.end)} · ${escapeHtml(item.type)}</small>
      </button>
    `).join('');
  }

  function renderToday() {
    els.todayTitle.textContent = formatDateLong(selectedDate);
    renderDatePlan();
    renderEntriesInto(els.todayEntries, getEntriesForDate(selectedDate).slice().sort(sortEntriesAsc), 'Записей за этот день пока нет.');
  }

  function renderDatePlan() {
    const schedule = getWorkSchedule(selectedDate);
    const progress = getDayProgress(selectedDate);
    const note = state.notes[selectedDate];
    const mood = MOODS.find((item) => item.key === state.moods[selectedDate]);
    const habitDone = countHabitChecksForDate(selectedDate);
    const planItems = [];

    if (schedule.isWorkday) {
      planItems.push({
        title: 'Работа',
        meta: `${schedule.start}–${schedule.end} · план ${formatMinutes(schedule.minutes)}`,
        text: `Зачтено: ${formatMinutes(progress.credited)} · статус: ${getDayStatusText(selectedDate)}`
      });
    } else {
      planItems.push({ title: 'Выходной', meta: 'Воскресенье', text: 'Работа не запланирована, но личные записи доступны.' });
    }

    planItems.push({ title: 'Привычки', meta: `${habitDone}/${state.habits.length || 0}`, text: state.habits.length ? 'Отметь ежедневные чек-листы во вкладке «Привычки».' : 'Добавь привычки во вкладке «Привычки».' });
    if (mood) planItems.push({ title: 'Настроение', meta: `${mood.icon} ${mood.label}`, text: 'Состояние дня сохранено локально.' });
    if (note) planItems.push({ title: 'Заметка дня', meta: `${note.length} символов`, text: note });

    els.datePlanBox.innerHTML = planItems.map((item) => `
      <div class="plan-item">
        <h4>${escapeHtml(item.title)}</h4>
        <div class="plan-meta"><span>${escapeHtml(item.meta)}</span></div>
        <p>${escapeHtml(item.text)}</p>
      </div>
    `).join('');
  }

  function renderCalendar() {
    const dates = getDateRange(START, END);
    els.calendarGrid.innerHTML = dates.map((dateStr) => {
      const schedule = getWorkSchedule(dateStr);
      const status = getDayStatus(dateStr);
      const progress = getDayProgress(dateStr);
      const date = parseYMD(dateStr);
      const month = date.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '');
      const hidden = calendarFilter === 'missed' && status !== 'missed'
        || calendarFilter === 'work' && !schedule.isWorkday;
      return `
        <button class="day-card ${hidden ? 'filtered-out' : ''}" data-date="${dateStr}" data-status="${status}" aria-label="${formatDateLong(dateStr)}">
          <span>
            <strong>${date.getDate()}</strong>
            <small>${month} · ${weekdayShort(dateStr)}</small>
          </span>
          <span>
            <span class="badge ${status}">${statusLabel(status)}</span>
            <small>${schedule.isWorkday ? `${schedule.start}–${schedule.end}` : 'выходной'} · ${Math.round(progress.percent)}%</small>
          </span>
        </button>
      `;
    }).join('');

    els.calendarGrid.querySelectorAll('.day-card').forEach((card) => {
      card.addEventListener('click', () => {
        setSelectedDate(card.dataset.date);
        switchTab('dashboard');
      });
    });
  }

  function setCalendarFilter(value) {
    calendarFilter = value;
    renderCalendar();
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
    const query = (els.filterSearch.value || '').trim().toLowerCase();
    let entries = state.entries.slice().sort(sortEntriesDesc);

    if (dateFilter) entries = entries.filter((entry) => entry.date === dateFilter);
    if (typeFilter && typeFilter !== 'all') entries = entries.filter((entry) => entry.type === typeFilter);
    if (query) entries = entries.filter((entry) => `${entry.type} ${entry.note || ''} ${entry.date}`.toLowerCase().includes(query));

    renderEntriesInto(els.logList, entries, 'Под выбранные фильтры записей нет.');
  }

  function renderEntriesInto(container, entries, emptyText) {
    if (!entries.length) {
      container.innerHTML = `<div class="empty">${escapeHtml(emptyText)}</div>`;
      return;
    }
    container.innerHTML = entries.map(entryTemplate).join('');
  }

  function entryTemplate(entry) {
    return `
      <div class="entry">
        <div>
          <h4>${escapeHtml(entry.type)}</h4>
          <div class="entry-meta">
            <span>${formatDateShort(entry.date)}</span>
            <span>${escapeHtml(entry.start)}–${escapeHtml(entry.end)}</span>
            <span>${formatMinutes(entry.minutes)}</span>
          </div>
          ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ''}
        </div>
        <div class="entry-actions">
          <button class="icon-btn" data-action="use-entry" data-id="${entry.id}" title="Использовать как шаблон">↗</button>
          <button class="icon-btn" data-action="duplicate-entry" data-id="${entry.id}" title="Дублировать">⧉</button>
          <button class="icon-btn" data-action="delete-entry" data-id="${entry.id}" title="Удалить">×</button>
        </div>
      </div>
    `;
  }

  function renderGoals() {
    if (!state.goals.length) {
      els.goalList.innerHTML = '<div class="empty">Целей пока нет.</div>';
      return;
    }
    els.goalList.innerHTML = state.goals.map((goal) => {
      const percent = Math.min(100, Math.round(goal.current / goal.target * 100));
      return `
        <div class="goal-item">
          <h4>${escapeHtml(goal.title)}</h4>
          <p>${goal.current} / ${goal.target} ${escapeHtml(goal.unit)}${goal.deadline ? ` · дедлайн ${formatDateShort(goal.deadline)}` : ''}</p>
          <div class="progress-bar"><span style="width:${percent}%"></span></div>
          <div class="goal-progress">
            <button class="ghost-btn" data-action="goal-minus" data-id="${goal.id}">−1</button>
            <button class="primary-btn" data-action="goal-plus" data-id="${goal.id}">+1</button>
            <button class="danger-btn" data-action="goal-delete" data-id="${goal.id}">Удалить</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderHabits() {
    const dates = getHabitWindow(selectedDate);
    if (!state.habits.length) {
      els.habitList.innerHTML = '<div class="empty">Добавь первую привычку.</div>';
    } else {
      els.habitList.innerHTML = state.habits.map((habit) => `
        <div class="habit-item">
          <div>
            <h4>${escapeHtml(habit.title)}</h4>
            <div class="habit-days">
              ${dates.map((dateStr) => {
                const active = Boolean(state.habitChecks[habit.id]?.[dateStr]);
                return `<button class="habit-day ${active ? 'active' : ''}" data-action="habit-toggle" data-habit="${habit.id}" data-date="${dateStr}" title="${formatDateShort(dateStr)}">${weekdayShort(dateStr).slice(0, 2)}</button>`;
              }).join('')}
            </div>
          </div>
          <button class="icon-btn" data-action="habit-delete" data-id="${habit.id}" title="Удалить">×</button>
        </div>
      `).join('');
    }

    const done = countHabitChecksForDate(selectedDate);
    els.habitTodaySummary.innerHTML = `
      <div class="plan-item">
        <h4>${formatDateShort(selectedDate)}</h4>
        <div class="plan-meta"><span>${done}/${state.habits.length} выполнено</span><span>${Math.round((done / Math.max(1, state.habits.length)) * 100)}%</span></div>
        <div class="progress-bar"><span style="width:${Math.round((done / Math.max(1, state.habits.length)) * 100)}%"></span></div>
      </div>
    `;
  }

  function renderFocusHistory() {
    const focusEntries = state.entries.filter((entry) => entry.type === 'Фокус-сессия').slice().sort(sortEntriesDesc).slice(0, 20);
    renderEntriesInto(els.focusHistory, focusEntries, 'Фокус-сессий пока нет.');
  }

  function renderTimer() {
    els.timerValue.textContent = formatTimer(timer.remaining);
    els.timerMode.textContent = timer.mode === 'focus' ? 'Фокус' : 'Перерыв';
  }

  function renderLevel() {
    const xp = calculateXP();
    const level = Math.floor(xp / 100) + 1;
    const current = xp % 100;
    const titles = ['Новичок системы', 'Стабильный режим', 'Оператор дня', 'Архитектор привычек', 'LifeOS Pro', 'Системный чемпион'];
    els.levelValue.textContent = level;
    els.levelTitle.textContent = titles[Math.min(titles.length - 1, Math.floor(level / 3))];
    els.xpText.textContent = `${current} / 100 XP · всего ${xp} XP`;
    els.xpBar.style.width = `${current}%`;
  }

  function renderAchievements() {
    const summary = getSummary();
    const focusCount = state.entries.filter((entry) => entry.type === 'Фокус-сессия').length;
    const goalsDone = state.goals.filter((goal) => goal.current >= goal.target).length;
    const habitChecks = countAllHabitChecks();
    const notes = Object.keys(state.notes).length;
    const achievements = [
      { icon: '✍️', title: 'Первая запись', text: 'Добавь первую запись времени', ok: state.entries.length >= 1 },
      { icon: '🧱', title: '10 записей', text: 'Собери 10 интервалов', ok: state.entries.length >= 10 },
      { icon: '✅', title: 'Первый рабочий день', text: 'Закрой первый рабочий день', ok: summary.completedDays >= 1 },
      { icon: '🔥', title: 'Серия 3 дня', text: 'Закрой 3 рабочих дня подряд', ok: summary.streak >= 3 },
      { icon: '🏁', title: 'Серия 7 дней', text: 'Закрой 7 рабочих дней подряд', ok: summary.streak >= 7 },
      { icon: '⏱️', title: '20 часов работы', text: 'Набери 20 зачтённых часов', ok: summary.creditedWorkMinutes >= 1200 },
      { icon: '💼', title: '100 часов работы', text: 'Набери 100 зачтённых часов', ok: summary.creditedWorkMinutes >= 6000 },
      { icon: '🎯', title: 'Цель закрыта', text: 'Выполни любую цель', ok: goalsDone >= 1 },
      { icon: '🧘', title: 'Фокус запущен', text: 'Заверши фокус-сессию', ok: focusCount >= 1 },
      { icon: '🚀', title: '10 фокус-сессий', text: 'Заверши 10 фокус-сессий', ok: focusCount >= 10 },
      { icon: '📓', title: 'Дневник', text: 'Оставь 5 заметок дня', ok: notes >= 5 },
      { icon: '🔁', title: 'Привычки', text: 'Сделай 25 отметок привычек', ok: habitChecks >= 25 }
    ];

    els.achievementGrid.innerHTML = achievements.map((item) => `
      <div class="achievement-item ${item.ok ? 'unlocked' : ''}">
        <div class="achievement-icon">${item.icon}</div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.text)}</p>
        <span class="badge ${item.ok ? 'done' : 'off'}">${item.ok ? 'открыто' : 'закрыто'}</span>
      </div>
    `).join('');
  }

  function renderAnalytics() {
    const summary = getSummary();
    els.statPlannedDays.textContent = summary.workDays;
    els.statPlannedHours.textContent = formatMinutesShort(summary.plannedMinutes);
    els.statLoggedWork.textContent = formatMinutesShort(summary.loggedWorkMinutes);
    els.statTotalLogged.textContent = formatMinutesShort(summary.totalLoggedMinutes);
    els.statMissingHours.textContent = formatMinutesShort(Math.max(0, summary.plannedMinutes - summary.creditedWorkMinutes));
    els.statBestDay.textContent = summary.bestDay ? formatDateShort(summary.bestDay.date) : '—';

    renderCategoryStats();
    renderBars14();
  }

  function renderCategoryStats() {
    const totals = getTotalsByType(state.entries);
    const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const max = rows[0]?.[1] || 1;
    if (!rows.length) {
      els.categoryStats.innerHTML = '<div class="empty">Записей пока нет.</div>';
      return;
    }
    els.categoryStats.innerHTML = rows.map(([type, minutes]) => `
      <div class="category-row">
        <strong>${escapeHtml(type)}</strong>
        <span>${formatMinutes(minutes)}</span>
        <div class="progress-bar"><span style="width:${Math.round(minutes / max * 100)}%"></span></div>
      </div>
    `).join('');
  }

  function renderBars14() {
    const dates = getLastNDates(selectedDate, 14).filter((dateStr) => dateStr >= START && dateStr <= END);
    const values = dates.map((dateStr) => ({ date: dateStr, minutes: getEntriesForDate(dateStr).reduce((sum, entry) => sum + entry.minutes, 0) }));
    const max = Math.max(60, ...values.map((item) => item.minutes));
    els.bars14.innerHTML = values.map((item) => `
      <div class="bar-wrap" title="${formatDateShort(item.date)} · ${formatMinutes(item.minutes)}">
        <div class="bar" style="height:${Math.max(6, Math.round(item.minutes / max * 220))}px"></div>
        <div class="bar-label">${parseYMD(item.date).getDate()}</div>
      </div>
    `).join('');
  }

  function addEntryFromForm(event) {
    event.preventDefault();
    const date = clampDate(els.logDate.value || selectedDate);
    const start = els.logStart.value;
    const end = els.logEnd.value;
    const baseType = els.logType.value;
    const type = baseType === 'Другое' ? els.customType.value.trim() : baseType;
    const note = els.logNote.value.trim();
    const minutes = getDurationMinutes(start, end);

    if (!date || !start || !end || !type) {
      toast('Заполни дату, время и тип');
      return;
    }
    if (!Number.isFinite(minutes) || minutes <= 0) {
      toast('Конец должен быть позже начала');
      return;
    }
    if (hasOverlap(date, start, end)) {
      const ok = window.confirm('Этот интервал пересекается с другой записью. Всё равно добавить?');
      if (!ok) return;
    }

    state.entries.unshift({ id: uid(), date, start, end, type, note, minutes, createdAt: new Date().toISOString() });
    if (type === 'Работа' && getDayProgress(date).percent >= 100) state.doneDays[date] = true;
    syncWorkGoal();
    saveState();
    els.logNote.value = '';
    renderAll();
    toast('Интервал записан');
  }

  function fillLogForm(template) {
    els.logDate.value = selectedDate;
    els.logStart.value = template.start;
    els.logEnd.value = template.end;
    if ([...els.logType.options].some((option) => option.value === template.type)) {
      els.logType.value = template.type;
      els.customType.value = '';
    } else {
      els.logType.value = 'Другое';
      els.customType.value = template.type;
    }
    els.logNote.value = template.note || '';
    syncCustomTypeVisibility();
  }

  function prefillWorkInterval(dateStr) {
    const schedule = getWorkSchedule(dateStr);
    if (schedule.isWorkday) {
      els.logStart.value = schedule.start;
      els.logEnd.value = schedule.end;
      els.logType.value = 'Работа';
    } else {
      els.logStart.value = '12:00';
      els.logEnd.value = '13:00';
      els.logType.value = 'Другое';
    }
    syncCustomTypeVisibility();
  }

  function syncCustomTypeVisibility() {
    const isCustom = els.logType.value === 'Другое';
    els.customTypeLabel.classList.toggle('hidden', !isCustom);
    if (!isCustom) els.customType.value = '';
  }

  function deleteEntry(id) {
    const ok = window.confirm('Удалить запись из журнала?');
    if (!ok) return;
    state.entries = state.entries.filter((entry) => entry.id !== id);
    saveState();
    renderAll();
    toast('Запись удалена');
  }

  function duplicateEntry(id) {
    const entry = state.entries.find((item) => item.id === id);
    if (!entry) return;
    state.entries.unshift({ ...entry, id: uid(), createdAt: new Date().toISOString(), note: entry.note ? `${entry.note} · копия` : 'Копия записи' });
    saveState();
    renderAll();
    toast('Запись дублирована');
  }

  function useEntryAsTemplate(id) {
    const entry = state.entries.find((item) => item.id === id);
    if (!entry) return;
    fillLogForm(entry);
    switchTab('today');
    toast('Запись перенесена в форму');
  }

  function adjustGoal(id, delta) {
    const goal = state.goals.find((item) => item.id === id);
    if (!goal) return;
    goal.current = Math.max(0, Math.min(goal.target, Number(goal.current || 0) + delta));
    saveState();
    renderAll();
  }

  function deleteGoal(id) {
    const ok = window.confirm('Удалить цель?');
    if (!ok) return;
    state.goals = state.goals.filter((goal) => goal.id !== id);
    saveState();
    renderAll();
    toast('Цель удалена');
  }

  function toggleHabit(habitId, dateStr) {
    state.habitChecks[habitId] ||= {};
    state.habitChecks[habitId][dateStr] = !state.habitChecks[habitId][dateStr];
    if (!state.habitChecks[habitId][dateStr]) delete state.habitChecks[habitId][dateStr];
    saveState();
    renderAll();
  }

  function deleteHabit(id) {
    const ok = window.confirm('Удалить привычку и её отметки?');
    if (!ok) return;
    state.habits = state.habits.filter((habit) => habit.id !== id);
    delete state.habitChecks[id];
    saveState();
    renderAll();
    toast('Привычка удалена');
  }

  function saveTimerSettings() {
    const focus = clampNumber(Number(els.focusMinutes.value), 5, 120, 25);
    const br = clampNumber(Number(els.breakMinutes.value), 1, 60, 5);
    state.settings.focusMinutes = focus;
    state.settings.breakMinutes = br;
    saveState();
    if (!timer.running) resetTimer();
  }

  function startTimer() {
    saveTimerSettings();
    if (timer.running) return;
    timer.running = true;
    timer.startedAt ||= new Date();
    timer.interval = window.setInterval(() => {
      timer.remaining -= 1;
      renderTimer();
      if (timer.remaining <= 0) completeTimer();
    }, 1000);
  }

  function pauseTimer() {
    if (!timer.running) return;
    timer.running = false;
    window.clearInterval(timer.interval);
    timer.interval = null;
    renderTimer();
  }

  function resetTimer() {
    window.clearInterval(timer.interval);
    timer = createTimerState();
    renderTimer();
  }

  function completeTimer() {
    window.clearInterval(timer.interval);
    const wasFocus = timer.mode === 'focus';
    timer.running = false;
    timer.interval = null;

    if (wasFocus) {
      saveFocusEntry();
      notify('LifeOS', 'Фокус-сессия завершена. Время сделать перерыв.');
      timer.mode = 'break';
      timer.total = state.settings.breakMinutes * 60;
      timer.remaining = timer.total;
      timer.startedAt = null;
    } else {
      notify('LifeOS', 'Перерыв завершён. Можно вернуться к фокусу.');
      timer = createTimerState();
    }
    renderAll();
  }

  function saveFocusEntry() {
    const now = new Date();
    const minutes = state.settings.focusMinutes;
    const startDate = new Date(now.getTime() - minutes * 60_000);
    const date = clampDate(toYMD(now));
    state.entries.unshift({
      id: uid(),
      date,
      start: toHM(startDate),
      end: toHM(now),
      type: 'Фокус-сессия',
      note: els.focusLabel.value.trim() || 'Фокус-сессия',
      minutes,
      createdAt: new Date().toISOString(),
      source: 'focus-timer'
    });
    saveState();
  }

  function createTimerState() {
    const total = (state?.settings?.focusMinutes || 25) * 60;
    return { mode: 'focus', total, remaining: total, running: false, interval: null, startedAt: null };
  }

  async function requestNotifications() {
    if (!('Notification' in window)) {
      toast('Браузер не поддерживает уведомления');
      return;
    }
    const result = await Notification.requestPermission();
    toast(result === 'granted' ? 'Уведомления включены' : 'Уведомления не разрешены');
  }

  function notify(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body, icon: './icons/icon-192.png' });
  }

  function exportJson() {
    const payload = {
      app: 'LifeOS',
      version: 2,
      period: { start: START, end: END },
      exportedAt: new Date().toISOString(),
      data: state
    };
    downloadFile(`lifeos-backup-${toYMD(new Date())}.json`, JSON.stringify(payload, null, 2), 'application/json');
    toast('JSON-резервная копия создана');
  }

  function exportCsv() {
    const rows = [['date', 'start', 'end', 'minutes', 'type', 'note']]
      .concat(state.entries.slice().sort(sortEntriesAsc).map((entry) => [entry.date, entry.start, entry.end, entry.minutes, entry.type, entry.note || '']));
    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
    downloadFile(`lifeos-time-${toYMD(new Date())}.csv`, csv, 'text/csv;charset=utf-8');
    toast('CSV экспортирован');
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        state = normalizeState(parsed.data || parsed);
        selectedDate = getInitialDate();
        applyTheme();
        saveState();
        els.themeSelect.value = state.theme;
        els.selectedDate.value = selectedDate;
        els.logDate.value = selectedDate;
        els.profileName.value = state.profileName || '';
        els.focusMinutes.value = state.settings.focusMinutes;
        els.breakMinutes.value = state.settings.breakMinutes;
        resetTimer();
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
    const ok = window.confirm('Сбросить все записи, цели, привычки и настройки LifeOS?');
    if (!ok) return;
    localStorage.removeItem(APP_KEY);
    state = normalizeState(null);
    selectedDate = getInitialDate();
    els.selectedDate.value = selectedDate;
    els.logDate.value = selectedDate;
    els.themeSelect.value = state.theme;
    els.profileName.value = '';
    els.focusMinutes.value = state.settings.focusMinutes;
    els.breakMinutes.value = state.settings.breakMinutes;
    applyTheme();
    resetTimer();
    prefillWorkInterval(selectedDate);
    renderAll();
    toast('Данные сброшены');
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(APP_KEY);
      return normalizeState(raw ? JSON.parse(raw) : null);
    } catch (error) {
      console.warn('LifeOS state load failed', error);
      return normalizeState(null);
    }
  }

  function normalizeState(value) {
    return {
      theme: ['system', 'light', 'dark', 'midnight', 'aurora'].includes(value?.theme) ? value.theme : 'system',
      profileName: typeof value?.profileName === 'string' ? value.profileName : '',
      entries: Array.isArray(value?.entries) ? value.entries.filter(isValidEntry).map(normalizeEntry) : [],
      doneDays: value?.doneDays && typeof value.doneDays === 'object' ? value.doneDays : {},
      habits: Array.isArray(value?.habits) && value.habits.length ? value.habits.filter((habit) => habit?.id && habit?.title) : DEFAULT_HABITS.slice(),
      habitChecks: value?.habitChecks && typeof value.habitChecks === 'object' ? value.habitChecks : {},
      goals: Array.isArray(value?.goals) && value.goals.length ? value.goals.filter((goal) => goal?.id && goal?.title) : DEFAULT_GOALS.slice(),
      notes: value?.notes && typeof value.notes === 'object' ? value.notes : {},
      moods: value?.moods && typeof value.moods === 'object' ? value.moods : {},
      settings: {
        focusMinutes: clampNumber(Number(value?.settings?.focusMinutes), 5, 120, 25),
        breakMinutes: clampNumber(Number(value?.settings?.breakMinutes), 1, 60, 5)
      }
    };
  }

  function normalizeEntry(entry) {
    return {
      id: String(entry.id),
      date: clampDate(entry.date),
      start: entry.start,
      end: entry.end,
      type: String(entry.type),
      note: entry.note ? String(entry.note) : '',
      minutes: Number(entry.minutes),
      createdAt: entry.createdAt || new Date().toISOString(),
      source: entry.source || 'manual'
    };
  }

  function isValidEntry(entry) {
    return entry && entry.id && entry.date && entry.start && entry.end && entry.type && Number.isFinite(Number(entry.minutes));
  }

  function saveState() {
    localStorage.setItem(APP_KEY, JSON.stringify(state));
  }

  function applyTheme() {
    const theme = state.theme || 'system';
    if (theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }

  function syncWorkGoal() {
    const goal = state.goals.find((item) => item.id === 'goal-work-period');
    if (!goal) return;
    goal.target = getDateRange(START, END).filter((dateStr) => getWorkSchedule(dateStr).isWorkday).length;
    goal.current = getDateRange(START, END).filter((dateStr) => getDayStatus(dateStr) === 'done').length;
    goal.deadline = END;
  }

  function getSummary() {
    const dates = getDateRange(START, END);
    const workdays = dates.filter((dateStr) => getWorkSchedule(dateStr).isWorkday);
    const plannedMinutes = workdays.reduce((sum, dateStr) => sum + getWorkSchedule(dateStr).minutes, 0);
    const creditedWorkMinutes = workdays.reduce((sum, dateStr) => sum + getDayProgress(dateStr).credited, 0);
    const loggedWorkMinutes = state.entries.filter((entry) => entry.type === 'Работа').reduce((sum, entry) => sum + entry.minutes, 0);
    const totalLoggedMinutes = state.entries.reduce((sum, entry) => sum + entry.minutes, 0);
    const completedDays = workdays.filter((dateStr) => getDayStatus(dateStr) === 'done').length;
    const bestDay = getBestDay();
    return {
      workDays: workdays.length,
      plannedMinutes,
      creditedWorkMinutes,
      loggedWorkMinutes,
      totalLoggedMinutes,
      completedDays,
      streak: getStreak(),
      bestDay
    };
  }

  function getDayProgress(dateStr) {
    const schedule = getWorkSchedule(dateStr);
    const workLogged = getEntriesForDate(dateStr).filter((entry) => entry.type === 'Работа').reduce((sum, entry) => sum + entry.minutes, 0);
    if (!schedule.isWorkday) return { percent: 0, workLogged, credited: 0 };
    const credited = state.doneDays[dateStr] ? schedule.minutes : Math.min(schedule.minutes, workLogged);
    return {
      percent: schedule.minutes ? Math.min(100, credited / schedule.minutes * 100) : 0,
      workLogged,
      credited
    };
  }

  function getDayStatus(dateStr) {
    const schedule = getWorkSchedule(dateStr);
    if (!schedule.isWorkday) return 'off';
    const progress = getDayProgress(dateStr);
    if (state.doneDays[dateStr] || progress.percent >= 100) return 'done';
    if (progress.percent > 0) return 'partial';
    return 'missed';
  }

  function getDayStatusText(dateStr) {
    return ({ done: 'выполнено', partial: 'частично', missed: 'пусто', off: 'выходной' })[getDayStatus(dateStr)];
  }

  function statusLabel(status) {
    return ({ done: 'готово', partial: 'частично', missed: 'пусто', off: 'выходной' })[status] || status;
  }

  function getWorkSchedule(dateStr) {
    const d = parseYMD(dateStr);
    const day = d.getDay();
    if (day === 0) return { isWorkday: false, start: null, end: null, minutes: 0 };
    if (day === 6) return { isWorkday: true, start: '10:00', end: '14:00', minutes: 240 };
    return { isWorkday: true, start: '10:00', end: '17:00', minutes: 420 };
  }

  function calculateXP() {
    const summary = getSummary();
    const entriesXP = state.entries.length * 5;
    const workXP = summary.completedDays * 40;
    const habitXP = countAllHabitChecks() * 10;
    const goalXP = state.goals.filter((goal) => goal.current >= goal.target).length * 80;
    const notesXP = Object.keys(state.notes).length * 4;
    return entriesXP + workXP + habitXP + goalXP + notesXP;
  }

  function getStreak() {
    const end = selectedDate < START ? START : selectedDate;
    const dates = getDateRange(START, end).filter((dateStr) => getWorkSchedule(dateStr).isWorkday).reverse();
    let streak = 0;
    for (const dateStr of dates) {
      if (getDayStatus(dateStr) === 'done') streak += 1;
      else break;
    }
    return streak;
  }

  function getBestDay() {
    const dates = getDateRange(START, END);
    let best = null;
    for (const dateStr of dates) {
      const minutes = getEntriesForDate(dateStr).reduce((sum, entry) => sum + entry.minutes, 0);
      if (!best || minutes > best.minutes) best = { date: dateStr, minutes };
    }
    return best && best.minutes > 0 ? best : null;
  }

  function getInitialDate() {
    return clampDate(toYMD(new Date()));
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

  function getLastNDates(endDate, count) {
    const out = [];
    const cursor = parseYMD(endDate);
    for (let i = count - 1; i >= 0; i -= 1) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() - i);
      out.push(toYMD(d));
    }
    return out;
  }

  function getHabitWindow(dateStr) {
    return getLastNDates(dateStr, 7);
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

  function toHM(date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  function getDurationMinutes(start, end) {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  }

  function hasOverlap(date, start, end) {
    const startMinutes = hmToMinutes(start);
    const endMinutes = hmToMinutes(end);
    return getEntriesForDate(date).some((entry) => {
      const a = hmToMinutes(entry.start);
      const b = hmToMinutes(entry.end);
      return startMinutes < b && endMinutes > a;
    });
  }

  function hmToMinutes(value) {
    const [h, m] = value.split(':').map(Number);
    return h * 60 + m;
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

  function countHabitChecksForDate(dateStr) {
    return state.habits.reduce((sum, habit) => sum + (state.habitChecks[habit.id]?.[dateStr] ? 1 : 0), 0);
  }

  function countAllHabitChecks() {
    return Object.values(state.habitChecks).reduce((sum, dates) => sum + Object.values(dates || {}).filter(Boolean).length, 0);
  }

  function sortEntriesAsc(a, b) {
    return `${a.date} ${a.start} ${a.createdAt}`.localeCompare(`${b.date} ${b.start} ${b.createdAt}`);
  }

  function sortEntriesDesc(a, b) {
    return `${b.date} ${b.start} ${b.createdAt}`.localeCompare(`${a.date} ${a.start} ${a.createdAt}`);
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
    const safe = Math.max(0, Math.round(minutes || 0));
    const h = Math.floor(safe / 60);
    const m = safe % 60;
    if (!h) return `${m} мин`;
    if (!m) return `${h} ч`;
    return `${h} ч ${m} мин`;
  }

  function formatMinutesShort(minutes) {
    const h = Math.max(0, minutes || 0) / 60;
    if (h >= 100) return `${Math.round(h)}ч`;
    return `${Number.isInteger(h) ? h : h.toFixed(1)}ч`;
  }

  function formatTimer(seconds) {
    const safe = Math.max(0, Math.floor(seconds));
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function clampNumber(value, min, max, fallback) {
    if (!Number.isFinite(value)) return fallback;
    return Math.min(max, Math.max(min, Math.round(value)));
  }

  function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function csvCell(value) {
    const text = String(value ?? '').replaceAll('"', '""');
    return `"${text}"`;
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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

/* ============================================================
   app.js — общие утилиты состояния участника.
   Всё состояние хранится в localStorage браузера самого участника
   (сайт статический, без бэкенда). Это MVP: для настоящего общего
   учёта команд/квестов на сервере понадобится бэкенд или сервис
   вроде Firebase/Supabase — см. README "Как подключить бэкенд".
   ============================================================ */

const STORAGE_KEY = 'crisis_event_state_v1';

function getState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function setState(patch) {
  const state = { ...getState(), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}

// простой детерминированный хэш строки -> число (для "случайного", но
// воспроизводимого распределения по имени участника)
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}
function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

// показать/спрятать реф на сброс прогресса — полезно на всех экранах
function mountResetControl(selector) {
  const el = qs(selector);
  if (!el) return;
  el.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Сбросить весь прогресс и начать заново?')) {
      resetState();
      window.location.href = 'index.html';
    }
  });
}

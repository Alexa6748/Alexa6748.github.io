/* ============================================================
   teams.js — распределение «движаков» по командам, точки на карте,
   квесты трёх дней.
   Команда участника = hash(имя) % количество_команд — стабильно
   и не требует сервера. Организатор задаёт TEAM_SIZE и общее число
   зарегистрированных, отсюда считается число команд.
   ============================================================ */

const TEAM_SIZE = 6;           // сколько человек в команде — поменяйте под свою группу
const DEFAULT_REGISTERED = 120; // сколько всего зарегистрировано на трек «движуха»

function teamCount(registered = DEFAULT_REGISTERED) {
  return Math.max(1, Math.round(registered / TEAM_SIZE));
}

function assignTeam(name, registered = DEFAULT_REGISTERED) {
  const n = teamCount(registered);
  const idx = hashString('team::' + name.trim().toLowerCase()) % n;
  return { index: idx, label: 'Команда ' + (idx + 1), total: n };
}

// генерирует стабильную точку на карте (в процентах от ширины/высоты)
// для команды — одинаковую для всех участников этой команды
function teamMapPoint(teamIndex, totalTeams) {
  const h = hashString('point::' + teamIndex + '::' + totalTeams);
  // распределяем по сетке с небольшим случайным смещением, чтобы точки
  // не накладывались друг на друга и не стояли ровно по краям
  const cols = Math.ceil(Math.sqrt(totalTeams));
  const rows = Math.ceil(totalTeams / cols);
  const col = teamIndex % cols;
  const row = Math.floor(teamIndex / cols);
  const jitterX = (h % 10) - 5;
  const jitterY = (Math.floor(h / 10) % 10) - 5;
  const x = ((col + 0.5) / cols) * 100 + jitterX * 0.4;
  const y = ((row + 0.5) / rows) * 100 + jitterY * 0.4;
  return {
    x: Math.min(94, Math.max(6, x)),
    y: Math.min(94, Math.max(6, y))
  };
}

/* Квесты движухи — по дням. Кураторы отмечают "пройден/не пройден"
   вручную на площадке (тут это фиксируется чекбоксом в интерфейсе
   участника — прод-версия может делать это через код/QR куратора). */
const QUESTS = [
  {
    day: 1,
    id: 'q1',
    title: 'Peer-to-Peer воркшоп про карьеру',
    desc: 'Вместо отменённого эксперта — вы сами. Соберите команду и за 15 минут проведите мини-воркшоп для других участников: что вы знаете о выборе карьерного трека? Куратор фиксирует результат.'
  },
  {
    day: 2,
    id: 'q2',
    title: 'Спасти МК «Командная работа и лидерство»',
    desc: 'Спикер отказался — мастер-класс проведёте вы. Вечером первого дня получите бриф от ИИ-генератора заданий и подготовьте 20-минутный МК для всех участников.'
  },
  {
    day: 3,
    id: 'q3',
    title: 'Финальная защита кейса',
    desc: 'Защитите решение кейса перед жюри. Если вы дошли до этого квеста — у вас есть право голоса в зрительском голосовании за финалистов (AhaSlides/Telegram).'
  }
];

function getQuestState() {
  return getState().quests || {};
}

function setQuestStatus(id, status) {
  const quests = { ...getQuestState(), [id]: status };
  setState({ quests });
  return quests;
}

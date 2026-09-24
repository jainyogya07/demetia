const DATE_KEY = 'smritiSaarthiMemoryQuizDate';
const RESULT_KEY = 'smritiSaarthiMemoryResult';

export function memoryQuizDateKey(date = new Date()) {
  return date.toDateString();
}

export function loadMemoryQuizResult() {
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function memoryQuizDoneToday(date = new Date()) {
  try {
    return localStorage.getItem(DATE_KEY) === memoryQuizDateKey(date);
  } catch {
    return false;
  }
}

export function markMemoryQuizDay(date = new Date()) {
  try {
    localStorage.setItem(DATE_KEY, memoryQuizDateKey(date));
  } catch {
    /* ignore */
  }
}

export function saveMemoryQuizResult(result) {
  try {
    localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    markMemoryQuizDay();
  } catch {
    /* ignore */
  }
  return result;
}

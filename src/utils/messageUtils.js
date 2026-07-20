const HOUR_12 = 12;

export function formatTime(date) {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours < HOUR_12 ? '오전' : '오후';
  hours = hours % HOUR_12 || HOUR_12;
  const padded = String(minutes).padStart(2, '0');
  return `${ampm} ${hours}:${padded}`;
}

let _counter = 0;

export function createMessage(role, content, sources = [], files = []) {
  _counter += 1;
  return {
    id: `${role}-${Date.now()}-${_counter}`,
    role,
    content,
    timestamp: new Date(),
    sources,
    files: Array.isArray(files) ? files : [],
  };
}

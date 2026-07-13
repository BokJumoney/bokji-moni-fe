const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const CHAT_PATH = '/api/v1/chat';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function postChatMessage({ message, sessionId }) {
  const body = { message };
  if (sessionId) body.session_id = sessionId;

  return request(`${CHAT_PATH}/message`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// TODO: 인증 세션 구현 시 헤더/Auth 추가

// TODO: 히스토리 API 연동 시 사용
export async function getSessions() {
  return request(`${CHAT_PATH}/sessions`);
}

export async function getSessionHistory(sessionId) {
  return request(`${CHAT_PATH}/sessions/${sessionId}/history`);
}

export async function deleteSession(sessionId) {
  return request(`${CHAT_PATH}/sessions/${sessionId}`, { method: 'DELETE' });
}

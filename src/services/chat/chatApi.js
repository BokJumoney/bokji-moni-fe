import { buildJsonRequest } from "../common/request";

const CHAT_PATH = '/api/v1/chat';

export async function postChatMessage({ message, sessionId }) {
  const body = { message };
  if (sessionId) body.session_id = sessionId;

  return buildJsonRequest(`${CHAT_PATH}/message`, {
    method: 'POST',
    body,
  });
}

// TODO: 히스토리 API 연동 시 사용
export async function getSessions() {
  return buildJsonRequest(`${CHAT_PATH}/sessions`);
}

export async function getSessionHistory(sessionId) {
  return buildJsonRequest(`${CHAT_PATH}/sessions/${sessionId}/history`);
}

export async function deleteSession(sessionId) {
  return buildJsonRequest(`${CHAT_PATH}/sessions/${sessionId}`, { method: 'DELETE' });
}
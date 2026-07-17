import { buildJsonRequest } from "../common/request";

const SETTINGS_PATH = "/api/v1/subscriptions/settings";

export async function getPolicySubscriptions() {
  return buildJsonRequest("/api/v1/subscriptions", { method: "GET" });
}

export async function getNotificationSettings() {
  return buildJsonRequest(SETTINGS_PATH, { method: "GET" });
}

export async function updatePolicyNews(enabled) {
  return buildJsonRequest(`${SETTINGS_PATH}/policy-news`, {
    method: "PUT",
    body: { enabled },
  });
}

export async function updateNotificationPause(paused) {
  return buildJsonRequest(`${SETTINGS_PATH}/pause`, {
    method: "PUT",
    body: { paused },
  });
}

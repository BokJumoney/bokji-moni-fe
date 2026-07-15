import { buildJsonRequest } from "../common/request";

const USERS_PATH = "/api/v1/users";

export async function getMyProfile() {
  return buildJsonRequest(`${USERS_PATH}/me`, { method: "GET" });
}

export async function patchMyProfile({ name }) {
  const body = {};
  if (name !== undefined) body.name = name;
  return buildJsonRequest(`${USERS_PATH}/me`, { method: "PATCH", body });
}

export async function getMyWelfareInfo() {
  return buildJsonRequest(`${USERS_PATH}/me/welfare-info`, { method: "GET" });
}

export async function patchMyWelfareInfo(fields) {
  return buildJsonRequest(`${USERS_PATH}/me/welfare-info`, {
    method: "PATCH",
    body: fields,
  });
}

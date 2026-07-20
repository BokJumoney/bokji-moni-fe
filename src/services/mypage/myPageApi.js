import { buildJsonRequest } from "../common/request.js";
import { USER_BACKGROUND_FIELDS } from "./userBackground.js";

const USERS_PATH = "/api/v1/users";

export async function getMyProfile() {
  return buildJsonRequest(`${USERS_PATH}/me`, { method: "GET" });
}

export async function patchMyProfile({ name }) {
  const body = {};
  if (name !== undefined) body.name = name;
  return buildJsonRequest(`${USERS_PATH}/me`, { method: "PATCH", body });
}

/** @returns {Promise<import("./userBackground").UserBackground>} */
export async function getMyUserBackground() {
  return buildJsonRequest(`${USERS_PATH}/me/welfare-info`, { method: "GET" });
}

/**
 * @param {import("./userBackground").UserBackgroundUpdateRequest} fields
 * @returns {Promise<import("./userBackground").UserBackground>}
 */
export async function patchMyUserBackground(fields) {
  const body = USER_BACKGROUND_FIELDS.reduce((allowedFields, field) => {
    if (Object.hasOwn(fields, field) && fields[field] !== undefined) {
      allowedFields[field] = fields[field];
    }
    return allowedFields;
  }, {});

  return buildJsonRequest(`${USERS_PATH}/me/welfare-info`, {
    method: "PATCH",
    body,
  });
}

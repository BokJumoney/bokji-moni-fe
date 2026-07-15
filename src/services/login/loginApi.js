import { buildJsonRequest } from "../common/request";
import { LoginRequestDto } from "./dto/loginRequestDto.js";

const AUTH_PATH = "/api/v1/auth";

export async function postSignup({ name, email, password }) {
  const dto = new LoginRequestDto({ name, email, password });
  return buildJsonRequest(`${AUTH_PATH}/signup`, {
    method: "POST",
    body: dto.toJSON(),
  });
}

export async function postLogin({ email, password }) {
  const dto = new LoginRequestDto({ email, password });
  return buildJsonRequest(`${AUTH_PATH}/login`, {
    method: "POST",
    body: dto.toJSON(),
  });
}

export async function getSession() {
  return buildJsonRequest(`${AUTH_PATH}/session`, {
    method: "GET",
  });
}

export async function postLogout() {
  return buildJsonRequest(`${AUTH_PATH}/logout`, {
    method: "POST",
  });
}

export async function checkEmailDuplicate(email) {
  return buildJsonRequest(`${AUTH_PATH}/check-email`, {
    method: "POST",
    body: { email },
  });
}
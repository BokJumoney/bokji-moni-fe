import { buildJsonRequest } from "../common/request";
import { SignupRequestDto } from "./dto/signupRequestDto";

const AUTH_PATH = "/api/v1/auth";

export async function postSignup({ name, email, password }) {
  const dto = new SignupRequestDto({ name, email, password });
  return buildJsonRequest(`${AUTH_PATH}/signup`, {
    method: "POST",
    body: dto.toJSON(),
  });
}

export async function checkEmailDuplicate(email) {
  return buildJsonRequest(`${AUTH_PATH}/check-email`, {
    method: "POST",
    body: { email },
  });
}
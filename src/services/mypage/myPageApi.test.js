import assert from "node:assert/strict";
import test from "node:test";
import {
  getMyUserBackground,
  patchMyUserBackground,
} from "./myPageApi.js";

function jsonResponse(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

test("사용자 배경정보를 계약된 GET 경로와 기존 쿠키 설정으로 조회한다", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (...args) => {
    calls.push(args);
    return jsonResponse({
      income: null,
      age: null,
      family_size: null,
      disability: null,
      assets: null,
      employment_stat: null,
      updated_at: null,
    });
  });

  await getMyUserBackground();

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "http://localhost:8000/api/v1/users/me/welfare-info");
  assert.equal(calls[0][1].method, "GET");
  assert.equal(calls[0][1].credentials, "include");
});

test("PATCH는 변경된 새 필드만 보내고 0, false, null을 보존한다", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (...args) => {
    calls.push(args);
    return jsonResponse({
      income: 0,
      age: null,
      family_size: null,
      disability: false,
      assets: null,
      employment_stat: null,
      updated_at: "2026-07-20T00:00:00Z",
    });
  });

  await patchMyUserBackground({
    income: 0,
    disability: false,
    age: null,
    unsupported_field: "전송되면 안 됨",
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "http://localhost:8000/api/v1/users/me/welfare-info");
  assert.equal(calls[0][1].method, "PATCH");
  assert.equal(calls[0][1].credentials, "include");
  assert.deepEqual(JSON.parse(calls[0][1].body), {
    income: 0,
    age: null,
    disability: false,
  });
});

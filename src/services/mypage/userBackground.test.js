import assert from "node:assert/strict";
import test from "node:test";
import {
  buildUserBackgroundUpdate,
  EMPTY_USER_BACKGROUND_FORM,
  normalizeUserBackground,
  validateUserBackground,
} from "./userBackground.js";

test("배경정보가 없으면 빈 폼으로 정규화한다", () => {
  assert.deepEqual(normalizeUserBackground(null), EMPTY_USER_BACKGROUND_FORM);
});

test("기존 배경정보를 새 폼 구조로 정규화한다", () => {
  assert.deepEqual(
    normalizeUserBackground({
      income: 0,
      age: 27,
      family_size: 2,
      disability: false,
      assets: 0,
      employment_stat: "재직",
      updated_at: "2026-07-20T00:00:00Z",
    }),
    {
      income: "0",
      age: "27",
      family_size: "2",
      disability: "false",
      assets: "0",
      employment_stat: "재직",
    },
  );
});

test("최초 저장에서도 입력한 필드만 보낸다", () => {
  const current = {
    ...EMPTY_USER_BACKGROUND_FORM,
    age: "25",
    family_size: "1",
  };

  assert.deepEqual(
    buildUserBackgroundUpdate(current, EMPTY_USER_BACKGROUND_FORM),
    { age: 25, family_size: 1 },
  );
});

test("기존 정보에서 한 필드만 부분 수정한다", () => {
  const initial = normalizeUserBackground({
    income: 3000000,
    age: 30,
    family_size: 2,
    disability: true,
    assets: 10000000,
    employment_stat: "재직",
  });

  assert.deepEqual(
    buildUserBackgroundUpdate(
      { ...initial, employment_stat: "구직" },
      initial,
    ),
    { employment_stat: "구직" },
  );
});

test("false와 숫자 0을 빈 값과 구분해 전송한다", () => {
  const current = {
    ...EMPTY_USER_BACKGROUND_FORM,
    income: "0",
    disability: "false",
    assets: "0",
  };

  assert.deepEqual(
    buildUserBackgroundUpdate(current, EMPTY_USER_BACKGROUND_FORM),
    { income: 0, disability: false, assets: 0 },
  );
});

test("기존 값을 명시적으로 지운 필드만 null로 전송한다", () => {
  const initial = normalizeUserBackground({
    income: 100,
    age: null,
    family_size: 3,
    disability: false,
    assets: null,
    employment_stat: "학생",
  });

  assert.deepEqual(
    buildUserBackgroundUpdate(
      { ...initial, income: "", employment_stat: "" },
      initial,
    ),
    { income: null, employment_stat: null },
  );
});

test("음수 나이, 정수가 아닌 나이, 31명 이상의 가구원 수를 차단한다", () => {
  assert.deepEqual(
    validateUserBackground({
      ...EMPTY_USER_BACKGROUND_FORM,
      age: "-1",
      family_size: "31",
    }),
    {
      age: "0 이상의 정수를 입력해 주세요.",
      family_size: "1~30 사이의 정수를 입력해 주세요.",
    },
  );

  assert.equal(
    validateUserBackground({
      ...EMPTY_USER_BACKGROUND_FORM,
      age: "1.5",
    }).age,
    "0 이상의 정수를 입력해 주세요.",
  );
});

test("요청 허용 목록 밖의 제거된 필드는 절대 포함하지 않는다", () => {
  const initial = { ...EMPTY_USER_BACKGROUND_FORM };
  const current = {
    ...initial,
    income: "10",
    unsupported_field: "백엔드 계약에 없는 값",
  };
  const update = buildUserBackgroundUpdate(current, initial);

  assert.deepEqual(update, { income: 10 });
  assert.deepEqual(Object.keys(update), ["income"]);
});

test("저장 응답을 다시 정규화하면 새로고침 조회와 같은 폼 상태가 된다", () => {
  const response = {
    income: 0,
    age: 40,
    family_size: null,
    disability: false,
    assets: 0,
    employment_stat: null,
    updated_at: "2026-07-20T00:00:00Z",
  };

  assert.deepEqual(
    normalizeUserBackground(response),
    normalizeUserBackground({ ...response }),
  );
});

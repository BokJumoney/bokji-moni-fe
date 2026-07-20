export const USER_BACKGROUND_FIELDS = [
  "income",
  "age",
  "family_size",
  "disability",
  "assets",
  "employment_stat",
];

export const EMPTY_USER_BACKGROUND_FORM = {
  income: "",
  age: "",
  family_size: "",
  disability: "",
  assets: "",
  employment_stat: "",
};

/**
 * @typedef {object} UserBackground
 * @property {number | null} income
 * @property {number | null} age
 * @property {number | null} family_size
 * @property {boolean | null} disability
 * @property {number | null} assets
 * @property {string | null} employment_stat
 * @property {string | null} updated_at
 */

/**
 * @typedef {object} UserBackgroundUpdateRequest
 * @property {number | null} [income]
 * @property {number | null} [age]
 * @property {number | null} [family_size]
 * @property {boolean | null} [disability]
 * @property {number | null} [assets]
 * @property {string | null} [employment_stat]
 */

/** @param {Partial<UserBackground> | null | undefined} data */
export function normalizeUserBackground(data = {}) {
  const source = data || {};

  return {
    income: source.income == null ? "" : String(source.income),
    age: source.age == null ? "" : String(source.age),
    family_size: source.family_size == null ? "" : String(source.family_size),
    disability: source.disability == null ? "" : String(source.disability),
    assets: source.assets == null ? "" : String(source.assets),
    employment_stat: source.employment_stat == null ? "" : String(source.employment_stat),
  };
}

function toRequestValue(field, rawValue) {
  if (rawValue === "") return null;
  if (field === "disability") return rawValue === "true";
  if (field === "employment_stat") return rawValue;
  return Number(rawValue);
}

/**
 * Builds a true partial PATCH body. A blank value only becomes null when it
 * differs from the last server-backed form value.
 *
 * @param {typeof EMPTY_USER_BACKGROUND_FORM} current
 * @param {typeof EMPTY_USER_BACKGROUND_FORM} initial
 * @returns {UserBackgroundUpdateRequest}
 */
export function buildUserBackgroundUpdate(current, initial) {
  return USER_BACKGROUND_FIELDS.reduce((body, field) => {
    if (current[field] !== initial[field]) {
      body[field] = toRequestValue(field, current[field]);
    }
    return body;
  }, {});
}

export function validateUserBackground(form) {
  const errors = {};

  if (form.income !== "") {
    const income = Number(form.income);
    if (!Number.isFinite(income) || income < 0) {
      errors.income = "0 이상의 숫자를 입력해 주세요.";
    }
  }

  if (form.age !== "") {
    const age = Number(form.age);
    if (!Number.isInteger(age) || age < 0) {
      errors.age = "0 이상의 정수를 입력해 주세요.";
    }
  }

  if (form.family_size !== "") {
    const familySize = Number(form.family_size);
    if (!Number.isInteger(familySize) || familySize < 1 || familySize > 30) {
      errors.family_size = "1~30 사이의 정수를 입력해 주세요.";
    }
  }

  if (form.assets !== "") {
    const assets = Number(form.assets);
    if (!Number.isFinite(assets) || assets < 0) {
      errors.assets = "0 이상의 숫자를 입력해 주세요.";
    }
  }

  if (form.employment_stat.length > 50) {
    errors.employment_stat = "고용 상태는 50자 이내로 입력해 주세요.";
  }

  return errors;
}

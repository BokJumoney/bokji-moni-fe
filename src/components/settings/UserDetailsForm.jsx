import { useCallback, useEffect, useState } from "react";
import {
  getMyWelfareInfo,
  patchMyWelfareInfo,
} from "../../services/mypage/myPageApi";

const EMPTY_DETAILS = {
  birth_date: "",
  monthly_income: "",
  family_size: "",
  household_type: "",
  region: "",
  district: "",
  has_disability: "",
  assets: "",
  employment_status: "",
};

const HOUSEHOLD_TYPES = ["1인", "한부모", "다문화", "노인", "장애인", "일반"];
const EMPLOYMENT_STATUSES = ["재직", "구직", "실업", "학생", "자영업", "기타"];

function normalizeDetails(data = {}) {
  return {
    birth_date: data.birth_date || "",
    monthly_income: data.monthly_income == null ? "" : String(data.monthly_income),
    family_size: data.family_size == null ? "" : String(data.family_size),
    household_type: data.household_type || "",
    region: data.region || "",
    district: data.district || "",
    has_disability: data.has_disability == null ? "" : String(data.has_disability),
    assets: data.assets == null ? "" : String(data.assets),
    employment_status: data.employment_status || "",
  };
}

function getErrorMessage(error, fallback) {
  const detail = error?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg).filter(Boolean).join(" ") || fallback;
  }
  return detail?.message || error?.message || fallback;
}

export default function UserDetailsForm({ onAuthenticationError }) {
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const loadDetails = useCallback(async () => {
    try {
      const data = await getMyWelfareInfo();
      setDetails(normalizeDetails(data));
      setIsDirty(false);
    } catch (error) {
      if (!(await onAuthenticationError(error))) {
        setLoadError(getErrorMessage(error, "사용자 상세 정보를 불러오지 못했습니다."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [onAuthenticationError]);

  useEffect(() => {
    const timer = window.setTimeout(loadDetails, 0);
    return () => window.clearTimeout(timer);
  }, [loadDetails]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError("");
    loadDetails();
  };

  const handleChange = (field, value) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setIsDirty(true);
    setSaveError("");
    setSaveSuccess(false);
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const errors = {};

    if (details.birth_date) {
      const birthDate = new Date(details.birth_date);
      if (Number.isNaN(birthDate.getTime())) {
        errors.birth_date = "올바른 날짜를 입력해 주세요.";
      } else if (birthDate > new Date()) {
        errors.birth_date = "미래 날짜는 입력할 수 없습니다.";
      }
    }

    if (details.monthly_income && Number(details.monthly_income) < 0) {
      errors.monthly_income = "0 이상의 금액을 입력해 주세요.";
    }
    if (details.family_size) {
      const familySize = Number(details.family_size);
      if (!Number.isInteger(familySize) || familySize < 1 || familySize > 30) {
        errors.family_size = "1~30 사이의 정수를 입력해 주세요.";
      }
    }
    if (details.assets && Number(details.assets) < 0) {
      errors.assets = "0 이상의 금액을 입력해 주세요.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildRequestBody = () => ({
    birth_date: details.birth_date || null,
    monthly_income: details.monthly_income === "" ? null : Number(details.monthly_income),
    family_size: details.family_size === "" ? null : Number(details.family_size),
    household_type: details.household_type || null,
    region: details.region || null,
    district: details.district || null,
    has_disability: details.has_disability === "" ? null : details.has_disability === "true",
    assets: details.assets === "" ? null : Number(details.assets),
    employment_status: details.employment_status || null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isDirty || !validate()) return;

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const data = await patchMyWelfareInfo(buildRequestBody());
      setDetails(normalizeDetails(data));
      setIsDirty(false);
      setSaveSuccess(true);
    } catch (error) {
      if (!(await onAuthenticationError(error))) {
        setSaveError(getErrorMessage(error, "사용자 상세 정보를 저장하지 못했습니다."));
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="settings-modal-status">상세 정보를 불러오는 중...</div>;
  }

  if (loadError) {
    return (
      <div className="settings-modal-status settings-modal-status--error" role="alert">
        <p>{loadError}</p>
        <button type="button" onClick={handleRetry}>다시 시도</button>
      </div>
    );
  }

  return (
    <section aria-labelledby="user-details-title">
      <div className="settings-section-heading">
        <h3 id="user-details-title">사용자 상세 정보</h3>
        <p>입력한 정보는 맞춤 복지 추천에 활용됩니다.</p>
      </div>

      <form className="settings-details-form" onSubmit={handleSubmit}>
        <div className="settings-details-grid">
          <div className="settings-field">
            <label htmlFor="details-birth-date">생년월일</label>
            <input
              id="details-birth-date"
              type="date"
              className={fieldErrors.birth_date ? "settings-input--error" : ""}
              value={details.birth_date}
              onChange={(event) => handleChange("birth_date", event.target.value)}
            />
            {fieldErrors.birth_date && <p className="settings-field-error">{fieldErrors.birth_date}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="details-family-size">가구원 수</label>
            <input
              id="details-family-size"
              type="number"
              min="1"
              max="30"
              className={fieldErrors.family_size ? "settings-input--error" : ""}
              value={details.family_size}
              onChange={(event) => handleChange("family_size", event.target.value)}
            />
            {fieldErrors.family_size && <p className="settings-field-error">{fieldErrors.family_size}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="details-monthly-income">월 소득 (원)</label>
            <input
              id="details-monthly-income"
              type="number"
              min="0"
              className={fieldErrors.monthly_income ? "settings-input--error" : ""}
              value={details.monthly_income}
              onChange={(event) => handleChange("monthly_income", event.target.value)}
            />
            {fieldErrors.monthly_income && <p className="settings-field-error">{fieldErrors.monthly_income}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="details-assets">자산 (원)</label>
            <input
              id="details-assets"
              type="number"
              min="0"
              className={fieldErrors.assets ? "settings-input--error" : ""}
              value={details.assets}
              onChange={(event) => handleChange("assets", event.target.value)}
            />
            {fieldErrors.assets && <p className="settings-field-error">{fieldErrors.assets}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="details-household-type">가구 유형</label>
            <select
              id="details-household-type"
              value={details.household_type}
              onChange={(event) => handleChange("household_type", event.target.value)}
            >
              <option value="">선택하세요</option>
              {HOUSEHOLD_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="settings-field">
            <label htmlFor="details-employment-status">고용 상태</label>
            <select
              id="details-employment-status"
              value={details.employment_status}
              onChange={(event) => handleChange("employment_status", event.target.value)}
            >
              <option value="">선택하세요</option>
              {EMPLOYMENT_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="settings-field">
            <label htmlFor="details-region">거주 지역 (시·도)</label>
            <input
              id="details-region"
              type="text"
              maxLength="100"
              placeholder="서울특별시"
              value={details.region}
              onChange={(event) => handleChange("region", event.target.value)}
            />
          </div>

          <div className="settings-field">
            <label htmlFor="details-district">거주 지역 (시·군·구)</label>
            <input
              id="details-district"
              type="text"
              maxLength="100"
              placeholder="강남구"
              value={details.district}
              onChange={(event) => handleChange("district", event.target.value)}
            />
          </div>

          <div className="settings-field">
            <label htmlFor="details-disability">장애 여부</label>
            <select
              id="details-disability"
              value={details.has_disability}
              onChange={(event) => handleChange("has_disability", event.target.value)}
            >
              <option value="">선택하세요</option>
              <option value="true">예</option>
              <option value="false">아니오</option>
            </select>
          </div>
        </div>

        <div className="settings-details-actions">
          <span>
            {saveError && <p className="settings-save-error" role="alert">{saveError}</p>}
            {saveSuccess && <p className="settings-save-success" role="status">상세 정보가 저장되었습니다.</p>}
          </span>
          <button type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? "저장 중..." : "변경사항 저장"}
          </button>
        </div>
      </form>
    </section>
  );
}

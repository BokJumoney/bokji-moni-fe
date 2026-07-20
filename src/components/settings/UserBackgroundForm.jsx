import { useCallback, useEffect, useState } from "react";
import {
  getMyUserBackground,
  patchMyUserBackground,
} from "../../services/mypage/myPageApi";
import {
  buildUserBackgroundUpdate,
  EMPTY_USER_BACKGROUND_FORM,
  normalizeUserBackground,
  validateUserBackground,
} from "../../services/mypage/userBackground";

function getErrorMessage(error, fallback) {
  const detail = error?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg).filter(Boolean).join(" ") || fallback;
  }
  return detail?.message || error?.message || fallback;
}

export default function UserBackgroundForm({ onAuthenticationError }) {
  const [userBackground, setUserBackground] = useState(EMPTY_USER_BACKGROUND_FORM);
  const [initialUserBackground, setInitialUserBackground] = useState(EMPTY_USER_BACKGROUND_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const loadUserBackground = useCallback(async () => {
    try {
      const normalized = normalizeUserBackground(await getMyUserBackground());
      setUserBackground(normalized);
      setInitialUserBackground(normalized);
    } catch (error) {
      if (!(await onAuthenticationError(error))) {
        setLoadError(getErrorMessage(error, "사용자 배경 정보를 불러오지 못했습니다."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [onAuthenticationError]);

  useEffect(() => {
    const timer = window.setTimeout(loadUserBackground, 0);
    return () => window.clearTimeout(timer);
  }, [loadUserBackground]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError("");
    loadUserBackground();
  };

  const handleChange = (field, value) => {
    setUserBackground((current) => ({ ...current, [field]: value }));
    setSaveError("");
    setSaveSuccess(false);
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const errors = validateUserBackground(userBackground);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateBody = buildUserBackgroundUpdate(userBackground, initialUserBackground);
  const isDirty = Object.keys(updateBody).length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isDirty || !validate()) return;

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const normalized = normalizeUserBackground(await patchMyUserBackground(updateBody));
      setUserBackground(normalized);
      setInitialUserBackground(normalized);
      setSaveSuccess(true);
    } catch (error) {
      if (!(await onAuthenticationError(error))) {
        setSaveError(getErrorMessage(error, "사용자 배경 정보를 저장하지 못했습니다."));
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="settings-modal-status">배경 정보를 불러오는 중...</div>;
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
    <section aria-labelledby="user-background-title">
      <div className="settings-section-heading">
        <h3 id="user-background-title">사용자 배경 정보</h3>
        <p>입력한 정보는 맞춤 복지 추천에 활용됩니다.</p>
      </div>

      <form className="settings-background-form" onSubmit={handleSubmit}>
        <div className="settings-background-grid">
          <div className="settings-field">
            <label htmlFor="background-age">나이</label>
            <input
              id="background-age"
              type="number"
              min="0"
              step="1"
              className={fieldErrors.age ? "settings-input--error" : ""}
              value={userBackground.age}
              onChange={(event) => handleChange("age", event.target.value)}
            />
            {fieldErrors.age && <p className="settings-field-error">{fieldErrors.age}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="background-family-size">가구원 수</label>
            <input
              id="background-family-size"
              type="number"
              min="1"
              max="30"
              className={fieldErrors.family_size ? "settings-input--error" : ""}
              step="1"
              value={userBackground.family_size}
              onChange={(event) => handleChange("family_size", event.target.value)}
            />
            {fieldErrors.family_size && <p className="settings-field-error">{fieldErrors.family_size}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="background-income">소득 (원)</label>
            <input
              id="background-income"
              type="number"
              min="0"
              className={fieldErrors.income ? "settings-input--error" : ""}
              value={userBackground.income}
              onChange={(event) => handleChange("income", event.target.value)}
            />
            {fieldErrors.income && <p className="settings-field-error">{fieldErrors.income}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="background-assets">자산 (원)</label>
            <input
              id="background-assets"
              type="number"
              min="0"
              className={fieldErrors.assets ? "settings-input--error" : ""}
              value={userBackground.assets}
              onChange={(event) => handleChange("assets", event.target.value)}
            />
            {fieldErrors.assets && <p className="settings-field-error">{fieldErrors.assets}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="background-disability">장애 여부</label>
            <select
              id="background-disability"
              value={userBackground.disability}
              onChange={(event) => handleChange("disability", event.target.value)}
            >
              <option value="">미입력</option>
              <option value="true">예</option>
              <option value="false">아니오</option>
            </select>
          </div>

          <div className="settings-field">
            <label htmlFor="background-employment-stat">고용 상태</label>
            <input
              id="background-employment-stat"
              type="text"
              maxLength="50"
              className={fieldErrors.employment_stat ? "settings-input--error" : ""}
              value={userBackground.employment_stat}
              onChange={(event) => handleChange("employment_stat", event.target.value)}
            />
            {fieldErrors.employment_stat && (
              <p className="settings-field-error">{fieldErrors.employment_stat}</p>
            )}
          </div>
        </div>

        <div className="settings-background-actions">
          <span>
            {saveError && <p className="settings-save-error" role="alert">{saveError}</p>}
            {saveSuccess && <p className="settings-save-success" role="status">배경 정보가 저장되었습니다.</p>}
          </span>
          <button type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? "저장 중..." : "변경사항 저장"}
          </button>
        </div>
      </form>
    </section>
  );
}

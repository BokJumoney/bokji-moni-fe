import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  getMyProfile,
  patchMyProfile,
  getMyWelfareInfo,
  patchMyWelfareInfo,
} from "../../services/mypage/myPageApi";
import Button from "../../components/common/Button";
import "./MyPage.css";

const HOUSEHOLD_TYPES = [
  { value: "", label: "선택하세요" },
  { value: "1인", label: "1인" },
  { value: "한부모", label: "한부모" },
  { value: "다문화", label: "다문화" },
  { value: "노인", label: "노인" },
  { value: "장애인", label: "장애인" },
  { value: "일반", label: "일반" },
];

const EMPLOYMENT_STATUSES = [
  { value: "", label: "선택하세요" },
  { value: "재직", label: "재직" },
  { value: "구직", label: "구직" },
  { value: "실업", label: "실업" },
  { value: "학생", label: "학생" },
  { value: "자영업", label: "자영업" },
  { value: "기타", label: "기타" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
}

export default function MyPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState(false);

  const [welfare, setWelfare] = useState({
    birth_date: "",
    monthly_income: "",
    family_size: "",
    household_type: "",
    region: "",
    district: "",
    has_disability: "",
    assets: "",
    employment_status: "",
  });
  const [welfareDirty, setWelfareDirty] = useState(false);
  const [welfareSaving, setWelfareSaving] = useState(false);
  const [welfareError, setWelfareError] = useState("");
  const [welfareSuccess, setWelfareSuccess] = useState(false);
  const [welfareFieldErrors, setWelfareFieldErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [profileData, welfareData] = await Promise.all([
          getMyProfile(),
          getMyWelfareInfo(),
        ]);
        if (!mounted) return;
        setProfile(profileData);
        setNameValue(profileData.name || "");

        const w = {
          birth_date: welfareData.birth_date || "",
          monthly_income: welfareData.monthly_income != null ? String(welfareData.monthly_income) : "",
          family_size: welfareData.family_size != null ? String(welfareData.family_size) : "",
          household_type: welfareData.household_type || "",
          region: welfareData.region || "",
          district: welfareData.district || "",
          has_disability: welfareData.has_disability != null ? String(welfareData.has_disability) : "",
          assets: welfareData.assets != null ? String(welfareData.assets) : "",
          employment_status: welfareData.employment_status || "",
        };
        setWelfare(w);
      } catch (err) {
        if (err.status === 401) {
          await logout();
          navigate("/login");
          return;
        }
      } finally {
        if (mounted) setPageLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [logout, navigate]);

  const handleWelfareChange = useCallback((field, value) => {
    setWelfare((prev) => ({ ...prev, [field]: value }));
    setWelfareDirty(true);
    setWelfareSuccess(false);
    setWelfareError("");
    setWelfareFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleNameSave = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed) {
      setNameError("이름을 입력해주세요.");
      return;
    }
    if (trimmed.length > 100) {
      setNameError("이름은 100자 이내로 입력해주세요.");
      return;
    }
    setNameError("");
    setNameSuccess(false);
    setNameSaving(true);
    try {
      const data = await patchMyProfile({ name: trimmed });
      setProfile(data);
      setNameValue(data.name || "");
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 2000);
    } catch (err) {
      setNameError(err.message || "저장에 실패했습니다.");
    } finally {
      setNameSaving(false);
    }
  };

  const buildWelfareBody = () => {
    const body = {};

    const setIfPresent = (key, rawValue, type) => {
      if (rawValue === "") {
        body[key] = null;
      } else if (type === "number") {
        const num = Number(rawValue);
        if (!isNaN(num)) body[key] = num;
      } else if (type === "boolean") {
        body[key] = rawValue === "true";
      } else {
        body[key] = rawValue;
      }
    };

    setIfPresent("birth_date", welfare.birth_date, "string");
    setIfPresent("monthly_income", welfare.monthly_income, "number");
    setIfPresent("family_size", welfare.family_size, "number");
    setIfPresent("household_type", welfare.household_type, "string");
    setIfPresent("region", welfare.region, "string");
    setIfPresent("district", welfare.district, "string");
    setIfPresent("has_disability", welfare.has_disability, "boolean");
    setIfPresent("assets", welfare.assets, "number");
    setIfPresent("employment_status", welfare.employment_status, "string");

    return body;
  };

  const validateWelfare = () => {
    const errors = {};

    if (welfare.birth_date) {
      const d = new Date(welfare.birth_date);
      if (isNaN(d.getTime())) {
        errors.birth_date = "올바른 날짜를 입력해주세요.";
      } else if (d > new Date()) {
        errors.birth_date = "미래 날짜는 입력할 수 없습니다.";
      }
    }

    if (welfare.monthly_income) {
      const v = Number(welfare.monthly_income);
      if (isNaN(v) || v < 0) errors.monthly_income = "0 이상의 숫자를 입력해주세요.";
    }

    if (welfare.family_size) {
      const v = Number(welfare.family_size);
      if (isNaN(v) || v < 1 || v > 30) errors.family_size = "1~30 사이의 숫자를 입력해주세요.";
    }

    if (welfare.assets) {
      const v = Number(welfare.assets);
      if (isNaN(v) || v < 0) errors.assets = "0 이상의 숫자를 입력해주세요.";
    }

    setWelfareFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWelfareSave = async () => {
    if (!welfareDirty) return;
    if (!validateWelfare()) return;

    setWelfareError("");
    setWelfareSuccess(false);
    setWelfareSaving(true);
    try {
      const body = buildWelfareBody();
      const data = await patchMyWelfareInfo(body);

      const w = {
        birth_date: data.birth_date || "",
        monthly_income: data.monthly_income != null ? String(data.monthly_income) : "",
        family_size: data.family_size != null ? String(data.family_size) : "",
        household_type: data.household_type || "",
        region: data.region || "",
        district: data.district || "",
        has_disability: data.has_disability != null ? String(data.has_disability) : "",
        assets: data.assets != null ? String(data.assets) : "",
        employment_status: data.employment_status || "",
      };
      setWelfare(w);
      setWelfareDirty(false);
      setWelfareSuccess(true);
      setTimeout(() => setWelfareSuccess(false), 2000);
    } catch (err) {
      if (err.status === 401) {
        await logout();
        navigate("/login");
        return;
      }
      setWelfareError(err.message || "저장에 실패했습니다.");
    } finally {
      setWelfareSaving(false);
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") handleNameSave();
  };

  if (pageLoading) {
    return (
      <div className="mypage">
        <div className="mypage__loading">로딩 중...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mypage">
        <div className="mypage__error">
          <p>프로필을 불러올 수 없습니다.</p>
          <button className="mypage__retry-btn" onClick={() => window.location.reload()}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage">
      <div className="mypage__container">
        <h1 className="mypage__title">마이페이지</h1>

        {/* 계정 정보 카드 */}
        <section className="mypage__section">
          <h2 className="mypage__section-title">계정 정보</h2>
          <div className="mypage__card">
            <div className="mypage__field">
              <label className="mypage__label">이메일</label>
              <div className="mypage__readonly">{profile.email}</div>
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="mypage-name">이름</label>
              <div className="mypage__inline-edit">
                <input
                  id="mypage-name"
                  type="text"
                  className={`mypage__input ${nameError ? "mypage__input--error" : ""}`}
                  value={nameValue}
                  onChange={(e) => {
                    setNameValue(e.target.value);
                    setNameError("");
                    setNameSuccess(false);
                  }}
                  onKeyDown={handleNameKeyDown}
                  maxLength={100}
                />
                <button
                  className="mypage__save-btn"
                  onClick={handleNameSave}
                  disabled={nameSaving}
                >
                  {nameSaving ? "저장 중..." : "저장"}
                </button>
              </div>
              {nameError && <p className="mypage__field-error">{nameError}</p>}
              {nameSuccess && <p className="mypage__field-success">이름이 저장되었습니다.</p>}
            </div>

            <div className="mypage__field">
              <label className="mypage__label">가입일</label>
              <div className="mypage__readonly">
                {formatDate(profile.created_at)}
              </div>
            </div>
          </div>
        </section>

        {/* 복지 정보 폼 */}
        <section className="mypage__section">
          <h2 className="mypage__section-title">맞춤 복지 정보</h2>
          <div className="mypage__card">
            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-birth-date">
                생년월일
              </label>
              <input
                id="welfare-birth-date"
                type="date"
                className={`mypage__input ${welfareFieldErrors.birth_date ? "mypage__input--error" : ""}`}
                value={welfare.birth_date}
                onChange={(e) => handleWelfareChange("birth_date", e.target.value)}
              />
              {welfareFieldErrors.birth_date && (
                <p className="mypage__field-error">{welfareFieldErrors.birth_date}</p>
              )}
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-monthly-income">
                월 소득 (원)
              </label>
              <input
                id="welfare-monthly-income"
                type="number"
                className={`mypage__input ${welfareFieldErrors.monthly_income ? "mypage__input--error" : ""}`}
                placeholder="0"
                min="0"
                value={welfare.monthly_income}
                onChange={(e) => handleWelfareChange("monthly_income", e.target.value)}
              />
              {welfareFieldErrors.monthly_income && (
                <p className="mypage__field-error">{welfareFieldErrors.monthly_income}</p>
              )}
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-family-size">
                가구원 수
              </label>
              <input
                id="welfare-family-size"
                type="number"
                className={`mypage__input ${welfareFieldErrors.family_size ? "mypage__input--error" : ""}`}
                placeholder="1"
                min="1"
                max="30"
                value={welfare.family_size}
                onChange={(e) => handleWelfareChange("family_size", e.target.value)}
              />
              {welfareFieldErrors.family_size && (
                <p className="mypage__field-error">{welfareFieldErrors.family_size}</p>
              )}
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-household-type">
                가구 유형
              </label>
              <select
                id="welfare-household-type"
                className="mypage__select"
                value={welfare.household_type}
                onChange={(e) => handleWelfareChange("household_type", e.target.value)}
              >
                {HOUSEHOLD_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-region">
                거주 지역 (시·도)
              </label>
              <input
                id="welfare-region"
                type="text"
                className="mypage__input"
                placeholder="서울특별시"
                maxLength={100}
                value={welfare.region}
                onChange={(e) => handleWelfareChange("region", e.target.value)}
              />
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-district">
                거주 지역 (시·군·구)
              </label>
              <input
                id="welfare-district"
                type="text"
                className="mypage__input"
                placeholder="강남구"
                maxLength={100}
                value={welfare.district}
                onChange={(e) => handleWelfareChange("district", e.target.value)}
              />
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-has-disability">
                장애 여부
              </label>
              <select
                id="welfare-has-disability"
                className="mypage__select"
                value={welfare.has_disability}
                onChange={(e) => handleWelfareChange("has_disability", e.target.value)}
              >
                <option value="">선택하세요</option>
                <option value="true">예</option>
                <option value="false">아니오</option>
              </select>
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-assets">
                자산 (원)
              </label>
              <input
                id="welfare-assets"
                type="number"
                className={`mypage__input ${welfareFieldErrors.assets ? "mypage__input--error" : ""}`}
                placeholder="0"
                min="0"
                value={welfare.assets}
                onChange={(e) => handleWelfareChange("assets", e.target.value)}
              />
              {welfareFieldErrors.assets && (
                <p className="mypage__field-error">{welfareFieldErrors.assets}</p>
              )}
            </div>

            <div className="mypage__field">
              <label className="mypage__label" htmlFor="welfare-employment-status">
                고용 상태
              </label>
              <select
                id="welfare-employment-status"
                className="mypage__select"
                value={welfare.employment_status}
                onChange={(e) => handleWelfareChange("employment_status", e.target.value)}
              >
                {EMPLOYMENT_STATUSES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mypage__field">
              <div className="mypage__save-wrap">
                {welfareError && <p className="mypage__field-error">{welfareError}</p>}
                {welfareSuccess && (
                  <p className="mypage__field-success">복지 정보가 저장되었습니다.</p>
                )}
                <Button
                  value={welfareSaving ? "저장 중..." : "복지 정보 저장"}
                  onClick={handleWelfareSave}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 안내 영역 */}
        <section className="mypage__section mypage__notice">
          <p className="mypage__notice-icon">&#9432;</p>
          <div className="mypage__notice-text">
            <p>입력하신 정보는 맞춤 복지 추천에 사용됩니다.</p>
            <p>
              민감정보는 최소한으로 수집하며, 언제든지 필드를 비워 저장하면
              해당 정보가 삭제됩니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

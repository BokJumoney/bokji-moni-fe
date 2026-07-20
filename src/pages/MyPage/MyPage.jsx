import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  getMyProfile,
  patchMyProfile,
  getMyUserBackground,
  patchMyUserBackground,
} from "../../services/mypage/myPageApi";
import {
  buildUserBackgroundUpdate,
  EMPTY_USER_BACKGROUND_FORM,
  normalizeUserBackground,
  validateUserBackground,
} from "../../services/mypage/userBackground";
import Button from "../../components/common/Button";
import "./MyPage.css";
import Header from "../../components/common/Header.jsx";

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

  const [userBackground, setUserBackground] = useState(EMPTY_USER_BACKGROUND_FORM);
  const [initialUserBackground, setInitialUserBackground] = useState(EMPTY_USER_BACKGROUND_FORM);
  const [welfareSaving, setWelfareSaving] = useState(false);
  const [welfareError, setWelfareError] = useState("");
  const [welfareSuccess, setWelfareSuccess] = useState(false);
  const [welfareFieldErrors, setWelfareFieldErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [profileData, backgroundData] = await Promise.all([
          getMyProfile(),
          getMyUserBackground(),
        ]);
        if (!mounted) return;
        setProfile(profileData);
        setNameValue(profileData.name || "");

        const normalized = normalizeUserBackground(backgroundData);
        setUserBackground(normalized);
        setInitialUserBackground(normalized);
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

  const handleUserBackgroundChange = useCallback((field, value) => {
    setUserBackground((prev) => ({ ...prev, [field]: value }));
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

  const validateWelfare = () => {
    const errors = validateUserBackground(userBackground);
    setWelfareFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWelfareSave = async () => {
    const updateBody = buildUserBackgroundUpdate(userBackground, initialUserBackground);
    if (Object.keys(updateBody).length === 0) return;
    if (!validateWelfare()) return;

    setWelfareError("");
    setWelfareSuccess(false);
    setWelfareSaving(true);
    try {
      const normalized = normalizeUserBackground(
        await patchMyUserBackground(updateBody),
      );
      setUserBackground(normalized);
      setInitialUserBackground(normalized);
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
      <>
        {/* ── Header / Navigation ── */}
        <Header />

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

            {/* 사용자 배경 정보 폼 */}
            <section className="mypage__section">
              <h2 className="mypage__section-title">사용자 배경 정보</h2>
              <div className="mypage__card">
                <div className="mypage__field">
                  <label className="mypage__label" htmlFor="background-age">
                    나이
                  </label>
                  <input
                      id="background-age"
                      type="number"
                      className={`mypage__input ${welfareFieldErrors.age ? "mypage__input--error" : ""}`}
                      placeholder="0"
                      min="0"
                      step="1"
                      value={userBackground.age}
                      onChange={(e) => handleUserBackgroundChange("age", e.target.value)}
                  />
                  {welfareFieldErrors.age && (
                      <p className="mypage__field-error">{welfareFieldErrors.age}</p>
                  )}
                </div>

                <div className="mypage__field">
                  <label className="mypage__label" htmlFor="background-income">
                    소득 (원)
                  </label>
                  <input
                      id="background-income"
                      type="number"
                      className={`mypage__input ${welfareFieldErrors.income ? "mypage__input--error" : ""}`}
                      placeholder="0"
                      min="0"
                      value={userBackground.income}
                      onChange={(e) => handleUserBackgroundChange("income", e.target.value)}
                  />
                  {welfareFieldErrors.income && (
                      <p className="mypage__field-error">{welfareFieldErrors.income}</p>
                  )}
                </div>

                <div className="mypage__field">
                  <label className="mypage__label" htmlFor="background-family-size">
                    가구원 수
                  </label>
                  <input
                      id="background-family-size"
                      type="number"
                      className={`mypage__input ${welfareFieldErrors.family_size ? "mypage__input--error" : ""}`}
                      placeholder="1"
                      min="1"
                      max="30"
                      step="1"
                      value={userBackground.family_size}
                      onChange={(e) => handleUserBackgroundChange("family_size", e.target.value)}
                  />
                  {welfareFieldErrors.family_size && (
                      <p className="mypage__field-error">{welfareFieldErrors.family_size}</p>
                  )}
                </div>

                <div className="mypage__field">
                  <label className="mypage__label" htmlFor="background-disability">
                    장애 여부
                  </label>
                  <select
                      id="background-disability"
                      className="mypage__select"
                      value={userBackground.disability}
                      onChange={(e) => handleUserBackgroundChange("disability", e.target.value)}
                  >
                    <option value="">미입력</option>
                    <option value="true">예</option>
                    <option value="false">아니오</option>
                  </select>
                </div>

                <div className="mypage__field">
                  <label className="mypage__label" htmlFor="background-assets">
                    자산 (원)
                  </label>
                  <input
                      id="background-assets"
                      type="number"
                      className={`mypage__input ${welfareFieldErrors.assets ? "mypage__input--error" : ""}`}
                      placeholder="0"
                      min="0"
                      value={userBackground.assets}
                      onChange={(e) => handleUserBackgroundChange("assets", e.target.value)}
                  />
                  {welfareFieldErrors.assets && (
                      <p className="mypage__field-error">{welfareFieldErrors.assets}</p>
                  )}
                </div>

                <div className="mypage__field">
                  <label className="mypage__label" htmlFor="background-employment-stat">
                    고용 상태
                  </label>
                  <input
                      id="background-employment-stat"
                      type="text"
                      maxLength="50"
                      className={`mypage__input ${welfareFieldErrors.employment_stat ? "mypage__input--error" : ""}`}
                      value={userBackground.employment_stat}
                      onChange={(e) => handleUserBackgroundChange("employment_stat", e.target.value)}
                  />
                  {welfareFieldErrors.employment_stat && (
                      <p className="mypage__field-error">{welfareFieldErrors.employment_stat}</p>
                  )}
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
      </>

  );
}

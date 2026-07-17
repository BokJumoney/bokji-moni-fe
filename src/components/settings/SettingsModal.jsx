import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getSession } from "../../services/login/loginApi";
import {
  getNotificationSettings,
  updateNotificationPause,
  updatePolicyNews,
} from "../../services/subscription/subscriptionApi";
import UserDetailsForm from "./UserDetailsForm";
import "./SettingsModal.css";

const EMPTY_SETTINGS = {
  policy_news_enabled: false,
  is_paused: false,
  updated_at: "",
};

function getErrorCode(error) {
  return error?.data?.detail?.code;
}

function getErrorMessage(error, fallback) {
  const detail = error?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg)
      .filter(Boolean)
      .join(" ") || fallback;
  }

  return detail?.message || error?.message || fallback;
}

function Toggle({ id, checked, disabled, label, description, onChange }) {
  return (
    <label className={`settings-toggle-row ${disabled ? "settings-toggle-row--disabled" : ""}`} htmlFor={id}>
      <span className="settings-toggle-copy">
        <span className="settings-toggle-label">{label}</span>
        <span className="settings-toggle-description">{description}</span>
      </span>
      <span className="settings-switch">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="settings-switch-track" aria-hidden="true" />
      </span>
    </label>
  );
}

export default function SettingsModal({ isOpen, initialSection = "account", onClose }) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [sessionUser, setSessionUser] = useState(null);
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [savingField, setSavingField] = useState(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleAuthenticationError = useCallback(async (error) => {
    const code = getErrorCode(error);
    if (error?.status !== 401 && code !== "AUTHENTICATION_REQUIRED" && code !== "SESSION_EXPIRED") {
      return false;
    }

    onClose();
    await logout();
    navigate("/login");
    return true;
  }, [logout, navigate, onClose]);

  const loadSettings = useCallback(async () => {
    try {
      const [sessionData, notificationData] = await Promise.all([
        getSession(),
        getNotificationSettings(),
      ]);
      setSessionUser(sessionData?.user || null);
      setSettings(notificationData);
    } catch (error) {
      if (!(await handleAuthenticationError(error))) {
        setLoadError(getErrorMessage(error, "설정 정보를 불러오지 못했습니다."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthenticationError]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(loadSettings, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, loadSettings]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError("");
    setSaveError("");
    loadSettings();
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePolicyNewsChange = async (enabled) => {
    const previousSettings = settings;
    setSettings((current) => ({ ...current, policy_news_enabled: enabled }));
    setSavingField("policy_news");
    setSaveError("");

    try {
      const data = await updatePolicyNews(enabled);
      setSettings(data);
    } catch (error) {
      setSettings(previousSettings);
      if (!(await handleAuthenticationError(error))) {
        setSaveError(getErrorMessage(error, "정책 소식 설정을 저장하지 못했습니다."));
      }
    } finally {
      setSavingField(null);
    }
  };

  const handlePauseChange = async (paused) => {
    const previousSettings = settings;
    setSettings((current) => ({ ...current, is_paused: paused }));
    setSavingField("pause");
    setSaveError("");

    try {
      const data = await updateNotificationPause(paused);
      setSettings(data);
    } catch (error) {
      setSettings(previousSettings);
      if (!(await handleAuthenticationError(error))) {
        setSaveError(getErrorMessage(error, "알림 일시 중지 설정을 저장하지 못했습니다."));
      }
    } finally {
      setSavingField(null);
    }
  };

  return (
    <div
      className="settings-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <header className="settings-modal-header">
          <h2 id="settings-modal-title">설정</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="settings-modal-close"
            aria-label="설정 닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="settings-modal-body">
          <nav className="settings-modal-nav" aria-label="설정 항목">
            <button
              type="button"
              className={activeSection === "account" ? "active" : ""}
              aria-current={activeSection === "account" ? "page" : undefined}
              onClick={() => setActiveSection("account")}
            >
              계정 정보
            </button>
            <button
              type="button"
              className={activeSection === "details" ? "active" : ""}
              aria-current={activeSection === "details" ? "page" : undefined}
              onClick={() => setActiveSection("details")}
            >
              사용자 상세 정보
            </button>
            <button
              type="button"
              className={activeSection === "notifications" ? "active" : ""}
              aria-current={activeSection === "notifications" ? "page" : undefined}
              onClick={() => setActiveSection("notifications")}
            >
              알림 정보
            </button>
          </nav>

          <main className="settings-modal-content">
            {isLoading && <div className="settings-modal-status">설정을 불러오는 중...</div>}

            {!isLoading && loadError && (
              <div className="settings-modal-status settings-modal-status--error" role="alert">
                <p>{loadError}</p>
                <button type="button" onClick={handleRetry}>다시 시도</button>
              </div>
            )}

            {!isLoading && !loadError && activeSection === "account" && (
              <section aria-labelledby="account-settings-title">
                <div className="settings-section-heading">
                  <h3 id="account-settings-title">계정 정보</h3>
                  <p>로그인한 계정의 기본 정보입니다.</p>
                </div>

                <div className="settings-field">
                  <label htmlFor="settings-email">이메일</label>
                  <input id="settings-email" type="email" value={sessionUser?.email || ""} readOnly />
                </div>

                <div className="settings-field">
                  <label htmlFor="settings-name">이름</label>
                  <input id="settings-name" type="text" value={sessionUser?.name || ""} disabled />
                  <p className="settings-field-help">이름 변경 기능은 준비 중입니다.</p>
                </div>

                <button type="button" className="settings-account-save" disabled>
                  변경사항 저장
                </button>
              </section>
            )}

            {!isLoading && !loadError && activeSection === "notifications" && (
              <section aria-labelledby="notification-settings-title">
                <div className="settings-section-heading">
                  <h3 id="notification-settings-title">알림 정보</h3>
                  <p>받고 싶은 복지 알림을 선택하세요. 변경 즉시 저장됩니다.</p>
                </div>

                <div className="settings-toggle-list">
                  <Toggle
                    id="policy-news-toggle"
                    checked={settings.policy_news_enabled}
                    disabled={settings.is_paused || savingField !== null}
                    label="새로운 복지 정책 소식 받기"
                    description={settings.is_paused ? "모든 알림이 일시 중지되어 있습니다." : "새로운 정책과 맞춤 복지 소식을 알려드려요."}
                    onChange={handlePolicyNewsChange}
                  />
                  <Toggle
                    id="notification-pause-toggle"
                    checked={settings.is_paused}
                    disabled={savingField !== null}
                    label="모든 알림 일시 중지"
                    description="기존 수신 설정은 유지한 채 모든 알림 발송을 멈춥니다."
                    onChange={handlePauseChange}
                  />
                </div>
                {saveError && <p className="settings-save-error" role="alert">{saveError}</p>}
              </section>
            )}

            {!isLoading && !loadError && activeSection === "details" && (
              <UserDetailsForm onAuthenticationError={handleAuthenticationError} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

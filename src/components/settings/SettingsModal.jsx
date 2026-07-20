import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  getMyProfile,
  patchMyProfile,
} from "../../services/mypage/myPageApi";
import {
  deletePolicySubscription,
  getNotificationSettings,
  getPolicySubscriptions,
  updatePolicyNews,
} from "../../services/subscription/subscriptionApi";
import UserDetailsForm from "./UserDetailsForm";
import "./SettingsModal.css";

const EMPTY_SETTINGS = {
  policy_news_enabled: false,
  updated_at: "",
};

function normalizeNotificationSettings(data = {}) {
  const source = data?.settings || data;
  const toBoolean = (value) =>
    value === true || value === 1 || value === "true" || value === "1";

  return {
    policy_news_enabled: toBoolean(source.policy_news_enabled),
    updated_at: source.updated_at || "",
  };
}

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

function formatDate(dateString) {
  if (!dateString) return "날짜 정보 없음";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
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
        <span
          className={`settings-switch-track ${checked ? "settings-switch-track--checked" : ""}`}
          aria-hidden="true"
        />
      </span>
    </label>
  );
}

export default function SettingsModal({ isOpen, initialSection = "account", onClose }) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [sessionUser, setSessionUser] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [isAccountDirty, setIsAccountDirty] = useState(false);
  const [isAccountSaving, setIsAccountSaving] = useState(false);
  const [accountSaveError, setAccountSaveError] = useState("");
  const [accountSaveSuccess, setAccountSaveSuccess] = useState(false);
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [isNotificationLoading, setIsNotificationLoading] = useState(true);
  const [notificationLoadError, setNotificationLoadError] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionQuery, setSubscriptionQuery] = useState("");
  const [isSubscriptionsLoading, setIsSubscriptionsLoading] = useState(true);
  const [subscriptionsError, setSubscriptionsError] = useState("");
  const [subscriptionActionError, setSubscriptionActionError] = useState("");
  const [deletingSubscriptionId, setDeletingSubscriptionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [savingField, setSavingField] = useState(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

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
      const profileData = await getMyProfile();
      setSessionUser(profileData);
      setAccountName(profileData?.name || "");
      setIsAccountDirty(false);
    } catch (error) {
      if (!(await handleAuthenticationError(error))) {
        setLoadError(getErrorMessage(error, "설정 정보를 불러오지 못했습니다."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthenticationError]);

  const loadNotificationSettings = useCallback(async () => {
    try {
      const notificationData = await getNotificationSettings();
      setSettings(normalizeNotificationSettings(notificationData));
    } catch (error) {
      if (!(await handleAuthenticationError(error))) {
        setNotificationLoadError(
          getErrorMessage(error, "알림 설정을 불러오지 못했습니다."),
        );
      }
    } finally {
      setIsNotificationLoading(false);
    }
  }, [handleAuthenticationError]);

  const loadSubscriptions = useCallback(async () => {
    try {
      const subscriptionData = await getPolicySubscriptions();
      setSubscriptions(Array.isArray(subscriptionData?.items) ? subscriptionData.items : []);
    } catch (error) {
      if (!(await handleAuthenticationError(error))) {
        setSubscriptionsError(getErrorMessage(error, "구독 정책 목록을 불러오지 못했습니다."));
      }
    } finally {
      setIsSubscriptionsLoading(false);
    }
  }, [handleAuthenticationError]);

  useEffect(() => {
    if (!isOpen) return;
    const settingsTimer = window.setTimeout(loadSettings, 0);
    const notificationTimer = window.setTimeout(loadNotificationSettings, 0);
    const subscriptionsTimer = window.setTimeout(loadSubscriptions, 0);
    return () => {
      window.clearTimeout(settingsTimer);
      window.clearTimeout(notificationTimer);
      window.clearTimeout(subscriptionsTimer);
    };
  }, [isOpen, loadNotificationSettings, loadSettings, loadSubscriptions]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError("");
    setSaveError("");
    loadSettings();
  };

  const handleNotificationRetry = () => {
    setIsNotificationLoading(true);
    setNotificationLoadError("");
    setSaveError("");
    loadNotificationSettings();
  };

  const handleSubscriptionsRetry = () => {
    setIsSubscriptionsLoading(true);
    setSubscriptionsError("");
    setSubscriptionActionError("");
    loadSubscriptions();
  };

  const handleAccountNameChange = (event) => {
    const nextName = event.target.value;
    setAccountName(nextName);
    setIsAccountDirty(nextName !== (sessionUser?.name || ""));
    setAccountSaveError("");
    setAccountSaveSuccess(false);
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = accountName.trim();
    if (!trimmedName || trimmedName.length > 100) {
      setAccountSaveError("이름은 앞뒤 공백을 제외하고 1~100자로 입력해 주세요.");
      return;
    }
    if (!isAccountDirty) return;

    setIsAccountSaving(true);
    setAccountSaveError("");
    setAccountSaveSuccess(false);

    try {
      const profileData = await patchMyProfile({ name: trimmedName });
      setSessionUser(profileData);
      setAccountName(profileData?.name || "");
      setIsAccountDirty(false);
      setAccountSaveSuccess(true);
      login({ ...user, ...profileData });
    } catch (error) {
      if (!(await handleAuthenticationError(error))) {
        setAccountSaveError(getErrorMessage(error, "계정 정보를 저장하지 못했습니다."));
      }
    } finally {
      setIsAccountSaving(false);
    }
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

  const normalizedSubscriptionQuery = subscriptionQuery.trim().toLocaleLowerCase("ko-KR");
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    if (!normalizedSubscriptionQuery) return true;
    return [subscription.service_name, subscription.service_id]
      .filter(Boolean)
      .some((value) => value.toLocaleLowerCase("ko-KR").includes(normalizedSubscriptionQuery));
  });

  const handlePolicyNewsChange = async (enabled) => {
    const previousSettings = settings;
    setSettings((current) => ({ ...current, policy_news_enabled: enabled }));
    setSavingField("policy_news");
    setSaveError("");

    try {
      const data = await updatePolicyNews(enabled);
      setSettings(normalizeNotificationSettings(data));
    } catch (error) {
      setSettings(previousSettings);
      if (!(await handleAuthenticationError(error))) {
        setSaveError(getErrorMessage(error, "정책 소식 설정을 저장하지 못했습니다."));
      }
    } finally {
      setSavingField(null);
    }
  };

  const handleUnsubscribe = async (subscription) => {
    if (deletingSubscriptionId !== null) return;

    const confirmed = window.confirm(
      `'${subscription.service_name}' 정책의 마감 알림을 해지할까요?`,
    );
    if (!confirmed) return;

    setDeletingSubscriptionId(subscription.service_id);
    setSubscriptionActionError("");
    try {
      await deletePolicySubscription(subscription.service_id);
      setSubscriptions((current) =>
        current.filter((item) => item.service_id !== subscription.service_id),
      );
    } catch (error) {
      if (!(await handleAuthenticationError(error))) {
        setSubscriptionActionError(
          getErrorMessage(error, "정책 알림을 해지하지 못했습니다."),
        );
      }
    } finally {
      setDeletingSubscriptionId(null);
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
              알림 설정
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

                <form onSubmit={handleAccountSubmit}>
                  <div className="settings-field">
                    <label htmlFor="settings-email">이메일</label>
                    <input id="settings-email" type="email" value={sessionUser?.email || ""} readOnly />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="settings-name">이름</label>
                    <input
                      id="settings-name"
                      type="text"
                      value={accountName}
                      maxLength="100"
                      disabled={isAccountSaving}
                      onChange={handleAccountNameChange}
                    />
                    <p className="settings-field-help">앞뒤 공백을 제외하고 1~100자로 입력해 주세요.</p>
                  </div>

                  {accountSaveError && (
                    <p className="settings-save-error" role="alert">{accountSaveError}</p>
                  )}
                  {accountSaveSuccess && (
                    <p className="settings-save-success" role="status">계정 정보가 저장되었습니다.</p>
                  )}

                  <button
                    type="submit"
                    className="settings-account-save"
                    disabled={!isAccountDirty || isAccountSaving}
                  >
                    {isAccountSaving ? "저장 중..." : "변경사항 저장"}
                  </button>
                </form>
              </section>
            )}

            {!isLoading && !loadError && activeSection === "notifications" && (
              <section aria-labelledby="notification-settings-title">
                <div className="settings-section-heading">
                  <h3 id="notification-settings-title">알림 설정</h3>
                  <p>받고 싶은 복지 알림을 선택하세요. 변경 즉시 저장됩니다.</p>
                </div>

                {isNotificationLoading && (
                  <div className="settings-policy-load-state">알림 설정을 불러오는 중...</div>
                )}

                {!isNotificationLoading && notificationLoadError && (
                  <div className="settings-policy-load-state settings-policy-load-state--error" role="alert">
                    <p>{notificationLoadError}</p>
                    <button type="button" onClick={handleNotificationRetry}>다시 시도</button>
                  </div>
                )}

                {!isNotificationLoading && !notificationLoadError && (
                  <>
                    <div className="settings-toggle-list">
                      <Toggle
                        id="policy-news-toggle"
                        checked={settings.policy_news_enabled}
                        disabled={savingField !== null}
                        label="새로운 복지 정책 소식 받기"
                        description={settings.policy_news_enabled ? "새로운 정책과 맞춤 복지 소식을 알려드려요." : "모든 알림이 중지되어 있습니다."}
                        onChange={handlePolicyNewsChange}
                      />
                    </div>
                    {saveError && <p className="settings-save-error" role="alert">{saveError}</p>}
                  </>
                )}

                <div className="settings-subscriptions">
                  <div className="settings-subscriptions-heading">
                    <div>
                      <h4>알림 받는 정책</h4>
                      <p>개별적으로 마감 알림을 신청한 정책입니다.</p>
                    </div>
                    <span>{isSubscriptionsLoading ? "..." : `${subscriptions.length}개`}</span>
                  </div>

                  <div className="settings-policy-search">
                    <span aria-hidden="true">⌕</span>
                    <input
                      type="search"
                      value={subscriptionQuery}
                      placeholder="정책명 또는 서비스 ID 검색"
                      aria-label="알림 받는 정책 검색"
                      disabled={isSubscriptionsLoading || Boolean(subscriptionsError)}
                      onChange={(event) => setSubscriptionQuery(event.target.value)}
                    />
                    {subscriptionQuery && (
                      <button
                        type="button"
                        aria-label="검색어 지우기"
                        onClick={() => setSubscriptionQuery("")}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="settings-policy-list" aria-live="polite">
                    {subscriptionActionError && (
                      <p className="settings-subscription-action-error" role="alert">
                        {subscriptionActionError}
                      </p>
                    )}

                    {isSubscriptionsLoading && (
                      <div className="settings-policy-load-state">구독 정책을 불러오는 중...</div>
                    )}

                    {!isSubscriptionsLoading && subscriptionsError && (
                      <div className="settings-policy-load-state settings-policy-load-state--error" role="alert">
                        <p>{subscriptionsError}</p>
                        <button type="button" onClick={handleSubscriptionsRetry}>다시 시도</button>
                      </div>
                    )}

                    {!isSubscriptionsLoading && !subscriptionsError && filteredSubscriptions.map((subscription) => (
                      <article className="settings-policy-item" key={subscription.id}>
                        <div className="settings-policy-copy">
                          <div className="settings-policy-title-row">
                            <h5>{subscription.service_name}</h5>
                            <span>알림 수신 중</span>
                          </div>
                          <p className="settings-policy-id">{subscription.service_id}</p>
                          <div className="settings-policy-meta">
                            <span>신청 마감 {formatDate(subscription.application_deadline)}</span>
                            <span>구독일 {formatDate(subscription.created_at)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="settings-policy-unsubscribe"
                          disabled={deletingSubscriptionId !== null}
                          onClick={() => handleUnsubscribe(subscription)}
                        >
                          {deletingSubscriptionId === subscription.service_id
                            ? "해지 중..."
                            : "알림 해지"}
                        </button>
                      </article>
                    ))}

                    {!isSubscriptionsLoading && !subscriptionsError && subscriptions.length === 0 && (
                      <div className="settings-policy-empty">
                        <p>아직 개별 알림을 신청한 정책이 없습니다.</p>
                        <span>채팅에서 관심 정책의 마감 알림을 신청해 보세요.</span>
                      </div>
                    )}

                    {!isSubscriptionsLoading && !subscriptionsError && subscriptions.length > 0 && filteredSubscriptions.length === 0 && (
                      <div className="settings-policy-empty">
                        <p>검색 결과가 없습니다.</p>
                        <span>다른 정책명이나 서비스 ID로 검색해 보세요.</span>
                      </div>
                    )}
                  </div>
                </div>
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

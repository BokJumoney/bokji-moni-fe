import { useState, useCallback, useRef, useEffect } from 'react';
import { postChatMessage, getSessionHistory } from '../services/chat/chatApi';
import { createMessage } from '../utils/messageUtils';

export default function useChat({ sessionId = null, initialMessages = null, pendingMessage = null, onSessionCreated } = {}) {
  const [messages, setMessages] = useState(() => (initialMessages ? [...initialMessages] : []));
  const [isLoading, setIsLoading] = useState(!!pendingMessage);
  const [historyLoading, setHistoryLoading] = useState(!initialMessages && !!sessionId);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const messagesRef = useRef(messages);
  const pendingSentRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!sessionId || initialMessages) return;
    let cancelled = false;
    getSessionHistory(sessionId)
      .then((data) => {
        if (cancelled) return;
        const items = Array.isArray(data?.items) ? data.items : [];
        setMessages(items.map((m) => createMessage(m.role, m.content)));
        setHistoryLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || '이력을 불러오지 못했습니다.');
        setHistoryLoading(false);
      });
    return () => { cancelled = true; };
  }, [sessionId, initialMessages]);

  useEffect(() => {
    if (!pendingMessage || pendingSentRef.current || sessionId) return;
    pendingSentRef.current = true;
    let cancelled = false;
    const controller = new AbortController();
    abortRef.current = controller;
    postChatMessage({ message: pendingMessage, sessionId: null })
      .then((data) => {
        if (cancelled) return;
        const assistantMsg = createMessage(
          'assistant',
          data.response,
          Array.isArray(data.sources) ? data.sources.map((s) => ({
            title: s.title || '',
            description: s.description || '',
          })) : [],
        );
        setMessages((prev) => [...prev, assistantMsg]);
        if (data.session_id) {
          onSessionCreated?.(data.session_id, [...messagesRef.current, assistantMsg]);
        }
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return;
        setError(err?.message || '알 수 없는 오류가 발생했습니다.');
        const errorMsg = createMessage(
          'assistant',
          '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          [],
        );
        setMessages((prev) => [...prev, errorMsg]);
      })
      .finally(() => {
        setIsLoading(false);
        abortRef.current = null;
      });
    return () => { cancelled = true; controller.abort(); };
  }, [pendingMessage, sessionId, onSessionCreated]);

  const sendMessage = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    setError(null);
    const trimmed = text.trim();

    const userMsg = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const data = await postChatMessage({
        message: trimmed,
        sessionId,
      });

      const assistantMsg = createMessage(
        'assistant',
        data.response,
        Array.isArray(data.sources) ? data.sources.map((s) => ({
          title: s.title || '',
          description: s.description || '',
        })) : [],
      );

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.session_id && !sessionId) {
        onSessionCreated?.(data.session_id, [...messagesRef.current, assistantMsg]);
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setError(err?.message || '알 수 없는 오류가 발생했습니다.');
      const errorMsg = createMessage(
        'assistant',
        '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        [],
      );
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [sessionId, onSessionCreated]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    historyLoading,
    error,
    sessionId,
    sendMessage,
    resetChat,
  };
}
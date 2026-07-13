import { useState, useCallback, useRef } from 'react';
import { postChatMessage } from '../services/chat/chatApi';
import { createMessage } from '../utils/messageUtils';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

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
        setSessionId(data.session_id);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
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
  }, [sessionId]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
  }, []);

  return {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    resetChat,
  };
}

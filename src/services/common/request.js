const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // 응답 본문이 없는 경우 무시
  }

  if (!response.ok) {
    const message = data?.message || data?.detail?.message || `API Error: ${response.status} ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function buildJsonRequest(path, { method = 'GET', body } = {}) {
  const options = { method };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }
  return request(path, options);
}
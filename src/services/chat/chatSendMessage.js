export const postChatRequest = async (message) => {
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // Try to parse JSON, if it's not JSON it might fail but that's standard
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('Failed to post chat request:', error);
    throw error;
  }
};

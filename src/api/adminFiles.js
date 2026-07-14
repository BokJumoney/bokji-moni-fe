const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

const parseErrorMessage = async (response) => {
  try {
    const data = await response.json();
    return data.detail ?? data.message ?? "Request failed.";
  } catch {
    return "Request failed.";
  }
};

export const uploadAdminFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(buildApiUrl("/admin/file"), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
};

export const deleteAdminFile = async (fileId) => {
  const response = await fetch(buildApiUrl(`/admin/files/${fileId}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
};

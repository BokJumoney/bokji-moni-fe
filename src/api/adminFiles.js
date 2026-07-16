import { request } from "../services/common/request";

export const uploadAdminFile = async (file, metadata = {}) => {
  const formData = new FormData();
  formData.append("file", file);

  Object.entries(metadata).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  return request("/admin/file", {
    method: "POST",
    body: formData,
    headers: {},
  });
};

export const deleteAdminFile = async (fileId) => {
  return request(`/admin/files/${fileId}`, {
    method: "DELETE",
    headers: {},
  });
};
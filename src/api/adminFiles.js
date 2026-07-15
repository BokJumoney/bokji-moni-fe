import { request } from "../services/common/request";

export const uploadAdminFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

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
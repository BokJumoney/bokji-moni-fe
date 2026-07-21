import { request } from "../services/common/request";

export const getAdminPolicies = async () => {
  return request("/admin/policies");
};

export const uploadAdminFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return request("/admin/file", {
    method: "POST",
    body: formData,
    headers: {},
  });
};

export const uploadAdminForm = async (file, serviceId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("service_id", serviceId);

  return request("/admin/form", {
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

export const policyUpdate = () => {
    return request("/admin/api_call");
}
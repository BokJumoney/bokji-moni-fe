import { request } from "../services/common/request";

export const uploadAdminFile = async (file, metadata = {}) => {
  const formData = new FormData();
  formData.append("file", file);

  Object.entries(metadata).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

   // 신청서 업로드
  if (metadata.fileCategory === "application") {
    return request("/admin/form", {
      method: "POST",
      body: formData,
      headers: {},
    });
  }

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

  //정책 id 가져오기
export const getAdminPolicies = async () => {
  return request("/admin/policies", {
    method: "GET",
  });
};
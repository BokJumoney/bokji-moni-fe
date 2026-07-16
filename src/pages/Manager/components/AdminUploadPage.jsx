import { useEffect, useRef, useState } from "react";
import upload from "../../../assets/upload.png";
import { deleteAdminFile, uploadAdminFile, getAdminPolicies } from "../../../api/adminFiles.js";
import { formatUploadedAt } from "../../../utils/dateutils.js";
import { formatFileSize, getExtension, getFileMeta } from "../../../utils/fileutils.js";
import UploadFileList from "./UploadFileList";

const MAX_FILE_SIZE = 20 * 1024 * 1024;


const AdminUploadPage = ({
  pageType,
  title,
  subtitle,
  description,
  dropDescription,
  listTitle,
  accept,
  extension,
  fileLabel,
  requiresPolicy = false,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const hasSelectedFiles = selectedFiles.length > 0;
  const selectedPolicy = policies.find((policy) => policy.id === selectedPolicyId);
  const canUpload = hasSelectedFiles && (!requiresPolicy || Boolean(selectedPolicy));

  useEffect(() => {
  if (!requiresPolicy) return;

  const fetchPolicies = async () => {
    try {
      const data = await getAdminPolicies();
      setPolicies(data);
      console.log("정책", data);
    } catch (error) {
      console.error("정책 목록 조회 실패", error);
    }
  };

  fetchPolicies();
}, [requiresPolicy]);

  const applySelectedFiles = (files) => {
    const file = Array.from(files ?? [])[0];
    if (!file) return;

    if (getExtension(file.name).toLowerCase() !== extension) {
      setSelectedFiles([]);
      setUploadError(`${fileLabel} 파일만 업로드할 수 있습니다.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFiles([]);
      setUploadError("파일 크기는 최대 20MB까지 업로드할 수 있습니다.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFiles([file]);
    setUploadError("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    applySelectedFiles(event.dataTransfer.files);
  };

  const handleUploadAreaClick = () => fileInputRef.current?.click();

  const handleUploadAreaKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleUploadAreaClick();
    }
  };

  const handleUploadStart = async () => {
    if (!canUpload) return;

    setIsUploading(true);
    setUploadError("");
    const now = new Date();
    const file = selectedFiles[0];

    try {
      const uploadedFile = await uploadAdminFile(file, {
        fileCategory: requiresPolicy ? "application" : "policy",
        policyId: selectedPolicy?.id,
        policyName: selectedPolicy?.name,
      });
      const newRow = {
        id: uploadedFile.fileId,
        name: uploadedFile.originalFilename,
        type: getExtension(uploadedFile.originalFilename),
        size: formatFileSize(uploadedFile.size),
        uploadedAt: formatUploadedAt(now),
        status: "업로드 완료",
        policyName: selectedPolicy?.name ?? "",
      };

      setUploadedFiles((current) => [newRow, ...current]);

      setSelectedFiles([]);
      setSelectedPolicyId("");
      setIsModalOpen(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    await deleteAdminFile(fileId);
    setUploadedFiles((current) => current.filter((file) => file.id !== fileId));

    if (!requiresPolicy) {
      setPolicies((current) => {
        const next = current.filter((policy) => policy.id !== fileId);
        localStorage.setItem(POLICY_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
  };

  return (
    <div className="manager-content">
      <header className="manager-header">
        <div className="page-title-container">
          <span className="page-kicker">관리자 페이지</span>
          <h1>{title}</h1>
          <span className="page-sub-title">{subtitle}</span>
        </div>
      </header>

      <main className="manager-main">
        <section className="upload-card" aria-label={title}>
          <div className="upload-card-header">
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <span className="selected-count">선택된 파일 {selectedFiles.length}개</span>
          </div>

          {requiresPolicy && (
            <div className="policy-field">
              <label htmlFor="policy-select">해당 복지 정책</label>
              <select
                id="policy-select"
                value={selectedPolicyId}
                onChange={(event) => setSelectedPolicyId(event.target.value)}
              >
                <option value="">복지 정책을 선택하세요</option>
                {policies.map((policy) => (
                  <option key={policy.id} value={policy.id}>{policy.name}</option>
                ))}
              </select>
              <span className="field-hint">
                {policies.length > 0
                  ? "업로드할 신청서가 속한 정책을 선택해 주세요."
                  : "먼저 ‘복지 정책 업로드하기’에서 정책 PDF를 등록해 주세요."}
              </span>
            </div>
          )}

          <div
            className={`file-upload-section ${isDragging ? "is-dragging" : ""} ${hasSelectedFiles ? "has-file" : ""}`}
            onClick={handleUploadAreaClick}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
            }}
            onKeyDown={handleUploadAreaKeyDown}
            role="button"
            tabIndex={0}
          >
            {isDragging ? (
              <div className="drop-guide">
                <span className="drop-guide-icon">+</span>
                <strong>여기에 놓으면 파일이 선택됩니다.</strong>
                <span>{dropDescription}</span>
              </div>
            ) : hasSelectedFiles ? (
              <div className="selected-file-list">
                {selectedFiles.map((file) => {
                  const meta = getFileMeta(file.name);
                  return (
                    <div className="selected-file" key={`${file.name}-${file.lastModified}-${file.size}`}>
                      <span className={`file-type-icon ${meta.tone}`}>{meta.label}</span>
                      <div>
                        <strong>{file.name}</strong>
                        <span>{meta.label} 파일 · {formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-upload">
                <img src={upload} className="upload-img" alt="" />
                <strong>파일을 드래그 앤 드롭하거나 클릭하여 업로드</strong>
                <span>{fileLabel} 파일만 가능 (최대 20MB)</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              id={`${pageType}-upload-input`}
              accept={accept}
              hidden
              onChange={(event) => applySelectedFiles(event.target.files)}
            />
          </div>

          {uploadError && <p className="upload-error">{uploadError}</p>}

          <div className="upload-actions">
            <button className="secondary-btn" type="button" onClick={handleUploadAreaClick}>파일 선택</button>
            <button
              className="upload-btn"
              type="button"
              disabled={!canUpload || isUploading}
              onClick={handleUploadStart}
            >
              {isUploading ? "업로드 중..." : "업로드 시작"}
            </button>
          </div>
        </section>

        <UploadFileList
          uploadedFiles={uploadedFiles}
          onDeleteFile={handleDeleteFile}
          title={listTitle}
          showPolicy={requiresPolicy}
        />
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsModalOpen(false)}>
          <div className="complete-modal" role="dialog" aria-modal="true" aria-labelledby="upload-complete-title" onClick={(event) => event.stopPropagation()}>
            <span className="complete-icon">✓</span>
            <h2 id="upload-complete-title">업로드 완료</h2>
            <p>선택한 파일이 업로드 파일 목록에 추가되었습니다.</p>
            <button className="upload-btn" type="button" onClick={() => setIsModalOpen(false)}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadPage;

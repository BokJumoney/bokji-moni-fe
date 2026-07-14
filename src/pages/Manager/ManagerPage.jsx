import { useRef, useState } from "react";
import "./ManagerPage.css";
import upload from "../../assets/upload.png";
import UploadFileList from "./components/UploadFileList"
import ManagerSidebar from "./components/ManagerSidebar";
import { deleteAdminFile, uploadAdminFile } from "../../api/adminFiles.js";
import { formatUploadedAt } from "../../utils/dateutils.js";
import { formatFileSize, getExtension, getFileMeta } from "../../utils/fileutils.js";

const initialFiles = [];

const ManagerPage = () => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const hasSelectedFiles = selectedFiles.length > 0;

  const applySelectedFiles = (files) => {
    const nextFiles = Array.from(files ?? []).slice(0, 1);
    setSelectedFiles(nextFiles);
    setUploadError("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    applySelectedFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleInputChange = (event) => {
    applySelectedFiles(event.target.files);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadStart = async () => {
    if (!hasSelectedFiles) return;

    setIsUploading(true);
    setUploadError("");

    const now = new Date();
    const file = selectedFiles[0];

    try {
      const uploadedFile = await uploadAdminFile(file);
      const newRow = {
        id: uploadedFile.fileId,
        name: uploadedFile.originalFilename,
        type: getExtension(uploadedFile.originalFilename),
        size: formatFileSize(uploadedFile.size),
        uploadedAt: formatUploadedAt(now),
        status: "업로드 완료",
      };

      setUploadedFiles((currentFiles) => [newRow, ...currentFiles]);
      setSelectedFiles([]);
      setIsModalOpen(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    await deleteAdminFile(fileId);
    setUploadedFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileId));
  };

  return (
    <section className="manager-page">
      <ManagerSidebar />

      <div className="manager-content">
        <header className="manager-header">
          <div className="page-title-container">
            <span className="page-kicker">관리자 페이지</span>
            <h1>데이터 관리</h1>
            <span className="page-sub-title">복지 정책 데이터를 업로드하고 관리할 수 있습니다.</span>
          </div>
        </header>

        <main className="manager-main">
            <section className="upload-card" aria-label="파일 업로드">
                <div className="upload-card-header">
                <div>
                    <h2>정책 데이터 업로드</h2>
                    <p>PDF, CSV, HWP 등의 파일을 추가하면 업로드 목록에 반영됩니다.</p>
                </div>
                <span className="selected-count">선택된 파일 {selectedFiles.length}개</span>
                </div>

                <div
                className={`file-upload-section ${isDragging ? "is-dragging" : ""} ${hasSelectedFiles ? "has-file" : ""}`}
                onClick={handleUploadAreaClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                role="button"
                tabIndex={0}
                >
                {isDragging ? (
                    <div className="drop-guide">
                    <span className="drop-guide-icon">+</span>
                    <strong>여기에 놓으면 파일이 선택됩니다.</strong>
                    <span>드롭해서 업로드할 정책 데이터를 추가하세요.</span>
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
                    <span>PDF, CSV, HWP 등의 파일 (최대 20MB)</span>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    id="upload-input"
                    accept=".pdf,.csv,.xls,.xlsx,.hwp,.hwpx"
                    hidden
                    onChange={handleInputChange}
                />
                </div>

                {uploadError && <p className="upload-error">{uploadError}</p>}

                <div className="upload-actions">
                <button className="secondary-btn" type="button" onClick={handleUploadAreaClick}>
                    파일 선택
                </button>
                <button
                    className="upload-btn"
                    type="button"
                    disabled={!hasSelectedFiles || isUploading}
                    onClick={handleUploadStart}
                >
                    {isUploading ? "업로드 중..." : "업로드 시작"}
                </button>
                </div>
            </section>
          
            <UploadFileList uploadedFiles={uploadedFiles} onDeleteFile={handleDeleteFile} />
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsModalOpen(false)}>
          <div className="complete-modal" role="dialog" aria-modal="true" aria-labelledby="upload-complete-title" onClick={(event) => event.stopPropagation()}>
            <span className="complete-icon">✓</span>
            <h2 id="upload-complete-title">업로드 완료</h2>
            <p>선택한 파일이 업로드 파일 목록에 추가되었습니다.</p>
            <button className="upload-btn" type="button" onClick={() => setIsModalOpen(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManagerPage;

import { useState } from "react";
import { getFileMeta } from "../../../utils/fileutils";

const UploadFileList = ({ uploadedFiles, onDeleteFile, title, showPolicy = false }) => {
    const [deletingFileId, setDeletingFileId] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const handleDelete = async (fileId) => {
        setDeletingFileId(fileId);
        setDeleteError("");

        try {
            await onDeleteFile(fileId);
        } catch (error) {
            setDeleteError(error.message);
        } finally {
            setDeletingFileId("");
        }
    };

    return (
        <section className="table-card">
            <div className="table-card-header">
              <div>
                <h2>{title}</h2>
                <p>총 {uploadedFiles.length}개의 파일이 등록되어 있습니다.</p>
                {deleteError && <p className="upload-error">{deleteError}</p>}
              </div>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>파일명</th>
                    <th>파일 형식</th>
                    {showPolicy && <th>해당 복지 정책</th>}
                    <th>크기</th>
                    <th>업로드 일시</th>
                    <th>상태</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file) => {
                    const meta = getFileMeta(file.name);

                    return (
                      <tr key={file.id}>
                        <td>
                          <div className="table-file-name">
                            <span className={`file-type-icon small ${meta.tone}`}>{meta.label}</span>
                            <span>{file.name}</span>
                          </div>
                        </td>
                        <td>{file.type}</td>
                        {showPolicy && <td>{file.policyName}</td>}
                        <td>{file.size}</td>
                        <td>{file.uploadedAt}</td>
                        <td>
                          <span className="status-badge">{file.status}</span>
                        </td>
                        <td>
                          <button className="delete-btn" type="button" disabled={deletingFileId === file.id} onClick={() => handleDelete(file.id)}>
                            {deletingFileId === file.id ? "삭제 중..." : "삭제"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {uploadedFiles.length === 0 && (
                    <tr>
                      <td className="empty-table-cell" colSpan={showPolicy ? 7 : 6}>
                        아직 업로드된 파일이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </section>)
}

export default UploadFileList;

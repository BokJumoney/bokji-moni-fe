import AdminUploadPage from "./components/AdminUploadPage";

const PolicyUploadPage = () => {
  const updatePolicy = async () => {
    const res = await fetch("http://localhost:8000/manager/api_call");
    const data = await res.json();
    console.log(data);
  };

  return (
    <AdminUploadPage
      pageType="policies"
      title="복지 정책 업로드"
      subtitle="복지 정책 PDF 데이터를 업로드하고 관리할 수 있습니다."
      description="복지 정책 원문 PDF 파일을 추가하면 업로드 목록에 반영됩니다."
      dropDescription="업로드할 복지 정책 PDF 파일을 추가하세요."
      listTitle="복지 정책 업로드 목록"
      accept=".pdf"
      extension="pdf"
      fileLabel="PDF"
      headerAction={
        <button id="api-call-btn" onClick={updatePolicy}>정책 업데이트</button>
      }
    />
  );
};

export default PolicyUploadPage;

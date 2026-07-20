import AdminUploadPage from "./components/AdminUploadPage";

const ApplicationUploadPage = () => (
  <AdminUploadPage
    pageType="applications"
    title="신청서 업로드"
    subtitle="복지 정책 신청서 HWP 파일을 업로드하고 관리할 수 있습니다."
    description="복지 정책 신청서 HWP 파일을 추가하면 업로드 목록에 반영됩니다."
    dropDescription="업로드할 복지 정책 신청서 HWP 파일을 추가하세요."
    listTitle="신청서 업로드 목록"
    accept=".hwp"
    extension="hwp"
    fileLabel="HWP"
    requiresPolicy
  />
);

export default ApplicationUploadPage;

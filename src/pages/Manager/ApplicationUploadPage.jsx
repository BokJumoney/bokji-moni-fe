import AdminUploadPage from "./components/AdminUploadPage";
import PolicyUpdateButton from "./components/PolicyUpdateButton.jsx";

const ApplicationUploadPage = () => (
  <AdminUploadPage
    requiresPolicy
    headerAction={<PolicyUpdateButton />}
  />
);

export default ApplicationUploadPage;

import LegalDocumentPage from "./LegalDocumentPage";
import { privacyPolicyDocument } from "./legalDocumentContent";

const PrivacyPolicy = () => {
  return <LegalDocumentPage document={privacyPolicyDocument} />;
};

export default PrivacyPolicy;
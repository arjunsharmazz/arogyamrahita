import LegalDocumentPage from "./LegalDocumentPage";
import { termsDocument } from "./legalDocumentContent";

const TermCondition = () => {
  return <LegalDocumentPage document={termsDocument} />;
};

export default TermCondition;

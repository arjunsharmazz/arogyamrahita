import LegalDocumentPage from "./LegalDocumentPage";
import { refundDocument } from "./legalDocumentContent";

const ReturnRefund = () => {
  return <LegalDocumentPage document={refundDocument} />;
};

export default ReturnRefund;
import LegalDocumentPage from "./LegalDocumentPage";
import { userContentDocument } from "./legalDocumentContent";

const UserContentPolicy = () => {
  return <LegalDocumentPage document={userContentDocument} />;
};

export default UserContentPolicy;
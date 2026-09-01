import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments } from './services/documentApi';
import './App.css';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDocuments() {
      try {
        const loadedDocuments = await listDocuments();
        setDocuments(loadedDocuments);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, []);

  function handleUploaded(document) {
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Arquivo local</p>
          <h1>Document Management System</h1>
        </div>
        <p className="session-note">Metadados mantidos nesta sessão</p>
      </header>

      <div className="workspace-grid">
        <section className="upload-section" aria-labelledby="upload-title">
          <h2 id="upload-title">Enviar documento</h2>
          <UploadComponent onUploaded={handleUploaded} />
        </section>

        <section aria-labelledby="documents-title">
          <h2 id="documents-title">Documentos</h2>
          {error && <p className="page-error" role="alert">{error}</p>}
          <DocumentList documents={documents} isLoading={isLoading} />
        </section>
      </div>
    </main>
  );
}

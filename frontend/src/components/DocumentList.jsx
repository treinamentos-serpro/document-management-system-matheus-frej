import DownloadButton from './DownloadButton';

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadDate(uploadedAt) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(uploadedAt));
}

export default function DocumentList({ documents, isLoading }) {
  if (isLoading) {
    return <p className="status-message">Carregando documentos...</p>;
  }

  if (documents.length === 0) {
    return <p className="empty-state">Nenhum documento enviado nesta sessão.</p>;
  }

  return (
    <div className="document-table-wrapper">
      <table className="document-table">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Proprietário</th>
            <th>Enviado em</th>
            <th>Tamanho</th>
            <th><span className="visually-hidden">Ação</span></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>
                <strong>{document.originalName}</strong>
                <span>{document.mimeType || 'Tipo não informado'}</span>
              </td>
              <td>{document.owner}</td>
              <td>{formatUploadDate(document.uploadedAt)}</td>
              <td>{formatFileSize(document.size)}</td>
              <td><DownloadButton document={document} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
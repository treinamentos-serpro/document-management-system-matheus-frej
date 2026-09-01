import { getDownloadUrl } from '../services/documentApi';

export default function DownloadButton({ document }) {
  return (
    <a
      className="download-link"
      href={getDownloadUrl(document.id)}
      download={document.originalName}
      aria-label={`Baixar ${document.originalName}`}
    >
      Baixar
    </a>
  );
}
import { useState } from 'react';
import { uploadDocument } from '../services/documentApi';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file || !owner.trim()) {
      setError('Selecione um arquivo e informe o proprietário.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const document = await uploadDocument(file, owner.trim());
      onUploaded(document);
      setFile(null);
      setOwner('');
      event.target.reset();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="owner">Proprietário</label>
        <input
          id="owner"
          name="owner"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Ex.: usuario-123"
          disabled={isSubmitting}
        />
      </div>

      <div className="field-group">
        <label htmlFor="document-file">Documento</label>
        <input
          id="document-file"
          name="file"
          type="file"
          onChange={(event) => setFile(event.target.files[0] || null)}
          disabled={isSubmitting}
        />
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}
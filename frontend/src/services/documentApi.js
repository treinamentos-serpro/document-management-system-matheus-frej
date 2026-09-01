const API_PREFIX = '/api';

async function request(path, options) {
  const response = await fetch(`${API_PREFIX}${path}`, options);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Não foi possível concluir a solicitação.');
  }

  return response;
}

export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', owner);

  const response = await request('/upload', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

export async function listDocuments() {
  const response = await request('/documents');
  return response.json();
}

export function getDownloadUrl(id) {
  return `${API_PREFIX}/documents/${encodeURIComponent(id)}/download`;
}
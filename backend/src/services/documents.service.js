const { randomUUID } = require('crypto');

function createDocument(file, owner, documentRepository) {
  const document = {
    id: randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString(),
    owner
  };

  return documentRepository.create(document);
}

function listDocuments(documentRepository) {
  return documentRepository.findAll();
}

function getDocumentById(id, documentRepository) {
  return documentRepository.findById(id);
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentById
};
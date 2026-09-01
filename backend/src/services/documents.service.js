const { randomUUID } = require('crypto');
const defaultDocumentRepository = require('../repositories/documents.repository');

function resolveRepository(documentRepository) {
  return documentRepository || defaultDocumentRepository;
}

function buildDocument(file, owner) {
  return {
    id: randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString(),
    owner
  };
}

function createDocument(file, owner, documentRepository = defaultDocumentRepository) {
  const repository = resolveRepository(documentRepository);
  const document = buildDocument(file, owner);

  return repository.create(document);
}

function listDocuments(documentRepository = defaultDocumentRepository) {
  const repository = resolveRepository(documentRepository);
  return repository.findAll();
}

function getDocumentById(id, documentRepository = defaultDocumentRepository) {
  const repository = resolveRepository(documentRepository);
  return repository.findById(id);
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentById,
  buildDocument,
  resolveRepository
};
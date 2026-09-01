const fs = require('fs');
const path = require('path');
const documentRepository = require('../repositories/documents.repository');
const documentService = require('../services/documents.service');

function createDocument(req, res) {
  const owner = req.body.owner?.trim();

  if (!req.file || !owner) {
    return res.status(400).json({ error: 'Arquivo e proprietário são obrigatórios.' });
  }

  const document = documentService.createDocument(req.file, owner, documentRepository);
  return res.status(201).json(toPublicDocument(document));
}

function listDocuments(req, res) {
  const documents = documentService.listDocuments(documentRepository);
  return res.json(documents.map(toPublicDocument));
}

function downloadDocument(req, res) {
  const document = documentService.getDocumentById(req.params.id, documentRepository);

  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  const storageDirectory = process.env.STORAGE_DIR || path.join(__dirname, '../../storage');
  const filePath = path.join(storageDirectory, document.storedName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  return res.download(filePath, document.originalName);
}

function toPublicDocument(document) {
  const { storedName, ...publicDocument } = document;
  return publicDocument;
}

module.exports = {
  createDocument,
  listDocuments,
  downloadDocument
};
const documents = [];

function create(document) {
  documents.push(document);
  return document;
}

function findAll() {
  return [...documents];
}

function findById(id) {
  return documents.find((document) => document.id === id);
}

module.exports = {
  create,
  findAll,
  findById
};
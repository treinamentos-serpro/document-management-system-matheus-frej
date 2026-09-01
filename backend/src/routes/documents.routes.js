const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documents.controller');

const router = express.Router();
const storageDirectory = process.env.STORAGE_DIR || path.join(__dirname, '../../storage');

fs.mkdirSync(storageDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: storageDirectory,
    filename: (req, file, callback) => {
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

router.post('/upload', upload.single('file'), documentController.createDocument);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', documentController.downloadDocument);

module.exports = router;
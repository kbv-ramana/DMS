const express = require('express');
const router = express.Router();
const multer = require('multer');

const protect = require('../middleware/authMiddleware');

const {
  uploadDocument,
  getMyDocuments,
  getSharedDocuments,
  searchDocuments,
  shareDocument,
  accessSharedDocument,
  updateDocument,
  deleteDocument
} = require('../controllers/documentController');

/* 🔥 Multer setup (file upload) */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

/* ✅ Upload document */
router.post('/upload', protect, upload.single('file'), uploadDocument);

/* ✅ My Files */
router.get('/my', protect, getMyDocuments);

/* ✅ Shared With Me */
router.get('/shared', protect, getSharedDocuments);

/* 🔍 Search */
router.get('/search', protect, searchDocuments);

/* 🔥 Share document (email + generate link) */
router.post('/:id/share', protect, shareDocument);

/* 🔥 Access document via share link (email verification) */
router.post('/share-link', accessSharedDocument);

/* ✏️ Update document */
router.put('/:id', protect, upload.single('file'), updateDocument);

/* ❌ Delete document */
router.delete('/:id', protect, deleteDocument);

module.exports = router;
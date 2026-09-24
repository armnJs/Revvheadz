import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readStore, writeStore } from '../store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Set up Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter validation
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPG, PNG, and WEBP files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

const router = express.Router();

// GET all files or filter by ?vehicleId=
router.get('/', (req, res) => {
  const store = readStore();
  let files = store.files || [];
  if (req.query.vehicleId) {
    files = files.filter(f => f.vehicleId === req.query.vehicleId);
  }
  res.json(files);
});

// POST upload file
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { vehicleId, docType } = req.body;
  if (!vehicleId) {
    return res.status(400).json({ error: 'vehicleId is required' });
  }

  const store = readStore();
  const fileSizeFormatted = req.file.size > 1024 * 1024
    ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(req.file.size / 1024)} KB`;

  const newFileRecord = {
    id: `doc_${Date.now()}`,
    vehicleId,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
    docType: docType || 'Document',
    fileSize: fileSizeFormatted,
    uploadDate: new Date().toISOString().split('T')[0]
  };

  store.files = [newFileRecord, ...(store.files || [])];
  writeStore(store);

  res.status(201).json(newFileRecord);
});

// DELETE file
router.delete('/:id', (req, res) => {
  const store = readStore();
  const fileRecord = (store.files || []).find(f => f.id === req.params.id);

  if (!fileRecord) {
    return res.status(404).json({ error: 'File record not found' });
  }

  // Remove file from disk if present
  const diskPath = path.join(UPLOADS_DIR, fileRecord.fileName);
  if (fs.existsSync(diskPath)) {
    try {
      fs.unlinkSync(diskPath);
    } catch (e) {
      console.warn("Could not delete file from disk:", e);
    }
  }

  store.files = store.files.filter(f => f.id !== req.params.id);
  writeStore(store);

  res.json({ message: 'File deleted successfully', id: req.params.id });
});

export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import { edgeStoreClient } from '../../lib/edgestore.js';

// Use memory storage so files are NOT saved to the local disk uploads folder
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|pdf|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'));
    }
  },
});

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'No file uploaded' });
    }

    const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase() || 'png';
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

    const isImage = req.file.mimetype.startsWith('image/');
    const bucket = isImage ? edgeStoreClient.publicImages : edgeStoreClient.publicFiles;

    const result = await bucket.upload({
      content: {
        blob,
        extension: ext,
      },
    });

    res.status(200).json({
      status: true,
      message: 'File uploaded to Edge Store successfully',
      url: result.url,
      filename: req.file.originalname,
    });
  } catch (error) {
    console.error('Edge Store upload error:', error);
    res.status(500).json({ status: false, message: error.message || 'Edge Store upload failed' });
  }
});

export default router;

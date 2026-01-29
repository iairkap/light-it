import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

/**
 * Multer configuration for file uploads
 *
 * NOTE: This stores files locally on the filesystem.
 * For production, consider using cloud storage (AWS S3, Google Cloud Storage, etc.)
 */
export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      // Generar nombre único: timestamp-randomstring.jpg
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `patient-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Validar ESTRICTAMENTE que sea image/jpeg
    if (file.mimetype !== 'image/jpeg') {
      return callback(
        new BadRequestException('Only JPEG images are allowed'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
};

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { AppError } from '../utils/appError.js';

// Lazy Cloudinary configuration — ensures env vars are loaded before use
let cloudinaryConfigured = false;

const ensureCloudinaryConfig = () => {
  if (!cloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinaryConfigured = true;
  }
};

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    ensureCloudinaryConfig();
    const nameWithoutExt = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
    return {
      folder: 'taskmanager/attachments',
      public_id: `${Date.now()}_${nameWithoutExt}`,
      resource_type: 'auto',
    };
  },
});

// File filter for security
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Allowed: Images, PDF, Word documents, Text files', 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
  },
});

// Helper to delete attachment from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    ensureCloudinaryConfig();
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary:`, error);
  }
};

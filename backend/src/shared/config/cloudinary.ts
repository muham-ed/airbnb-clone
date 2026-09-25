import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isAvatar = req.query.type === 'avatar';
    const folder = isAvatar ? 'airbnb-clone/avatars' : 'airbnb-clone/listings';
    const prefix = isAvatar ? 'avatar' : 'listing';
    const cleanName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');

    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${prefix}-${Date.now()}-${cleanName}`,
    };
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max limit per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('مسموح فقط برفع ملفات الصور (JPG, PNG, WEBP)'));
    }
  },
});

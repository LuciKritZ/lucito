import multer, { diskStorage } from 'multer';

export const imageStorage = diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'src/images');
  },
  filename: function (_req, file, cb) {
    cb(null, `${new Date().toISOString()}_${file.originalname}`);
  },
});

export const imagesMulter = multer({ storage: imageStorage }).array(
  'images',
  10
);

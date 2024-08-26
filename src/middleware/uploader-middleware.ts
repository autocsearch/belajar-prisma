import multer from "multer";
import path from "path";

export function uploader() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    }, //tujuan tempat penyimpanan
    filename: (req, file, cb) => {
      const uniquesuffix = `images-${Date.now().toString().slice(-7)}`;
      cb(null, uniquesuffix + path.extname(file.originalname));
    },
  });

  return multer({ storage });
}

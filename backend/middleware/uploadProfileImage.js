import multer from 'multer';
import path from 'path';
import fs from 'fs';

if (!fs.existsSync("./public")) {
    fs.mkdirSync("./public", { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const uploadProfileImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter
});

export default uploadProfileImage;

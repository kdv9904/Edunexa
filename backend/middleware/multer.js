import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Ensure public directory exists
if (!fs.existsSync("./public")) {
    fs.mkdirSync("./public", { recursive: true });
}

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public")
    },
    filename: (req, file, cb) => {
        // Create unique filename to avoid conflicts
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
})

// **IMPORTANT: Increased file size limit**
const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB - MAKE SURE THIS IS UPDATED
    },
    fileFilter: (req, file, cb) => {
        // Check if video file
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

export default upload;
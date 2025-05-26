// src/middleware/uploadMiddleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Configures disk storage for Multer.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

/**
 * Filters incoming files based on their field name and MIME type.
 */
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname === "cvFile") {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid CV file type. Only PDF, DOC, DOCX are allowed!"
        ) as any,
        false
      );
    }
  } else if (file.fieldname === "profilePictureFile") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid profile picture file type. Only JPEG, PNG are allowed!"
        ) as any,
        false
      );
    }
  }
  // No else if for 'coverLetterFile' because it's now text-based.
  else {
    cb(new Error("Unexpected field name for file upload.") as any, false);
  }
};

/**
 * Initializes Multer with the defined storage, file filter, and file size limits.
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
  },
});

/**
 * Middleware to handle multiple file uploads for specific field names.
 * Removed 'coverLetterFile' as it's now a text field.
 */
export const uploadApplicationFiles = upload.fields([
  { name: "cvFile", maxCount: 1 },
  { name: "profilePictureFile", maxCount: 1 },
  // REMOVED: { name: "coverLetterFile", maxCount: 1 },
]);

// Export the 'upload' instance for use directly in routes
export default upload; // Added this export for direct use in routes

import express, { Request, Response } from "express";
import multer from "multer";
import { storagePut } from "./storage";
import { randomBytes } from "crypto";

export const uploadRouter = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * POST /api/upload
 * Upload a file to S3 storage
 */
uploadRouter.post("/upload", upload.single("file"), async (req: any, res: Response) => {
  try {
    // Check if file is in request
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const file = req.file;

    // Generate unique file key
    const randomSuffix = randomBytes(8).toString("hex");
    const fileKey = `stakeholder-photos/${Date.now()}-${randomSuffix}-${file.originalname}`;

    // Upload to S3
    const { url } = await storagePut(fileKey, file.buffer, file.mimetype);

    return res.json({
      url,
      key: fileKey,
      filename: file.originalname,
      size: file.size,
    });
  } catch (error) {
    console.error("[Upload Error]", error);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default uploadRouter;

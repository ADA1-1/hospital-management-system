import express, { Request, Response } from "express";
import { storagePut } from "./storage";
import { randomBytes } from "crypto";

export const uploadRouter = express.Router();

// Middleware to parse multipart form data
uploadRouter.use(express.json());

/**
 * POST /api/upload
 * Upload a file to S3 storage
 */
uploadRouter.post("/upload", async (req: any, res: Response) => {
  try {
    // Check if file is in request
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const file = req.file;
    
    // Validate file type
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Only image files are allowed" });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "File size must be less than 5MB" });
    }

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

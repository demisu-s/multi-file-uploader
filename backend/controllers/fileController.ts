interface UploadApiResponse {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    created_at: string;
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    original_filename: string;
  }
  
  import { Request, Response } from 'express';
  import multer, { MulterError } from 'multer';
  import path from 'path';
  import { v2 as cloudinary } from 'cloudinary';
  import dotenv from 'dotenv';
dotenv.config();
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_KEY_SECRET
  });
  
  const fileUploaderTable = require('../models').fileUploaders;
  
  // Multer storage configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads'); // Destination folder
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  
  // Multer upload configuration
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 100 }, // 100MB
    fileFilter: function (req, file, cb) {
      // Define the allowed MIME types
      const allowedMimeTypes = ['application/pdf', 'audio/mpeg', 'video/mp4', 'image/jpeg', 'image/png'];
  
      // Check if the uploaded file's MIME type is in the allowed list
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Allow the file to be uploaded
      } else {
        cb(null, false); // Reject the file
      }
    }
  }).array("file", 10);
  
  export const createFile = async (req: Request, res: Response) => {
    try {
      upload(req, res, async (err: MulterError | string | null) => {
        if (err) {
          return res.status(400).json({ error: err instanceof MulterError ? err.message : 'Invalid file type. Only PDF, MP3, MP4, JPG, and PNG files are allowed.' });
        }
  
        const { description } = req.body;
  
        if (!req.files) {
          return res.status(400).json({ error: 'No files uploaded' });
        }
  
        // Upload file to Cloudinary
        const filePromises = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => {
          return cloudinary.uploader.upload(file.path) as Promise<UploadApiResponse>;
        });
        const cloudinaryResponses = await Promise.all(filePromises);
  
        // Extract Cloudinary URLs
        const fileLinks = cloudinaryResponses.map((response: UploadApiResponse) => response.url);
  
        // Create file records in the database
        const fileRecords = fileLinks.map((link: string) => ({
          description: description,
          link: link
        }));
        const createdFiles = await fileUploaderTable.bulkCreate(fileRecords);
  
        // Respond with success message and file records
        res.status(201).json({
          status: true,
          message: "Files uploaded successfully",
          files: createdFiles
        });
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({
        status: false,
        message: "Failed to upload files. Please try again later."
      });
    }
  };
  
  
  
  

  export const getAllFile = async (req: Request, res: Response) => {
    try {
      const files = await fileUploaderTable.findAll();
      if (files.length > 0) {
        res.json({
          status: true,
          message: "Files found",
          files: files
        });
      } else {
        res.json({
          status: false,
          message: "No files found"
        });
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch files. Please try again later."
      });
    }
  };

export const getSingleFile = async (req: Request, res: Response) => {
    try {
        const file = await fileUploaderTable.findOne({
            where: {
                id: req.params.id
            }
        });

        if (file) {
            res.json({
                status: true,
                message: "File found",
                files: file
            });
        } else {
            res.json({
                status: false,
                message: "File not found"
            });
        }
    } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch file. Please try again later."
        });
    }
};

export const updateFile = async (req: Request, res: Response) => {
    try {
        const filesUpdate = await fileUploaderTable.findOne({
            where: {
                id: req.params.id
            }
        });

        if (filesUpdate) {
            await fileUploaderTable.update({
                description: req.body.description,
                link: req.body.link,
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.json({
                status: true,
                message: "File updated successfully"
            });
        } else {
            res.json({
                status: false,
                message: "No file found"
            });
        }
    } catch (error) {
        console.error("Error updating file:", error);
        res.status(500).json({
            status: false,
            message: "Failed to update file"
        });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const files = await fileUploaderTable.findOne({
            where: {
                id: req.params.id
            }
        });

        if (files) {
            await fileUploaderTable.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.json({
                status: true,
                message: "File deleted successfully"
            });
        } else {
            res.json({
                status: false,
                message: "File not found"
            });
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete file"
        });
    }
};

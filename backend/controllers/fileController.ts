import { Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import path from 'path';
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
}).array("fileLink", 10);

export const createFile = async (req: Request, res: Response) => {
    try {
        upload(req, res, async (err: MulterError | string | null) => { // Adjusted the type of err
            if (err) {
                return res.status(400).json({ error: err instanceof MulterError ? err.message : 'Invalid file type. Only PDF, MP3, MP4, JPG, and PNG files are allowed.' });
            }

            const { description } = req.body;
            const fileLink = req.file?.path;

            // Create file record in the database
            const fileRecord = {
                description: description,
                link: fileLink
            };
            const createdFile = await fileUploaderTable.create(fileRecord);

            // Respond with success message and file record
            res.status(201).json({
                status: true,
                message: "File uploaded successfully",
                file: createdFile
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
// export const createFile = async (req: Request, res: Response) => {
//     try {
//         upload('file')(req, res, async (err: any) => { // Adjusted the type of err
//             if (err) {
//                 return res.status(400).json({ error: err instanceof MulterError ? err.message : 'Invalid file type. Only PDF, MP3, MP4, JPG, and PNG files are allowed.' });
//             }

//             const { description } = req.body;
//             const fileLink = req.file.path;

//             // Create file record in the database
//             const fileRecord = {
//                 description: description,
//                 link: fileLink
//             };
//             const createdFile = await fileUploaderTable.create(fileRecord);

//             // Respond with success message and file record
//             res.status(201).json({
//                 status: true,
//                 message: "File uploaded successfully",
//                 file: createdFile
//             });
//         });
//     } catch (error) {
//         console.error("Error uploading file:", error);
//         res.status(500).json({
//             status: false,
//             message: "Failed to upload file. Please try again later."
//         });
//     }
// };

// Other controller functions remain unchanged


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

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.updateFile = exports.getSingleFile = exports.getAllFile = exports.createFile = void 0;
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_KEY_SECRET
});
const fileUploaderTable = require('../models').fileUploaders;
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    }
});
// Multer upload configuration
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 100 }, // 100MB
    fileFilter: function (req, file, cb) {
        // Define the allowed MIME types
        const allowedMimeTypes = ['application/pdf', 'audio/mpeg', 'video/mp4', 'image/jpeg', 'image/png'];
        // Check if the uploaded file's MIME type is in the allowed list
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Allow the file to be uploaded
        }
        else {
            cb(null, false); // Reject the file
        }
    }
}).array("file", 10);
const createFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json({ error: err instanceof multer_1.MulterError ? err.message : 'Invalid file type. Only PDF, MP3, MP4, JPG, and PNG files are allowed.' });
            }
            const { description } = req.body;
            if (!req.files) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
            // Upload file to Cloudinary
            const filePromises = req.files.map((file) => {
                return cloudinary_1.v2.uploader.upload(file.path);
            });
            const cloudinaryResponses = yield Promise.all(filePromises);
            // Extract Cloudinary URLs
            const fileLinks = cloudinaryResponses.map((response) => response.url);
            // Create file records in the database
            const fileRecords = fileLinks.map((link) => ({
                description: description,
                link: link
            }));
            const createdFiles = yield fileUploaderTable.bulkCreate(fileRecords);
            // Respond with success message and file records
            res.status(201).json({
                status: true,
                message: "Files uploaded successfully",
                files: createdFiles
            });
        }));
    }
    catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({
            status: false,
            message: "Failed to upload files. Please try again later."
        });
    }
});
exports.createFile = createFile;
const getAllFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield fileUploaderTable.findAll();
        if (files.length > 0) {
            res.json({
                status: true,
                message: "Files found",
                files: files
            });
        }
        else {
            res.json({
                status: false,
                message: "No files found"
            });
        }
    }
    catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch files. Please try again later."
        });
    }
});
exports.getAllFile = getAllFile;
const getSingleFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = yield fileUploaderTable.findOne({
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
        }
        else {
            res.json({
                status: false,
                message: "File not found"
            });
        }
    }
    catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch file. Please try again later."
        });
    }
});
exports.getSingleFile = getSingleFile;
const updateFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filesUpdate = yield fileUploaderTable.findOne({
            where: {
                id: req.params.id
            }
        });
        if (filesUpdate) {
            yield fileUploaderTable.update({
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
        }
        else {
            res.json({
                status: false,
                message: "No file found"
            });
        }
    }
    catch (error) {
        console.error("Error updating file:", error);
        res.status(500).json({
            status: false,
            message: "Failed to update file"
        });
    }
});
exports.updateFile = updateFile;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield fileUploaderTable.findOne({
            where: {
                id: req.params.id
            }
        });
        if (files) {
            yield fileUploaderTable.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.json({
                status: true,
                message: "File deleted successfully"
            });
        }
        else {
            res.json({
                status: false,
                message: "File not found"
            });
        }
    }
    catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete file"
        });
    }
});
exports.deleteFile = deleteFile;

import express from 'express';
import { createFile, getAllFile, getSingleFile, updateFile, deleteFile } from '../controllers/fileController';

const router = express.Router();

router.post("/", createFile);
router.get("/", getAllFile);
router.get("/singleFile/:id", getSingleFile);
router.put("/update/:id", updateFile);
router.delete("/deleteFile/:id", deleteFile);

export default router;

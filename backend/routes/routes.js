"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileController_1 = require("../controllers/fileController");
const router = express_1.default.Router();
router.post("/", fileController_1.createFile);
router.get("/", fileController_1.getAllFile);
router.get("/singleFile/:id", fileController_1.getSingleFile);
router.put("/update/:id", fileController_1.updateFile);
router.delete("/deleteFile/:id", fileController_1.deleteFile);
exports.default = router;

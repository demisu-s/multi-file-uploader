"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 3003;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // You need to call cors as a function
app.use('/api/files', routes_1.default);
app.listen(port, () => {
    console.log(`Server Started at ${port}`);
});

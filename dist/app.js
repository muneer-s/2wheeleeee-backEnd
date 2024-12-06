"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoDB_1 = __importDefault(require("./database/mongoDB"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
dotenv_1.default.config();
(0, mongoDB_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// Routes 
app.use('/api/user', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

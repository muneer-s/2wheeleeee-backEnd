"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoDB_1 = __importDefault(require("./database/mongoDB"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const hostRoutes_1 = __importDefault(require("./routes/hostRoutes"));
const otpRoutes_1 = __importDefault(require("./routes/otpRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const offerRoutes_1 = __importDefault(require("./routes/offerRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const socket_1 = require("./socket/socket");
const feedBackRoutes_1 = __importDefault(require("./routes/feedBackRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
(0, mongoDB_1.default)();
//middleware
socket_1.app.use((0, cors_1.default)(corsOptions));
socket_1.app.use(express_1.default.json());
socket_1.app.use(express_1.default.urlencoded({ extended: false }));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.default.info(message.trim()),
    },
}));
// Routes 
socket_1.app.use('/api/user', userRoutes_1.default);
socket_1.app.use('/api/admin', adminRoutes_1.default);
socket_1.app.use('/api/bike', hostRoutes_1.default);
socket_1.app.use('/api/otp', otpRoutes_1.default);
socket_1.app.use('/api/order', orderRoutes_1.default);
socket_1.app.use('/api/wallet', walletRoutes_1.default);
socket_1.app.use('/api/offer', offerRoutes_1.default);
socket_1.app.use('/api/feedback', feedBackRoutes_1.default);
socket_1.app.use('/api/chat', chatRoutes_1.default);
socket_1.app.use('/api/chat', messageRoutes_1.default);
const port = process.env.PORT || 2000;
socket_1.server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

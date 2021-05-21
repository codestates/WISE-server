"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const service_1 = __importDefault(require("./routes/service"));
const review_1 = __importDefault(require("./routes/review"));
const reservatoin_1 = __importDefault(require("./routes/reservatoin"));
dotenv_1.default.config();
const app = express_1.default();
mongoose_1.default.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
mongoose_1.default.connection
    .once('open', () => {
    console.log('MONGODB is connected');
})
    .on('error', (err) => {
    console.log(`MONGODB connection error: ${err}`);
});
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(cors_1.default({
    origin: true,
    credentials: true,
}));
app.use(cookie_parser_1.default());
// routes
app.use('/api/v1', auth_1.default);
app.use('/api/v1', user_1.default);
app.use('/api/v1', service_1.default);
app.use('/api/v1', review_1.default);
app.use('/api/v1', reservatoin_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});

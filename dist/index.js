"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(cors_1.default({
    origin: true,
    credentials: true,
}));
app.use(cookie_parser_1.default());
app.get('/', (req, res) => {
    res.json({ greeting: 'Hello World' });
});
const myArray = [1, 2, 3, 4, 5];
console.log(...myArray);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./errors/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const authrouter_1 = __importDefault(require("./router/authrouter"));
const exrouter_1 = __importDefault(require("./router/exrouter"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const projectrouter_1 = __importDefault(require("./router/projectrouter"));
const callo_router_1 = __importDefault(require("./router/callo.router"));
const concatrouter_1 = __importDefault(require("./router/concatrouter"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, '..', '.env')
});
let app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)());
app.use('/public/images', express_1.default.static(path_1.default.join(__dirname, '..', 'public', 'images')));
app.use('/auth', authrouter_1.default);
app.use('/ex', exrouter_1.default);
app.use('/proj', projectrouter_1.default);
app.use("/cal", callo_router_1.default);
app.use("/concat", concatrouter_1.default);
app.use(errorHandler_1.default.error404);
app.use(errorHandler_1.default.unexceptionError);
let port = process.env.PORT;
app.listen(port, () => {
    console.log(`project ruuning on port ${port}`);
});

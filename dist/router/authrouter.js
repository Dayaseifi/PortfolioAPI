"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const authchecker_1 = __importDefault(require("../middleware/authchecker"));
let authRouter = (0, express_1.Router)();
authRouter.post('/send', auth_controller_1.default.sendOTP);
authRouter.post('/signin', auth_controller_1.default.SignIn);
authRouter.post('/refresh', auth_controller_1.default.SignIn);
authRouter.get('/test', authchecker_1.default, (req, res) => console.log(3));
exports.default = authRouter;

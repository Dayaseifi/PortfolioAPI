"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expertise_controller_1 = __importDefault(require("../controller/expertise.controller"));
const authchecker_1 = __importDefault(require("../middleware/authchecker"));
let exRouter = (0, express_1.Router)();
exRouter.post('/create', authchecker_1.default, expertise_controller_1.default.create);
exRouter.put('/update/:id', authchecker_1.default, expertise_controller_1.default.update);
exRouter.delete('/delete/:id', authchecker_1.default, expertise_controller_1.default.delete);
exports.default = exRouter;

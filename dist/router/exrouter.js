"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expertise_controller_1 = __importDefault(require("../controller/expertise.controller"));
let exRouter = (0, express_1.Router)();
exRouter.post('/create', expertise_controller_1.default.create);
exRouter.put('/update/:id', expertise_controller_1.default.update);
exRouter.delete('/delete/:id', expertise_controller_1.default.delete);
exRouter.get('/', expertise_controller_1.default.getAll);
exports.default = exRouter;

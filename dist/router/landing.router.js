"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const landing_controller_1 = __importDefault(require("../controller/landing.controller"));
let mainRouter = (0, express_1.Router)();
mainRouter.get("/", landing_controller_1.default);
exports.default = mainRouter;

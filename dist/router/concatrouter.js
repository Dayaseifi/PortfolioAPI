"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const concat_controller_1 = __importDefault(require("../controller/concat.controller"));
let concatRouter = (0, express_1.Router)();
concatRouter.post("/create", concat_controller_1.default.create);
exports.default = concatRouter;

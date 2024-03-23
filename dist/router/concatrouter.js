"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const concat_controller_1 = __importDefault(require("../controller/concat.controller"));
let concatRouter = (0, express_1.Router)();
concatRouter.get("/all", concat_controller_1.default.getAll);
concatRouter.get("/get/:id", concat_controller_1.default.getById);
concatRouter.post("/create", concat_controller_1.default.create);
concatRouter.delete("/delete/:id", concat_controller_1.default.delete);
exports.default = concatRouter;

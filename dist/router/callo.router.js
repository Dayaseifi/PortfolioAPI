"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Collaboration_controller_1 = __importDefault(require("../controller/Collaboration.controller"));
let callRouter = (0, express_1.Router)();
callRouter.get("/", Collaboration_controller_1.default.getAll);
callRouter.post("/create", Collaboration_controller_1.default.create);
exports.default = callRouter;
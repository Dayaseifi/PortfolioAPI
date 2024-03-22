"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Collaboration_controller_1 = __importDefault(require("../controller/Collaboration.controller"));
let callRouter = (0, express_1.Router)();
callRouter.get("/", Collaboration_controller_1.default.getAll);
callRouter.get("/:id", Collaboration_controller_1.default.getOne);
callRouter.post("/create", Collaboration_controller_1.default.create);
callRouter.put("/edit/:id", Collaboration_controller_1.default.edit);
callRouter.delete("/delete/:id", Collaboration_controller_1.default.delete);
exports.default = callRouter;

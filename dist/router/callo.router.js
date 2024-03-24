"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Collaboration_controller_1 = __importDefault(require("../controller/Collaboration.controller"));
const authchecker_1 = __importDefault(require("../middleware/authchecker"));
let callRouter = (0, express_1.Router)();
callRouter.get("/", Collaboration_controller_1.default.getAll);
callRouter.get("/:id", authchecker_1.default, Collaboration_controller_1.default.getOne);
callRouter.post("/create", authchecker_1.default, Collaboration_controller_1.default.create);
callRouter.put("/edit/:id", authchecker_1.default, Collaboration_controller_1.default.edit);
callRouter.patch("/edit/image/:id", authchecker_1.default, Collaboration_controller_1.default.addOrchangeImage);
callRouter.delete("/delete/:id", authchecker_1.default, Collaboration_controller_1.default.delete);
exports.default = callRouter;

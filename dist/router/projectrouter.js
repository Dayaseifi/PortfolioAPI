"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = __importDefault(require("../controller/project.controller"));
const project_controller_2 = __importDefault(require("../controller/project.controller"));
const Projectrouter = (0, express_1.Router)();
Projectrouter.post('/create', project_controller_1.default.create);
Projectrouter.put('/edit/:id', project_controller_1.default.edit);
Projectrouter.put('/change/image', project_controller_1.default.changeImage);
Projectrouter.delete('/delete/:id', project_controller_1.default.delete);
Projectrouter.get('/:id', project_controller_2.default.getById);
Projectrouter.get('/image/:id', project_controller_2.default.getImages);
Projectrouter.get('/', project_controller_1.default.getAll);
exports.default = Projectrouter;

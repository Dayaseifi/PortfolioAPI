"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function landingController(req, res, next) {
    try {
        let colls = await axios_1.default.get("http://localhost:5000/concat/all");
        let projects = await axios_1.default.get("http://localhost:5000/proj");
        let ex = await axios_1.default.get("http://localhost:5000/ex");
        let concats = await axios_1.default.get("http://localhost:5000/concat/all");
        return res.status(200).json({
            colls: colls.data,
            projects: projects.data,
            ex: ex.data,
            concats: concats.data
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
exports.default = landingController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
let prisma = new client_1.PrismaClient();
class ProjectController {
    async create(req, res, next) {
        try {
            let { name, description, technology } = req.body;
            if (!req.files?.images) {
                return res.status(404).json({
                    message: "Project should has image",
                    success: false
                });
            }
            let project = await prisma.project.findFirst({
                where: {
                    name
                }
            });
            if (project) {
                return res.status(400).json({
                    success: false,
                    message: "This name project is available at system."
                });
            }
            let images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            let promises = images.map((file) => {
                return new Promise((resolve, reject) => {
                    (0, sharp_1.default)(file.data)
                        .resize(200, 200)
                        .toFile(path_1.default.join(__dirname, '..', '..', 'public', 'images', file.name), (err, info) => {
                        if (err) {
                            next(err);
                        }
                        else {
                            resolve({ fileName: file.name });
                        }
                    });
                });
            });
            let imagesInfo = await Promise.all(promises);
            let madeProject = await prisma.project.create({
                data: {
                    description,
                    name,
                    technologies: technology
                }
            });
            let imagePromises = imagesInfo.map((file) => {
                return new Promise(async (resolve, reject) => {
                    await prisma.image.create({
                        data: {
                            alt: 'Project photo',
                            src: path_1.default.join(__dirname, '..', '..', 'public', 'images', file.fileName),
                            projectID: madeProject.ID
                        }
                    });
                    resolve(true);
                });
            });
            await Promise.all(imagePromises);
            return res.status(201).json({
                success: true,
                message: 'Done succesfully'
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = new ProjectController;

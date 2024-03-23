"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const sharp_1 = __importDefault(require("sharp"));
const RandomFileNameGenerator_1 = require("../utils/RandomFileNameGenerator");
const path_1 = __importDefault(require("path"));
let prisma = new client_1.PrismaClient();
class ConcarController {
    async create(req, res, next) {
        try {
            let { title, link } = req.body;
            let concat = await prisma.concat.findFirst({
                where: {
                    OR: [
                        { title },
                        { link }
                    ]
                }
            });
            if (concat) {
                return res.status(400).json({
                    success: false,
                    message: "this concat is available"
                });
            }
            if (req.files?.logo) {
                let logo = Array.isArray(req.files?.logo) ? req.files?.logo[0] : req.files?.logo;
                let newConcat = await prisma.concat.create({
                    data: {
                        title, link
                    }
                });
                let saveFileName = (0, RandomFileNameGenerator_1.fileNameGenerator)(logo.name);
                (0, sharp_1.default)(logo.data)
                    .resize(200, 200)
                    .toFile(path_1.default.join(__dirname, '..', '..', 'public', 'images', saveFileName), async (err, info) => {
                    if (err) {
                        await prisma.concat.delete({
                            where: {
                                ID: newConcat.ID
                            }
                        });
                        return next(err);
                    }
                });
                await prisma.logo.create({
                    data: {
                        alt: `${title} alt`,
                        fileName: saveFileName,
                        collaborationID: newConcat.ID,
                        src: path_1.default.join(__dirname, '..', '..', 'public', 'images', saveFileName)
                    }
                });
                return res.status(201).json({
                    success: true,
                    message: "link creation done succesfully"
                });
            }
            else {
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ConcarController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const sharp_1 = __importDefault(require("sharp"));
const RandomFileNameGenerator_1 = require("../utils/RandomFileNameGenerator");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
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
                        concatID: newConcat.ID,
                        src: path_1.default.join(__dirname, '..', '..', 'public', 'images', saveFileName)
                    }
                });
                return res.status(201).json({
                    success: true,
                    message: "link creation done succesfully"
                });
            }
            else {
                let newConcat = await prisma.concat.create({
                    data: {
                        title, link
                    }
                });
                return res.status(201).json({
                    success: true,
                    message: "link creation done succesfully"
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const concats = await prisma.concat.findMany({
                include: {
                    logo: {
                        select: {
                            alt: true,
                            fileName: true,
                            ID: true
                        }
                    }
                }
            });
            res.status(200).json({ concats, success: true });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        const { id } = req.params;
        try {
            const concat = await prisma.concat.findUnique({
                where: {
                    ID: parseInt(id)
                },
                include: {
                    logo: {
                        select: {
                            alt: true,
                            fileName: true,
                            ID: true
                        }
                    }
                }
            });
            if (!concat) {
                return res.status(404).json({
                    success: false,
                    message: "Concat not found"
                });
            }
            res.status(200).json({ concat, success: true, });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        const { id } = req.params;
        try {
            // Check if Concat exists
            const concat = await prisma.concat.findUnique({
                where: {
                    ID: parseInt(id)
                },
                include: {
                    logo: true // Fetch associated logo
                }
            });
            if (!concat) {
                return res.status(404).json({
                    success: false,
                    message: "Concat not found"
                });
            }
            // Delete associated logo if it exists
            if (concat.logo) {
                await prisma.logo.delete({
                    where: {
                        ID: concat.logo.ID
                    }
                });
                // Remove logo file from filesystem
                const logoFilePath = concat.logo.src;
                // Add logic to delete the file using fs.unlink or similar
                (0, fs_1.unlink)(logoFilePath, (err) => {
                    if (err) {
                        return next(err);
                    }
                });
                // Now, delete the Concat
                const deletedConcat = await prisma.concat.delete({
                    where: {
                        ID: parseInt(id)
                    }
                });
                res.status(200).json({
                    message: "delete done succesfully",
                    success: false
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async edit(req, res, next) {
        let { title, link } = req.body;
        try {
            let id = req.params.id;
            const concatToUpdate = await prisma.concat.findUnique({
                where: {
                    ID: +id
                },
                include: {
                    logo: true // Fetch associated logo if it exists
                }
            });
            if (!concatToUpdate) {
                return res.status(404).json({
                    success: false,
                    message: "Concat not found"
                });
            }
            if (req.files?.logo) {
                // If a new logo is uploaded
                const newLogo = Array.isArray(req.files.logo) ? req.files.logo[0] : req.files.logo;
                let saveFileName = (0, RandomFileNameGenerator_1.fileNameGenerator)(newLogo.name);
                let source = path_1.default.join(__dirname, '..', '..', 'public', 'images', saveFileName);
                (0, sharp_1.default)(newLogo.data)
                    .resize(200, 200)
                    .toFile(source, (err, info) => {
                    if (err) {
                        return next(err);
                    }
                });
                console.log(concatToUpdate.logo);
                if (concatToUpdate.logo) {
                    await prisma.logo.update({
                        where: {
                            concatID: +id
                        },
                        data: {
                            alt: `${title} logo`,
                            fileName: saveFileName,
                            src: source
                        }
                    });
                    await prisma.concat.update({
                        where: {
                            ID: +id
                        },
                        data: {
                            link,
                            title
                        }
                    });
                    (0, fs_1.unlink)(concatToUpdate.logo.src, (err) => {
                        if (err) {
                            return next(err);
                        }
                    });
                    return res.status(200).json({
                        success: true,
                        message: "Update done succesfully"
                    });
                }
                else {
                    await prisma.logo.create({
                        data: {
                            alt: `${title} logo`,
                            fileName: saveFileName,
                            src: source
                        }
                    });
                    await prisma.concat.update({
                        where: {
                            ID: +id
                        },
                        data: {
                            link,
                            title,
                        }
                    });
                    return res.status(200).json({
                        success: true,
                        message: "Update done succesfully"
                    });
                }
            }
            else {
                await prisma.concat.update({
                    where: {
                        ID: +id
                    },
                    data: {
                        link,
                        title
                    }
                });
                return res.status(200).json({
                    success: true,
                    message: "Update done succesfully"
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = new ConcarController;

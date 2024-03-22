"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timecontroller_1 = require("../utils/timecontroller");
const client_1 = require("@prisma/client");
const sharp_1 = __importDefault(require("sharp"));
const RandomFileNameGenerator_1 = require("../utils/RandomFileNameGenerator");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let prisma = new client_1.PrismaClient();
class callobrationController {
    async create(req, res, next) {
        let { name, position, startMonth, startyear, endMonth, endYear, url } = req.body;
        let logo = req.files?.logo;
        let timeControllerChecker = (0, timecontroller_1.timeController)(parseInt(startyear), parseInt(endYear), parseInt(startMonth), parseInt(endMonth));
        if (!timeControllerChecker.success) {
            return res.status(400).json({
                success: false,
                messasge: timeControllerChecker.Problem == "Now" ? "You have problem at setting time" : "time can not be in feature"
            });
        }
        let callobration = await prisma.collaborations.findFirst({
            where: {
                name
            }
        });
        if (callobration) {
            return res.status(400).json({
                success: false,
                messasge: "this name is existing on system"
            });
        }
        logo = Array.isArray(logo) ? logo[0] : logo;
        if (logo) {
            let saveFileName = (0, RandomFileNameGenerator_1.fileNameGenerator)(logo.name);
            // Continue processing the logo file (e.g., resizing)
            (0, sharp_1.default)(logo.data)
                .resize(200, 200)
                .toFile(path_1.default.join(__dirname, '..', '..', 'public', 'images', saveFileName), async (err, info) => {
                if (err) {
                    next(err);
                }
                else {
                    let newCallo = await prisma.collaborations.create({
                        data: {
                            name,
                            position,
                            startMonth,
                            startyear,
                            endMonth,
                            endYear,
                            url
                        }
                    });
                    const insertedLogo = await prisma.logo.create({
                        data: {
                            src: path_1.default.join(__dirname, '..', '..', 'public', 'images', saveFileName),
                            alt: name + ' alt',
                            fileName: saveFileName,
                            collaborationID: newCallo.ID
                        }
                    });
                    return res.status(201).json({
                        success: true,
                        message: "This collaboration has been added to your portfolio"
                    });
                }
            });
        }
        else {
            await prisma.collaborations.create({
                data: {
                    name,
                    position,
                    startMonth,
                    startyear, endMonth, endYear, url
                }
            });
            return res.status(201).json({
                success: true,
                message: "This callobration add to your portfolio"
            });
        }
    }
    async getAll(req, res, next) {
        try {
            let callos = await prisma.collaborations.findMany({
                include: {
                    logo: {
                        select: {
                            ID: true,
                            alt: true,
                            fileName: true,
                            src: true
                        }
                    }
                }
            });
            return res.status(200).json({
                success: false,
                message: "callos got succesfully",
                callos
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const id = req.params.id;
            // Find the project by ID and include its associated images
            const calloWithImages = await prisma.collaborations.findFirst({
                where: {
                    ID: +id
                },
                include: {
                    logo: {
                        select: {
                            ID: true,
                            alt: true,
                            fileName: true,
                            src: true
                        }
                    }
                }
            });
            // If the project doesn't exist, return 404
            if (!calloWithImages) {
                return res.status(404).json({
                    success: false,
                    message: "collaboration  not found"
                });
            }
            return res.status(200).json({
                success: true,
                project: calloWithImages
            });
        }
        catch (error) {
            next(error);
        }
    }
    async edit(req, res, next) {
        try {
        }
        catch (error) {
        }
    }
    async delete(req, res, next) {
        try {
            let id = req.params.id;
            let coll = await prisma.collaborations.findFirst({
                where: {
                    ID: +id
                },
                include: {
                    logo: true
                }
            });
            if (!coll) {
                return res.status(404).json({
                    success: false,
                    message: "This porfolio doesnt exist"
                });
            }
            if (coll.logo) {
                await prisma.collaborations.delete({
                    where: {
                        ID: +id
                    }
                });
                await prisma.logo.delete({
                    where: {
                        collaborationID: +id
                    }
                });
                fs_1.default.unlink(coll.logo.src, (err) => {
                    if (err) {
                        return next(err);
                    }
                });
                return res.status(200).json({
                    success: false,
                    message: "delete done succesfully"
                });
            }
            else {
                await prisma.collaborations.delete({
                    where: {
                        ID: +id
                    }
                });
                return res.status(200).json({
                    success: false,
                    message: "delete done succesfully"
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new callobrationController;

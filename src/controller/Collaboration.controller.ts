import { NextFunction, Request, Response } from "express"
import { timeController } from "../utils/timecontroller"
import { PrismaClient } from "@prisma/client"
import sharp from "sharp"
import { fileNameGenerator } from "../utils/RandomFileNameGenerator"
import path from "path"
import fs from "fs"
let prisma = new PrismaClient()

class callobrationController {
    async create(req: Request, res: Response, next: NextFunction) {
        let { name, position, startMonth, startyear, endMonth, endYear, url } = req.body
        let logo = req.files?.logo
        let timeControllerChecker = timeController(parseInt(startyear), parseInt(endYear), parseInt(startMonth), parseInt(endMonth))
        if (!timeControllerChecker.success) {
            return res.status(400).json({
                success: false,
                messasge: timeControllerChecker.Problem == "Now" ? "You have problem at setting time" : "time can not be in feature"
            })
        }
        let callobration = await prisma.collaborations.findFirst({
            where: {
                name
            }
        })
        if (callobration) {
            return res.status(400).json({
                success: false,
                messasge: "this name is existing on system"
            })
        }
        logo = Array.isArray(logo) ? logo[0] : logo
        if (logo) {
            let saveFileName = fileNameGenerator(logo.name);

            // Continue processing the logo file (e.g., resizing)
            sharp(logo.data)
                .resize(200, 200)
                .toFile(path.join(__dirname, '..', '..', 'public', 'images', saveFileName), async (err, info) => {
                    if (err) {
                        next(err);
                    } else {
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
                                src: path.join(__dirname, '..', '..', 'public', 'images', saveFileName),
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
            })
            return res.status(201).json({
                success: true,
                message: "This callobration add to your portfolio"
            })
        }

    }
    async getAll(req: Request, res: Response, next: NextFunction) {
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
            })
            return res.status(200).json({
                success: false,
                message: "callos got succesfully",
                callos
            })
        } catch (error) {
            next(error)
        }
    }
    async getOne(req: Request, res: Response, next: NextFunction) {
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
        } catch (error) {
            next(error);
        }
    }
    async edit(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.params.id
            let { name, position, startMonth, startyear, endMonth, endYear, url } = req.body

            let timeControllerChecker = timeController(parseInt(startyear), parseInt(endYear), parseInt(startMonth), parseInt(endMonth))
            if (!timeControllerChecker.success) {
                return res.status(400).json({
                    success: false,
                    messasge: timeControllerChecker.Problem == "Now" ? "You have problem at setting time" : "time can not be in feature"
                })
            }
            let callobration = await prisma.collaborations.findFirst({
                where: {
                    ID: +id
                },
                include: {
                    logo: {
                        select: {
                            ID: true,
                            src: true
                        }
                    }
                }
            })
            if (!callobration) {
                return res.status(400).json({
                    success: false,
                    messasge: "this coll does not existing on system"
                })
            }
            if (req.files?.logo) {
                let logo = req.files?.logo
                logo = Array.isArray(logo) ? logo[0] : logo
                let saveFileName = fileNameGenerator(logo.name);

                // Continue processing the logo file (e.g., resizing)
                sharp(logo.data)
                    .resize(200, 200)
                    .toFile(path.join(__dirname, '..', '..', 'public', 'images', saveFileName), async (err, info) => {
                        if (err) {
                            next(err);
                        } else {
                            if (callobration?.logo) {
                                let deleteImageSRC = callobration.logo.src
                                await prisma.logo.update({
                                    where: {
                                        ID: callobration.logo.ID
                                    },
                                    data: {
                                        src: path.join(__dirname, '..', '..', 'public', 'images', saveFileName),
                                        alt: name + ' alt',
                                        fileName: saveFileName
                                    }
                                })
                                await prisma.collaborations.update({
                                    where: {
                                        ID: +id
                                    },
                                    data: {
                                        name, position, startMonth, startyear, endMonth, endYear, url
                                    }
                                })
                                fs.unlink(deleteImageSRC, (err) => {
                                    if (err) {
                                        next(err)
                                    }
                                })
                                return res.status(200).json({
                                    success: true,
                                    message: "update done succesfully"
                                })
                            }
                            else {
                                await prisma.logo.create({
                                    data: {
                                        src: path.join(__dirname, '..', '..', 'public', 'images', saveFileName),
                                        alt: name + ' alt',
                                        fileName: saveFileName,
                                        collaborationID: callobration?.ID
                                    }
                                })
                                await prisma.collaborations.update({
                                    where: {
                                        ID: +id
                                    },
                                    data: {
                                        name, position, startMonth, startyear, endMonth, endYear, url
                                    }
                                })
                                return res.status(200).json({
                                    success: true,
                                    message: "delete done succesfully"
                                })
                            }

                        }
                    });

            }
            else {
                await prisma.collaborations.update({
                    where: {
                        ID: +id
                    },
                    data: {
                        name, position, startMonth, startyear, endMonth, endYear, url
                    }
                })
                return res.status(200).json({
                    success: true,
                    message: "update done succesfully"
                })
            }
        } catch (error) {

        }
    }
    async addOrchangeImage(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.params.id
            let coll = await prisma.collaborations.findFirst({
                where : {
                    ID : +id
                },
                include : {
                    logo : true
                }
            })
            if (!coll) {
                return res.status(404).json({
                    success : false,
                    message : "Coll doesnt find"
                })
            }
            if (req.files?.logo) {
                let logo = req.files?.logo
                logo = Array.isArray(logo) ? logo[0] : logo
                let saveFileName = fileNameGenerator(logo.name);
                sharp(logo.data)
                    .resize(200, 200)
                    .toFile(path.join(__dirname, '..', '..', 'public', 'images', saveFileName), (err, info) => {
                        if (err) {
                            return next(err)
                        }
                    })
                if (!coll.logo) {
                    await prisma.logo.create({
                        data: {
                            src: path.join(__dirname, '..', '..', 'public', 'images', saveFileName),
                            alt: name + ' alt',
                            fileName: saveFileName,
                            collaborationID: coll.ID
                        }
                    })
                    return res.status(200).json({
                        message : "i=Image added succesfully",
                        success : true
                    })
                }
                else{
                    await prisma.logo.update({
                        data: {
                            src: path.join(__dirname, '..', '..', 'public', 'images', saveFileName),
                            fileName: saveFileName,
                            collaborationID: coll.ID
                        },
                        where : {
                            ID : coll.logo.ID
                        }
                    })
                    fs.unlink(coll.logo.src , (err) => {
                        if (err) {
                            next(err)
                        }
                    })
                    return res.status(200).json({
                        message : "Image added succesfully",
                        success : true
                    })
                }
            }
            else {
               return res.status(404).json({
                success : false,
                message : "logo doesnt exist"
               })
            }
        } catch (error) {
 next(error)
        }
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.params.id
            let coll = await prisma.collaborations.findFirst({
                where: {
                    ID: +id
                },
                include: {
                    logo: true
                }
            })
            if (!coll) {
                return res.status(404).json({
                    success: false,
                    message: "This porfolio doesnt exist"
                })
            }
            if (coll.logo) {
                await prisma.collaborations.delete({
                    where: {
                        ID: +id
                    }
                })

                await prisma.logo.delete({
                    where: {
                        collaborationID: +id
                    }
                })
                fs.unlink(coll.logo.src, (err) => {
                    if (err) {
                        return next(err)
                    }
                })
                return res.status(200).json({
                    success: false,
                    message: "delete done succesfully"
                })

            }
            else {
                await prisma.collaborations.delete({
                    where: {
                        ID: +id
                    }
                })
                return res.status(200).json({
                    success: false,
                    message: "delete done succesfully"
                })
            }
        } catch (error) {
            next(error)
        }
    }

}

export default new callobrationController
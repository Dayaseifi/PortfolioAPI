import { NextFunction, Request, Response } from "express"
import { timeController } from "../utils/timecontroller"
import { PrismaClient } from "@prisma/client"
import sharp from "sharp"
import { fileNameGenerator } from "../utils/RandomFileNameGenerator"
import path from "path"
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
                        const logoData = {
                            src: saveFileName,
                            alt: name + ' alt',
                            fileName: saveFileName
                        };

                        const insertedLogo = await prisma.logo.create({
                            data: logoData
                        });

                        await prisma.collaborations.create({
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
}

export default new callobrationController
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import { fileNameGenerator } from "../utils/RandomFileNameGenerator";
import path from "path";
let prisma = new PrismaClient()

class ConcarController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            let { title, link } = req.body
            let concat = await prisma.concat.findFirst({
                where: {
                    OR: [
                        { title },
                        { link }
                    ]
                }
            })
            if (concat) {
                return res.status(400).json({
                    success: false,
                    message: "this concat is available"
                })
            }
            if (req.files?.logo) {
                let logo = Array.isArray(req.files?.logo) ? req.files?.logo[0] : req.files?.logo
                let newConcat = await prisma.concat.create({
                    data: {
                        title, link
                    }
                })
                let saveFileName = fileNameGenerator(logo.name);
                sharp(logo.data)
                    .resize(200, 200)
                    .toFile(path.join(__dirname, '..', '..', 'public', 'images', saveFileName), async (err, info) => {
                        if (err) {
                            await prisma.concat.delete({
                                where: {
                                    ID: newConcat.ID
                                }
                            })
                            return next(err)
                        }
                    })
                await prisma.logo.create({
                    data : {
                        alt : `${title } alt`,
                        fileName : saveFileName,
                        collaborationID : newConcat.ID,
                        src : path.join(__dirname, '..', '..', 'public', 'images', saveFileName)
                    }
                })
                return res.status(201).json({
                    success : true,
                    message : "link creation done succesfully"
                })
            }
            else {

            }
        } catch (error) {
           next(error)
        }
    }
}

export default new ConcarController
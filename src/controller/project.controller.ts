import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import path from "path";
import sharp from "sharp";

let prisma = new PrismaClient()

class ProjectController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            let { name, description, technology } = req.body
            if (!req.files?.images) {
                return res.status(404).json({
                    message: "Project should has image",
                    success: false
                })
            }
            let project = await prisma.project.findFirst({
                where: {
                    name
                }
            })
            if (project) {
                return res.status(400).json({
                    success: false,
                    message: "This name project is available at system."
                })
            }
            
            let images = Array.isArray(req.files.images) ? req.files.images : [req.files.images]
            let promises = images.map((file: any) => {
                return new Promise((resolve, reject) => {
                    sharp(file.data)
                        .resize(200, 200)
                        .toFile(path.join(__dirname , '..' , '..' , 'public' , 'images' , file.name ),(err, info) => {
                            if (err) {
                                next(err);
                            } else {
                                resolve({ fileName: file.name });
                            }
                        });
                });
            });
            let imagesInfo = await Promise.all(promises)
            let madeProject = await prisma.project.create({
                data : {
                    description,
                    name,
                    technologies : technology
                }
            })
            let imagePromises = imagesInfo.map((file: any) => {
                return new Promise(async (resolve, reject) => {
                    await prisma.image.create({
                        data : {
                            alt : 'Project photo',
                            src : path.join(__dirname , '..' , '..' , 'public' , 'images' , file.fileName ),
                            projectID : madeProject.ID
                        }
                    })
                    resolve(true);
                });
            })
            await Promise.all(imagePromises)
            return res.status(201).json({
                success : true,
                message : 'Done succesfully'
            })
        } catch (error) {
            console.log(error);
 next(error)
        }
    }
}

export default new ProjectController
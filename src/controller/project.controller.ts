import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import path from "path";
import sharp from "sharp";
import fs from 'fs'
import { fileNameGenerator } from "../utils/RandomFileNameGenerator";

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
                    let saveFileName = fileNameGenerator(file.name)
                    
                    sharp(file.data)
                        .resize(200, 200)
                        .toFile(path.join(__dirname, '..', '..', 'public', 'images', saveFileName), (err, info) => {
                            if (err) {
                                next(err);
                            } else {
                                resolve({ fileName: saveFileName });
                            }
                        });
                });
            });
            let imagesInfo = await Promise.all(promises)
            let madeProject = await prisma.project.create({
                data: {
                    description,
                    name,
                    technologies: technology
                }
            })
            let imagePromises = imagesInfo.map((file: any) => {
                console.log(file.fileName);
                return new Promise(async (resolve, reject) => {
                    await prisma.image.create({
                        data: {
                            alt: `${name} photo`,
                            src: path.join(__dirname, '..', '..', 'public', 'images', file.fileName),
                            projectID: madeProject.ID,
                            fileName : file.fileName
                        }
                    })
                    resolve(true);
                });
            })
            await Promise.all(imagePromises)
            return res.status(201).json({
                success: true,
                message: 'Done succesfully'
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    async edit(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.params.id
            let { name, description, technology } = req.body
            if (req.files?.slider) {

            }
            else {
                let proj = await prisma.project.findFirst({
                    where: {
                        ID: +id
                    },
                    select: {
                        ID: true
                    }
                })
                if (!proj) {
                    return res.status(404).json({
                        success: false,
                        message: "This project doesnt exist on system"
                    })
                }
                await prisma.project.update({
                    where: {
                        ID: +id
                    },
                    data: {
                        description, name, technologies: technology
                    }
                })
            }
        } catch (error) {
            next(error)
        }
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;

            // Check if the project exists
            const existingProject = await prisma.project.findFirst({
                where: {
                    ID: +id
                }
            });

            // If the project doesn't exist, return 404
            if (!existingProject) {
                return res.status(404).json({
                    success: false,
                    message: "This project doesn't exist in the system"
                });
            }

            // Fetch associated images for deletion
            const projectImages = await prisma.image.findMany({
                where: {
                    projectID: +id
                }
            });

            // Delete associated image files from the system
            const deletePromises = projectImages.map(async (image) => {
                fs.unlink(path.join(image.src), (err) => {
                    if (err) {
                        next(err)
                    }
                });
            });

            // Wait for all image files to be deleted
            await Promise.all(deletePromises);

            // Delete project images from database
            await prisma.image.deleteMany({
                where: {
                    projectID: +id
                }
            });

            // Delete project
            await prisma.project.delete({
                where: {
                    ID: +id
                }
            });

            return res.status(200).json({
                success: true,
                message: "Project deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            let projects = await prisma.project.findMany({
                include: {
                    Image: true
                }
            })
            return res.status(200).json({
                success: true,
                message: "Projects got succesfullly",
                projects
            })
        } catch (error) {
            next(error)
        }
    }
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;

            // Find the project by ID and include its associated images
            const projectWithImages = await prisma.project.findFirst({
                where: {
                    ID: +id
                },
                include: {
                    Image: true
                }
            });

            // If the project doesn't exist, return 404
            if (!projectWithImages) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found"
                });
            }

            return res.status(200).json({
                success: true,
                project: projectWithImages
            });
        } catch (error) {
            next(error);
        }
    }
    async getImages(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.params.id
            let images = await prisma.image.findMany({
                where: {
                    projectID: +id
                }
            })
            return res.status(200).json({
                message: "image got succesfully",
                images
            })
        } catch (error) {
            next(error)
        }
    }
    async changeImage(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.body.id
            if (!req.files?.image || Array.isArray(req.files.image)) {
                return res.status(404).json({
                    message: "file doesnt exist",
                    success: false
                })
            }
            let previmage = await prisma.image.findFirst({
                where: {
                    ID: +id
                }
            })
            if (!previmage) {
                return res.status(404).json({
                    message: "file doesnt exist",
                    success: false
                })
            }
            let saveFileName = fileNameGenerator(req.files.image.name)
            sharp(req.files.image.data)
                .resize(200, 200)
                .toFile(path.join(__dirname, '..', '..', 'public', 'images', saveFileName), (err) => {
                    if (err) {
                        next(err);
                    }
                });
            let newImage = await prisma.image.update({
                where: {
                    ID: +id
                },
                data: {
                    src: path.join(__dirname, '..', '..', 'public', 'images', req.files.image.name)
                }
            })
            fs.unlink(previmage?.src, (err) => {
                if (err) {
                    return next(err)
                }
            })
            return res.status(200).json({
                message : "Done",
                success : true
            })
        } catch (error) {
            next(error)
        }
    }

}

export default new ProjectController
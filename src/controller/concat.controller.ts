import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import { fileNameGenerator } from "../utils/RandomFileNameGenerator";
import path from "path";
import { unlink } from "fs";
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
                    data: {
                        alt: `${title} alt`,
                        fileName: saveFileName,
                        concatID: newConcat.ID,
                        src: path.join(__dirname, '..', '..', 'public', 'images', saveFileName)
                    }
                })
                return res.status(201).json({
                    success: true,
                    message: "link creation done succesfully"
                })
            }
            else {
                let newConcat = await prisma.concat.create({
                    data: {
                        title, link
                    }
                })
                return res.status(201).json({
                    success: true,
                    message: "link creation done succesfully"
                })
            }
        } catch (error) {
            next(error)
        }
        
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
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
            res.status(200).json({concats , success : true});
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
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
            res.status(200).json({concat , success : true ,});
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
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
            unlink(logoFilePath , (err) => {
                if (err) {
                    return next(err)
                }
            })
            // Now, delete the Concat
            const deletedConcat = await prisma.concat.delete({
              where: {
                ID: parseInt(id)
              }
            });
      
            res.status(200).json({
                message : "delete done succesfully",
                success : false
            });
          }
        } catch (error) {
          next(error);
        }
      }
      
      
}

export default new ConcarController
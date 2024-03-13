import { NextFunction, Response } from "express";
import CustomRequest from "../types/Customrequest";
import { PrismaClient } from "@prisma/client";
let prisma = new PrismaClient()
class ExpertiseController {
    async create(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            let { name, percent } = req.body
            let ex = await prisma.expertise.findFirst({
                where: {
                    name
                }
            })
            if (ex) {
                return res.status(404).json({
                    message: "This expertise available for you.",
                    success: false
                })
            }
            await prisma.expertise.create({
                data: {
                    name,
                    percent
                }
            })
            return res.status(201).json({
                message: "Created done succesfully!",
                success: true
            })
        } catch (error) {
            next(error)
        }
    }
    async delete(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const expertiseId = Number(req.params.id); // Assuming ID is passed in the URL params

            if (isNaN(expertiseId)) {
                return res.status(400).json({
                    message: "Invalid expertise ID provided.",
                    success: false
                });
            }
            const existingExpertise = await prisma.expertise.findFirst({
                where: { ID: expertiseId }
            });

            if (!existingExpertise) {
                return res.status(404).json({
                    message: "Expertise with the provided ID not found.",
                    success: false
                });
            }
            const deletedExpertise = await prisma.expertise.delete({
                where: { ID: expertiseId }
            });

            if (!deletedExpertise) {
                return res.status(404).json({
                    message: "Expertise with the provided ID not found.",
                    success: false
                });
            }

            return res.status(200).json({
                message: "Expertise deleted successfully.",
                success: true
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const expertiseId = Number(req.params.id); // Assuming ID is passed in the URL params
            const { name, percent } = req.body;

            if (isNaN(expertiseId)) {
                return res.status(400).json({
                    message: "Invalid expertise ID provided.",
                    success: false
                });
            }

            const existingExpertise = await prisma.expertise.findFirst({
                where: { ID: expertiseId }
            });

            if (!existingExpertise) {
                return res.status(404).json({
                    message: "Expertise with the provided ID not found.",
                    success: false
                });
            }

            const updatedExpertise = await prisma.expertise.update({
                where: { ID: expertiseId },
                data: {
                    name,
                    percent
                }
            });

            return res.status(200).json({
                message: "Expertise updated successfully.",
                success: true,
            });
        } catch (error) {
            next(error);
        }
    }
    async getAll(req: CustomRequest, res: Response, next: NextFunction){
        try {
            let expertises = await prisma.expertise.findMany()
            return res.status(200).json({
                success : true,
                message : "expertises got succesfully",
                expertises
            })
        } catch (error) {
            next(error)
        }
    }



}

export default new ExpertiseController
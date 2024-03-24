import { NextFunction, Request, Response, Router } from "express";
import callController from "../controller/Collaboration.controller"
import authChecker from "../middleware/authchecker";

let callRouter = Router()

callRouter.get("/" , callController.getAll)

callRouter.get("/:id" , authChecker as (req: Request, res: Response, next: NextFunction) => any , callController.getOne)

callRouter.post("/create" , authChecker as (req: Request, res: Response, next: NextFunction) => any , callController.create)

callRouter.put("/edit/:id" , authChecker as (req: Request, res: Response, next: NextFunction) => any , callController.edit)

callRouter.patch("/edit/image/:id" , authChecker as (req: Request, res: Response, next: NextFunction) => any , callController.addOrchangeImage)


callRouter.delete("/delete/:id" , authChecker as (req: Request, res: Response, next: NextFunction) => any , callController.delete)


export default callRouter;
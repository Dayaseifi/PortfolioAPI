import { NextFunction, Request, Response, Router } from "express";
import concatController from "../controller/concat.controller";
import authChecker from "../middleware/authchecker";

let concatRouter = Router()

concatRouter.get("/all" , concatController.getAll)

concatRouter.get("/get/:id" , authChecker as (req: Request, res: Response, next: NextFunction) => any , concatController.getById)

concatRouter.post("/create" , authChecker as (req: Request, res: Response, next: NextFunction) => any , concatController.create)

concatRouter.delete("/delete/:id" , authChecker as (req: Request, res: Response, next: NextFunction) => any , concatController.delete)

concatRouter.put("/edit/:id" , authChecker as (req: Request, res: Response, next: NextFunction) => any , concatController.edit)

export default concatRouter;
import { NextFunction, Request, Response, Router } from "express";
import expertiseController from "../controller/expertise.controller";
import authChecker from "../middleware/authchecker";


let exRouter = Router()


exRouter.post('/create' ,  authChecker as (req: Request, res: Response, next: NextFunction) => any , expertiseController.create as (req: Request, res: Response, next: NextFunction) => any )

exRouter.put('/update/:id' ,  authChecker as (req: Request, res: Response, next: NextFunction) => any , expertiseController.update as (req: Request, res: Response, next: NextFunction) => any )


exRouter.delete('/delete/:id' ,  authChecker as (req: Request, res: Response, next: NextFunction) => any , expertiseController.delete as (req: Request, res: Response, next: NextFunction) => any )

exRouter.get('/' ,  authChecker as (req: Request, res: Response, next: NextFunction) => any , expertiseController.getAll as (req: Request, res: Response, next: NextFunction) => any )

export default exRouter;
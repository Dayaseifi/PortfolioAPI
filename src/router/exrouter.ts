import { NextFunction, Request, Response, Router } from "express";
import expertiseController from "../controller/expertise.controller";
import authChecker from "../middleware/authchecker";


let exRouter = Router()


exRouter.post('/create' , expertiseController.create as (req: Request, res: Response, next: NextFunction) => any )

exRouter.put('/update/:id' ,   expertiseController.update as (req: Request, res: Response, next: NextFunction) => any )


exRouter.delete('/delete/:id' ,  expertiseController.delete as (req: Request, res: Response, next: NextFunction) => any )

exRouter.get('/' ,   expertiseController.getAll as (req: Request, res: Response, next: NextFunction) => any )

export default exRouter;
import { NextFunction, Request, Response, Router } from "express";
import authController from "../controller/auth.controller";
import authChecker from "../middleware/authchecker";

let authRouter = Router()

authRouter.post('/send' , authController.sendOTP)

authRouter.post('/signin' , authController.SignIn)

authRouter.post('/refresh' , authController.SignIn)

authRouter.get('/test' ,  authChecker as (req: Request, res: Response, next: NextFunction) => any , (req , res ) => console.log(3))


export default authRouter;
import { NextFunction, Request, Response, Router } from "express";
import ProjectController from "../controller/project.controller";
import projectController from "../controller/project.controller";
import authChecker from "../middleware/authchecker";

const Projectrouter = Router()


Projectrouter.post('/create' , authChecker as (req: Request, res: Response, next: NextFunction) => any ,  ProjectController.create)

Projectrouter.put('/edit/:id' , authChecker as (req: Request, res: Response, next: NextFunction) => any , ProjectController.edit)

Projectrouter.put('/change/image' , authChecker as (req: Request, res: Response, next: NextFunction) => any , ProjectController.changeImage)

Projectrouter.delete('/delete/:id' ,authChecker as (req: Request, res: Response, next: NextFunction) => any, ProjectController.delete)

Projectrouter.get('/:id', projectController.getById);

Projectrouter.get('/image/:id', projectController.getImages);

Projectrouter.get('/' , ProjectController.getAll)




export default Projectrouter
import { Router } from "express";
import ProjectController from "../controller/project.controller";
import projectController from "../controller/project.controller";

const Projectrouter = Router()


Projectrouter.post('/create' , ProjectController.create)

Projectrouter.put('/edit/:id' , ProjectController.edit)

Projectrouter.delete('/delete/:id' , ProjectController.delete)

Projectrouter.get('/' , ProjectController.getAll)

Projectrouter.get('/:id', projectController.getById);

Projectrouter.get('/image/:id', projectController.getImages);




export default Projectrouter
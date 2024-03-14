import { Router } from "express";
import ProjectController from "../controller/project.controller";

const Projectrouter = Router()

Projectrouter.post('/create' , ProjectController.create)

export default Projectrouter
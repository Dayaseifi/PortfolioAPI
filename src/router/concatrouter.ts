import { NextFunction, Request, Response, Router } from "express";
import concatController from "../controller/concat.controller";

let concatRouter = Router()

concatRouter.get("/all" , concatController.getAll)

concatRouter.get("/get/:id" , concatController.getById)

concatRouter.post("/create" , concatController.create)

concatRouter.delete("/delete/:id" , concatController.delete)

concatRouter.put("/edit/:id" , concatController.edit)

export default concatRouter;
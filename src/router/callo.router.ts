import { NextFunction, Request, Response, Router } from "express";
import callController from "../controller/Collaboration.controller"

let callRouter = Router()

callRouter.get("/" , callController.getAll)

callRouter.get("/:id" , callController.getOne)

callRouter.post("/create" , callController.create)

callRouter.delete("/delete/:id" , callController.delete)


export default callRouter;
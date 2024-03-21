import { NextFunction, Request, Response, Router } from "express";
import callController from "../controller/Collaboration.controller"

let callRouter = Router()

callRouter.get("/" , callController.getAll)

callRouter.post("/create" , callController.create)

export default callRouter;
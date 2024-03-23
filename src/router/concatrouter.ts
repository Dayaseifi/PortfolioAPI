import { NextFunction, Request, Response, Router } from "express";
import concatController from "../controller/concat.controller";

let concatRouter = Router()

concatRouter.post("/create" , concatController.create)

export default concatRouter;
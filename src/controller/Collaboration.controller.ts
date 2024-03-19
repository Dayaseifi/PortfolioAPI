import { NextFunction, Request, Response } from "express"
import { timeController } from "../utils/timecontroller"

class callobrationController {
    create(req: Request, res: Response, next: NextFunction) {
        let { name,position,startMonth,startyear,endMonth,endYear,url } = req.body
        let timeControllerChecker = timeController(parseInt(startyear) , parseInt(endYear) , parseInt(startMonth)  , parseInt(endMonth) )
        if (!timeControllerChecker.success) {
            return res.status(400).json({
                success  :false,
                messasge : timeControllerChecker.Problem == "Now" ? "You have problem at setting time" : "time can not be in feature"
            })
        }
        
    }
}
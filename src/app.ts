import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cookie_parser from 'cookie-parser'
import errorHandler from './errors/errorHandler'
import cors from 'cors'



dotenv.config({
    path: path.join(__dirname, '..', '.env')
})
let app = express()
app.use(cors({origin : '*'}))
app.use(cookie_parser())
app.use(express.json())
app.get('/' , (req : Request , res : Response , next : NextFunction) => {
    try {
        res.status(200).json({
            message : "OK"
        })
    } catch (error) {
        next(error)
    }
})

app.use(errorHandler.error404)
app.use(errorHandler.unexceptionError)
let port = process.env.PORT

app.listen(port, () => {
    console.log(`project ruuning on port ${port}`);
})
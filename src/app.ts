import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cookie_parser from 'cookie-parser'
import errorHandler from './errors/errorHandler'
import cors from 'cors'
import authRouter from './router/authrouter'
import exRouter from './router/exrouter'
import expressFileUpload from 'express-fileupload'
import Projectrouter from './router/projectrouter'
import callRouter from './router/callo.router'


dotenv.config({
    path: path.join(__dirname, '..', '.env')
})
let app = express()
app.use(cors({origin : '*'}))
app.use(cookie_parser())
app.use(express.json())
app.use(expressFileUpload())
app.use('/public/images',express.static(path.join(__dirname , '..' , 'public' , 'images')))
app.get('/' , (req : Request , res : Response , next : NextFunction) => {
    try {
        res.status(200).json({
            message : "OK"
        })
    } catch (error) {
        next(error)
    }
})

app.use('/auth' , authRouter)
app.use('/ex' , exRouter)
app.use('/proj' , Projectrouter)
app.use("/cal" , callRouter)
app.use(errorHandler.error404)
app.use(errorHandler.unexceptionError)
let port = process.env.PORT

app.listen(port, () => {
    console.log(`project ruuning on port ${port}`);
})
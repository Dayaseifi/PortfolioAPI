import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { generateRandomNumberString } from "../utils/RandomNumberGenerator";
import jwt from 'jsonwebtoken'
import CustomRequest from "../types/Customrequest";
import { DecodedToken } from "../types/DecodedToken";

let prisma = new PrismaClient()
class authController {

    async sendOTP(req: Request, res: Response, next: NextFunction) {
        try {
            let phone = req.body.phone
            // Check if phone is not provided or empty
            if (!phone) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number is required"
                });
            }
            let user = await prisma.user.findFirst({
                where: {
                    Phonenumber: phone
                }
            })
            console.log(user);
            console.log(1);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
            let otp = generateRandomNumberString(6)
            let updateUser = await prisma.user.update({
                where: {
                    ID : user.ID
                },
                data : {
                    otp
                }
            })
            return res.status(201).json({
                success : true,
                otp : updateUser.otp
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    async SignIn(req: Request, res: Response, next: NextFunction) {
        try {
            let otp = req.body.otp
            let user = await prisma.user.findFirst({
                where: {
                    otp
                }
            })
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "OTP is wrong"
                })
            }
            let payload = {
                id: user.ID,
                username: user.username,
                Phonenumber: user.Phonenumber
            }
            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY!,
                {
                    expiresIn: "10m",
                    issuer: "Shopino"
                }
            )
            let refereshtoken = jwt.sign(payload, process.env.REFERESH_TOKEN_KEY!,
                {
                    expiresIn: "30d",
                    issuer: "Shopino"
                }
            )
            await prisma.user.update({
                where: {
                    ID: user.ID
                },
                data: {
                    refreshToken: refereshtoken
                }
            });
            res.cookie('refreshToken', refereshtoken, {
                httpOnly: true,
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 24 * 30
            })
            return res.status(200).json({
                success: true,
                message: "Login done succesfully",
                data: {
                    token: accessToken
                }
            })
        } catch (error) {
            next(error)
        }

    }
    async Referesh(req: CustomRequest, res: Response, next: NextFunction) {
        let cookies = req.cookies
        let refereshToken = cookies?.refreshToken
        if (!refereshToken) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "cookie doesnt find"
                },
                data: null
            })
        }
        jwt.verify(refereshToken, process.env.REFERESH_TOKEN_KEY!, async (err: Error | null, decoded: unknown) => {
            if (typeof decoded === 'object' && decoded !== null) {
                const { username, id, roleId } = decoded as DecodedToken;
                let user = await prisma.user.findFirst({
                    where: {
                        refreshToken: refereshToken,
                        ID: +id,
                        username
                    }
                })
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        data: null,
                        error: {
                            message: "user not found , please relogin again"
                        }
                    })
                }
                let payload = {
                    username: user.username,
                    id: user.ID,
                    roleId
                }
                let newtoken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY!,
                    {
                        expiresIn: "10m",
                        issuer: "Shopino"
                    }
                )
                req.user = user
                return res.status(421).json({
                    success: false,
                    data: {
                        message: "New access token generated successfully",
                        newtoken
                    },
                    error: null
                })
            }
        })
    }

}

export default new authController;
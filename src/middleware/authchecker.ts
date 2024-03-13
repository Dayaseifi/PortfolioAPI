import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import CustomRequest from "../types/Customrequest";
let prisma = new PrismaClient()


interface DecodedToken {
    username: string;
    id: string;
    roleId: string;
}

async function authChecker(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        //bearer token
        let authheader: string | undefined = req.headers.authorization
        if (!authheader) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "auth header doesnt find"
                },
                data: null
            })

        }
        //['bearer' , 'token']
        let tokenParts: string[] = authheader.split(' ')
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(400).json({
                success: false,
                data: null,
                error: {
                    message: 'Invalid token format'
                }
            })
        }
        const token: string = tokenParts[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY!, async (err, decoded) => {
            if (err) {
                return next(err)
            }
            let cookie = req.cookies
            let refereshToken = cookie.refreshToken
            // solve ts error
            if (typeof decoded === 'object' && decoded !== null) {
                const { username, id, roleId } = decoded as DecodedToken;
                let user = await prisma.user.findFirst({
                    where: {
                        refreshToken: refereshToken
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

                console.log(refereshToken);
                if (!refereshToken) {
                    res.clearCookie('refreshToken');
                    await prisma.user.update({
                        where: {
                            ID : user.ID
                        },
                        data: {
                            refreshToken: { set: null }
                        }
                    });
                    return res.status(401).json({
                        success: false,
                        data: null,
                        error: {
                            message: 'user logout succesfully',
                            token: ''
                        }
                    })
                }

                //user may changed its refereshToken
                if (user.refreshToken != refereshToken) {
                    return res.status(401).json({
                        success: false,
                        data: null,
                        error: {
                            message: "refresh token change"
                        }
                    })
                }
                req.user = user;
                next();
            } else {
                return res.status(400).json({
                    success: false,
                    data: null,
                    error: {
                        message: 'Invalid token payload format'
                    }
                })
            }

        })


    } catch (error) {
        console.log(error);
        next(error)
    }
}

export default authChecker
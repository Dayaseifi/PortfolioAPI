"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
let prisma = new client_1.PrismaClient();
async function authChecker(req, res, next) {
    try {
        //bearer token
        let authheader = req.headers.authorization;
        if (!authheader) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "auth header doesnt find"
                },
                data: null
            });
        }
        //['bearer' , 'token']
        let tokenParts = authheader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(400).json({
                success: false,
                data: null,
                error: {
                    message: 'Invalid token format'
                }
            });
        }
        const token = tokenParts[1];
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, decoded) => {
            if (err) {
                return next(err);
            }
            let cookie = req.cookies;
            let refereshToken = cookie.refreshToken;
            // solve ts error
            if (typeof decoded === 'object' && decoded !== null) {
                const { username, id, roleId } = decoded;
                let user = await prisma.user.findFirst({
                    where: {
                        refreshToken: refereshToken
                    }
                });
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        data: null,
                        error: {
                            message: "user not found , please relogin again"
                        }
                    });
                }
                console.log(refereshToken);
                if (!refereshToken) {
                    res.clearCookie('refreshToken');
                    await prisma.user.update({
                        where: {
                            ID: user.ID
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
                    });
                }
                //user may changed its refereshToken
                if (user.refreshToken != refereshToken) {
                    return res.status(401).json({
                        success: false,
                        data: null,
                        error: {
                            message: "refresh token change"
                        }
                    });
                }
                req.user = user;
                next();
            }
            else {
                return res.status(400).json({
                    success: false,
                    data: null,
                    error: {
                        message: 'Invalid token payload format'
                    }
                });
            }
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
exports.default = authChecker;

import { ApiError } from '../utils/ApiError.js';
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Emp } from '../models/emp.modal.js'
import { hmacVal } from '../utils/encrpytion.js';

export const verifyUser = asyncHandler(async (req, res, next) => {    
    try {
        const token = req.header('accessToken')
        const getHmac = req.header('reqhmac')
        const userAgent = req.header('user-agent')
        if (!token || !getHmac || !userAgent) {
            throw new ApiError(401, 'Unauthorized Request')
        }
        if (getHmac != hmacVal) {
            res.send(new ApiResponse(401, 'Invalid reqHmac'))
            return
        }
        if (userAgent != 'AltaNeo') {
            res.send(new ApiResponse(401, 'Invalid userAgent'))
            return
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN)
        const user = await Emp.findById(decodedToken?._id).select('-password -refreshToken')
        if (!user) {
            throw new ApiError(401, 'Invalid Access Token')
        }
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token" )
    }
})
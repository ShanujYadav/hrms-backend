import { ApiError } from '../utils/ApiError.js';
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Emp } from '../models/emp.modal.js'
import { hmacVal } from '../utils/encrpytion.js';
import { ApiResponse } from '../utils/ApiResponse.js';



export const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        const token = req.header('accessToken')
        const getHmac = hmacVal
        const userAgent = req.header('userAgent')

        if (!token || !getHmac || !userAgent) {
            return res.status(401).json(
                new ApiResponse(401, "Unothorized Request !")
            )
        }
        if (getHmac != hmacVal) {
            return res.status(401).json(
                new ApiResponse(401, "Invalid reqHmac !")
            )
        }
        if (userAgent != "altaNeo") {
            return res.status(401).json(
                new ApiResponse(401, "Invalid userAgent!")
            )
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN)
        const user = await Emp.findById(decodedToken?._id).select('-password -refreshToken')
        if (!user) {
            throw new ApiError(401, 'Invalid Access Token')
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})
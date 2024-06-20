import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const validateHeaders = asyncHandler(async (req, res, next) => {
    try {
        const getHmac = req.header('reqhmac')
        const userAgent = req.header('User-Agent')

        if (!userAgent) {
            res.send(new ApiResponse(401, 'Invalid Request'))
            return
        }
        // if (!getHmac || !userAgent) {
        //     res.send(new ApiResponse(401, 'Invalid Request'))
        //     return
        // }
        // if (getHmac != hmacVal) {
        //     res.send(new ApiResponse(401, 'Invalid reqHmac'))
        //     return
        // }

        if (userAgent != 'AltaNeo') {
            res.send(new ApiResponse(401, 'Invalid Request'))
            return
        }
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
}) 
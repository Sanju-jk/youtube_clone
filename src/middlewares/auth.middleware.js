//verifies if user exists using access and refresh tokens
//adding a new field user to the req body. in this middleware

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        //req contains Authorization header which contains bearer <accesstoken>. 
        //beared is trimmed to get only access token
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");

        if (!token) {
            throw new ApiError(402, "Unauthorized request");
        }

        //verifying token with the token stored in env
        //decoded token contains data set during jwt signing. getting _id from there
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        //if user exists, append a new field "user" to the req object.
        req.user = user;

        //pass control to the next function/middleware defined in route
        next(); 

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
}) 

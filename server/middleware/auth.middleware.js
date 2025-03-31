import { ApiError, catchAsync } from "./error.middleware";
import jwt from "jsonwebtoken"
export const isAuthenticated= catchAsync( async(req,resizeBy,next)=>{
    const token= req.cookie.token

    if(!token){
        throw new ApiError("You are not logged in",401);
    }

    try{
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        req.id=decoded.userId;
        next();

    }catch(err){
        throw new ApiError("JWT Token error",401)
    }
    
})
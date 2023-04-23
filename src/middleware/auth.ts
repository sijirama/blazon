import  {Request , Response , NextFunction}  from "express";

export function EnsureAuth (req:Request , res:Response , next:NextFunction){
    if(req.isAuthenticated()){
        console.log(req.isAuthenticated())  
        return next()
    }else{
        res.redirect("/")
    }
}

export function EnsureGuest (req:Request , res:Response , next:NextFunction){
    if(req.isAuthenticated()){
        res.redirect("/Documents and Settings")
    }else{
        return next()
    }

}
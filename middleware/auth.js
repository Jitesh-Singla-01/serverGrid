import jwt from "jsonwebtoken";
import dotenv from "dotenv" ;
dotenv.config() ;

export const verifyToken = async (req , res, next ) => {
    try{
        let token = req.header("Autherization");

        if(!token){
            return res.status(403).send("Access Denied") ;

        }

        const verified = jwt.verify(token , process.env.JWT_SECRET) ;
        req.user=verified ;
        next() ;
    }
    catch(err){
        res.status(500).json({error : err.message}); 

    }
} ;
import express from "express";
import {login , register, signUp, verifyOtp} from "../controllers/auth.js" ;

const router = express.Router() ;

router.post("/login" , login) ;
router.post("/register" , register) ;
router.post("/signUp", signUp ) ;
router.post("/signUp/verifyOtp" , verifyOtp) ;

export default router ; 


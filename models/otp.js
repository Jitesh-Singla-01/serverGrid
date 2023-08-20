import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email : {
        type : String ,
        required : true ,
    } ,
    otp : {
        type: String , 
        required : true , 
    },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
    } ,
    {
        timestamps : true ,
    }
) ; 

const Otp = mongoose.model("OTP" , otpSchema) ;
export default Otp ; 
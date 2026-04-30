const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');


//resetpasswordtoken
exports.resetPasswordToken=async(req,res)=>{
    try{
        //get email from request body
        const {email}=req.body;
        //check if user exists,email is registered or not
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User with this email does not exist"
            });
        }
        //link to reset password will be sent only if email is registered
        //generate token
        const token=crypto.randomUUID();
        //set token and expiry time in user document
        const updatedDetails=await User.findByIdAndUpdate(user._id,{
            token:token,
            resetPasswordExpires:Date.now()+3600000, //token expires in 1 hour
        },{new:true});//new:true to return the updated document
        //update user with token and expiry time
        //url creation
        const url=`http://localhost:3000/update-password/${token}`;
        //send email to user with the link
        await mailSender(user.email, "Password Reset Request", `Click the link to reset your password: ${url}`);
        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset link sent successfully"
        });
        //return response
     
    }
    catch(error){
        console.error("Error in resetPasswordToken controller:", error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while generating reset password token, try again later"
        });
    }


//resetpassword
exports.resetPassword=async(req,res)=>{
    try{
        //data fetch from request body
            const {password,confirmPassword,token}=req.body;
        //validate data
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password do not match"
            });
        }
        //get user from db based on token and check if token is valid or not
        const userDetails=await User.findOne({token:token});
        //if no entry found or token expired,return error response
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired token"
            });
        }
        //token time validity check
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token has expired"
            });
        }


        //hash new password and update user document,remove token and expiry time
        const hashedPassword=await bcrypt.hash(password,10);
        await User.findOneAndUpdate({
            token:token},
            {
                password:hashedPassword
            },
            {new:true},
        );
        //password updated successfully,send response
        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        });
        //send email to user about password change
    }
    catch(error){
        console.error("Error in resetPassword controller:", error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while resetting password, try again later"
        });
    }
}

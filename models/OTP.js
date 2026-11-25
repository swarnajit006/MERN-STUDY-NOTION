const mongoose=require("mongoose");

const OTPSchema=new mongoose.Schema({
   
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:300, // OTP expires after 5 minutes (300 seconds)
    }

});

//a function to send OTP to user's email
async function sendVerificationEmail(email, otp) {
    // Here you can use any email service provider like nodemailer, SendGrid, etc.
    // For example, using nodemailer:
    try{
        const mailResponse=await mailSender(email, "verification OTP", `Your OTP is: ${otp}`);
        console.log("OTP email sent successfully:", mailResponse);
    }
    catch(error){
        console.error("Error sending email:", error);
        throw new Error("Failed to send OTP email");
    }
}
OTPschema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports=mongoose.model("OTP",OTPSchema);
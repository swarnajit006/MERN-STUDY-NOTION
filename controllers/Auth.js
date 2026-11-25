const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
require('dotenv').config();


//send otp to email
exports.sendOTP = async (req, res) => {
    //fetch email from request body
    const { email } = req.body;
    try {
        // Check if the user already exists
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already exists'
            });
        }
        // Generate a 6-digit OTP
        var otp=otpGenerator.generate(6, { 
            upperCaseAlphabets: false,
             specialChars: false, 
             lowerCaseAlphabets: false
             });
             console.log("Generated OTP:", otp);

             //check unique otp
             let result = await OTP.findOne({ otp: otp });
             while (result) {
                 otp = otpGenerator.generate(6, { 
                     upperCaseAlphabets: false,
                      specialChars: false, 
                      lowerCaseAlphabets: false
                      });
                  
                       result = await OTP.findOne({ otp: otp });
             }

             const otpPayload= {email, otp};

             //creaTE OTP entry in database
             const otpBody = await OTP.create(otpPayload);
             console.log("OTP entry created in database:", otpBody);

             //return response
                 res.status(200).json({
                    success: true,
                    message: 'OTP sent to email successfully',
                    otp: otp
                })

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP'
        });
    }
}
//signup
exports.signUp = async (req, res) => {
    //data fetch from request body
   try {
     const { 
        firstName,
         lastName, 
         email, 
         password, 
         confirmPassword,
         accountType,
         contactNumber,
         otp
         } = req.body;
    //validation of data
    if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp)//mane empty fields
    {
        return res.status(403).json({
            success: false,
            message: 'Please fill in all the required fields'
        });
    }
    // match passwords both in database and request body
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match'
        });
    }
    //check user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }

    //find most recent otp for the email
    const recentOtp = await OTP.find({ email: email }).sort({ createdAt: -1 }).limit(1);
    console.log("Recent OTP found in database:", recentOtp);
    if (recentOtp.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'OTP not found'
        })
    }else if(otp !== recentOtp.otp){
        //invalid OTP
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP'
        });
    }
    //validate otp with request body otp
    if (recentOtp.otp !== otp) {
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP'
        });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //create user in database
    const profileDetails = await Profile.create({
        gender: '',
        dateOfBirth: '',
        about: '',
        contactNumber: '',
    });

    const user= await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
        additionalDetails: {
        image: 'https://api.dicebear.com/9.x/initials/svg?seed=FirstName+LastName   ',
        }
    });
    //return response
    return res.status(200).json({
        success: true,
        message: 'User registered successfully',
        user: user,
    });
   }
    catch (error) {
        console.error('Error during sign up:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during sign up.try again later'
        });
    }
//login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //get data from request body and validate
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all the required fields'
            });
        }
        // Check if the user exists
        const user = await User.findOne({ email }).populate('additionalDetails');
        if (!user) {
            return res.status(404).json({   
                success: false,
                message: 'User not found'
            });
        }
        
        // Compare the provided password with the stored hashed password
         //generate jwt,after password matching 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) { 
            const payload = {
                id: user._id,
                email: user.email,
               role:user.accountType,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, 
                { expiresIn: '2h'
                });  
                user.token = token;
                user.password = undefined;
                
                
       
        //create cookieand send response
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000), // Cookie expires in 3 days
            httpOnly: true, // Cookie is accessible only by the web server
        };
        res.cookie('token', token,options).status(200).json({
            success: true,
            token: token,
            user: user,
            message: 'Login successful',
        });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }
    } catch(error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during login.try again later'
        });
    }
}       


//change password
exports.changePassword = async (req, res) => {
    //fetch data from request body
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
        try {
    //validate data
    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all the required fields'
        });
    }   
    
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
            success: false,
            message: 'New passwords do not match'
        });
    }
    //check user exists or not
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }   
   
    //update pwd in db
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid old password'
        });
    }
   
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    
    return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });

     //send mail-password changed successfully
    await mailSender(user.email, "Password Changed", "Your password was updated");
    } catch (error) {
        console.error('Error during password change:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during password change.try again later'
        });
    }
};

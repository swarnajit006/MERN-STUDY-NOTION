const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');


//auth
exports.auth = async (req, res, next) => {
    try {
        // extract token
        const token=req.cookies.token
                          ||req.body.token
                          ||req.header("Authorization")?.replace("Bearer ","");
                          //if token is not present
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found, authorization denied"
            });
        }
        //verify token
        try{
            const decoded=jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);
            req.user=decoded;
          
        }
        catch(error){
            console.error("Error in auth middleware:", error);
            res.status(401).json({
                success: false,
                message: 'Invalid token, authorization denied'
            });
        }
        next();
    }
    catch(error){
        console.error("Error in auth middleware:", error);
        res.status(401).json({
            success: false,
            message: 'Something went wrong in validating token, authorization denied'
        });
    }


//isStudent
exports.isStudent=async(req,res,next)=>{
    try{
        const user=await User.findById(req.user.id);
        if(user.accountType!=="student"){
            return res.status(403).json({       
                success:false,
                message:"Access denied, students only"
            });
        }
        next();
    }
    catch(error){
        console.error("Error in isStudent middleware:", error);
        res.status(500).json({
            success: false,
            message: 'Server error in checking student role'
        });
    }
};



//isInstructor

exports.isInstructor=async(req,res,next)=>{
    try{
        const user=await User.findById(req.user.id);
        if(user.accountType!=="instructor"){
            return res.status(403).json({       
                success:false,
                message:"Access denied, instructors only"
            });
        }
        next();
    }
    catch(error){
        console.error("Error in isInstructor middleware:", error);
        res.status(500).json({
            success: false,
            message: 'Server error in checking instructor role'
        });
    }
};

//isAdmin
exports.isAdmin=async(req,res,next)=>{
    try{
        const user=await User.findById(req.user.id);
        if(user.accountType!=="admin"){
            return res.status(403).json({       
                success:false,
                message:"Access denied, admins only"
            });
        }
        next();
    }
    catch(error){
        console.error("Error in isAdmin middleware:", error);
        res.status(500).json({
            success: false,
            message: 'Server error in checking admin role'
        });
    }
};
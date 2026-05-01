const Profile =require("..models/Profile");
const User = require("../models/User");

exports.updateProfile=async(req,res)=>{
    try {
        //get data from frontend
            const {gender,dateOfBirth="",about="",contactNumber}=req.body;//"" is default value for dateOfBirth and about
        //get user id from req.user
        const userId=req.user.id;
        //validation
        if (!contactNumber || !gender || !userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        //find the profile by user id and update it
 
        const profileId = userDetails.profile;
        const updatedProfile = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        profileDetails.data
        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        //return success response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profileDetails
        });

    }
    catch(error){
        console.error("Error in update profile controller", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating profile",
            error: error.message
        });
    }
}
//delete profile
exports.deleteAccount=async(req,res)=>{
    try {
        //get user id from req.user
        const id=req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        //find the profile by user id and delete it
        
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //unernroll the user from all courses
        await Course.updateMany(//updateMany is used to update multiple documents that match the filter criteria. 
        // In this case, we are updating all courses where the studentsEnrolled array contains the user's id. 
        // The $pull operator is used to remove the user's id from the studentsEnrolled array in those courses.
            { studentsEnrolled: id },
            { $pull: { studentsEnrolled: id } }
        );
        //delete the user account
        await User.findByIdAndDelete({_id:id});
        
        //return success response
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",

        });
    }
    catch(error){
        console.error("Error in delete account controller", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting account",
            error: error.message
        });
    }
}
//get all user details
exports.getAllUserDetails=async(req,res)=>{

    try {
        //get user id from req.user
        const id=req.user.id;
        //validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec();//exec() is used to execute the query and return a promise. 
        // It allows you to handle the result of the query asynchronously using .then() and .catch() or async/await syntax.
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }
        //return success response
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: userDetails
        });
    }
    catch(error){
        console.error("Error in get all user details controller", error);
        res.status(500).json({

            success: false,
            message: "Server error while fetching user details",
            error: error.message
        });
    }   
}



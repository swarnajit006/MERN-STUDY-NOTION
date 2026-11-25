const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection=async(req,res)=>{ 
    try {
        //data from frontend
        const {sectionName,courseID}=req.body;  
        if(!sectionName || !courseID){//validation
            return res.status(400).json({
                success:false,  
                message:"All fields are required"
            });
        }   
        
        //create section in database
        const newSection=await Section.create({
            sectionName:sectionName,
        });
        //update the course schema with the new section
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseID,{
            $push:{
                courseContent:newSection._id
            }
        },{new:true}).populate({//populate section ke andar subSection ko bhi populate karna hai
            //if we didn't populate subSection, then we will get only the id of the subSection, but we want the details of the subSection as well, so we need to populate it    
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        });

        //success response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            data:updatedCourseDetails
        });
    } catch (error) {
        console.error("Error in create section controller",error);
        res.status(500).json({  
            success:false,  
            message:"Server error while creating section",
            error:error.message
        });
    }
};
//update section
exports.updateSection=async(req,res)=>{
    try {
        //data from frontend
        const {sectionID,sectionName}=req.body;
        if(!sectionID || !sectionName){//validation
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        //update section in database
        const updatedSection=await Section.findByIdAndUpdate(sectionID,{//(find the section by id and update the section name)
            sectionName:sectionName
        },{new:true});//(new:true is used to return the updated document, if we didn't use it, then we will get the old document before update )

        //success response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            data:updatedSection
        });
    }
    catch (error) {
        console.error("Error in update section controller",error);
        res.status(500).json({  
            success:false,
            message:"Server error while updating section",
            error:error.message
        });
    }
};
//delete section
exports.deleteSection=async(req,res)=>{
    try {
        //data from frontend
        const {sectionID}=req.body;
        if(!sectionID){//validation
            return res.status(400).json({
                success:false,
                message:"Section ID is required"
            });
        }
        //delete section from database
        await Section.findByIdAndDelete(sectionID);
        //success response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in delete section controller",error);
        res.status(500).json({
            success:false,
            message:"Server error while deleting section",
            error:error.message
        });
    }
};
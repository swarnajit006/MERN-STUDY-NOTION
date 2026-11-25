const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create a new subsection
exports.createSubSection = async (req, res) => {
    try {
        //extract data from request body
        const { title, timeDuration, description, sectionId } = req.body;
        //extract video file from request
        const video = req.files.videoFile;
        //validation    
        if (!title || !timeDuration || !description || !video || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
         //upload video file to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create new subsection in database
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
        });
        //push the new subsection to the section's subsections array
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                subSections: subSectionDetails._id
            }
        }, { new: true }).populate({
            path: "subSections" //log updated section details in console after updating the section with the new subsection
        }).exec();
        console.log("Updated section details after adding new subsection:", updatedSection);
            //path is the name of the field in the section schema which is an array of subsections, we need to populate it to get the details of the subsections instead of just getting the ids of the subsections
        

        //success response
        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: updatedSection
        });
    } catch (error) {
        console.error("Error in create subSection controller", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating subSection",
            error: error.message
        });
    }
};
//update subsection
exports.updateSubSection = async (req, res) => {
    try {
        //data from frontend
        const { subSectionId, title, timeDuration, description } = req.body;
        //validation
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        //find the subsection by ID and update it
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, {
            title: title,
            timeDuration: timeDuration,
            description: description
        }, { new: true });

        //success response
        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            data: updatedSubSection
        });
    } catch (error) {
        console.error("Error in update subSection controller", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating subSection",
            error: error.message
        });
    }
};
//delete subsection
exports.deleteSubSection = async (req, res) => {
    try {
        //data from frontend
        const { subSectionId } = req.body;
        //validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID is required"
            });
        }
        //find the subsection by ID and delete it
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found"
            });
        }
        //success response
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
        });
    } catch (error) {
        console.error("Error in delete subSection controller", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting subSection",
            error: error.message
        });
    }
};
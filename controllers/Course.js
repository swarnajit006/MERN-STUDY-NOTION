const Course = require("../models/Course");

const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create course handler function
exports.createCourse = async (req, res) => {
    try {
        //extract data from request body
        const { courseName, courseDescription,whatYouWillLearn,price,tags } = req.body;
         //thumbnail image from request file
        const thumbnail = req.files.thumbnailImage;
        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        //check for instructor
        const userId = req.user.id;
        const InstructorDetails = await User.findById(userId);
        console.log("Instructor details:", InstructorDetails);
        //todo: check if the user is instructor or not, only instructor can create course
        if (!InstructorDetails.isInstructor) {
            return res.status(400).json({
                success: false,
                message: "Only instructors can create courses"
            });
        }

        if(!InstructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }
        //check given categories are valid or not
        const categoryDetails = await Category.findById(tags);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        //upload thumbnail to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        //create course in database
        const newCourse = await Course.create({
            courseName: courseName,
            courseDescription: courseDescription,
            instructor: InstructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price: price,
            thumbnail: thumbnailImage.secure_url,
            category: categoryDetails._id,
        });
        console.log("Course created successfully:", newCourse);
        //add the new course to instructor's user schema
        await User.findByIdAndUpdate(InstructorDetails._id, {
            $push: {
                courses: newCourse._id
            }
        }, { new: true });
        //update the category's schema with the new course
        await Category.findByIdAndUpdate(categoryDetails._id, {
            $push: {
                courses: newCourse._id
            }
        }, { new: true });
        //return response
        return res.status(201).json({   
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    } catch (error) {
        console.error("Error in create course controller", error);
        res.status(500).json({ 
            success: false,
            message: "Server error while creating course",
            error: error.message,
        });
    }   
};






//get all courses handler function
exports.showAllCourses = async (req, res) => {
    try {
        //find all courses from database
        //todo: change the below statement incrementally 
        
        const allCourses = await Course.find({}, { courseName: true,
                                                    courseDescription: true,
                                                        price: true,
                                                     thumbnail: true,instructor:true,
                                                     category:true,
                                                     studentsEnrolled:true,ratingAndReviews:true,
                                                     whatYouWillLearn:true,
                                                     }).populate("instructor").exec();
        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: allCourses
        });
    } catch (error) {
        console.error("Error in show all courses controller", error);
        res.status(500).json({  
            success: false,
            message: "Server error while fetching courses"
        });
    }
    }

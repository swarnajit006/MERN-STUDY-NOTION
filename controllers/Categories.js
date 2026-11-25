const Tag=require("../models/Category");

//create category ka handler function
exports.createCategory=async (req,res)=>{
    try{
        //extract data from request body
        const {name, description, course}=req.body;
        //validation
        if(!name || !description || !course){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        //create category in database
        const categoryDetails=await Tag.create({
            name:name,
            description:description,
        });
        console.log("Category created successfully:", categoryDetails);
        return res.status(201).json({
            success:true,
            message:"Category created successfully",
            category:categoryDetails,
        });
    }
    catch(error){
        console.error("Error in create category controller",error);
        res.status(500).json({  
            success:false,
            message:"Server error while creating category"
        });
    }
};
//get all categories handler function
exports.showAllCategories=async(req,res)=>{
    try{
        //find all categories from database
        const allCategories=await Tag.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"All categories fetched successfully",
            categories:allCategories
        }); 
    }
    catch(error){
        console.error("Error in show all categories controller",error);
        res.status(500).json({
            success:false,
            message:"Server error while fetching categories"
        });
    }
};
const Tag=require("..//models/tags");

//create tag ka handler function
exports.createTag=async (req,res)=>{
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
        //create tag in database
        const tagDetails=await Tag.create({
            name:name,
            description:description,
        });
        console.log("Tag created successfully:", tagDetails);
        return res.status(201).json({
            success:true,
            message:"Tag created successfully",
            tag:tagDetails,
        });
    }
    catch(error){
        console.error("Error in create tag controller",error);
        res.status(500).json({  
            success:false,
            message:"Server error while creating tag"
        });
    }
};
//get all tags handler function
exports.showAllTags=async(req,res)=>{
    try{
        //find all tags from database
        const allTags=await Tag.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"All tags fetched successfully",
            tags:allTags
        }); 
    }
    catch(error){
        console.error("Error in show all tags controller",error);
        res.status(500).json({
            success:false,
            message:"Server error while fetching tags"
        });
    }   
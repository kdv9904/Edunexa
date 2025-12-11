import Course from "../model/courseModel.js";

export const searchWithAi = async(req, res)=>{
    try {
        const {input} = req.body;
        if(!input){
            return res.status(400).json({message:"Search query is required"});
        }
        const course = await Course.find({
            isPublished: true,
            $or:[
                {title: {$regex: input, $options: 'i'}},
                {subTitle: {$regex: input, $options: 'i'}},
                {category: {$regex: input, $options: 'i'}},
                {description: {$regex: input, $options: 'i'}},
                {level : {$regex: input, $options: 'i'}},
            ]
        })
        return res.status(200).json({course});
    } catch (error) {
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
}
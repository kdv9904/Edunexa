import mongoose from "mongoose"

const lactureSchema = new mongoose.Schema({
    lectureTitle:{
        type:String,
        required:true,
    },
    videoUrl:{
        type:String,
    },
    isPreviewFree:{
        type:Boolean
    },
},{timestamps:true})

const Lecture = mongoose.model("Lecture",lactureSchema);
export default Lecture;
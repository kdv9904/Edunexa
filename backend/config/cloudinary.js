import {v2 as cloudinary} from "cloudinary";
import fs from "fs";    

const uploadOnCloudinary = async (filePath) => {
    // Check if file exists before proceeding
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at path: ${filePath}`);
    }

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
        secure: true
    });

    try {
        console.log("Uploading to Cloudinary...", filePath);
        
        const uploadResult = await cloudinary.uploader.upload(filePath, { 
            resource_type: 'auto',
            chunk_size: 6000000, // 6MB chunks for large files
            timeout: 60000 // 60 second timeout
        });
        
        console.log("Cloudinary upload successful:", uploadResult.secure_url);
        
        // Delete local file after successful upload
        fs.unlinkSync(filePath);
        
        return {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };
        
    } catch (error) {
        console.error("Cloudinary Upload Error Details:", error);
        
        // Clean up local file if it exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

export default uploadOnCloudinary;
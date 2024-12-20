// file upload 
// fs file system node k sath aata hai to manage file system , read , write, edit files
import {v2 as cloudinary} from "cloudinary";
import fs from fs;

//configuration which gives the file upload load permission
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
// creating method to upload the file

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto" 
        })
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);
        return response

    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operations gets fail's  
        return null;
    } 
}

export {uploadOnCloudinary}
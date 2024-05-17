import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

// used the cloudinary to upload files on cloud.
// if it is successfully uploads files if error comes removes the localfile from disk.

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadCloudinary = async (localFilePath) =>{
  try {
    if(! localFilePath) return "File not found..."

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })

    // console.log("file uploaded successfully",response.url);
    fs.unlinkSync(localFilePath)
    return response

  } catch (error) {
    fs.unlinkSync(localFilePath)
    return null
  }
}

export {uploadCloudinary}
import { mongoose } from 'mongoose';
import { DB_NAME } from '../constants.js';

// always use trycatch if you are connecting with user. this might take time because DataBase maybe in another desh so also use async await

 const connectDB = async ()=>{
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    // console.log("connectionInstance:::: ",connectionInstance);
    console.log(`connected succesfull!! DB_Host:${connectionInstance.connection.host}`);

  } catch (error) {
    console.log("Error in coonectDB: ",error);
    throw error
  }
}

export {connectDB}
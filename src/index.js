import dotenv from "dotenv";
import {connectDB} from "./db/index.js"
import express from "express";
dotenv.config({
  path:"./env"
}) 

const app = express()

connectDB()
.then(()=>{

  app.on("error",(e)=>{
    console.log(`Failed to communication: `,e);
  })


  app.listen(process.env.PORT || 8000,()=>{
    console.log(`App is listening on port: ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.log(`Mongodb connection falied:`,err);
})    



    

















/*
import express from "express";

const app = express()
;( async ()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

    app.on("error",(e)=>{
      console.log("Error in app to connect db:",e)
      throw e

    })
    app.listen(process.env.PORT,()=>{
      console.log(`app is listening on: ${process.env.PORT}`)
    })
  } catch (error) {
    console.error("Error in connection: ",error)
    throw error
  }
})()
*/
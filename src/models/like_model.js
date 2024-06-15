import mongoose, { Types, mongo } from "mongoose";


const likeSchema = new mongoose.Schema({

  video:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video",
    default:[],
  }],
  comment:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comment",
    default:[],
  }],
  tweet:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Tweet",
    default:[],
  }],
  likedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },


},{timestamps:true})

export const Like = mongoose.model("Like",likeSchema)
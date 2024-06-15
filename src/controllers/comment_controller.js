import mongoose from "mongoose";
import { Comment } from "../models/comment_model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video_model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  // First find the video using videoId
  // Then find all comments which have this videoid

  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400,"No Video Id Provided")
  }
  const { page = 1, limit = 10 } = req.query;
  const commentsAggregate = await Comment.aggregate([
    {
      $match: {
        video: videoId,
      },
    },
  ]);

  const options = {
    page,
    limit,
  };

  const allComments = await Comment.aggregatePaginate(
    commentsAggregate,
    options
  );
// console.log(allComments);
  return res
    .status(200)
    .json(
      new ApiResponse(200, {allComments}, "all comments fetched succcesfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400,"No Video Id Provided")
  }
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400,"Please provide content")
  }
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError(500, "comment is not created");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment is successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400,"No Video Id Provided")
  }
  const { comment } = req.body;
  if (comment) {
    var newcomment = await Comment.findByIdAndUpdate(commentId, {
      $set: {
        content: comment,
      },
    },{new:true});
  }
  //  console.log(newcomment);
  return res.status(200).json(new ApiResponse(200, {newcomment}, "comment is updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400,"No Video Id Provided")
  }
  const deleteComment = await Comment.findByIdAndDelete(commentId);
  return res
    .status(200)
    .json(new ApiResponse(200, deleteComment, "Comment is deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };

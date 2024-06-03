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
  const { page = 1, limit = 10 } = req.query;
  commentsAggregate = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
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

  return res
    .status(200)
    .json(
      new ApiResponse(200, allComments, "all comments fetched succcesfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError(400, "No comment is avialble");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment is successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { comment } = req.body;
  if (comment) {
    await Comment.findByIdAndUpdate(commentId, {
      $set: {
        content: comment,
      },
    });
  }

  return res.status(200).json(new ApiResponse(200, {}, "comment is updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  deletedComment = await Comment.findByIdAndDelete(commentId);
  return res
    .status(200)
    .json(new ApiResponse(200, deleteComment, "Comment is deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };

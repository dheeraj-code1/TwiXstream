import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video_model.js";
import { User } from "../models/user_model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  // find all videos based on query
  // sort them
  // paginate them
  // return the response

  // const videos = await Video.find({ $text: { $search: query,$caseSensitive: false } })

  const videoAggregate = Video.aggregate([
    {
      $match: {
        $text: {
          $search: query.split("+").join(" "),
        },
      },
    },
  ]);


  const options = {
    page,
    limit,
    sort: { sortBy: sortType },
  };

  const videos = await Video.aggregatePaginate(videoAggregate, options);

  return res
  .status(200)
  .json(
    new ApiResponse(200,videos,"all videos are fetched")
  )

});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  // req.body->data
  // req.files -> files
  // check video
  // check thumnail
  // upload on cloudinary
  // return res

  const { title, description } = req.body;

  // console.log(req.files);
  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!(videoFileLocalPath && thumnailLocalPath)) {
    throw new ApiError(400, "thumail or video is missing");
  }

  const videoFile = await uploadCloudinary(videoFileLocalPath);
  const thumnail = await uploadCloudinary(thumnailLocalPath);

  // console.log("videoFile:",videoFile);
  const videoCreated = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumnail.url,
    title: title,
    description: description,
    duration: videoFile.duration,
    owner: req.user._id,
  });

  if (!videoCreated) {
    throw new ApiError(400, "video is not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoCreated, "video pulished succesfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  // search video using id
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(200).json(new ApiResponse(200, video, "No video exist"));
  }

  return res.status(200).json(new ApiResponse(200, video, "No video exist"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  // get video first
  // upload the thumnail if need to change
  // change the other feilds also

  const { videoId } = req.params;
  const currentVideo = await Video.findById(videoId);
  if (!currentVideo) {
    throw new ApiError(400, "Video does not exist");
  }

  const { title, description } = req.body;
  if (title) {
    currentVideo.title = title;
  }
  if (description) {
    currentVideo.description = description;
  }
  const newThumbnail = req.file?.thumbnail?.path;
  if (newThumbnail) {
    currentVideo.thumbnail = newThumbnail;
  }

  await currentVideo.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, currentVideo, "video update succesfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  // Fetch video
  // delete video

  const { videoId } = req.params;
  await Video.findByIdAndDelete(videoId, (err, docs) => {
    if (err) {
      throw new ApiError(400, err.message);
    } else {
      console.log("Deleted : ", docs);
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "video deleted succesfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findByIdAndUpdate(
    videoId,
    { $set: { isPublic: !isPublic } },
    { new: true }
  );
  return res.status(200).json(
    new ApiResponse(200, {
      isPublic: video.isPublic,
    })
  );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

import express  from 'express';
import cors from "cors"
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json({limit:'16kb'}))  // used configuration for json response in express
app.use(express.urlencoded({extended:true})) // for handling data from url(params)
app.use(express.static("public"))  // for storing static files
app.use(cookieParser())  // cookie-parser

//routes import 
import userRouter from './routes/user_routes.js'
import commentRouter from './routes/comment_routes.js'
import videoRouter from './routes/video_routes.js'
import likeRouter from './routes/like_routes.js'
import tweetRouter from './routes/tweet_routes.js'
import sbuscriptionRouter from './routes/subscription_routes.js'
import playlistRouter from './routes/playlist_routes.js'
import healthcheckRouter from './routes/healthcheck_routes.js'
import dashboardRouter from './routes/dashboard_routes.js'
// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/likes",likeRouter) 
app.use("/api/v1/tweets",tweetRouter) 
app.use("/api/v1/subs",sbuscriptionRouter) 
app.use("/api/v1/playlist",playlistRouter) 
app.use("/api/v1/healthcheck",healthcheckRouter) 
app.use("/api/v1/dashboard",dashboardRouter) 
export { app } 
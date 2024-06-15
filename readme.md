# TwiXstream

TwiXstream is a cutting-edge social media platform that seamlessly integrates the best features of Twitter and YouTube. It offers users a unique space to share short, engaging tweets and longer, captivating videos, all in one place. Whether you want to express quick thoughts or create in-depth content, TwiXstream has got you covered.

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
    - [Microblogging (Tweets)](#microblogging-tweets)
    - [Video Sharing](#video-sharing)
    - [Interactive Features](#interactive-features)
    - [User Profiles](#user-profiles)
3. [Use Cases](#use-cases)
4. [Technologies Used](#technologies-used)
5. [Project Features](#project-features)
6. [Standard Practices](#standard-practices)
7. [Contribution Guidelines](#contribution-guidelines)
    - [Learning Outcomes](#learning-outcomes)
8. [Resources](#resources)
9. [Installation](#installation)
10. [Usage](#usage)
11. [File Structure](#file-structure)
12. [Contributing](#contributing)
13. [Authors and Acknowledgments](#authors-and-acknowledgments)
14. [Contact Information](#contact-information)

## Overview
This project is a complex backend system built with Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, and many other technologies. It is a complete backend solution for a video hosting website similar to YouTube, with integrated features for microblogging akin to Twitter.

## Key Features
### Microblogging (Tweets)
- **Short Posts**: Share your thoughts, updates, and news in concise, tweet-style posts.
- **Engagement**: Like, reply, and retweet posts to interact with the community.
- **Trends**: Discover trending topics and join conversations on what’s hot.

### Video Sharing
- **Upload Videos**: Upload videos of various lengths, from short clips to long-form content.
- **Playlists**: Create and manage playlists to organize your favorite videos.
- **Subscriptions**: Follow your favorite content creators and get notified of new uploads.

### Interactive Features
- **Comments**: Engage with videos and tweets through comments and discussions.
- **Liking and Disliking**: Feature of liking and disliking of videos, comments, tweets.
- **Commenting and Replying**: Participate in discussions by commenting on posts and replying to others.
- **Subscribing and Unsubscribing to Channels**: Stay updated by subscribing to channels, and unsubscribe anytime.

### User Profiles
- **User Authentication (Login and Signup)**: Securely log in and sign up to access features.
- **Customizable Profiles**: Showcase your identity with personalized profiles, featuring your tweets and videos.
- **Followers and Following**: Build your community by following others and gaining followers.

## Use Cases
- **Content Creators**: Share your creativity through videos while engaging with your audience via tweets.
- **Businesses**: Promote products, share updates, and connect with customers using a mix of video content and social interaction.
- **Influencers**: Grow your influence by combining visual storytelling with quick, engaging updates.
- **General Users**: Enjoy a diverse mix of content from brief thoughts to comprehensive videos, all within a single platform.

## Technologies Used

- **Node.js**: JavaScript runtime environment. [Learn more](https://nodejs.org/)
- **Express.js**: Web application framework for Node.js. [Learn more](https://expressjs.com/)
- **MongoDB**: NoSQL database program. [Learn more](https://www.mongodb.com/)
- **Mongoose**: MongoDB object modeling for Node.js. [Learn more](https://mongoosejs.com/)
- **JWT (JSON Web Tokens)**: Securely transmitting information between parties. [Learn more](https://jwt.io/)
- **Bcrypt**: Password hashing library. [Learn more](https://www.npmjs.com/package/bcrypt)

## Project Features
- **User Authentication**: Secure user authentication using JWT and Bcrypt.
- **Video Management**: Upload, like, dislike, and comment on videos.
- **User Interaction**: Reply to comments, subscribe, and unsubscribe to channels.
- **Security**: Implemented access and refresh tokens to ensure secure API endpoints.

## Standard Practices
This project adheres to standard practices such as using JWT for authentication, Bcrypt for password hashing, and implementing access and refresh tokens. We have invested significant effort into building this project and are confident that you will learn a great deal from it.

## Contribution Guidelines
### Learning Outcomes
By working on this project, you will gain hands-on experience in:
- Setting up a backend server with Node.js and Express.js.
- Integrating MongoDB using Mongoose for database operations.
- Implementing authentication and authorization using JWT.
- Handling file uploads and media management.
- Applying best practices for securing backend APIs.
We are confident that you will find this project educational and valuable in enhancing your backend development skills. Happy coding!

## Resources
- [DB Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)
- [All API's](https://documenter.getpostman.com/view/28639772/2sA3XQhMcC)
- [YouTube Tutorials](https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW)

## Installation

### Prerequisites
- Node.js
- npm

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/dheeraj-code1/TwiXstream.git
    ```

2. Navigate to the project directory:
    ```bash
    cd TwiXstream
    ```

3. Create a `.env` file in the root of your project and add the following variables:

   ```
   PORT=8000
   MONGODB_URI=mongodb://username:password@localhost:27017/database_name
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
    Replace all placeholders (e.g., `your_value`) with your actual configuration values.

4. Install the dependencies:
    ```bash
    npm install
    ```


## Usage
To start the project, run:
```bash
npm start
```

## File Structure
```
TwiXstream
├── public/
│   └── temp/
├── src/
│   ├── controllers/
│   │   └── db/
│   │       └── index.js
│   ├── middlewares/
│   │   └── multer.middleware.js
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │   ├── ApiResponse.js
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
└── readme.md
```
## Acknowledgments

- [Chaiaurcode YouTube Channel](https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW) - A big thank you to Hitesh Choudhary Sir and the Chaiaurcode channel for their fantastic tutorials. Your guidance has been invaluable in developing our project and improving our skills.
- Postman
## Contact Information

- **Email:** [dheeraj25062003@gmail.com](mailto:your.email@example.com)

- **LinkedIn:** [dheeraj](https://www.linkedin.com/in/dheeraj-51b568209/)



---


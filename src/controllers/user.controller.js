import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// const registerUser = asyncHandler(async (req, res) => {
//     //get user details from front end
//     //validation
//     //check if user already exists - username/email
//     //check for images and avtar. as it is required fields
//     //upload to cloudinary, check for avatar
//     //create user object- to store in mongo db. create entry in db.
//     //remove password and refresh token field from response
//     //check for user creation 
//     //return res



//     const { username, fullName, email, password } = req.body;

//     //checking if any field is empty using some() method of array
//     if ([username, fullName, email, password].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required")
//     }

//     const existedUser= await User.findOne({
//         $or: [{ email }, { username }]
//     })

//     if(existedUser) {
//         throw new ApiError(409, "User with username or email already exists")
//     }

//     //req.files using multer 

//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     const coverImageLocalPath = req.files?.coverImage[0]?.path;

//     if(!avatarLocalPath) {
//         throw new ApiError(400, "Avatar file is required")
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath);
//     const cover = await uploadOnCloudinary(coverImageLocalPath);

//     if(!avatar){
//         throw new ApiError(400, "Avatar file is required")
//     }

//     //creating record in mongo db using mongoose create method on the user model
//     const user = await User.create({
//         fullName:fullName,
//         avatar:avatar.url,
//         coverImage: cover?.url || " ", //check if cover image exists or add empty string
//         email,
//         password,
//         username: username.toLowerCase()
//     })

//     //checking if user is created and removing password and refreshtoken fields using select
//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken" 
//     );
    
//     if (!createdUser) {
//         throw new ApiError(500, "User registration failed")
//     }

//     return res.status(201).json(
//         new ApiResponse(200, createdUser, "User registered successfully")
//     )
// })

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body;

    if ([username, fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    // Check if files were uploaded
    if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatarLocalPath = req.files.avatar[0]?.path;
    const coverImageLocalPath = req.files.coverImage?.[0]?.path;

    // console.log(req.files)
    // Upload the avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const cover = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    // Create the user in MongoDB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: cover?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});



export { registerUser }
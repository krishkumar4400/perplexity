import userModel from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import generateAccessAndRefreshToken from "../utils/auth-token.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      existingUser.email === email
        ? "Email already exists"
        : "username already exists",
    );
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const data = {
    message: "user registered successfully",
    success: true,
    status: "CREATED",
    user: {
      email,
      username,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    },
  };

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "development" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, data, "user registered successfully"));
});

export {
    registerUser
}
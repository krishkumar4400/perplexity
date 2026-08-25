import userModel from "../models/user.model";
import ApiError from "./api-error";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(
      500,
      "Failed to generate access and refresh token",
      error,
    );
  }
};

export default generateAccessAndRefreshToken;

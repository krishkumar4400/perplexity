import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mail.service.js";

/**
 * @description Register a new user and send verification email
 * @route POST /api/v1/auth/register
 * @access Public
 * @body {username, email, password}
 */
async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    let user = await userModel.findOne({
      $or: [{ email }, { password }],
    });

    if (user) {
      return res.status(409).json({
        message:
          user.username === username
            ? "username already exists"
            : "email already exists",
        success: false,
      });
    }

    user = await userModel.create({
      username,
      email,
      password,
    });

    const emailVerificationToken = jwt.sign(
      { email },
      process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_SECRET_EXPIRY,
      },
    );

    const html = `
    <div>
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below</p>
                <a href="http://localhost:3000/api/v1/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        </div>
                `;

    await sendMail({ to: email, subject: "Email verification message", html });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      status: "CREATED",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to register user",
      success: false,
      status: "ERROR",
      error,
    });
  }
}

/**
 * @description Login a user
 * @route POST /api/user/login
 * @access Public
 * @body {username | email, password}
 */
async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY,
      },
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "development" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      })
      .json({
        message: "User logged in successfully",
        success: true,
        status: "OK",
        user,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to login user",
      success: false,
      status: "ERROR",
      error,
    });
  }
}

/**
 * @description Logout a user
 * @route POST /api/v1/auth/logout
 * @access Public
 * @body {}
 */
async function logoutUser(req, res) {
  try {
    // const { accessToken } = req.cookies;
    return res.status(200).clearCookie("accessToken").json({
      message: "User logged out successfully",
      success: true,
      status: "OK",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to logout user",
      success: false,
      status: "ERROR",
      error,
    });
  }
}

/**
 * @description Verify user's email address
 * @route GET /api/v1/auth/verify-email
 * @access Public
 * @query {token}
 */
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(404).json({
        message: "Email verification token not found",
        success: false,
        status: "ERROR",
      });
    }

    const decodedToken = jwt.verify(token, EMAIL_VERIFICATION_TOKEN_SECRET);
    const user = await userModel.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).json({
        message: "Email verification token is invalid",
        success: false,
        status: "ERROR",
      });
    }

    if (user.isVerified) {
      return res.send(`
        <div>
        <h1>warning</h1>
        <p>You are already verified</p>
        </div>`);
    }

    user.isVerified = true;
    await user.save();

    const html = `
    <div>
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified. You can now log in to your account</p>
    <p>Hello world</p>
    </div>
    `;

    return res.send(html);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to verify email",
      success: false,
      status: "ERROR",
      error,
    });
  }
}

export async function resendVerificationEmail(req, res) {
  try {
    const user = await userModel.findById(req.userId);

    const emailVerificationToken = jwt.sign(
      { email: user.email },
      process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_SECRET_EXPIRY,
      },
    );

    const html = `
    <div>
                <p>Hi ${user.username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below</p>
                <a href="http://localhost:3000/api/v1/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        </div>
                `;

    await sendMail({
      to: user.email,
      subject: "Account verification mail",
      html,
    });

    return res.status(200).json({
      message:
        "Account verification email send to your registered email address",
      success: true,
      status: "OK",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to send verification email",
      success: false,
      status: "ERROR",
      error,
    });
  }
}

/**
 * @description Get current logged in user's details
 * @route GET /api/user/register
 * @access Private
 * @req {userId}
 * @cookie {token}
 */
export async function getUser(req, res) {
  try {
    const user = await userModel.findById(req.userId);
    console.log(user);
    return res.status(200).json({
      message: "Successfully fetched user details",
      success: true,
      status: "OK",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch user details",
      success: false,
      status: "ERROR",
      error,
    });
  }
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  resendVerificationEmail,
  verifyEmail,
};

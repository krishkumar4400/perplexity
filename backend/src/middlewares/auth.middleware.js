import jwt from "jsonwebtoken";

/**
 *
 * @type {import("express").RequestHandler}
 * @type {import("express").Request}
 * @type {import("express").Response}
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function authenticationMiddleware(req, res, next) {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(401).json({
      message: "You are not logged in",
      success: false,
      status: "ERROR",
    });
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      status: "ERROR",
      error,
    });
  }
}

async function isAuthenticated(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({
      message: "Unauthorized! Login again",
      success: false,
      status: "ERROR",
    });
  }

  next();
}

export { authenticationMiddleware, isAuthenticated };

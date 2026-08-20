import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      success: false,
      message: "Request valdiation failed",
    });
  }
};

const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isString()
    .withMessage("username must be in string format")
    .isLength({ min: 3 }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email id is not valid")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  validate,
];

const loginValidator = [
  body("username")
    .trim()
    .isString()
    .withMessage("username must be in string format")
    .isLength({ min: 3 })
    .optional(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email id is not valid")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  validate,
];

export { registerValidator, loginValidator };

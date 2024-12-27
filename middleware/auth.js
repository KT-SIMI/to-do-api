const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const authenticate = catchAsync(async (req, res, next) => {
  try {
    let token = req.session?.token || req.session?.cookie || null;

    if (!token) {
      console.error("[Auth Middleware] No token found!");
      return next(new AppError(401, "Unauthorized! Please log in."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log("[Auth Middleware] Decoded Token:", decoded);

    next();
  } catch (err) {
    console.error("[Auth Middleware Error]:", err);
    return next(new AppError(401, "Invalid token"));
  }
});


const auth = (req, res, next) => {
  authenticate(req, res, () => {
   
    if (req?.user) {
      next();
    } else {
      console.log(req.user)
        return next(new AppError(401, 'Unauthorized'));
    }
  });
};

module.exports = { auth };

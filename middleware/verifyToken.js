const jwt = require("jsonwebtoken");

const verifyToken = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Access denied. You are not authenticated.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: 3600,
    }); // returns the decoded payload, expiration_time_in_seconds

    req.user = decoded;

    next(); // pass control to the next middleware function
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
};

const verifyTokenAndAuthorizeUser = (req, res, next) => {
  // Passing middleware function as a parameter to verifyToken(). So, next() in verifyToken() will call this middleware function to check for admin user.
  verifyToken(req, res, () => {
    // User can update itself or admin user can update the other user
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next(); // pass control to the next middleware function which is present in our route file
    } else {
      return res.status(403).send("Access denied, unauthorized user!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  // Passing middleware function as a parameter to verifyToken(). So, next() in verifyToken() will call this middleware function to check for admin user.
  verifyToken(req, res, () => {
    // Only admin user can perform the tasks
    if (req.user.isAdmin) {
      next(); // pass control to the next middleware function which is present in our route file
    } else {
      return res.status(403).send("Access denied, unauthorized user!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorizeUser,
  verifyTokenAndAdmin,
};

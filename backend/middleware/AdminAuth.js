const jwt = require("jsonwebtoken");
const config = process.env;

//Middleware to call after VerifyToken middleware
const adminAuth = (req, res, next) => {
    if (req.user.type !== "admin") {
      return res.status(401).send("unauthorized request");
    } else {
      next();
    }
  }
  
module.exports = adminAuth;
//Middleware to call after VerifyToken middleware
const userAuth = (req, res, next) => {
    if (req.user.type !== "customer") {
      return res.status(401).send("Unauthorized Request");
    } else {
      next();
    }
  }
  
module.exports = userAuth;
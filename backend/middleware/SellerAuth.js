
//Middleware to call after VerifyToken middleware
const sellerAuth = (req, res, next) => {
    if (req.user.type !== "seller" || req.user.sellerStatus != "accepted") {
      return res.status(401).send("Unauthorized Request");
    } else {
      next();
    }
  }
  
module.exports = sellerAuth;
const rateLimit = require("express-rate-limit");
  
const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message:
    "Too many accounts created from this IP, please try again after two minute!"
});

module.exports = {
    apiLimiter
}
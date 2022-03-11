const jwt = require("jsonwebtoken");
const msg = sails.config.messages.User;
const statCode = sails.config.resstatus.statusCode;

module.exports = (req, res, proceed) => {
  try {
    //get token from the headers
    const token = req.headers.authorization.split(" ")[1];
    //verify token and key
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.userData = decoded;
    //const exp = req.userData.exp;
    //const extp = Date.now() >= exp * 1000;

    proceed();
  } catch (error) {
    // check if token is expired?
    if (error instanceof jwt.TokenExpiredError) {
      return res.send(msg.TokenExpired);
    } else {
      return res.status(statCode.FORBIDDEN).json({
        message: msg.Auth_fail,
      });
    }
  }
  return true;
};

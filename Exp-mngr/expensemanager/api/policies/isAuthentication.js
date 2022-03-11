const jwt = require("jsonwebtoken");

module.exports = (req, res, proceed) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.userData = decoded;
    const exp = req.userData.exp;
    const extp = Date.now() >= exp * 1000;

    proceed();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
  return true;
};

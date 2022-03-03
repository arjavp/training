const jwt = require("jsonwebtoken");

module.exports = (req, res, proceed) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //const decoded = jwt.verify(token, "secret");

    req.userData = decoded;

    console.log(req.userData.userId);

    proceed();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

const jwt = require("jsonwebtoken");

module.exports = (req, res, proceed) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //const decoded = jwt.verify(token, "secret");

    req.userData = decoded;
    //console.log('expiry date',req.userData.exp)
    const exp = req.userData.exp;
    //console.log(exp);
    const extp = (Date.now() >= exp * 1000)
    //console.log('hello',extp)

  

    proceed();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
  return true
};

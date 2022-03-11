const statCode = sails.config.resstatus.statusCode;
module.exports = async (req, res, proceed) => {
  const id = req.userData.userId;
  //console.log('user id from policy',id);

  user
    .findOne({ where: { id: id }, select: ["username", "token"] })
    .then((result) => {
      // checks if token field is null or not, if null then user is already logged out
      if (result.token === null) {
        res.status(statCode.FORBIDDEN).json({
          message: "user logged out, you need to login",
        });
      } else {
        proceed();
      }
    });
};

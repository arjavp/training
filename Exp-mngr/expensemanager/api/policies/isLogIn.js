module.exports = async (req, res, proceed) => {
  const id = req.userData.userId;
  //console.log('user id from policy',id);
  user
    .findOne({ where: { id: id }, select: ["username", "token"] })
    .then((result) => {
      if (result.token === null) {
        res.status(403).json({
          message: "user logged out, you need to login",
        });
      } else {
        proceed();
      }
    });
};

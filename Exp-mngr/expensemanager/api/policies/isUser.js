const statCode = sails.config.resstatus.statusCode;
module.exports = (req, res, proceed) => {
  try {
    const acc_id = req.params.accountId;

    // find requested id in account model and populate users details
    Account.findOne({ where: { id: acc_id } })
      .populate("users")
      .then((result) => {
        let myid = false;
        // match users.id with currently logged in user's id
        result.users.forEach((data) => {
          if (data.id === req.userData.userId) {
            myid = true;
          }
        });
        if (myid) {
          proceed();
        } else {
          return res.status(statCode.UNAUTHORIZED).json({
            message: "access denied",
          });
        }
      })
      .catch((err) => {
        res.status(statCode.UNAUTHORIZED).json({
          message: "You are not authorized for this account",
        });
      });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

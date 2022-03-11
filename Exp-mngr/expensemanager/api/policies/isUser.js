module.exports = (req, res, proceed) => {
  try {
    const acc_id = req.params.accountId;

    Account.findOne({ where: { id: acc_id } })
      .populate("users")
      .then((result) => {
        let myid = false;

        result.users.forEach((data) => {
          if (data.id === req.userData.userId) {
            myid = true;
          }
        });
        if (myid) {
          proceed();
        } else {
          return res.status(403).json({
            message: "access denied",
          });
        }
      }).catch(err => {
          res.status(403).json({
              message: 'account not exist'
          })
      })
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

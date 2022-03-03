/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  //get list of account
  getacc: (req, res, next) => {
    user
      .find({
        where: { id: req.userData.userId },
        select: ["email", "username"],
      })
      .populate("Accounts", { select: ["acc_name", "balance"] })
      .then((docs) => {
        console.log(docs);
        res.ok(docs);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({
          error: err,
        });
      });
  },

  // create account
  create: (req, res) => {
    let { acc_name } = req.body;

    // check account is already exists or not
    Account.find({ acc_name: acc_name }).then((account) => {
      if (account.length >= 1) {
        res.badRequest("account already exists");
      } else {
        Account.create({
          acc_name: acc_name,
          users: req.userData.userId,
        })
          .fetch()
          .then((result) => {
            console.log(result);

            res.ok("account created");
          })
          .catch((err) => {
            res.badRequest("account not Created", err);
          });
      }
    });
  },

  // get account by id
  getaccbyid: (req, res) => {
    let id = req.params.accountId;
    console.log(id);
    Account.find({ where: { id: id } })
      .populate("users")
      .populate("transactions")
      .then((result) => {
        //console.log(result);
        if (result) {
          res.ok(result);
        } else {
          res.badRequest("enter valid id");
        }
      })
      .catch((err) => {
        res.badRequest(err);
      });
  },

  // update account
  acc_update: (req, res) => {
    let user = req.userData;

    let id = req.params.accountId;
    const { acc_name } = req.body;

    Account.update({ where: { id: id } })
      .set({ acc_name: acc_name })
      .then((result) => {
        //console.log(result);
        res.ok("account updated", result);
      })
      .catch((err) => {
        res.badRequest(err);
      });
  },

  //add member to the account
  addmember: (req, res) => {
    //console.log("yourid", req.params.id);

    Account.find({ id: req.params.id })
      .limit(1)
      .then((result) => {
        //console.log(req.params.id);
        //console.log("result ", result);

        user
          .find({ email: req.body.email })
          .limit(1)
          .then((record) => {
            Account.addToCollection(req.params.id, "users")
              .members([record[0].id])
              .then((data) => {
                res.ok({ message: "Member Added" });
              })
              .catch((err) => {
                res.badRequest("member not found");
              });
          })
          .catch((err) => {
            res.badRequest("member not found");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },

  // delete account
  delete: (req, res) => {
    let id = req.params.accountId;
    console.log(id);
    Transaction.find({ where: { Accounts: id } })
      .then((result) => {
        console.log(result);
        Transaction.destroy({ Accounts: id })
          .fetch()
          .then((record) => {
            console.log(record);
            Account.destroyOne({ id: id }).then((docs) => {
              console.log(docs);
              res.ok("account deleted successfully");
            });
          });
      })
      .catch((err) => {
        res.badRequest(err);
      });
  },
};

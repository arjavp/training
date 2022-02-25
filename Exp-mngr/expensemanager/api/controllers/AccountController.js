/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



module.exports = {
  //get list of account
  getacc: (req, res, next) => {
    Account.find()
      .then((docs) => {
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
    let { acc_name} = req.body;

    // check account is already exists or not
    Account.find({ acc_name: acc_name }).then((account) => {
      if (account.length >= 1) {
        res.badRequest("account already exists");
      } else {
        Account.create({
          acc_name: acc_name,
          users: user.id,
        })
          .then((result) => {
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
    let id = req.body.accountId;
    Account.findById(id)
      .then((result) => {
        console.log(result);
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
    let id = req.body.accountId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    Account.update({ _id: id }, { $set: updateOps })
      .then((result) => {
        res.ok("account updated", result);
      })
      .catch((err) => {
        res.badRequest(err);
      });
  },

  // delete account
  delete: (req, res) => {
    let id = req.body.accountId;
    Account.remove({
      _id: id,
    })
      .then((result) => {
        res.ok("account deleted successfully", result);
      })
      .catch((err) => {
        res.badRequest(err);
      });
  },
};

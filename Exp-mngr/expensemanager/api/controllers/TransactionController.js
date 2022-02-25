/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getTransaction: function (req, res) {
    Transaction.find()
      .then((docs) => {
        console.log(docs);
        res.ok(docs);
      })
      .catch((err) => {
        console.log(err);
        res.badRequest(err);
      });
  },

  addTransaction: function (req, res) {
    let { type, description, amount } = req.body;
    Transaction.create({
      type: type,
      description: description,
      amount: amount,
    })
      .fetch()
      .then((docs) => {
        console.log(docs);
        res.ok("transaction created");
      })
      .catch((err) => {
        res.badRequest(err);
      });
  },
  // get transaction by id
  gettranbyid: (req, res) => {
    let id = req.body.transactionId;
    Transaction.findById(id)
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
  // update transaction
  trns_update: (req, res) => {
    let id = req.body.transactionId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    Transaction.update({ _id: id }, { $set: updateOps })
      .then((result) => {
        res.ok("account updated", result);
      })
      .catch((err) => {
        res.badRequest(err);
      });
  },

  // delete transaction
  trns_delete: (req, res) => {
    let id = req.body.transactionId;
    Transaction.remove({
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

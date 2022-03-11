/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const msg = sails.config.messages.Transaction;
const statCode = sails.config.resstatus.statusCode;
module.exports = {
  /**
   * @description get transaction
   * @param {request} req
   * @param {response} res
   */
  getTransaction: async function (req, res) {
    try {
      let id = req.params.accountId;
      //find transaction by account id
      const trns_find = await Transaction.find({
        where: { Accounts: id },
        sort: "createdAt DESC",
      }).populate("Accounts");

      if (trns_find.length < 1) {
        res.status(statCode.FORBIDDEN).json({
          message: msg.Not_Found,
        });
      } else {
        res.status(statCode.OK).json({
          message: trns_find,
        });
      }
    } catch (err) {
      console.log(err);
      res.badRequest(err);
    }
  },

  /**
   * @description create new transaction and update balance of account accordingly
   * @param {request} req
   * @param {response} res
   */
  addTransaction: async function (req, res) {
    try {
      // const userid = req.userData.userId;
      // const acc_name = req.body.acc_name;
      const acc_id = req.params.accountId;
      //find account details
      const accountData = await Account.findOne({
        where: { id: acc_id },
      });

      let balance = accountData.balance;
      let accountId = accountData.id;
      const { type, description, amount } = req.body;
      if (amount < 0) {
        res.status(statCode.BAD_REQUEST).json({
          message: msg.amount,
        });
      } else {
        // create transaction
        if (type === "income") {
          await Transaction.create({
            type: type,
            description: description,
            amount: amount,
            Accounts: accountId,
          });

          balance = balance + Number(amount);
          // update balance of account according to type
          await Account.updateOne({ where: { id: acc_id } }).set({
            balance: balance,
          });
          res.status(statCode.OK).json({
            message: msg.Updated,
          });
        } else if (type === "expense") {
          if (balance >= amount) {
            await Transaction.create({
              type: type,
              description: description,
              amount: amount,
              Accounts: accountId,
            }).fetch();

            balance = balance - Number(amount);
            //update balance of account according to type
            await Account.updateOne({ where: { id: acc_id } }).set({
              balance: balance,
            });
            res.status(statCode.OK).json({
              message: msg.Updated,
            });
          } else {
            res.status(statCode.BAD_REQUEST).json({
              message: msg.bal,
            });
          }
        } else {
          res.status(statCode.BAD_REQUEST).json({
            message: msg.select,
          });
        }
      }
    } catch (err) {
      res.status(statCode.SERVER_ERROR).json({
        message: msg.ServerError,
      });
    }
  },
  /**
   * @description update transaction in transaction model and update totalBalance of account respectively
   * @param {request} req
   * @param {response} res
   */

  newupdate: async function (req, res) {
    try {
      const id = req.params.transactionId;
      // Find transaction by its id
      const transaction = await Transaction.find({ where: { id: id } })
        .limit(1)
        .populate("Accounts");
      const accountId = transaction[0].Accounts.id;
      //find account details by its id and set available balance in new variable
      const accountDetails = await Account.find({
        where: { id: accountId },
      })
        .limit(1)
        .populate("users");

      let balance = accountDetails[0].balance;
      const { type, description } = req.body;
      const newamount = req.body.amount;
      const amount = Number(newamount);
      // check transaction type and also check type we want to update and work accordingly
      if (transaction[0].type === "income") {
        if (type === "income") {
          balance = balance - transaction[0].amount;
          balance = balance + amount;
        } else if (type === "expense") {
          balance = balance - transaction[0].amount;
          balance = balance - amount;
        }
      }
      if (transaction[0].type === "expense") {
        if (type === "income") {
          balance = balance + transaction[0].amount;
          balance = balance + amount;
        } else if (type === "expense") {
          balance = balance + transaction[0].amount;
          balance = balance - amount;
        }
      } else {
      }
      //if balance is more than 0 only then allow to update
      if (balance >= 0) {
        await Transaction.update({ where: { id: id } }).set({
          type: type,
          description: description,
          amount: amount,
          Accounts: accountId,
        });
        //update balance of account model
        await Account.update({ where: { id: accountId } }).set({
          balance: balance,
        });
        res.status(statCode.OK).json({
          message: msg.trns_update,
        });
      } else {
        return res.status(statCode.BAD_REQUEST).json({
          message: msg.bal,
        });
      }
      // res.status(statCode.OK).json({
      //   message: msg.trns_update,
      // });
    } catch (err) {
      res.badRequest(err);
    }
  },

  /**
   * @description delete any transaction from account and update balance of account accordingly
   * @param {request} req
   * @param {response} res
   * @returns
   */

  // delete transaction
  trns_delete: async function (req, res) {
    try {
      // req id from url and find it in transaction model
      let id = req.params.transactionId;
      const transaction = await Transaction.find({
        where: { id: id },
      }).populate("Accounts");
      const accountId = transaction[0].Accounts.id;
      //find account details of that transaction
      const accountDetails = await Account.find({
        where: { id: accountId },
      }).limit(1);
      let balance = accountDetails[0].balance;
      // check type of transaction and work accordingly
      if (transaction[0].type === "income") {
        balance = balance - transaction[0].amount;
      } else if (transaction[0].type === "expense") {
        balance = balance + transaction[0].amount;
      }
      // if balance is more then 0 then update balance and then only allow to delete the transaction
      if (balance >= 0) {
        await Account.update({ where: { id: accountId } }).set({
          balance: balance,
        });
        await Transaction.destroy({
          id: id,
        });
        return res.status(statCode.OK).json({
          message: msg.trns_delete,
        });
      }
    } catch (err) {
      res.status(statCode.SERVER_ERROR).json({
        message: msg.ServerError,
      });
    }
  },
};

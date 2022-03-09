/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const msg =  sails.config.messages.Transaction;
 const statCode = sails.config.resstatus.statusCode;
module.exports = {
  // getTransaction: function (req, res) {
  //   let id = req.params.id;
  //   console.log(id)
  //   Transaction.find({where : {Accounts: id}, sort:'createdAt DESC'})
  //     .populate("Accounts")
  //     .then((docs) => {
  //       console.log(docs);
  //       res.ok(docs);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.badRequest(err);
  //     });
  // },
  getTransaction: async function (req, res) {
    try{
    let id = req.params.id;
    const trns_find = await Transaction.find({where : {Accounts: id}, sort:'createdAt DESC'})
      .populate("Accounts")
      
      if(trns_find.length < 1){
        res.status(statCode.FORBIDDEN).json({
          message: msg.Not_Found
        })
      }else{
        res.status(statCode.OK).json({
          message: trns_find
        })
      }
    }
      catch(err)  {
        console.log(err);
        res.badRequest(err);
      };
  },
  
/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
  addTransaction: async function (req, res) {
    try {
      const userid = req.userData.userId;
      const acc_name = req.body.acc_name;
      const accountData = await Account.findOne({
        where: { acc_name: acc_name },
      });
      let balance = accountData.balance;
      let accountId = accountData.id;
      const { type, description, amount } = req.body;

      if (type === "income") {
        await Transaction.create({
          type: type,
          description: description,
          amount: amount,
          Accounts: accountId,
        });

        balance = balance + Number(amount);
        await Account.updateOne({ where: { acc_name: acc_name } }).set({
          balance: balance,
        });
        res.status(statCode.OK).json({
          message: msg.Updated
        })
      } else if (type === "expense") {
        if (balance >= amount) {
          await Transaction.create({
            type: type,
            description: description,
            amount: amount,
            Accounts: accountId,
          }).fetch();

          balance = balance - Number(amount);
          await Account.updateOne({ where: { acc_name: acc_name } }).set({
            balance: balance,
          });
          res.status(statCode.OK).json({
            message: msg.Updated
          });
        } else {
          res.status(statCode.BAD_REQUEST).json({
            message:msg.bal
          })
        }
      } else {
        res.status(statCode.BAD_REQUEST).json({
          message: msg.select
        });
      }
    } catch (err) {
      res.status(statCode.SERVER_ERROR).json({
        message : msg.ServerError
      })
    }
  },
  // gettranbyid: async (req, res) => {
  //   try{
  //   let id = req.params.transactionId;
  //   console.log(id)
  //  const trns_find = await Transaction.find({where : {Accounts: id}}).populate('Accounts')
  //  console.log(trns_find)
  //     if(trns_find.length < 1){
  //       res.status(statCode.NOT_FOUND).json({
  //         message : 'transaction not found'
  //       })
  //     }
  //     else{
  //       res.status(statCode.OK).json({
  //         message: trns_find
  //       })
  //     }
   
  //  // .then((result) => {
  //     //   if (result) {
  //     //     res.ok(result);
  //     //   } else {
  //     //     res.badRequest("enter valid id");
  //     //   }
  //     // })
  //   }
  //     catch(err) {
  //       res.badRequest(err);
  //     };
  // },

  newupdate: async function (req, res) {
    try {
      const id = req.params.transactionId;
      const transaction = await Transaction.find({ where: { id: id } })
        .limit(1)
        .populate("Accounts");
      const accountId = transaction[0].Accounts.id;
      const accountDetails = await Account.find({
        where: { id: accountId },
      }).limit(1).populate('users');
      
      let balance = accountDetails[0].balance;
      const { type, description } = req.body;
      const newamount = req.body.amount;
      const amount = Number(newamount);
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
      if (balance >= 0) {
        await Transaction.update({ where: { id: id } }).set({
          type: type,
          description: description,
          amount: amount,
          Accounts: accountId,
        });
        await Account.update({ where: { id: accountId } }).set({
          balance: balance,
        });
      } else {
        res.status(statCode.BAD_REQUEST).json({
          message: msg.bal
        })
      }
      res.status(statCode.OK).json({
        message : msg.trns_update
      })
    } catch (err) {
      res.badRequest(err);
    }
  },

  // delete transaction

  trns_delete: async function (req, res) {
    try {
      let id = req.params.transactionId;
      const transaction = await Transaction.find({
        where: { id: id },
      }).populate("Accounts");
      const accountId = transaction[0].Accounts.id;
      const accountDetails = await Account.find({
        where: { id: accountId },
      }).limit(1);
      let balance = accountDetails[0].balance;
      if (transaction[0].type === "income") {
        balance = balance - transaction[0].amount;
      } else if (transaction[0].type === "expense") {
        balance = balance + transaction[0].amount;
      }

      if (balance >= 0) {
        await Account.update({ where: { id: accountId } }).set({
          balance: balance,
        });
        await Transaction.destroy({
          id: id,
        });
        return res.status(statCode.OK).json({
          message: msg.trns_delete
        })
      }
    } catch (err) {
      res.status(statCode.SERVER_ERROR).json({
        message : msg.ServerError
      })
    }
  },
};

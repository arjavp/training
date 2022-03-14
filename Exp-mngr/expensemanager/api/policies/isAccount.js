const statCode = sails.config.resstatus.statusCode;
const msg = sails.config.messages.Transaction;

/**
 * @description This policy checks that if user try to edit transaction is belongs to that particular user or not.
 * @param {request} req
 * @param {response} res
 * @param {proceed} proceed
 * @returns
 */
module.exports = (req, res, proceed) => {
  const transactionId = req.params.transactionId;
  const accountId = req.params.accountId;
  // to get particular account's transactions, user add account's id in URL to find the data
  if (accountId) {
    //now we have to fetch details of account with users
    Account.findOne({ where: { id: accountId } })
      .populate("users")
      .then((result) => {
        if(result){
        let myid = false;
        //here we checks users id which is stored in account is equal to curent logged in account
        result.users.forEach((data) => {
          if (data.id === req.userData.userId) {
            myid = true;
          }
        });
        if (myid) {
          proceed();
        } else {
          return res.status(statCode.UNAUTHORIZED).json({
            message: msg.unAuth,
          });
        }
      }else{
        res.status(statCode.NOT_FOUND).json({
          message : msg.acc_n_found
        })
      }
      });
    //to update or delete transaction we pass transaction id in URL
  } else if (transactionId) {
    // now find that id from the transaction model with Account details
    Transaction.findOne({ id: transactionId })
      .populate("Accounts")
      .then((result) => {
        const accountId = result.Accounts.id;
        //find that account id in account's model and populate users details
        Account.findOne({ where: { id: accountId } })
          .populate("users")
          .then((result) => {
            console.log(result);
            let myid = false;
            //match user's id with currently loggedIn user
            result.users.forEach((data) => {
              if (data.id === req.userData.userId) {
                myid = true;
              }
            });
            console.log(myid);
            if (myid) {
              proceed();
            } else {
              return res.status(statCode.UNAUTHORIZED).json({
                message: msg.unAuth,
              });
            }
          });
      });
  } else {
    return res.status(statCode.UNAUTHORIZED).json({
      message: msg.unAuth,
    });
  }
};

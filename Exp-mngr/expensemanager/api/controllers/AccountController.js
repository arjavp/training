/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const msg = sails.config.messages.Account;
const statCode = sails.config.resstatus.statusCode;
module.exports = {
  /**
   * @description get list of account for the user
   * @param {request} req
   * @param {response} res
   * @param {next} next
   */
  //get list of account for the user
  getacc: async (req, res, next) => {
    try {
      const docs = await user
        .find({
          where: { id: req.userData.userId },
          select: ["email", "username"],
        })
        .populate("Accounts", { select: ["acc_name", "balance"] });
      //console.log(statCode);

      if (docs.length < 1) {
        res.status(statCode.FORBIDDEN).json({
          message: msg.Not_Found,
        });
      } else {
        res.status(statCode.OK).json({
          result: docs,
        });
      }
    } catch (err) {
      res.status(404).json({
        error: err,
      });
    }
  },

  /**
   * @description create account for logged in user
   * @param {request} req
   * @param {response} res
   */

  // create account
  create: async (req, res) => {
    try {
      let { acc_name } = req.body;

      //create account by adding account name
      const acc_cre = await Account.create({
        acc_name: acc_name,
        users: req.userData.userId,
      }).fetch();

      res.status(statCode.CREATED).json({
        message: msg.Created,
      });
    } catch (err) {
      res.status(statCode.SERVER_ERROR);
    }
  },

  /**
   * @description get particular account by its id
   * @param {request} req
   * @param {response} res
   */
  // get account by id
  getaccbyid: async (req, res) => {
    try {
      //get account by its id
      let id = req.params.accountId;
      console.log(id);
      const result = await Account.find({
        where: { id: id },
        select: ["id", "acc_name", "balance"],
      }).populate("users", { select: ["id", "username", "email"] });
      if (result.length < 1) {
        res.status(404).json({
          message: "no account available",
        });
      } else {
        res.status(200).json({
          message: result,
        });
      }
    } catch (err) {
      res.badRequest(err);
    }
  },

  /**
   * @description update account by its id
   * @param {request} req
   * @param {response} res
   */

  // update account
  acc_update: async (req, res) => {
    try {
      let user = req.userData;
      let accid = req.params.accountId;
      const { acc_name } = req.body;

      //update account by its id and set new value
      const acc_update = await Account.update({ where: { id: accid } }).set({
        acc_name: acc_name,
      });

      res.status(statCode.OK).json({
        message: msg.Updated,
      });
    } catch (err) {
      res.status(statCode.SERVER_ERROR).json({
        message: msg.ServerError,
      });
    }
  },

  /**
   * @description check if user exist in user model or not and add that user as member of the account by using its email.
   * @param {request} req
   * @param {response} res
   */
  //add member to the account
  addmember: async (req, res) => {
    try {
      //find user is exist in user model or not and add that user in account as member
      await Account.findOne({ id: req.params.id });
      const user_find = await user.findOne({ email: req.body.email });
      if (user_find) {
        const acc_user = await AccountUser.findOne({
          where: { accounts: req.params.id, users: user_find.id },
        });

        if (acc_user) {
          res.status(statCode.CONFLICT).json({
            message: msg.member_Exist,
          });
        } else {
          await Account.addToCollection(req.params.id, "users").members([
            user_find.id,
          ]);
          res.status(statCode.OK).json({
            message: msg.Added,
          });
        }
      } else {
        res.status(statCode.NOT_FOUND).json({
          message: "user not found",
        });
      }

      
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  },

  /**
   * @description delete account by its id and also delete its all transaction from the model
   * @param {request} req
   * @param {response} res
   */
  // delete account
  delete: async (req, res) => {
    try {
      let accid = req.params.accountId;

      // find transactions of related account and destroy that data
      await Transaction.find({ where: { Accounts: accid } });
      await Transaction.destroy({ Accounts: accid }).fetch();
      // destroy account
      const acc_delete = await Account.destroyOne({ id: accid });
      if (acc_delete) {
        res.status(statCode.OK).json({
          message: msg.Deleted,
        });
      } else {
        res.status(403).json({
          message: "account not exist",
        });
      }
    } catch (error) {
      res.status(statCode.SERVER_ERROR).json({
        message: msg.ServerError,
      });
    }
  },
};

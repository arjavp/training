/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const msg = sails.config.messages.Account;
const statCode = sails.config.resstatus.statusCode;
module.exports = {
  //get list of account
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
      // .then((docs) => {
      //   res.ok(docs);
      // })
    } catch (err) {
      res.status(404).json({
        error: err,
      });
    }
  },

  // create account
  create: async (req, res) => {
    try {
      let { acc_name } = req.body;
      // check account is already exists or not
      const acc_find = await Account.find({ acc_name: acc_name });
      if (acc_find.length >= 1) {
        return res.status(statCode.CONFLICT).json({
          message: msg.DuplicateAccount,
        });
      } else {
        const acc_cre = await Account.create({
          acc_name: acc_name,
          users: req.userData.userId,
        }).fetch();

        res.status(statCode.CREATED).json({
          message: msg.Created,
        });
        // .then((result) => {
        //   res.ok("account created");
        // })
        // .catch((err) => {
        //   res.badRequest("account not Created", err);
        // });
      }
    } catch (err) {
      res.status(statCode.SERVER_ERROR);
    }
  },

  // get account by id
  getaccbyid: async (req, res) => {
    try {
      let id = req.params.accountId;
      console.log(id);
      const result = await Account.find({ where: { id: id } }).populate(
        "users"
      );
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
      // .then((result) => {
      //   //console.log(result);
      //   if (result) {
      //     res.ok(result);
      //   } else {
      //     res.badRequest("enter valid id");
      //   }
      // })
      res.badRequest(err);
    }
  },

  // update account
  acc_update: async (req, res) => {
    try {
      let user = req.userData;
      let accid = req.params.accountId;
      const { acc_name } = req.body;
      // const getacc = Account.find({id: accid}).populate('users', {select : ["id"]});
      // console.log(typeof getacc[0]);
      const acc_find = await Account.findOne({ where: { id: accid } }).populate(
        "users"
      );
      let myid = false;
      acc_find.users.forEach((data) => {
        //console.log('pop user id',data.id);
        if (data.id === req.userData.userId) {
          myid = true;
        }
        console.log(myid);
      });

      //console.log("user id", record[0].users[0].id);
      if (myid) {
        const acc_update = await Account.update({ where: { id: accid } }).set({
          acc_name: acc_name,
        });

        res.status(statCode.OK).json({
          message: msg.Updated,
        });
      }
    } catch (err) {
      res.status(statCode.SERVER_ERROR).json({
        message: msg.ServerError,
      });
    }
  },

  //add member to the account
  addmember: async (req, res) => {
    try {
      await Account.find({ id: req.params.id }).limit(1);
      //console.log(req.params.id);
      //console.log("result ", result);

      const user_find = await user.find({ email: req.body.email }).limit(1);
      await Account.addToCollection(req.params.id, "users").members([
        user_find[0].id,
      ]);
      if (user_find.length < 1) {
        res.status(statCode.NOT_FOUND).json({
          message: "user not found",
        });
      } else {
        res.status(statCode.OK).json({
          message: msg.Added,
        });
      }
    } catch (err) {
      // .then((data) => {
      //   res.ok({ message: "Member Added" });
      // })
      // .catch((err) => {
      //   res.badRequest("member not found");
      // });
      // .catch((err) => {
      //   res.badRequest("member not found");
      // });

      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  },

  // delete account
  delete: async (req, res) => {
    try {
      let accid = req.params.accountId;
      const acc_find = await Account.findOne({ where: { id: accid } }).populate(
        "users"
      );
      let usid = false;
      acc_find.users.forEach((data) => {
        if (data.id === req.userData.userId) {
          usid = true;
        }
      });
      if (usid) {
        await Transaction.find({ where: { Accounts: accid } });
        await Transaction.destroy({ Accounts: accid }).fetch();
        const acc_delete = await Account.destroyOne({ id: accid });

        res.status(statCode.OK).json({
          message: msg.Deleted,
        });
      } else {
        res.status(statCode.FORBIDDEN).json({
          message: msg.User_N_Found,
        });
      }
    } catch (error) {
      res.status(statCode.SERVER_ERROR).json({
        message: msg.ServerError,
      });
    }
  },
};

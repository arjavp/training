const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const msg = sails.config.messages.User;
const statCode = sails.config.resstatus.statusCode;

module.exports = {
  /**
   * @description register new user with required fields
   * @param {request} req
   * @param {response} res
   */
  register: async function (req, res) {
    try {
      let { username, email, password } = req.body;
      // check all fields inserted or not
      if (!username || !email || !password) {
        return res.status(statCode.BAD_REQUEST).json({
          message: msg.Required,
        });
      } else {
        // find user by email and if email allready exists give error
        const User = await user.find({ email: email });
        if (User.length >= 1) {
          return res.status(statCode.CONFLICT).json({
            message: msg.DuplicateEmail,
          });
        } else {
          //Create user
          await user
            .create({
              username: username,
              email: email,
              password: password,
            })
            .fetch();
          return res.status(statCode.CREATED).json({
            //status : statCode.CREATED,
            message: msg.Created,
          });
        }
      }
    } catch (error) {
      res.status(statCode.SERVER_ERROR).json({
        message: msg.ServerError,
      });
    }
  },

  /**
   * @description login with valid credentials
   * @param {request} req
   * @param {response} res
   */

  // user login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // checks the field is not empty
      if (!email || !password) {
        //return res.badRequest("Email and password required");
        return res.status(statCode.BAD_REQUEST).json({
          message: msg.Required,
        });
      }
      // find user by emailID

      const User = await user.find({ email: email });
      console.log(User[0].id);
      if (User.length < 1) {
        return res.status(statCode.UNAUTHORIZED).json({
          message: msg.Auth_fail,
        });
      }
      //compare entered password with encrypted password
      bcrypt.compare(password, User[0].password, (err, result) => {
        if (err) {
          return res.status(statCode.UNAUTHORIZED).json({
            message: msg.Auth_fail,
          });
        }
        //if password match then generate jwt token for that user
        if (result) {
          const token = jwt.sign(
            {
              email: User[0].email,
              userId: User[0].id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2h",
            }
          );
          // update token field in user collection
          user
            .updateOne({ where: { id: User[0].id } })
            .set({ token: token })
            .then((result) => {});

          return res.status(statCode.OK).json({
            message: msg.Auth,
            token: token,
          });
        } else {
          res.status(statCode.UNAUTHORIZED).json({
            message: msg.Auth_fail,
          });
        }
      });
    } catch (error) {
      res.status(statCode.SERVER_ERROR).json({
        message: msg.ServerError,
        error: error,
      });
    }
  },

  /**
   * @description logout user
   * @param {request} req
   * @param {response} res
   */
  // logout
  Logout: async (req, res) => {
    try {
      // logout user by checking logged in user's ID
      let id = req.userData.userId;
      // update user model and set token as null
      const user_logout = await user
        .updateOne({ where: { id: id } })
        .set({ token: null });
      res.status(statCode.OK).json({
        message: msg.LogOut,
        result: user_logout,
      });
    } catch (error) {
      res.serverError(error);
    }
  },

  /**
   * @description get all users from the database
   * @param {request} req
   * @param {response} res
   */
  getUsers: async function (req, res) {
    try {
      const docs = await user.find().populate("Accounts");
      if (docs.length < 1) {
        res.status(statCode.NOT_FOUND).json({
          message: msg.No_User,
        });
      } else {
        res.status(statCode.OK).json({
          message: msg.Ok,
          result: docs,
        });
      }
    } catch (err) {
      res.badRequest(err);
    }
  },
};

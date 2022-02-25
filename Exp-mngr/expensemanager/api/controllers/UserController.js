const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
module.exports = {
  register: function (req, res) {
    // return res.ok('ok');
    let { username, email, password } = req.body;
    // check if mail is already exist?
    if (!username || !email || !password) {
      res.badRequest("all fields required");
    }
    // find user by email and if email allready exists give error
    else
      user.find({ email: email }).then((User) => {
        if (User.length >= 1) {
          res.badRequest("mail already exists");
        } else {
          //Create user
          user
            .create({
              username: username,
              email: email,
              password: password,
            })
            .fetch()
            .then((result) => {
              res.ok("user created", result);
            })
            // then(result=>{
            //   console.log(result)
            //   Account.create({
            //     users: result._id,
            //     acc_name: result.username +" default",
            //     balance: 0,
            //     members:[{name: result.username,email: result.email}]

            //   }).then((docs) => {
            //     console.log(docs)
            //     res.ok("user created",docs);
            //   })

            // })
            // (err, result) => {
            //   if (err) {
            //     return res.serverError(err);
            //   }

            //   return res.ok("user created", result);

            // }

            .catch((err) => {
              res.badRequest("pls enter valid details");
            });
        }
      }).catch(err => {
        res.badRequest(err)
      })
  },

  // user login
  login: (req, res) => {
    const { email, password } = req.body;
    // checks the feiled is not empty
    if (!email || !password)
      return res.badRequest("Email and password required");

    // find user by emailID
    user
      .find({ email: email })
      .then((User) => {
        //console.log(req.body.password)
        //console.log(User);
        if (User.length < 1) {
          return res.status(401).json({
            message: "Auth Faild",
          });
        }
        bcrypt.compare(password, User[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth Faild",
            });
          }
          if (result) {
            //res.ok('user logedin ');
            const token = jwt.sign(
              {
                email: User[0].email,
                userId: User[0]._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "5h",
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
            });
          } else {
            res.status(401).json({
              message: "Auth Faild",
            });
          }
        });
        //.then((User) => {

        // if (!User) return res.badRequest("User not Found");

        // //compare password
        // user
        //   .comparePassword(password, User.password)

        //   .then(() => {
        //     return res.ok("user logedIn successfully");
        //   })
        //   .catch((err) => {
        //     return res.forbidden("pls enter valid email or password");
        //   });
        //})
      })
      .catch((err) => {
        sails.log.error(err);
        return res.serverError();
      });
  },

  getUsers: function (req, res) {
    user
      .find()
      .populate("Accounts")
      .then((docs) => {
        res.ok(docs);
      })
      .catch((err) => {
        res.badRequest(err);
      });
  },
};

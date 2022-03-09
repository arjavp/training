const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const msg =  sails.config.messages.User;
const statCode = sails.config.resstatus.statusCode;

module.exports = {
/**
 * @description 
 * @param {request} req 
 * @param {response} res 
 */
   register: async function (req,res){
     try {
      let { username, email, password } = req.body;
    // check all fields inserted or not 
     if (!username || !email || !password) {
      return res.status(statCode.BAD_REQUEST).json({
        message: msg.Required
      })
     }else{
    // find user by email and if email allready exists give error
      const User = await user.find({email : email})
      if (User.length >= 1) {
                return  res.status(statCode.CONFLICT).json({
                  message: msg.DuplicateEmail
                })
                } else {
                  //Create user
              await  user
                    .create({
                      username: username,
                      email: email,
                      password: password,
                    }).fetch()
                   return res.status(statCode.CREATED).json({
                     //status : statCode.CREATED,
                     message: msg.Created
                   })
                  }

     }
     } catch (error) {
       res.status(statCode.SERVER_ERROR).json({
         message : msg.ServerError
       })
       
     }
   }, //function (req, res) {
  //   // return res.ok('ok');
  //   let { username, email, password } = req.body;
  //   // check if mail is already exist?
  //   if (!username || !email || !password) {
  //     res.badRequest("all fields required");
  //   }
  //   // find user by email and if email allready exists give error
  //   else
  //     user
  //       .find({ email: email })
  //       .then((User) => {
  //         if (User.length >= 1) {
  //           res.badRequest("mail already exists");
  //         } else {
  //           //Create user
  //           user
  //             .create({
  //               username: username,
  //               email: email,
  //               password: password,
  //             })
  //             .fetch()
  //             .then((result) => {
  //               res.status(201).json({
  //                 message : 'welcome'
  //               })
  //             })

  //             .catch((err) => {
  //               res.badRequest("pls enter valid details");
  //             });
  //         }
  //       })
  //       .catch((err) => {
  //         res.badRequest(err);
  //       });
  // },

  // user login
  login: async (req, res) =>  {
    try{
    const { email, password } = req.body;
    // checks the field is not empty
     if (!email || !password) {
       //return res.badRequest("Email and password required");
       return res.status(statCode.BAD_REQUEST).json({
        message: msg.Required
      })
      }
    // find user by emailID
    
    const User = await user.find({email: email})
    console.log(User[0].id)
    if (User.length < 1) {
            return res.status(statCode.UNAUTHORIZED).json({
              message: msg.Auth_fail
            });
          }
          bcrypt.compare(password, User[0].password, (err, result) => {
            if (err) {
              return res.status(statCode.UNAUTHORIZED).json({
                message: msg.Auth_fail
              });
            }
            if (result) {
              //res.ok('user logedin ');
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
             user.updateOne({where:{id: User[0].id}}).set({token : token}).then(result => {
               //console.log(result)
             })
             

              return res.status(statCode.OK).json({ 
                message: msg.Auth,
                token: token,
              });
            } else {
              res.status(statCode.UNAUTHORIZED).json({
                message: msg.Auth_fail
              });
            }
          });
        } catch (error){
          res.status(statCode.SERVER_ERROR).json({
            message : msg.ServerError,
            error : error

          })

        }

  },
    // const { email, password } = req.body;
    // // checks the feiled is not empty
    // if (!email || !password)
    //   return res.badRequest("Email and password required");

    // // find user by emailID
    // user
    //   .find({ email: email })
    //   .then((User) => {
    //     //console.log(req.body.password)
    //     //console.log(User);
    //     if (User.length < 1) {
    //       return res.status(401).json({
    //         message: "Auth Faild",
    //       });
    //     }
    //     bcrypt.compare(password, User[0].password, (err, result) => {
    //       if (err) {
    //         return res.status(401).json({
    //           message: "Auth Faild",
    //         });
    //       }
    //       if (result) {
    //         //res.ok('user logedin ');
    //         const token = jwt.sign(
    //           {
    //             email: User[0].email,
    //             userId: User[0].id,
    //           },
    //           process.env.JWT_KEY,
    //           {
    //             expiresIn: "180s",
    //           }
    //         );
    //         return res.status(200).json({
    //           message: "Auth successful",
    //           token: token,
    //         });
    //       } else {
    //         res.status(401).json({
    //           message: "Auth Faild",
    //         });
    //       }
    //     });
    //   })
    //   .catch((err) => {
    //     sails.log.error(err);
    //     return res.serverError();
    //   });



    Logout: async (req,res) => {
      try {
        let id = req.userData.userId;
        console.log(typeof id)
        const user_logout = await user.updateOne({where: {id : id}}).set({token : null })
        console.log(user_logout)
        res.status(statCode.OK).json({
          message:msg.LogOut,
          result: user_logout
        })
      } catch (error) {
        res.serverError(error)
        
      }
    },
  

  getUsers: async function (req, res) {
    try{
   const docs = await user
      .find()
      .populate("Accounts")
      if(docs.length < 1){
      res.status(statCode.NOT_FOUND).json({
        message: msg.No_User
      })
    }else{
      res.status(statCode.OK).json({
        message : msg.Ok,
        result: docs
      })
    }
    }
      catch(err)  {
        res.badRequest(err);
      };
  },
};

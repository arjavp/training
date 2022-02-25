const bcrypt = require("bcrypt");

module.exports = {
  attributes: {
    username: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
      isEmail: true,
      required: true,
      regex: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
      type: "String",
      minLength: 8,
      required: true,
    },
    // Add a reference to accounts
    Accounts: {
      collection: "account",
      via: "users",
    },
  },

  // encrypt password before creating user
  beforeCreate(values, next) {
    bcrypt.hash(values.password, 10, (err, hash) => {
      if (err) {
        sails.log.error(err);
        return next();
      }
      values.password = hash; // Here is our encrypted password
      return next();
    });
  },

  // send welcome mail after user signup
  afterCreate: async function (user, proceed) {
    try {
      await sails.helpers.sendMail.with({
        to: user.email,
      });
      let results = await Account.create({
        users: user.id,
        acc_name: user.username + "'s default account",
        balance: 123,
        members: [{ name: user.username, email: user.email }],
      }).fetch();
      console.log(results);
      // let docs = await user.addToCollection(user.id, "Account").members([user.acc_name]);
      // console.log(docs);
    } catch (err) {
      console.log(err);
    }
  

    proceed();
  },

  // comparePassword(password, encryptedPassword) {
  //   return new Promise(function (resolve, reject) {
  //     bcrypt.compare(password, encryptedPassword, (err, match) => {
  //       if (err) {
  //         sails.log.error(err);
  //         return reject("Something went wrong!");
  //       }
  //       if (match) return resolve();
  //       else return reject("Mismatch passwords");
  //     });
  //   });
  // },
};

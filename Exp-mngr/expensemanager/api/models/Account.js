/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    acc_name: {
      type: "String",
      required: true,
    },

    members: { type: "json" },
    balance: {
      type: "Number",
    },

    users: { type: "String" },
    // Add a reference to user
    users: {
      collection: "user",
      via: "accounts",
      through: "accountuser",
    },

    // add reference to transaction model
    transactions: {
      collection: "transaction",
      via: "Accounts",
    },
  },
};

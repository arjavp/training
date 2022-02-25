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
    // Add a reference to user
    users: {
      model: "user",
    },

    // add reference to transaction model
     transaction: {
      collection: "transaction",
      via: "accounts",
    },
  },
};

/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */



module.exports.routes = {
  "GET /getusers": "UserController.getUsers",
  "POST /signup": "UserController.register",
  "POST /login": "UserController.login",
  "POST /logout": "UserController.Logout",
  "POST /addaccount": "AccountController.create",
  "DELETE /account/:accountId": "AccountController.delete",
  "GET /account": "AccountController.getacc",
  "GET /account/:accountId": "AccountController.getaccbyid",
  "PATCH /account/:accountId": "AccountController.acc_update",
  "POST /account/addmember/:id": "AccountController.addmember",
  "GET /transaction/:id": "TransactionController.getTransaction",
  "POST /transaction/addtransaction": "TransactionController.addTransaction",
  "PATCH /transaction/:transactionId": "TransactionController.newupdate",
  "DELETE /transaction/:transactionId": "TransactionController.trns_delete",
};

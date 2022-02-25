/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const TransactionController = require("../api/controllers/TransactionController");

module.exports.routes = {
    "GET /getusers" : "UserController.getUsers",
    "POST /signup" : "UserController.register",
    "POST /login" : "UserController.login",
    "POST /addaccount" : "AccountController.create",
    "DELETE /:accountId" : "AccountController.delete",
    "GET /account" : "AccountController.getacc",
    "GET /:accountId" : "AccountController.getaccbyid",
    "PATCH /:accountId" : "AccountController.acc_update",
    "GET /transaction" : "TransactionController.getTransaction",
    "POST /addtransaction" : "TransactionController.addTransaction",
    "GET /:transactionId" : 'TransactionController.gettranbyid',
    "PATCH /:transactionId" : 'TransactionController.trns_update',
    "DELETE /:transactionId" : 'TransactionController.trns_delete',


};

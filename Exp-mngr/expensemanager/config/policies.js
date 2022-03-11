/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */


module.exports.policies = {
  AccountController: {
    //'*': ['isAuthentication','isUser']
    'getacc': ['isAuthentication','isLogIn'],
    'create': ['isAuthentication','isLogIn'],
    'getaccbyid':['isAuthentication','isUser','isLogIn'],
    'acc_update':['isAuthentication','isUser','isLogIn'],
    'delete':['isAuthentication','isUser','isLogIn']
  },
  
  TransactionController:{
    '*': ['isAuthentication','isLogIn']
  },
  
  'UserController' :{
    'Logout' : ["isAuthentication",'isLogIn'],
    "*":true
  }

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

};

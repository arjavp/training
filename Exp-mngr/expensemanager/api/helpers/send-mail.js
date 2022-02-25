module.exports = {


  friendlyName: 'Send mail',


  description: '',


  inputs: {
    to: {
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    // TODO
    
    
    const nodemailer = require('nodemailer');
    var transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'fdfd459a974641',
        pass: '7d17407b1db965'
      }
    });
    var data = {
      from: 'expensemanager@gmail.com',
      to: inputs.to,
      subject: 'Welcome email',
      text: 'Welcome to expense manager'
    };
    
    transport.sendMail(data, (err) => {
      if(err) {
        console.log('Error occured : ' + err);
      } else {
        console.log('Email sent');
      }
    });
    
  }


};


var nodeMailer = require('nodemailer');

var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'flap.jacks.cs@gmail.com',
      pass: 'Sneezer1'
    }
  });
  
  var mailOptions = {
    from: 'Jaco@gmail.com',
    to: 'flap.jacks.cs@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'This email is just testing if i can send emails in node js FROM JACO'
  };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

  module.exports = {

    sendMail: function()
    {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }


  }
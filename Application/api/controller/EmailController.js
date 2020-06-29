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
  

  var passwordChangeOptions = {
    from: 'Jaco@gmail.com',
    to: 'flap.jacks.cs@gmail.com',
    subject: '3D Render Password Change',
    html:'<div style="background-color: #343a40; width: 400px; padding: 10px; border-radius: 10px; position:relative;margin:0 auto; margin-top: 100px;"><h1 style="color:white;text-align: center;">Password Reset</h1><hr><h2 style="color:lightblue;text-align: center;" id="emailLink"><!--insert email here (inner html)-->email...</h2><p style="text-align: center; color:white;">You have requested to change your password. <br>Simply click on the link below to reset your password.</p><div style="text-align:center;"><a style="color:lightblue;" href="">Reset Password</a></div><hr><p style="text-align: center; color:white; font-size: 13px;">If this was not you, please ignore this email.<br>Your passowrd will remain the sam.</p></div>'
  };

  module.exports = {

    passwordChangeEmail: function(req , res)
    {
        transporter.sendMail(passwordChangeOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          res.send(200);
    }


  }
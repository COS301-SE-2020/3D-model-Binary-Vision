//Created by Jacobus Janse van Rensburg
//
//This file contains the API function declarations and implementations for all functionality of sending emails to users

var nodeMailer = require('nodemailer');
const { Doctor, Receptionist, PasswordChanges } = require('../model/3DModelModel');


//var transporter = nodeMailer.createTransport({
//    host:"smtp.mailtrap.io",
//    port: 2525,
//    auth:{
//        user:"0c9f2b08034ef4",
//        pass:"c1fd4b36bbc842"
//    } 
//});



var transporter = nodeMailer.createTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
          user: 'flap.jacks.cs@gmail.com',
          pass: 'Replace me with the app password'
      }
  });

module.exports = {

    //========================================================================================
    //function developed by Jacobus Janse van Rensburg
    //sends a email to the user to allow the user to change their passwords
    passwordChangeEmail: function(req , res)
    {
        // need to see if the email is actually in the database
        const {email} = req.body;

        Doctor.findOne({email} , function(err, doctor){
            if ( doctor )
            {
                sendPasswordResetEmail(req);
                res.status(200).send("ok");
                return;
            }
            else
            {
                Receptionist.findOne({email}, function (err, receptionist)
                {
                    if ( receptionist )
                     {
                         sendPasswordResetEmail(req);
                         res.status(200).send("ok");
                         return; 
                     }
                     else 
                     {
                         res.status(400).send("not ok");
                         return;
                     }
                 });
            }
        });
        return;
    },


    //===================================================================================
    //function developed by Jacobus Janse van Rensburg
    signupEmail: function (req ,res)
    {
        var passwordChangeOptions = 
        {
            from: 'flap.jacks.cs@gmail.com',
            to:req.body.email,
            subject: '3D Render Password Change',
            html:'<div style="background-color: #343a40; width: 400px; padding: 10px; border-radius: 10px; position:relative;margin:0 auto; margin-top: 100px;"><h1 style="color:white;text-align: center;">Password Reset</h1><hr><h2 style="color:lightblue;text-align: center;" id="emailLink">USER_EMAIL_HERE</h2><p style="text-align: center; color:white;">You have requested to change your password. <br>Click on the link below to reset your password.</p><div style="text-align:center;"><a style="color:lightblue;" href="RESET_PASSWORD_URL">Reset Password</a></div><hr><p style="text-align: center; color:white; font-size: 13px;">If this was not you, please ignore this email.<br>Your passowrd will remain the same.</p></div>'
        };

    }
}

//======================================================================================================
//function developed by: Jacobus Jane van Rensburg 
//Email HTML developed by rani
//function that sends the actual email to reset the users password
function sendPasswordResetEmail(req)
{
    var email = req.body.email;
    var record = new PasswordChanges({email});
    var id = record._id;
    //store a temporary record in the database with a id to mach for a valid password change 
    record.save(function (err)
    {
        if (err){
            console.log(err);
        }
        
    });

    //setting the details of the email to be sent
    var passwordChangeOptions = 
    {
        from: 'flap.jacks.cs@gmail.com',
        to:req.body.email,
        subject: '3D Render Password Change',
        html:'<div style="background-color: #343a40; width: 400px; padding: 10px; border-radius: 10px; position:relative;margin:0 auto; margin-top: 100px;"><h1 style="color:white;text-align: center;">Password Reset</h1><hr><h2 style="color:lightblue;text-align: center;" id="emailLink">USER_EMAIL_HERE</h2><p style="text-align: center; color:white;">You have requested to change your password. <br>Click on the link below to reset your password.</p><div style="text-align:center;"><a style="color:lightblue;" href="RESET_PASSWORD_URL">Reset Password</a></div><hr><p style="text-align: center; color:white; font-size: 13px;">If this was not you, please ignore this email.<br>Your passowrd will remain the same.</p></div>'
    };

    // setting the variants in the email that is dependent on certain users
    // var resetURL="lacalhost:3000/ResetPassword.html?email="+req.body.email+"&code="+id;
    var resetURL="https://flapjacks.goodx.co.za/ResetPassword.html?email="+req.body.email+"&code="+id;
    passwordChangeOptions.html = passwordChangeOptions.html.replace('RESET_PASSWORD_URL',resetURL);
    passwordChangeOptions.html = passwordChangeOptions.html.replace('USER_EMAIL_HERE',req.body.email);
    //send the actual email
    transporter.sendMail(passwordChangeOptions, function(error, info)
    {
        if (error) 
        {
            console.log(error);
        } 
    });

}

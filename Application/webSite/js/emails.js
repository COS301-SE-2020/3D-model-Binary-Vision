//File created by Jaco Janse van Rensburg
//Class used to handle all the api calls to send emails to the users


//===================================================================================================
//function developed by: Jacobus Janse van Rensburg 
//functions handles the api call to send a password reset email to the user and hanndles all the error codes
//that can arrive
function passwordchangeEmail(){

    var email = document.querySelector("#email").value;
    var response = fetch("/passwordChangeEmail",{
        method:"POST", 
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({email})
    });


    response.then(res =>  {
        //decoded response to see if any errors occured
        console.log('res status: '+res.status);
        if (res.status==200)
        {
            //all ok and tell user to check emails
            console.log('check emails');
            document.querySelector("#response").innerHTML="Please see email sent to "+ email+" for instructions on changing password";
        }
        else if (res.status ==401){
            //email not found in database
            console.log('email not found');
            document.querySelector("#response").innerHTML="The email provided does not match registered emails";
        }
    });

}
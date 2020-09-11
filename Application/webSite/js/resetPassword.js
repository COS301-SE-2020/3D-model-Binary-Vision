//File created by Jacobus Janse van Rensburg
// file that contains checks and functions in order for a user to change
//his/her email address

function changePassword(){
    
    var p1 = document.querySelector("#password").value;
    var p2 = document.querySelector("#confirmpassword").value;

    if (p1 == "" || p2 =="")
    {
        //one field is missing there for we need to indicate that
    }
    else if (p1 != p2)
    {
        //the fields do not match
    }
    else{
        //passwords match and we can store them in the database
        var frontSalt ="COS301";
        var backSalt ="FlapJacks";
        var saltedPasword = frontSalt+ password.value+backSalt;

        var frontEndHashedPassword = CryptoJS.MD5(saltedPasword).toString();

        var url = window.location.href;
        var parts = url.split("?");
        parts = parts[1].split("&");
        var emailparts = parts[0].split("=");
        var email = emailparts[1];

        var codeparts = parts[1].split("=")
        var code = codeparts[1];

        console.log("email: "+email+"\nCode: "+code);

        var response = fetch("/resetPassord",{
            method:"POST",
            headers:{'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({email , 'password':frontEndHashedPassword, 'code': code})
        });

        response.then(res =>  {
            if (res.status == 200)
            {
                window.location.href = "/login.html";
            }

            else{
                // maybe redirect to a security issue page
            }
        });

    }
}
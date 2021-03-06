//File created by: Jacobus Janse van Rensburg
//File made to to do api call to the login function with hasshed password

//===============================================================================================
//Function developed by: Jacobus Janse van Rensburg
//function used to handel the login of a patient
function login()
{
    document.getElementById("errorResponse").innerHTML = "";

    var username = document.querySelector("#username");
    var password = document.querySelector("#password");

    if(username.value != "" && password.value!="")
    {
        //salt and hash the password
        var frontSalt ="COS301";
        var backSalt ="FlapJacks";

        var saltedPasword = frontSalt+ password.value+backSalt;
        var frontEndHashedPassword = CryptoJS.MD5(saltedPasword).toString();

        var response = fetch("/login",
        {
            method:"POST",
            headers:{'Content-Type':'application/json; charset=utf-8'},
            body:JSON.stringify({"username":username.value,"password":frontEndHashedPassword})
        });

        response.then(res => 
        {

            if(res.status == 404)
            {
                document.querySelector("#errorResponse").innerHTML="Invalid login credentials";
            }
            else
            {
                window.location.href= res.url;
            }
        });

    }
    else
    {
        //indicate that some fields are missing
        if (username.value == "" && password.value == "") 
        {
            document.querySelector("#errorResponse").innerHTML="Please enter username and password";
        } 
        else if (username.value == "") 
        {
            document.querySelector("#errorResponse").innerHTML="Please enter username";
        } 
        else if (password.value == "") 
        {
            document.querySelector("#errorResponse").innerHTML="Please enter password";
        }
    }
}
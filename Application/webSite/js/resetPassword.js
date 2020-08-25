//File created by Jacobus Janse van Rensburg
// file that contains checks and functions in order for a user to change
//his/her email address

function changePassword(){
    
    var p1 = document.querySelector("#password").value;
    var p2 = document.getElementById("#confirmpassword").value;

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
        

        var url = window.location.href;
        var parts = url.split("=");
        var email = parts[1];


        var response = fetch("/resetPassord",{
            method:"POST",
            headers:{'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({email , 'password':saltedPasword})
        });

        response.then(res => res.json().then(data => {
            console.log(data);
        }));

    }
}
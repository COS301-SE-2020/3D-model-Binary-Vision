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

    }
}
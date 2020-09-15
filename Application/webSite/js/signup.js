// File c reated by: Jacobus Janse van Rensburg
//file containing all the checks and hashing required to add a user

//variable used to to indicate if the checks are completed without finding a match for username or email in the database and that the user is allowed to be registerd
var usedParamaters=false;

//==================================================================
// Function developed by: Jacobus janse van Rensburg
//initialize the page with event listeners to indicate if the passwords or emails do not match

function init()
{
    //event listener that will indicate if the emails match
    document.querySelector("#emailCheck").addEventListener("onchange",function(){
        var email = document.querySelector("#email");
        var emailCheck = document.querySelector("#emailCheck");
        if(email.value != emailCheck.value){
            //make emailcheck background red
            emailCheck.style.backgroundColor="red";
            email.style.backgroundColor="red";
        }
        else{
            //make emailCheck background green
            emailCheck.style.backgroundColor="green";
            email.style.backgroundColor="green";
        }
    });

    //event listener that will indicate if the passwords matches 
    document.querySelector("#passwordCheck").addEventListener("onchange",function(){
        var password = document.querySelector("#password");
        var passwordCheck=document.querySelector("#password");
        if(password.value != passwordCheck.value){
            //passwords do not match
            passwordCheck.style.backgroundColor = "red";
            password.style.backgroundColor="red";
        }
        else{
            //passwords match
            passwordCheck.style.backgroundColor="green";
            password.style.backgroundColor="green";
        }
    });

    //change the background colour to white a choice is provided
    document.querySelector("#choice").addEventListener("onchange",function(){
        document.querySelector("#choice").style.backgroundColor="white";
    });
    document.querySelector("#name").addEventListener("onchange",function(){
        document.querySelector("#name").style.backgroundColor="white";
    });
    document.querySelector("#surname").addEventListener("onchange",function(){
        document.querySelector("#surname").style.backgroundColor="white";
    });

}

function signup()
{
    usedParamaters = false;
    var name = document.querySelector("#name");
    var surname = document.querySelector("#surname");
    var email = document.querySelector("#email");
    var username = document.querySelector("#username");
    var password = document.querySelector("#password");
    var passwordCheck = document.querySelector("#passwordCheck");
    var practice = document.querySelector("#practice");
    var security = document.querySelector("#securityCode");
    var selectionElement = document.getElementById("choice");
    var errorData = document.querySelector("#errorOutput");
    
    errorData.style.color = "red";
    var choice = selectionElement.options[selectionElement.selectedIndex].value ;
    var securityCode = document.querySelector("#securityCode").value;

    if(name.value == "")
    {
        usedParamaters=true;

        //indicate that it is ""
        name.placeholder="Please enter name";
        name.style.backgroundColor="red";
        errorData.innerHTML = "<i>Please enter your name!</i>";
        name.style.color="white";
        name.focus();
    }
    else if(name.value != "")
    {
        name.style.backgroundColor="lightgreen";
        name.style.color="black";

        if(surname.value=="")
        {
            usedParamaters=true;
            surname.placeholder="Please enter surname";
            surname.style.backgroundColor="red";
            errorData.innerHTML = "<i>Please enter your surname!</i>";
            surname.style.color="white";
            surname.focus();
        }
        else if(surname.value != "")
        {
            surname.style.backgroundColor="lightgreen";
            surname.style.color="black";

            if(email.value == "")
            {

                usedParamaters=true;
                email.style.backgroundColor="red";
                email.placeholder="please enter a valid email";
                errorData.innerHTML = "<i>Email field is empty!</i>";
                email.style.backgroundColor="red";
                email.style.color="white"; 
                email.value="";
                email.focus();
            }
            else if(email.value != "")
            {
                checkEmail(email.value);
                if(usedParamaters == true)
                {
                    email.style.backgroundColor="red";
                    email.placeholder="please enter a valid email";
                    errorData.innerHTML = "<i>Email field is empty!</i>";
                    email.style.backgroundColor="red";
                    email.style.color="white"; 
                    email.value="";
                }
                else
                {
                    email.style.backgroundColor="lightgreen";
                    email.style.color="black";
                    if (username.value !="")
                    {
                        checkUsername(username.value);
                        username.style.backgroundColor="lightgreen";
                        username.style.color="black";

                        if(password.value != "" && passwordCheck.value !="")
                        {
                            if(password.value != passwordCheck.value)
                            {
                                usedParamaters=true;
                                //indicate that they dont match
                                passwordCheck.placeholder="password does not match";
                                password.placeholder = "password does not match";
                                passwordCheck.value="";
                                password.value="";
                                passwordCheck.style.backgroundColor="red";
                                password.style.backgroundColor="red";
                                errorData.innerHTML = "<i>Passwords do not match!</i>"
                            }
                            else
                            {
                                passwordCheck.style.color="black";
                                passwordCheck.style.backgroundColor="lightgreen";
                                password.style.color="black";
                                password.style.backgroundColor="lightgreen";
                            }
                        }
                        else if(password.value == "" && passwordCheck.value !="")
                        {
                            usedParamaters=true;
                            password.placeholder="password field is empty";
                            password.value="";
                            password.style.backgroundColor="red";
                            passwordCheck.style.backgroundColor="white";
                            password.style.color="white";
                            passwordCheck.style.color="black";
                            errorData.innerHTML = "<i>Password field is empty, please type password.</i>";
                            passwordCheck.focus();
                        }
                        else if(password.value != "" && passwordCheck.value =="")//one of the passwords is null
                        {
                            usedParamaters=true;
                            passwordCheck.placeholder="password does not match";
                            passwordCheck.value="";
                            passwordCheck.style.backgroundColor="red";
                            passwordCheck.style.color="white";
                            errorData.innerHTML = "<i>Confirm password field is empty, please type password.</i>";
                            password.style.backgroundColor="white";
                            password.style.color="black";
                            password.focus();
                        }
                        else if(password.value == "" && passwordCheck.value =="")
                        {
                            usedParamaters=true;
                            passwordCheck.placeholder="Both Password fields are empty!";
                            passwordCheck.value="";
                            passwordCheck.style.backgroundColor="red";
                            passwordCheck.style.color="white";
                            password.style.color="white";
                            errorData.innerHTML = "<i>Confirm password field is empty, please type password.</i>";
                            password.style.backgroundColor="red";
                            password.focus();
                        }
                        if(usedParamaters != true)
                        {
                            errorData.innerHTML = "<i></i>";
                            if(practice.value == "")
                            {
                                usedParamaters=true;
                                //indicate that practice is ""
                                practice.placeholder="Please enter Practice";
                                practice.style.backgroundColor="red";
                                errorData.innerHTML = "<i>Please enter the Practice!</i>";
                                practice.focus();
                            }
                            else
                            {
                                practice.style.backgroundColor="lightgreen";
                                practice.style.color="black";
                                errorData.innerHTML = "<i></i>";
                                if(security.value == "")
                                {
                                    usedParamaters=true;
                                    //indicate that practice is ""
                                    security.placeholder="Please enter Security Code";
                                    security.style.backgroundColor="red";
                                    errorData.innerHTML = "<i>Please enter the Security Code</i>";
                                    security.focus();
                                }
                                else
                                {
                                    security.style.backgroundColor="lightgreen";
                                    security.style.color="black";
                                }
                            }
                        }
                    }
                    else
                    {
                        usedParamaters=true;
                        username.placeholder="Please enter username";
                        username.style.backgroundColor="red";
                        errorData.innerHTML = "<i>Please enter your username!</i>";
                        username.style.color="white";
                        username.focus();
                    }
                }
            }
        }
    }
    
    addUser(name , surname, email ,username,choice,practice , securityCode);    
}

//===============================================================================================
//Function developed by: Jacobus Janse van Rensburg
//Function used to check if the database contains a user that has the same username
function checkUsername(username)
{
    var response = fetch('/isValidUsername',{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body:JSON.stringify({"username":username})
    });

    response.then(res=> {
        if(res.status == 422){
            //the username was invalid
            this.usedParamaters=true;
            document.querySelector("#username").style.backgroundColor="red";
            stop();
        }
    });

}

//===============================================================================================
//Function developed by: Jacobus Janse van Rensburg
//function used to check if there is someone that has the same email in use already
function checkEmail(email)
{
    var response = fetch('/isValidEmail',{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body:JSON.stringify({"email":email})
    });

    response.then(res=> res.json().then(data=>{
        if(res.status ==422){
            //the email was invalid
            this.usedParamaters=true;
            document.querySelector("#email").style.backgroundColor="red";
            stop();
        }
    }));
}

async function stop()
{
    usedParamaters=true;
}

//=====================================================================================
//Function developed by: Jacobus Janse van Rensburg
// adding a user if its allowed
function addUser(name , surname, email ,username,choice,practice , securityCode)
{
    
    if(usedParamaters!=true && choice!="")
    {
        //make the api call with the hashed password to sign up a new user 

        var frontSalt ="COS301";
        var backSalt ="FlapJacks";
        var saltedPasword = frontSalt+ password.value+backSalt;

        var e = document.querySelector("#email");
        var u = document.querySelector("#username");
        var p = document.querySelector("#practice");
        var s = document.querySelector("#securityCode");
        var errorData = document.querySelector("#errorOutput");

        var frontEndHashedPassword = CryptoJS.MD5(saltedPasword).toString();

        var response = fetch("/signup",
        {
            method:"POST",
            headers:{'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({"name":name.value , "surname":surname.value , "email":email.value ,"username":username.value , "password":frontEndHashedPassword, choice,"practition":practice.value , "securityCode":securityCode})
        })

        response.then(res => 
        {
            if(res.status == 402)
            {
                e.value = "";
                e.placeholder="Email already exists";
                e.style.backgroundColor="red";
                errorData.innerHTML = "<i>Email already exists!</i>";
                e.focus();
            }
            else if(res.status == 402)
            {
                u.value = "";
                u.placeholder="Username already exists";
                u.style.backgroundColor="red";
                errorData.innerHTML = "<i>Username already exists!</i>";
                u.focus();
            }
            else if(res.status == 404)
            {
                p.value = "";
                p.placeholder="Practice Invalid";
                p.style.backgroundColor="red";
                errorData.innerHTML = "<i>Practice does not exist!</i>";
                p.focus();
            }
            else if(res.status == 403)
            {
                s.value = "";
                s.placeholder="try again";
                s.style.backgroundColor="red";
                errorData.innerHTML = "<i>Security code is incorrect!</i>";
                s.focus();
            }
            else
            {
                var today = new Date();
                var date = today.getDate() + '/' + (today.getMonth()+1) +'/'+ today.getFullYear();
                var hours = today.getHours();
                var minutes = today.getMinutes();
                var seconds = today.getSeconds();
                var time = hours + ":" + minutes + ":" + seconds ;
                var line = date + "@" + time + "@" + username.value + "@Registered as a " + choice;
                var resp = fetch("/updateLog",{
                    method:"POST",
                    headers:{'Content-Type':'application/json; charset=utf-8'},
                    body:JSON.stringify({"practice":practice.value,"line":line})
                });
                window.location.href = res.url;
            }
        });
    }
    else
    {
        console.log("Could not make a new doctor");
    }
}
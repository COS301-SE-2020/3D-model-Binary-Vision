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
    var name = document.querySelector("#name");
    var surname = document.querySelector("#surname");
    var email = document.querySelector("#email");
    var emailCheck = document.querySelector("#emailCheck");
    var username = document.querySelector("#username");
    var password = document.querySelector("#password");
    var passwordCheck = document.querySelector("#passwordCheck");
    var practice = document.querySelector("#practice");
    var selectionElement = document.getElementById("choice");
    var choice = selectionElement.options[selectionElement.selectedIndex].value ;
    //check that the passwords match
    console.log("choice: "+choice);
    if(password.value != "" && passwordCheck.value !=""){
        if(password.value != passwordCheck.value){
            usedParamaters=true;
            //indicate that they dont match
            passwordCheck.placeholder="password does not match";
            passwordCheck.value="";
            passwordCheck.style.backgroundColor="red";
        }
    }
    else{//one of the passwords is null
        usedParamaters=true;
        passwordCheck.placeholder="password does not match";
        passwordCheck.value="";
        passwordCheck.style.backgroundColor="red";
    }

    //check that the emais match
    if(email.value != "" && emailCheck.value !=""){
        if(email.value != emailCheck.value){
            //indicate that they dont match 
            usedParamaters=true;
            email.style.backgroundColor="red";
            emailCheck.placeholder="Email does not match";
            emailCheck.style.backgroundColor="red";
            emailCheck.value="";
        }
    }
    else{//one of the emails is "" 
        usedParamaters=true;
        email.style.backgroundColor="red";
        emailCheck.placeholder="Email does not match";
        emailCheck.style.backgroundColor="red";
        emailCheck.value="";
    }

    //check that the choise is a valid one
    console.log("choice:" + choice.value);
    if(choice.value == ""){
        usedParamaters=true;
        //indicate that the choice is ""
        document.querySelector("#choice").backgroundColor="red";
    }


    if(practice.value == ""){
        usedParamaters=true;
        //indicate that practice is ""
        practice.style.backgroundColor="red";
    }

    if(name.value == "")
    {
        usedParamaters=true;
        //indicate that it is ""
        name.style.backgroundColor="red";
    }
    if(surname.value==""){
        usedParamaters=true;
        surname.style.backgroundColor="red";
    }

    //need to chack that the email is not used and that the user name hasnt already been used 
    console.log("username given: "+username.value);
    if (username.value !=""){
        checkUsername(username.value);
    }
    else{
        usedParamaters=true;
        username.style.backgroundColor="red";
    }


    if (email.value != ""){
        checkEmail(email.value);
    }
    else{
        usedParamaters=true;
        email.style.backgroundColor="red";
    }

    console.log(usedParamaters +" "+ choice)
    addUser(name , surname, email ,username,frontEndHashedPassword,choice,practice);    
}

//===============================================================================================
//Function developed by: Jacobus Janse van Rensburg
//Function used to check if the database contains a user that has the same username
function checkUsername(username)
{
    console.log("check username");
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

    console.log("after user");
}

//===============================================================================================
//Function developed by: Jacobus Janse van Rensburg
//function used to check if there is someone that has the same email in use already
function checkEmail(email)
{
    console.log("check email");
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
    console.log("after email");
}

async function stop(){
    console.log("setting used")
    usedParamaters=true;
}

//=====================================================================================
//Function developed by: Jacobus Janse van Rensburg
// adding a user if its allowed
function addUser(name , surname, email ,username,frontEndHashedPassword,choice,practice){
    
    if(usedParamaters==false && choice!=""){
        //make the api call with the hashed password to sign up a new user 

        var frontSalt ="COS301";
        var backSalt ="FlapJacks";
        var saltedPasword = frontSalt+ password.value+backSalt;

        var frontEndHashedPassword = CryptoJS.MD5(saltedPasword).toString();
        console.log(frontEndHashedPassword);

        var response = fetch("/signup",{
            method:"POST",
            headers:{'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({"name":name.value , "surname":surname.value , "email":email.value ,"username":username.value , "password":frontEndHashedPassword, choice,"practition":practice.value})
        })
    }
    else{
        console.log("Could not make a new doctor");
    }
}
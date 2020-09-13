//Created by: Jacobus Janse van Rensburg

var doctorCookie = document.cookie;

//Function developed by: Jacobus Janse van Rensburg
//This function creates a Doctor Cookie when correct login credentials are used
function login()
{
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    var response = fetch("/login",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ username, password })
    });

    response.then(res => res.json().then( data => {
        if (data.name == "")
        {
            console.log("Not found");
            //RANI!!!!!! reload page with incorrect information thing
        }
        else
        {
            //login credentials are correct so we set it to the frontend cookie
            var doctorID = data._id;
            doctorCookie = "id="+doctorID+";domain=;path=/;";
            //RANI!!!!!   cookie is set and now send us to home page bellow here rani
        }
        alert("response: ");

    }))
    .catch(err=> {
        alert(err);
    });
}
//=======================================================================================================


//Function developed by: Jacobus Janse van Rensburg
//This function deletes the stored cookie
function deleteCookie()
{
    doctorCookie = "id=";
}
//=======================================================================================================


//Function developed by: Jacobus Janse van Rensburg
//This function displays the stored cookie
function displayCookieData()
{
    console.log(doctorCookie);
}

//=======================================================================================================
//Function developed by: Jacobus Janse van Rensburg
//This function calls getDoctor from the API to get the doctors name
function docName()
{

    var response = fetch("/getDoctor",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    });

    response.then(res => res.json().then( data => {
        if (res.status==200)
        {
            document.getElementById("nameId").innerHTML = data.surname;
        }
        else 
        {
            alert("Doctor Not Logged In");
            var response = fetch("/logout",{
                method:"POST",
                headers: {
                  'Content-Type': 'application/json; charset=UTF-8',
                }
            });
        }
    }));
    
}
var doctorCookie = document.cookie;


function login()
{
  console.log("inside login");

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

        
        
        console.log(data);
        console.log(data.name);
        if (data.name == "")
        {
            console.log("Not found");

            //RANI!!!!!! reload page with incorrect information thing
        }
        else{
            //login credentials are correct so we set it to the frontend cookie
            var doctorID = data._id;
            doctorCookie = "id="+doctorID+";domain=;path=/;";
            console.log(doctorCookie);
            
            //RANI!!!!!   cookie is set and now send us to home page bellow here rani

        }
        alert("response: ");

    }))
    .catch(err=> {
        alert(err);
    });
}

function deleteCookie()
{
    doctorCookie = "id=";
}

function displayCookieData()
{
    console.log(doctorCookie);
}


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
            else {
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
//var x = document.cookie;


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

    response.then(res=> {

        console.log(res);
        alert("response: ");

    })
    .catch(err=> {
        alert(err);
    });



}

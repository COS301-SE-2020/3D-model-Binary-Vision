//file created by: Jacobus Janse van Rensburg 
//file used to decode the url and accept or reject a signup attempt for security reasons 

window.onload= function()
{
    //first decode the url
    var href = window.location.href;
    var parts = href.split("?");
    var options = parts[1].split("&");

    var option1 = options[0].split("=");
    var choice = option1[1]; // value holds the accept or reject option

    var option2 = options[1].split("=");
    var user = option2[1]; //variable holds the users id to use the action 

    console.log("User: "+user+ "\nOption: "+choice);


    var response = fetch("/activateUser", {
        method: "POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({user, choice})
    });

    response.then(res=> {

    });

}
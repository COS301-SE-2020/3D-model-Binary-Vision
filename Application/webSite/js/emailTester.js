//made by jaco 
// just testing sending an email using mailtrap

function sendEmail(){

    var response = fetch("/email",{
        method:"POST", 
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"email":"someemail@mailer.com"})
    });

}
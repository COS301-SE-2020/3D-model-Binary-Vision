//Made by : Jacobus Janse van Rensburg
//This file contains all functions implemented to send data to the backend API

var checkDoc = [];

//Function developed by : Steven Visser
function initReceptionist()
{
    //getReceptionist Info and populate visual info on page
    var info = getReceptionistInfo();

    for(var i = 0; i < 8; i++)
    {
        checkDoc[i] = false;
    }
    

   var response = fetch("/getAvatarChoice",{
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    response.then(res=> res.json().then(data=> 
    {
        //data.choice is the avatar option
        var index = parseInt(data.avatar,10);
        checkDoc[index] = true;
        confirmPic();
    }));
}

window.onbeforeunload = saveNotes();

//=======================================================================================
//Function developed by : Jacobus Janse van Rensburg
//Modified by: Steven Visser
//used to get the information of the receptionist and populate the html elements with data
function getReceptionistInfo()
{
    var response = fetch("/getReceptionist",{
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    var info = [];
    response.then(res=> res.json().then(data=> 
    {
        info[0] = data.name;
        info[1] = data.surname;
        info[3] = data.practition;

        if(typeof data.Note === "undefined")
        {
            info[4] = " ";
        }
        else
        {
            info[4] = data.Note;
        }

        document.getElementById("receptionistName").innerHTML = data.name+" "+ data.surname;
        document.getElementById("receptionistNotes").innerText = info[4];
    }));
    return info;
}

//=======================================================================================
//Function developed by : Jacobus Janse van Rensburg
//used to save receptionists notes to the database to be retrieved
function saveNotes()
{
    var noteSpace = document.getElementById('receptionistNotes').value;
    saveReceptionistNotes(noteSpace);
}

//=======================================================================================
//Function developed by : Jacobus Janse van Rensburg
//used as an api call to get all the patients that meet curtain search criteria
function receptionistSearchPatient()
{
    var nameElement= document.getElementById("searchName");
    var surnameElement = document.getElementById("searchSurname");
    var idNumberElement = document.getElementById("searchPatientID");

    var name , surname , idNumber;
    if(nameElement!=null) 
    {
        name=nameElement.value;
    }
    if(surnameElement!=null) 
    {
        surname= surnameElement.value;
    }
    if(idNumberElement!=null)
    {
        idNumber=idNumberElement.value;
    } 

    var response = fetch("/searchPatient",
    {
        method:"POST",
        headers:{'Content-Type':'application/json; charset=UTF-8'},
        body:JSON.stringify({ name ,surname, idNumber })
    });

    response.then(res=> res.json().then(data=>
    {
        return data;
    }));
}

//=============================================================================================
//Function Developed by: Steven Visser
//Initializes the QRCode add patient page
function init()
{
    var url = window.location.href;
    var parts = url.split("=");
    document.getElementById("prac").value = parts[1];
}

function checkRegFields() {
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var idNumber = document.getElementById("idNumber");
    var email = document.getElementById("email");
    var cell = document.getElementById("cell");

    var patientInfo = document.getElementById("submitPatientInfo");
    var noSubmit = document.getElementById("noSubmitButton");

    var trueSubmit = true;

    if (name == "") {
        trueSubmit = false;
    }

    if (surname == "") {
        trueSubmit = false;
    }

    if (document.getElementById("idNoChoice").checked == true)
        idChecked = true;

    if (idChecked == true) {
        if (checkIdNumber(idNumber.value) == false) {
            trueSubmit = false;
        } else if (checkIdNumber(idNumber.value) == true && document.getElementById("errorForID").style.display == "block") {
            document.getElementById("errorForID").style.display = "none";
            idNumber.style.color = "black";
        }
    } else { 
        if (checkPassport(idNumber.value) == false) {
            trueSubmit = false;
        } else if (checkPassport(idNumber.value) == true && document.getElementById("errorForPass").style.display == "block") {
            document.getElementById("errorForPass").style.display = "none";
            idNumber.style.color = "black";
        }
    }

    if (checkEmailReg(email.value) == false) {
        trueSubmit = false;
    } else if (checkEmailReg(email.value) == true && document.getElementById("errorForEmail").style.display == "block") {
        document.getElementById("errorForEmail").style.display = "none";
        email.style.color = "black";
    }

    if (checkCellNumber(cell.value) == false) {
        trueSubmit = false;
    } else if (checkCellNumber(cell.value) == true && document.getElementById("errorForCell").style.display == "block") {
        document.getElementById("errorForCell").style.display = "none";
        cell.style.color = "black";
    }

    if (trueSubmit == true) {
        patientInfo.style.display = "block";
        noSubmit.style.display = "none";
    } else {
        patientInfo.style.display = "none";
        noSubmit.style.display = "block";
    }
} 

function checkId() {
    var idNumber = document.getElementById("idNumber");

    if (idNumber.value != "") {
        if (idChecked == true) {
            if (checkIdNumber(idNumber.value) == false) {
                document.getElementById("errorForID").style.display = "block";
                idNumber.style.color = "#ff5050";
            } else {
                document.getElementById("errorForID").style.display = "none";
            }
        } else {
            if (checkPassport(idNumber.value) == false) {
                document.getElementById("errorForPass").style.display = "block";
                idNumber.style.color = "#ff5050";
            } else {
                document.getElementById("errorForID").style.display = "none";
            }
        }
    }
}

function checkCell() {
    var cell = document.getElementById("cell");

    if (checkCellNumber(cell.value) == false) {
        document.getElementById("errorForCell").style.display = "block";
        cell.style.color = "#ff5050";
    } else {
        document.getElementById("errorForCell").style.display = "none";
    }
}

function checkEmail() {
    var email = document.getElementById("email");

    if (checkEmailReg(email.value) == false) {
        document.getElementById("errorForEmail").style.display = "block";
        email.style.color = "#ff5050";
    } else {
        document.getElementById("errorForEmail").style.display = "none";
    }
}

var idChecked = true;

function testPass() {
    idChecked = false;
    document.getElementById("idNumber").placeholder = "Passport Number";

    document.getElementById("errorForID").style.display = "none";
    document.getElementById("idNumber").style.color = "black";
}

function testID() {
    idChecked = true;
    document.getElementById("idNumber").placeholder = "ID Number";

    document.getElementById("errorForPass").style.display = "none";
    document.getElementById("idNumber").style.color = "black";
}
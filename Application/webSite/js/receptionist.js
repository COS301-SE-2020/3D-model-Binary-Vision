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
    var idNumber = document.getElementById("idNumber").value;
    var email = document.getElementById("email").value;
    var cell = document.getElementById("cell").value;

    var patientInfo = document.getElementById("submitPatientInfo");
    var noSubmit = document.getElementById("noSubmitButton");

    var trueSubmit = true;

    if (name == "") {
        trueSubmit = false;
    }

    if (surname == "") {
        trueSubmit = false;
    }

    if (checkIdNumber(idNumber) == false) {
        trueSubmit = false;
    }

    if (checkEmailReg(email) == false) {
        trueSubmit = false;
    }

    if (checkCellNumber(cell) == false) {
        trueSubmit = false;
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
    var idNumber = document.getElementById("idNumber").value;

    if (checkIdNumber(idNumber) == false) {
        document.getElementById("errorForID").style.display = "block";
    } else {
        document.getElementById("errorForID").style.display = "none";
    }
}

function checkCell() {
    var cell = document.getElementById("cell").value;

    if (checkCellNumber(cell) == false) {
        document.getElementById("errorForCell").style.display = "block";
    } else {
        document.getElementById("errorForCell").style.display = "none";
    }
}

function checkEmail() {
    var email = document.getElementById("email").value;

    if (checkEmailReg(email) == false) {
        document.getElementById("errorForEmail").style.display = "block";
    } else {
        document.getElementById("errorForEmail").style.display = "none";
    }
}
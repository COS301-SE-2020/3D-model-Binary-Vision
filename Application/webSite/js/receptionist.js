//Made by : Jacobus Janse van Rensburg
//This file contains all functions implemented to send data to the backend API


//Function developed by : Jacobus Janse van Rensburg
function initReceptionist()
{
    //getReceptionist Info and populate visual info on page
   var info = getReceptionistInfo();
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



//=============================================================================================
//Function Developed by: Rani Arraf
//Initializes Profile Pictures
var checkDoc1 = false;
var checkDoc2 = false;
var checkDoc3 = false;
var checkDoc4 = false;
var checkDoc5 = false;
var checkDoc6 = false;
var checkDoc7 = false;
var checkDoc8 = false;

function selectDoc1(){
    checkDoc1 = true;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;

    var doc4 = document.getElementById("avatar4");
    var doc3 = document.getElementById("avatar3");
    var doc2 = document.getElementById("avatar2");
    var doc1 = document.getElementById("avatar1");

    var doc5 = document.getElementById("avatar5");
    var doc6 = document.getElementById("avatar6");
    var doc7 = document.getElementById("avatar7");
    var doc8 = document.getElementById("avatar8");

    doc1.style.backgroundColor = "green";
    doc4.style.backgroundColor = "lightblue";
    doc3.style.backgroundColor = "lightblue";
    doc2.style.backgroundColor = "lightblue";

    doc5.style.backgroundColor = "lightblue";
    doc6.style.backgroundColor = "lightblue";
    doc7.style.backgroundColor = "lightblue";
    doc8.style.backgroundColor = "lightblue";
    
}

function selectDoc2(){
    checkDoc1 = false;
    checkDoc2 = true;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;


    var doc4 = document.getElementById("avatar4");
    var doc1 = document.getElementById("avatar1");
    var doc3 = document.getElementById("avatar3");
    var doc2 = document.getElementById("avatar2");

    var doc5 = document.getElementById("avatar5");
    var doc6 = document.getElementById("avatar6");
    var doc7 = document.getElementById("avatar7");
    var doc8 = document.getElementById("avatar8");

    doc2.style.backgroundColor = "green";
    doc4.style.backgroundColor = "lightblue";
    doc3.style.backgroundColor = "lightblue";
    doc1.style.backgroundColor = "lightblue";

    doc5.style.backgroundColor = "lightblue";
    doc6.style.backgroundColor = "lightblue";
    doc7.style.backgroundColor = "lightblue";
    doc8.style.backgroundColor = "lightblue";
}

function selectDoc3(){
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = true;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;

    
    var doc4 = document.getElementById("avatar4");
    var doc2 = document.getElementById("avatar2");
    var doc1 = document.getElementById("avatar1");
    var doc3 = document.getElementById("avatar3");

    var doc5 = document.getElementById("avatar5");
    var doc6 = document.getElementById("avatar6");
    var doc7 = document.getElementById("avatar7");
    var doc8 = document.getElementById("avatar8");

    doc3.style.backgroundColor = "green";
    doc4.style.backgroundColor = "lightblue";
    doc2.style.backgroundColor = "lightblue";
    doc1.style.backgroundColor = "lightblue";

    doc5.style.backgroundColor = "lightblue";
    doc6.style.backgroundColor = "lightblue";
    doc7.style.backgroundColor = "lightblue";
    doc8.style.backgroundColor = "lightblue";
}

function selectDoc4(){
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = true;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;


    var doc4 = document.getElementById("avatar4");
    var doc3 = document.getElementById("avatar3");
    var doc2 = document.getElementById("avatar2");
    var doc1 = document.getElementById("avatar1");

    var doc5 = document.getElementById("avatar5");
    var doc6 = document.getElementById("avatar6");
    var doc7 = document.getElementById("avatar7");
    var doc8 = document.getElementById("avatar8");

    doc4.style.backgroundColor = "green";
    doc3.style.backgroundColor = "lightblue";
    doc2.style.backgroundColor = "lightblue";
    doc1.style.backgroundColor = "lightblue";

    doc5.style.backgroundColor = "lightblue";
    doc6.style.backgroundColor = "lightblue";
    doc7.style.backgroundColor = "lightblue";
    doc8.style.backgroundColor = "lightblue";
}

function selectDoc5(){
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = true;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;

    var doc4 = document.getElementById("avatar4");
    var doc3 = document.getElementById("avatar3");
    var doc2 = document.getElementById("avatar2");
    var doc1 = document.getElementById("avatar1");

    var doc5 = document.getElementById("avatar5");
    var doc6 = document.getElementById("avatar6");
    var doc7 = document.getElementById("avatar7");
    var doc8 = document.getElementById("avatar8");

    doc1.style.backgroundColor = "lightblue";
    doc4.style.backgroundColor = "lightblue";
    doc3.style.backgroundColor = "lightblue";
    doc2.style.backgroundColor = "lightblue";

    doc5.style.backgroundColor = "green";
    doc6.style.backgroundColor = "lightblue";
    doc7.style.backgroundColor = "lightblue";
    doc8.style.backgroundColor = "lightblue";
    
}

function selectDoc6(){
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = true;
    checkDoc7 = false;
    checkDoc8 = false;


    var doc4 = document.getElementById("avatar4");
    var doc1 = document.getElementById("avatar1");
    var doc3 = document.getElementById("avatar3");
    var doc2 = document.getElementById("avatar2");

    var doc5 = document.getElementById("avatar5");
    var doc6 = document.getElementById("avatar6");
    var doc7 = document.getElementById("avatar7");
    var doc8 = document.getElementById("avatar8");

    doc2.style.backgroundColor = "lightblue";
    doc4.style.backgroundColor = "lightblue";
    doc3.style.backgroundColor = "lightblue";
    doc1.style.backgroundColor = "lightblue";

    doc5.style.backgroundColor = "lightblue";
    doc6.style.backgroundColor = "green";
    doc7.style.backgroundColor = "lightblue";
    doc8.style.backgroundColor = "lightblue";
}

function selectDoc7(){
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = true;
    checkDoc8 = false;

    
    var doc4 = document.getElementById("avatar4");
    var doc2 = document.getElementById("avatar2");
    var doc1 = document.getElementById("avatar1");
    var doc3 = document.getElementById("avatar3");

    var doc5 = document.getElementById("avatar5");
    var doc6 = document.getElementById("avatar6");
    var doc7 = document.getElementById("avatar7");
    var doc8 = document.getElementById("avatar8");

    doc3.style.backgroundColor = "lightblue";
    doc4.style.backgroundColor = "lightblue";
    doc2.style.backgroundColor = "lightblue";
    doc1.style.backgroundColor = "lightblue";

    doc5.style.backgroundColor = "lightblue";
    doc6.style.backgroundColor = "lightblue";
    doc7.style.backgroundColor = "green";
    doc8.style.backgroundColor = "lightblue";
}

function selectDoc8(){
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = true;


    var doc4 = document.getElementById("avatar4");
    var doc3 = document.getElementById("avatar3");
    var doc2 = document.getElementById("avatar2");
    var doc1 = document.getElementById("avatar1");

    var doc5 = document.getElementById("avatar5");
    var doc6 = document.getElementById("avatar6");
    var doc7 = document.getElementById("avatar7");
    var doc8 = document.getElementById("avatar8");

    doc4.style.backgroundColor = "lightblue";
    doc3.style.backgroundColor = "lightblue";
    doc2.style.backgroundColor = "lightblue";
    doc1.style.backgroundColor = "lightblue";

    doc5.style.backgroundColor = "lightblue";
    doc6.style.backgroundColor = "lightblue";
    doc7.style.backgroundColor = "lightblue";
    doc8.style.backgroundColor = "green";
}

function confirmPicture(){
    var pictureFrame1 = document.querySelector(".profile");
    if(checkDoc1 == true){
        
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_a_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc2 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_b_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc3 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_i_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc4 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_w_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc5 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_a_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc6 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_b_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc7 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_i_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc8 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_w_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
}
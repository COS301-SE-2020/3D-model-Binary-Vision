//Made by : Jacobus Janse van Rensburg

// ==================================================================
//function developed by : Jacobus Janse van Rensburg
function initReceptionist()
{
    //getReceptionist Info and populate visual info on page
   var info = getReceptionistInfo();

   console.log(info);

}

window.onbeforeunload = saveNotes();
// ==================================================================
//function developed by : Jacobus Janse van Rensburg
//used to get the information of the receptionist and populate the html elements with data
function getReceptionistInfo(){
    var response = fetch("/getReceptionist",{
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    var info = [];
    response.then(res=> res.json().then(data=> {

        info[0] = data.name;
        info[1] = data.surname;
        info[3] = data.practition;
        info[4] = data.Note;

        document.getElementById("receptionistName").innerHTML = data.name+" "+ data.surname;
        document.getElementById("receptionistNotes").innerHTML = data.Note;
        // console.log(data);
    }));

    return info;
}

// ==================================================================
//function developed by : Jacobus Janse van Rensburg
//used to save receptionists notes to the database to be retrieved
function saveNotes(){
    var noteSpace = document.getElementById('receptionistNotes').value;
    console.log("Note captured to save: "+ noteSpace);
    saveReceptionistNotes(noteSpace);
}

// ==================================================================
//function developed by : Jacobus Janse van Rensburg
//used as an api call to get all the patients that meet curtain search criteria
function receptionistSearchPatient()
{
    var nameElement= document.getElementById("searchName");
    var surnameElement = document.getElementById("searchSurname");
    var idNumberElement = document.getElementById("searchPatientID");

    var name , surname , idNumber;
    if(nameElement!=null) name=nameElement.value;
    if(surnameElement!=null) surname= surnameElement.value;
    if(idNumberElement!=null) idNumber=idNumberElement.value;

    var response = fetch("/searchPatient",{
        method:"POST",
        headers:{'Content-Type':'application/json; charset=UTF-8'},
        body:JSON.stringify({ name,surname, idNumber })
    });

    response.then(res=> res.json().then(data=>{

        for(var i in data){
            console.log(data[i]);
        }
        return data;
    }));
}

//  created by: Jacobus Janse van Rensburg

var selectedDoctor;
var selectedDate;
var selectedTime;
var selectedPatient;
var selectedReason;

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//fetch all the doctors that is available to the receptionist and display them in a list overlay
function displayDoctorOverlay(){

    var response = fetch("/getDoctorsOfReceptionist",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          }    
        });

    response.then(res => res.json().then(data=> {

        for(var i in data)
        {
            console.log(data[i].name+"\n "+data[i].surname+" \nid:"+data[i]._id+" \nusername: "+data[i].username+" \npassword: "+data[i].password +"\n\n");
        }

        //createDoctorslist with the data
        createDoctorsList(data);
    }));
}

// ==========================================================================================
// Function developed by: Jacobus Janse Van Rensburg
// creates a list of all the doctors that the receptionist is allowed to schedule bookings for
function createDoctorsList(data){
    var overlay = document.getElementById('currentOverlay');
    var replacement;
    for(var i in data){
        replacement+='<li>Dr.'+data[i].surname+' ('+data[i].name+') </li><a onclick="selectDoctor(\''+data[i]._id+'\')">select</a> <br>';
    }
    overlay.innerHTML=replacement;
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function displayTimeTableOverlay(){
    var overlay = document.getElementById('currentOverlay');

     createScheduler(overlay);
    //still need to populate the table with bookings

}
// ===========================================================================================
// Function developed by: Jacobus Janse van Rensburg
// Dynamically produces a schedule for the week for a doctor
function createScheduler(overlay){
    var days = ["mon","tue","wed","thu","fri","sat","sun"];
    var times=[7,8,9,10,11,12,13,14,15,16,17,18];
    var replacement;
    replacement='<table class="table table-bordered" id="dayTable">';
    replacement+='<thead id="dayTableHead">';

    var d = new Date();
    var currentMonth = d.getMonth();
    var currentDate = d.getDate();
    var currentDay = d.getDay();
    var currentYear=d.getFullYear();
    replacement+='<td style="background-color: rgb(0, 51, 102); color: white;">Tues, 11</td>';
    //set the headings now
    var count =0;
    var dd = currentDay;
    while (count<days.length){
        if(dd > days.length ){
            dd =0;
        }

        replacement+='<td style="background-color: rgb(0, 51, 102); color: white;">'+days[dd]+','+(currentDate+(count+1))+'</td>';
        count++;
    }

    replacement += '</thead>'
    replacement+='<tbody>';
    for(var i = 0 ; i < times.length; i ++){
        replacement+='<tr><td id="time">'+times[i]+'</td>';
        for (var j =0 ; j < days.length; j ++)
        {
            replacement+='<td id="'+(currentDate+j)+'/'+currentMonth+'/'+currentYear+':'+times[i]+'"></td>';

            replacement+='</td>';
        }
        replacement+='</tr>'
    }

    replacement+='</tbody></table>';
    overlay.innerHTML=replacement;
}


// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function displayPatientSearchOverlay(){

    createPatientSearchOverlay();

}



// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function createPatientSearchOverlay()
{
    var overlay = document.getElementById("currentOverlay");
    overlay.innerHTML = '  <div id="doctorFormSignup"><br>';
    overlay.innerHTML+='<h2> Search Patient</h2><br>';
    overlay.innerHTML+='<div class="change"><input type="checkbox" id="searchByName" name="searchBy" onclick="searchByInputDisplay()"><label style="color:white;" for="searchByName"> Search By Name </label><br>';
    overlay.innerHTML+='<input type="checkbox" id="searchBySurname" name="searchBy" onclick="searchByInputDisplay()"><label style="color:white;" for="searchBySurname"> Search By Surname </label><br>';
    overlay.innerHTML+='<input type="checkbox" id="searchByPatientID" name="searchBy" onclick="searchByInputDisplay()"><label style="color:white;" for="searchByPatientID"> Search By Patient ID </label> <br><br></div>';
    overlay.innerHTML+='<div id="inputBoxes"></div><input type="submit" class="btn" value="Search" onclick="createPatientsListForBooking()"></div>';
 
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function createPatientsListForBooking(){
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

       fillPatientSearchedList(data);
        
    }));
    //populate a list with this data
}

// ==========================================================================================
// Function developed by: Jacobus Janse van Rensburg
// fillse the patients overlay list that is selectable
function fillPatientSearchedList(data){
    var overlay = document.getElementById("currentOverlay");
    var replacement;

    for (var i in data)
    {
        replacement+='<li>'+data[i].name+'</li><li>'+data[i].surname+'</li><li>'+data[i].idNumber+'</li><li>'+data[i].cell+'</li><a onclick="selectPatient(\''+data[i]._id+'\')">Select</a><br>';
    }
    overlay.innerHTML=replacement;
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function selectDoctor(drID)
{
    selectedDoctor=drID;
    console.log("Selected doctor with id: "+selectedDoctor);
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function selectTimeSlot(date,time){
    selectedDate = date;
    selectedTime = time;
    document.getElementById("currentOverlay").innerHTML="";

}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function selectPatient(patientID){
    selectedPatient = patientID;
    document.getElementById("currentOverlay").innerHTML="";
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function providedReason(){
    selectedReason = document.getElementById('reasonForBooking').value;
    document.getElementById("currentOverlay").innerHTML="";
}
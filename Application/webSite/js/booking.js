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

        // create an overlay with this data

    }));


}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function displayTimeTableOverlay(){
    var overlay = document.getElementById('currentOver');

    var response = fetch('/getDoctorsTimetable',{
        method:"POST",
        headers:{
            'Content-Type': 'application/json; charset=UTF-8',
          },
        body: JSON.stringify({"doctor":selectedDoctor})    
    });

    response.then(res => res.json().then(data=> {

        //go and create the schedule for the doctor
        createSheduler(data, overlay);
    }));

}
// ===========================================================================================
// Function developed by: Jacobus Janse van Rensburg
function createScheduler(data, overlay){
    
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
function createPatientsListForBooking(patients){
    var data = receptionistSearchPatient();

    //populate a list with this data

}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function selectDoctor(drID)
{
    selectedDoctor=drID;
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function selectTimeSlot(date,time){
    selectedDate = date;
    selectedTime = time;
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function selectPatient(patientID){
    selectedPatient = patientID;
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
function providedReason(){
    selectedReason = document.getElementById('reasonForBooking').value;
}
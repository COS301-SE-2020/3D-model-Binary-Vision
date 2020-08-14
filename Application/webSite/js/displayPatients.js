// File created by: 
// File modified by: Jacobus Janse van Rensburg

function rotateArrow(arrowID) {
  let arrowElement = document.getElementById(arrowID);
  
  if(arrowElement.classList.contains("arrowSideBarTransform")) {
    document.getElementById("sideBarLabel").style.display = "none";
    arrowElement.classList.replace("arrowSideBarTransform", "arrowSideBody");
    moveSideBar();
  } else {
    document.getElementById("sideBarLabel").style.display = "block";
    arrowElement.classList.replace("arrowSideBody", "arrowSideBarTransform");
    moveSideBar();
  }
}

var showSideBar = true;

function moveSideBar(){
  var bodyA = document.getElementById("sideBody");
  //var show = document.getElementById('buttonShow')

  if(!showSideBar){
    showSideBar = true;
    //show.style.display = "none";
    bodyA.classList.remove("moveSideBar");
    document.getElementById("conatinerHome").classList.remove("moveContainerHome");
  }
  else{
    showSideBar = false;
    //show.style.display = "block";
    bodyA.classList.add("moveSideBar");
    document.getElementById("conatinerHome").classList.add("moveContainerHome");
  }
  
}

// =================================================================================
// Function developed by: Jacobus Janse van Rensburg
// function used to initiaise the page with the required information
function init(){
  populateDoctorChoices();
  // populatePatients();  
  document.querySelector("#doctors").addEventListener("change", populatePatients);
}

// =================================================================================
// Function developed by: Jacobus Janse van Rensburg
//function used to retrieve the doctors and set the the fields to chose a doctor that is visible to the receptionist
function populateDoctorChoices(){
  //retrieve the doctors using the api
  var response = fetch("/getDoctorsOfReceptionist",{
    method:"POST",
    headers:{'Content-Type': 'application/json; charset=UTF-8'}
  });

  //decode the response from the api and use the information
  response.then(res => res.json().then(data=> {
    if ( res.status == 200){
      //there was no error fetching the data and we can pupulate the dr choice bar
      var replacement = "<option >Select Doctor</option>";
      for (var i in data)
      {
        replacement+= "<option value='"+data[i]._id+"'>Dr "+data[i].surname+" ("+data[i].name+")</option>";
      }
      document.getElementById("doctors").innerHTML=replacement;
    }
    else{
      //there was an error that needs to be handled in the front end RANI PLS
    }
  }));
}

// =================================================================================
// Function developed by: Jacobus Janse van Rensburg
//function used to fetch the patients belonging to the selected doctor and populate thet table
function populatePatients()
{

  var selectionElement = document.getElementById("doctors");

  var selectedDoctor = selectionElement.options[selectionElement.selectedIndex].value ;
  console.log(selectedDoctor);

  //get the information regarding the doctor
  var response = fetch("/getDoctorsScheduleToday",{
    method: "POST",
    headers:{'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({"doctor":selectedDoctor})
  });


 response.then(res=> res.json().then(data=> {
    var replacement ="";
    var count = 1;

    for( var i in data)
    {

      //fetch the patients information
      var get = fetch("/singlePatient",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"patient":data[i].patient})
      });

      get.then(g => g.json().then(patientInfo=>{

        if(g.status ==200){
        console.log(patientInfo);
        replacement+="<tr><td>"+count+"</td><td>"+patientInfo.idNumber+"</td><td>"+patientInfo.name+"</td><td>"+data[i].time+"</td><td>"+patientInfo.cellnumber+"</td><td><button class='btn btn-success'  type='button' onclick='postponeBooking(\""+data[i]._id+"\")'>POSTPONE</button><button class='btn btn-danger'  type='button' onclick='cancelBooking(\""+data[i]._id+"\")'>CANCEL</button></td></tr>";
        console.log(replacement);
        document.getElementById("patientTable").innerHTML+=replacement;
        }
        else{
          //error occured getting patient information for a booking
        }
     
      }));
    }
 }));

 
}

//================================================================================================
// Function developed by:Steven Visser
// Removes a booking from the database & notifies patient
function cancelBooking(bookingID)
{
  var response = fetch("/removeBooking",{
    method:"POST",
    headers:{'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({"bookingID":bookingID})
  });

  response.then(res => {
    //check status code
    // remove the patient from the waiting log
    //if its successful, call a function to notify patient of cancellation
    console.log(res.status);
  });

}


//================================================================================================
// Function developed by:Steven Visser
// Gets new date & time for booking, notifies the patient, updates database
function postponeBooking(bookingID)
{
    //these will be gotten from the new booking page
    var date;
    var time;
    //open new booking postponement element & get new date/time
    postpone(bookingID,date,time);
    //call function to notify patient of update

}

//================================================================================================
// Function developed by:Steven Visser
// Calls update for booking
function postpone(bookingID,date,time)
{
  var response = fetch("/postponeBooking",{
    method:"POST",
    headers:{'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({"bookingID":bookingID,"date":date,"time":time})
  });

  response.then(res => {
    //check status code
    //if its successful, remove patient from waiting log & check if it needs to be added back or not with new info
    console.log(res.status);
  });
}
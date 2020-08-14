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
  var response = ("/getDoctorsScheduleToday",{
    method: "POST",
    headers:{'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({"doctor":selectedDoctor})
  });

  response.then(res => res.json().then(data =>{
    if (res.status == 200){

      for(var i in data)
      {
        console.log(data[i]);
      }

    }
    else{
      //something went wrong and needs handling in the front end
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
    console.log(res.status);
  });

}


//================================================================================================
// Function developed by:Steven Visser
// Updates a booking to a different time & notifies patient
function postponeBooking(bookingID)
{
    

}

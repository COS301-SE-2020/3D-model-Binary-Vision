//  created by: Jacobus Janse van Rensburg
//  Updated & Reviewed by: Steven Visser

var selectedDoctor;
var selectedDate;
var selectedTime;
var selectedPatient;
var selectedReason;
var selectedEndTime;

//===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//fetch all the doctors that is available to the receptionist and display them in a list overlay
function displayDoctorOverlay()
{

    var response = fetch("/getDoctorsOfReceptionist",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    });

    response.then(res => res.json().then(data=>
    {
        //createDoctorslist with the data
        createDoctorsList(data);
    }));
}

// ==========================================================================================
// Function developed by: Jacobus Janse Van Rensburg
// Style development by: Rani Arraf
// creates a list of all the doctors that the receptionist is allowed to schedule bookings for
function createDoctorsList(data)
{
    var indOverlay = document.getElementById("individual");
    indOverlay.style.display = "none";
    var overlay = document.getElementById('currentOverlay');
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "none";
    overlay.style.display = "block";
    overlay.style.color= "white";
    overlay.style.textAlign = "center";
    overlay.style.borderRadius = "5px";
    var replacement = "";
    var inc = 1;
    for(var i in data)
    {
      if(data != null){
        //replacement += '<div style="display: block; float: left; background-color:#003366; color: white; width: 300px;position: relative;border-radius: 5px;box-shadow: 0px 0px 5px 0px black; margin-right: 10px; margin-left: 10px; margin-top: 20px;"><br><h2>' + data[i].name + ' ' + data[i].surname + ' ' + inc + ':</h2><hr><li> Name: '+data[i].name+'</li><li> Surname: '+data[i].surname+'</li><li>ID: '+data[i].idNumber+'</li><li>Cell: '+data[i].cellnumber+'</li><br><button class="btn btn-warning" onclick="selectPatient(\''+data[i]._id+'\',\''+data[i].name+'\',\''+data[i].surname+'\',\''+data[i].idNumber+'\')">Select</button><br><br></div>';

        replacement += "<div style='display: block; float: left; background-color:#003366; color: white; width: 300px;position: relative;border-radius: 5px;box-shadow: 0px 0px 5px 0px black; margin-right: 10px; margin-left: 10px; margin-top: 20px;'>";
        replacement +='<br><h2>Dr. ' + data[i].surname + '</h2><hr><li>Dr.'+data[i].surname+' ('+data[i].name+') </li><br><button class="btn btn-primary" onclick="selectDoctor(\''+data[i]._id+'\',\''+data[i].name+'\',\''+data[i].surname+'\')">Select</button> <br><br>';
        replacement += "</div>";
      }
    }
    if(data != "undefined"){
      overlay.innerHTML=replacement;
    }
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//Modified by: Steven Visser
// Style development by: Rani Arraf
//populates the booking table with all existing bookings & creates the schedule
function displayTimeTableOverlay()
{
    var indOverlay = document.getElementById("individual");
    indOverlay.style.display = "none";
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "block";
    overlayTable.style.boxShadow = "1px 0px 15px 0px black";
    var overlay = document.getElementById('currentOverlay');
    overlay.style.display = "none";

     createScheduler(overlayTable);
    //still need to populate the table with bookings

    if(selectedDoctor!=null)
    {
        var response = fetch("/getDoctorsTimeTable", {
            method:"POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            } ,
            body: JSON.stringify({"doctor":selectedDoctor})
        });

        response.then(res=> res.json().then(data=>
        {
            populateCalander(data);

        }));
    }

}
// ==========================================================================================
// Function developed by: Jacobus Janse van Rensburg
// populate the block timetable with the bookings that has already been created
function populateCalander(data)
{

    for(var i in data)
    {
        
        if(data[i].status == "Pending")
        {
            var dataIndex = parseInt(i) ;
            var date = data[dataIndex].date;
            var time = data[dataIndex].time;
            var searchPageId = date+"&"+time;
            var element = document.getElementById(searchPageId);

            if (element!=null)
            {
                //mark as red since a booking already exists
                element.setAttribute("style","background-color:red;");
                element.setAttribute("onclick","");
                //call api to get patient based on id, then put the patients full name ehre
                setName(data[dataIndex].patient,searchPageId);
            }
        }
        
    }

}

function setName(patient, searchPageId)
{
    var response = fetch("/singlePatient",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body:JSON.stringify({"patient":patient})
    });

    response.then(res => res.json().then(pat => 
    {
        document.getElementById(searchPageId).innerHTML=pat.name + " " + pat.surname;
    }));
}

// ===========================================================================================
// Function developed by: Jacobus Janse van Rensburg
// Modified by: Steven Visser
// Dynamically produces a schedule for the week for a doctor
function createScheduler(overlay)
{
    var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var times = [
               "09:00","09:15","09:30","09:45",
               "10:00","10:15","10:30","10:45",
               "11:00","11:15","11:30","11:45",
               "12:00","12:15","12:30","12:45",
               "13:00","13:15","13:30","13:45",
               "14:00","14:15","14:30","14:45",
               "15:00","15:15","15:30","15:45",
               "16:00","16:15","16:30","16:45"
              ];
    var replacement ='<table class="table table-bordered" id="dayTable">';
    replacement += '<thead id="dayTableHead">';

    var d = new Date();
    var currentMonth = d.getMonth();
    var currentDate = d.getDate();
    var currentDay = d.getDay();
    var currentYear=d.getFullYear();
    replacement+='<td style="background-color: rgb(0, 51, 102); color: white;">Time</td>';
    //set the headings now
    var count =0;
    var dd = currentDay;

    while (count<days.length)
    {
        if(dd == days.length )
        {

            dd =0;
        }
        replacement+='<td style="background-color: rgb(0, 51, 102); color: white;">'+days[dd]+','+(currentDate+(count))+'</td>';
        count++;
        dd++;
    }

    replacement += '</thead>'
    replacement += '<tbody>';
    for(var i = 0 ; i < times.length; i ++)
    {
        replacement+='<tr><td id="time">'+times[i]+'</td>';
        for (var j =0 ; j < days.length; j ++)
        {
            replacement += '<td class="selectableTimeSlot" id="'+(currentDate+j)+'/'+(currentMonth+1)+'/'+currentYear+'&'+times[i]+'" onclick="selectTime(\''+(currentDate+j)+'/'+(currentMonth+1)+'/'+currentYear+'&'+times[i]+'\')"></td>';
        }
        replacement += '</tr>'
    }

    replacement+='</tbody></table>';
    overlay.innerHTML=replacement;
}

// ===========================================================================================
// Function developed by: Jacobus Janse van Rensburg
// Style development by: Rani Arraf
//function that colours the selected time slot and sets the values to make a booking
var oldTimeSlotID;
function selectTime(timeslot)
{
    var element = document.getElementById(oldTimeSlotID);
    if (element!=null)
    {
        element.setAttribute("style","background-colour:white;");
    }

    oldTimeSlotID= timeslot;
    element=document.getElementById(timeslot);
    element.setAttribute("style","background-color:green;");

    var parts = timeslot.split("&");
    selectTimeSlot(parts[0],parts[1]);
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//
function displayPatientSearchOverlay()
{
    createPatientSearchOverlay();
}



// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
// Style development by: Rani Arraf
//
function createPatientSearchOverlay()
{
    var indOverlay = document.getElementById("individual");
    indOverlay.style.display = "none";
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "none";
    

    var overlay = document.getElementById("currentOverlay");
    overlay.style.position = "relative";
    overlay.style.display = "inline-block";
    overlay.style.backgroundColor= "#003366";
    overlay.style.width= "300px";
    overlay.style.color= "white";
    overlay.style.textAlign = "center";
    overlay.style.borderRadius = "5px";
    overlay.style.boxShadow = "1px 0px 15px 0px black";


    overlay.innerHTML ='<div style=""><div id="doctorFormSignup"><br>';
    overlay.innerHTML+='<h2> Search Patient</h2><hr><br>';
    overlay.innerHTML+='<div class="change" class="custom-control"><input type="checkbox"  id="searchByName" name="searchBy" onclick="searchByInputDisplay()"><label class="form-check-label" style="color:white; padding: 5px; left: 0px;" for="searchByName">  Search By Name </label><br>';
    overlay.innerHTML+='<input type="checkbox" id="searchBySurname" name="searchBy" onclick="searchByInputDisplay()"><label class="form-check-label" style="color:white; padding: 5px; left: 0px;" for="searchBySurname">  Search By Surname </label><br>';
    overlay.innerHTML+='<input type="checkbox" id="searchByPatientID" name="searchBy" onclick="searchByInputDisplay()"><label class="form-check-label" style="color:white; padding: 5px; left: 0px;" for="searchByPatientID">  Search By Patient ID </label> <br><br></div>';
    overlay.innerHTML+='<div id="inputBoxes" ></div><input style="margin-bottom: 20px;" class="btn btn-danger" type="submit" class="btn" value="Search" onclick="createPatientsListForBooking()"></div></div>';

}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//
function createPatientsListForBooking()
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
    var response = fetch("/searchPatient",{
        method:"POST",
        headers:{'Content-Type':'application/json; charset=UTF-8'},
        body:JSON.stringify({ name,surname, idNumber })
    });

    response.then(res=> res.json().then(data=>
    {
       fillPatientSearchedList(data);
    }));
    //populate a list with this data
}

// ==========================================================================================
// Function developed by: Jacobus Janse van Rensburg
// fillse the patients overlay list that is selectable
function fillPatientSearchedList(data)
{
    var overlay = document.getElementById("individual");
    var cOverlay = document.getElementById("currentOverlay");
    var replacement = "";
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "none";
    cOverlay.style.display = "none";
    overlay.style.display = "block";
    var inc = 1;

    for (var i in data)
    {
        
        replacement += '<div style="display: block; float: left; background-color:#003366; color: white; width: 300px;position: relative;border-radius: 5px;box-shadow: 0px 0px 5px 0px black; margin-right: 10px; margin-left: 10px; margin-top: 20px;"><br><h2>' + data[i].name + ' ' + data[i].surname + ' ' + inc + ':</h2><hr><li> Name: '+data[i].name+'</li><li> Surname: '+data[i].surname+'</li><li>ID: '+data[i].idNumber+'</li><li>Cell: '+data[i].cellnumber+'</li><br><button class="btn btn-warning" onclick="selectPatient(\''+data[i]._id+'\',\''+data[i].name+'\',\''+data[i].surname+'\',\''+data[i].idNumber+'\')">Select</button><br><br></div>';
        inc++;
    }
    overlay.innerHTML = replacement;
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//
function selectDoctor(drID,name, surname)
{
    selectedDoctor = drID;

    document.getElementById("doctorInfoDisplay").innerHTML = "("+name+") "+surname;
    document.getElementById("doctorInfoDisplay").style.color = "lightgreen";
    document.getElementById("currentOverlay").innerHTML = "";

}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//
function selectTimeSlot(date, time)
{
    selectedDate = date;
    selectedTime = time;

    document.getElementById("timeInfoDisplay").innerHTML = time;
    document.getElementById("timeInfoDisplay").style.color = "lightgreen";

    document.getElementById("dateInfoDisplay").innerHTML = date;
    document.getElementById("dateInfoDisplay").style.color = "lightgreen";

}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//
function selectPatient(patientID, name , surname, idNumber)
{
    selectedPatient = patientID;
    document.getElementById("patientInfoDisplay").innerHTML = "("+idNumber+") " + name  +" " + surname;
    document.getElementById("patientInfoDisplay").style.color = "lightgreen";

    document.getElementById("currentOverlay").innerHTML = "";
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//
function providedReason()
{
    selectedReason = document.getElementById('reasonForBooking').value;
    document.getElementById("currentOverlay").innerHTML = "";
}

// ===========================================================================================
//Function developed by:Jacobus Janse van Rensburg
// Createing the booking in the database and testing if the booking is legal
function makeBooking()
{
    if (selectedDoctor != null && selectedPatient!= null && selectedDate != null && selectedTime!=null)
    {

        //booking can be created
        var reason = document.getElementById("reasonForBooking").value;

        if(selectedEndTime ==null || selectedEndTime =="")
        {
            selectedEndTime = selectedTime;
        }

        var response = fetch("/makeBooking",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({"doctor":selectedDoctor, "patient":selectedPatient,"date":selectedDate,"time":selectedTime,"reason":reason,"endTime":selectedEndTime})
        });

        response.then(res=> 
        {
            if(res.status == 200)
            {

                window.location.href = res.url;
            }
            else
            {
                //something is wrong
            }
        });
    }
    else
    {
        alert("Please provide all fields to make a booking");
    }
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//Modified by: Steven Visser
//sets up the booking page to make the postponement
function prepPostponement()
{
    var url = window.location.href;
    var parts = url.split("=");
    var p = parts[1].split("&");

    var patientID = p[0];
    var doctorID = parts[2];
    //make a call to find doctor by id and get name/surname
    var docname; 
    var docsurname;

    var response = fetch("/getSingleDoctor",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body:JSON.stringify({"id":doctorID})
    });

    response.then(res=> res.json().then(data=>
    {
        selectDoctor(doctorID,data.name, data.surname);
        displayTimeTableOverlay();
    }));

    //make a call to find patient by id and get name/surname
    var patname; var patsurname;var idnmumber;
    var fetcher = fetch("/singlePatient",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body:JSON.stringify({"patient":patientID})
    });

    fetcher.then(res=> res.json().then(data=>
    {
        selectPatient(patientID, data.name, data.surname, data.idNumber);
    }));
    

    //populate the reason
    selectedReason = "Postponed Booking";
    document.getElementById("reasonForBooking").value = selectedReason;

    //change Make Booking! to Postpone Booking
    document.getElementById("makeBookingButton").innerText = "Postpone Booking!";

}

function initPage()
{
    var url = window.location.href;
    var parts = url.split("=");
    if(parts.length > 1)
    {
        prepPostponement();
    }

    var response = fetch ('/getReceptionist',{
        method: "POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    response.then(res=> res.json().then( data => {  
        document.querySelector("#receptionistName").innerHTML = data.name +" "+ data.surname;
    }));
}

//=============================================================================================
//Function Developed by: Marcus Werren
// Rotates the arrows of the side bar
function rotateArrowBooking(arrowID) 
{  
    let arrowElement = document.getElementById(arrowID);

    if(arrowElement.classList.contains("arrowSideBarTransform")) 
    {
        document.getElementById("sideBarLabel").style.display = "none";
        arrowElement.classList.replace("arrowSideBarTransform", "arrowSideBody");
        moveSideBar();
    } 
    else 
    {
        document.getElementById("sideBarLabel").style.display = "block";
        arrowElement.classList.replace("arrowSideBody", "arrowSideBarTransform");
        moveSideBar();
    }
}

var showSideBar = true;
//=============================================================================================
//Function Developed by: Marcus Werren
// This function hides the side bar 
function moveSideBar()
{
    var bodyA = document.getElementById("sideBody");
    var bookingBody = document.getElementById("bookingBody");

      if(!showSideBar)
      {
        showSideBar = true;
        bodyA.classList.remove("moveSideBar");
        //bookingBody.style.width = "60%";
        bookingBody.classList.remove("bookingBodyInceaseWidth");
    }
    else
    {
        showSideBar = false;
        bodyA.classList.add("moveSideBar");
        //bookingBody.style.width = "75%";
        bookingBody.classList.add("bookingBodyInceaseWidth");
    }
}


//================================================================================================
//Function developed by: Jacobus Janse van Rensburg
//Function Used to initialize the fuzzy logic overlay to select from the different types of procedures that are common to make a booking
function fuzzyLogic()
{
    var indOverlay = document.getElementById("individual");
    indOverlay.style.display = "none";
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "none";

    var overlay = document.getElementById("currentOverlay");
    overlay.style.position = "relative";
    overlay.style.display = "inline-block";
    overlay.style.backgroundColor= "#003366";
    overlay.style.width= "300px";
    overlay.style.color= "white";
    overlay.style.textAlign = "center";
    overlay.style.borderRadius = "5px";
    overlay.style.boxShadow = "1px 0px 15px 0px black";

    var location = document.querySelector("#currentOverlay"); //get the element that will be dynamically populated

    var population='<select id="selectedProcedure"> <option value="">Select Option</option>';
    population+='<option value="15">checkup</option> <option value="30">Tooth Decay</option>';
    population+='<option value="45">Gum Disease</option>  <option value="30">Tooth Sensitivity</option>';
    population+='<option value="45">Tooth Extraction</option> <option value="30">Tooth Erosion</option>';
    population+='<option value="30">Moouth Sores</option> </select> <button id="btnCommonBooking" class="btn btn-primary" onclick="findAvailableBookings()">Select</button>';

    location.innerHTML=population;
}

//=================================================================================================
//function developed by: Jacobus Janse van Rensburg
//Function used for the fuzzy logic to find bookings based on the option that the receptionist chose
function findAvailableBookings(){

    //get the choice that was made's reason and time period it would take 
    var selector = document.querySelector("#selectedProcedure");
    var reason = selector.options[selector.selectedIndex].innerHTML;
    var time = selector.options[selector.selectedIndex].value;

    //API CALL TO GET THE POSSIBLE BOOKING SLOTS
    var response = fetch("/fuzzyLogic" , {
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"reason":reason, "duration":time})
    });

    response.then(res=> res.json().then(data => {
        //process the returned data from the server
        for( var i in data)
        {
            console.log(data[i]);
        }
    }));

}
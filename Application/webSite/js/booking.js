//  created by: Jacobus Janse van Rensburg
//  Updated & Reviewed by: Steven Visser

var selectedDoctor;
var selectedDate;
var selectedTime;
var selectedPatient;
var selectedReason;
var selectedEndTime;
var checkDoc = [];

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

    for(var i =0 ; i < data.length; i ++)
    {
        
        if(data[i].status == "Pending")
        {
            if(data[i].time == data[i].endTime){
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
            else{
                console.log(data[i]);
                console.log("Multi slot booking")
                var date = data[i].date;
                console.log("date: "+ date);
                var numOfSlots;
                var timeIndex;
                for(var j = 0 ; j < times.length; j ++)
                {
                    if (times[j] == data[i].time) {
                        timeIndex = j;
                        console.log("found that start time "+data[i].time+" = "+times[j]);
                    }
                    if (times[j] == data[i].endTime){ 
                        numOfSlots = j-timeIndex;
                        console.log("found that end time "+data[i].time+" = "+times[j]);
                    }

                }
                console.log("Start time: "+ times[timeIndex]+" \tEnd: "+times[timeIndex+numOfSlots])
                for (var j =0 ; j < numOfSlots ; j++){
                    var searchPageId = date+"&"+times[timeIndex+j];
                    console.log("Searching page for "+searchPageId);
                    var element = document.getElementById(searchPageId);
                    if (element!=null)
                    {
                        var colorWheel=["red","yellow","orange","blue","purple"]
                        var colorIndex;
                        switch(data[i].reason)
                        {
                            case "": {colorIndex=0; break;}
                            case "checkup": {colorIndex=3; break;}
                            case "Tooth Decay": {colorIndex=0; break;}
                            case "Gum Disease": {colorIndex=2; break;}
                            case "Tooth Sensitivity": {colorIndex=4; break;}
                            case "Tooth Extraction": {colorIndex=2; break;}
                            case "Tooth Erosion": {colorIndex=4; break;}
                            case "Moouth Sores": {colorIndex=4; break;}
                            default: colorIndex=0; break;

                        }
                        console.log("Reason: "+data[i].reason+"\tColor: "+colorWheel[colorIndex]);
                        //mark as red since a booking already exists
                        element.setAttribute("style","background-color:"+colorWheel[colorIndex]+";");
                        element.setAttribute("onclick","");
                        //call api to get patient based on id, then put the patients full name ehre
                        setName(data[i].patient,searchPageId);
                    }
                }
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
    overlay.innerHTML+='<div class="change" class="custom-control"><input type="checkbox"  id="searchByName" name="searchBy" onclick="searchByInputDisplay()" checked><label class="form-check-label" style="color:white; padding: 5px; left: 0px;" for="searchByName">  Search By Name </label><br>';
    overlay.innerHTML+='<input type="checkbox" id="searchBySurname" name="searchBy" onclick="searchByInputDisplay()"><label class="form-check-label" style="color:white; padding: 5px; left: 0px;" for="searchBySurname">  Search By Surname </label><br>';
    overlay.innerHTML+='<input type="checkbox" id="searchByPatientID" name="searchBy" onclick="searchByInputDisplay()"><label class="form-check-label" style="color:white; padding: 5px; left: 0px;" for="searchByPatientID">  Search By Patient ID </label> <br><br></div>';
    overlay.innerHTML+='<div id="inputBoxes" ></div><input style="margin-bottom: 20px;" class="btn btn-danger" type="submit" class="btn" value="Search" onclick="createPatientsListForBooking()"></div></div>';
    searchByInputDisplay();
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
    console.log("Searching db for patients ");
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
    // var overlay = document.getElementById("individual");
    var overlay = document.getElementById("currentOverlay");
    var replacement = "";
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "none";
    overlay.style.display = "none";
    overlay.style.display = "block";
    var inc = 1;

    for (var i in data)
    {
        console.log("found patient "+data[i].name+"  "+data[i].surname);
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
    displayTimeTableOverlay();
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
    displayDoctorOverlay();
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
        if(selectedReason == null || selectedReason == "")
        {
            if(reason == "" || reason == null)
            {
                reason = "General Appointment";
            }
            selectedReason = reason;
        }

        if(selectedEndTime ==null || selectedEndTime =="")
        {
            selectedEndTime = selectedTime;
        }

        var response = fetch("/makeBooking",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({"doctor":selectedDoctor, "patient":selectedPatient,"date":selectedDate,"time":selectedTime,"reason":selectedReason,"endTime":selectedEndTime})
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
        displayTimeTableOverlay();
    }));
    

    //populate the reason
    selectedReason = "Postponed Booking";
    document.getElementById("reasonForBooking").value = selectedReason;

    //change Make Booking! to Postpone Booking
    document.getElementById("makeBookingButton").innerText = "Postpone Booking!";
}

function initPage()
{
    displayPatientSearchOverlay();
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

    for(var i = 0; i < 8; i++)
    {
        checkDoc[i] = false;
    }
    

   var res = fetch("/getAvatarChoice",{
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    res.then(res=> res.json().then(data=> 
    {
        //data.choice is the avatar option
        var index = parseInt(data.avatar,10);
        checkDoc[index] = true;
        confirmPic();
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

    var population='<br><h3>Choose Common Type</h3><hr><select class="form-control" id="selectedProcedure"> <option value="">Select Option</option>';
    population+='<option value="15">checkup</option> <option value="30">Tooth Decay</option>';
    population+='<option value="45">Gum Disease</option>  <option value="30">Tooth Sensitivity</option>';
    population+='<option value="45">Tooth Extraction</option> <option value="30">Tooth Erosion</option>';
    population+='<option value="30">Moouth Sores</option> </select> <button id="btnCommonBooking" class="btn btn-primary" onclick="findAvailableBookings()">Select</button>';

    location.innerHTML=population;
}

//=================================================================================================
//function developed by: Jacobus Janse van Rensburg and Rani Arraf
//Function used for the fuzzy logic to find bookings based on the option that the receptionist chose

var OptionalBookings;
async function findAvailableBookings(){

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

    console.log("getting data");
    await response.then(res=>  res.json().then(data => {
        saveData(data);
    }));

    var bodySelector = document.getElementById("currentOverlay");
    bodySelector.style.position = "relative";
    bodySelector.style.display = "inline-block";
    bodySelector.style.backgroundColor= "#003366";
    bodySelector.style.width= "300px";
    bodySelector.style.color= "white";
    bodySelector.style.textAlign = "center";
    bodySelector.style.borderRadius = "5px";
    bodySelector.style.boxShadow = "1px 0px 15px 0px black";
    

    var location = document.querySelector("#currentOverlay");

    var population = '<br><h2>Choose Options</h2><hr><label for="selectTime">Select Time of Day</label><select class="form-control" id="selectFilterTime">';
    population += '<option  value="0">Morning</option> <option value="1">Afternoon</option></select>';
    population += '<br><label for="selectDay">Select Day of Week</label><select class="form-control" id="selectFilterDay">';
    population += '<option  value="1">Monday</option> <option value="2">Tuesday</option>';
    population += '<option  value="3">Wednesday</option> <option value="4">Thursday</option>';
    population += '<option  value="5">Friday</option> <option value="6">Saturday</option>';
    population += '<option  value="0">Sunday</option></select><br>';
    population += '<button id="btnCommonBooking" class="btn btn-primary" onclick="filterOptions()">Find</button>';
    
    location.innerHTML = population;

    // for(var i in OptionalBookings)
    // {
    //     console.log(OptionalBookings[i]);
    // }

}

//function just to save data captured from api call into a global variable
function saveData(data){
    OptionalBookings = data;
}

//================================================================================================
//Function developed by: Jacobus Janse van Rensburg
//Function is used to filter the fuzzy logic options to a set of options that is appropriate to the
//options that the user provides 
var sameDayFilteredOptions=[];
var sameTimeFilteredOptions=[];
function filterOptions()
{
    var dayArray =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var selectedFiltetTimeElement = document.querySelector("#selectFilterTime");
    var selectedFilterDayElement = document.querySelector("#selectFilterDay");

    var time = selectedFiltetTimeElement.options[selectedFiltetTimeElement.selectedIndex].value;
    var daySelected = selectedFilterDayElement.options[selectedFilterDayElement.selectedIndex].value;

    console.log("Time selected: "+ time +"\tday selected: "+daySelected);
    //most effitient way to find the elements ...
    if(time!= null && daySelected != null){

        //loop through the optional bookings
        for(var i in OptionalBookings){
            var booking = JSON.parse(OptionalBookings[i]);

            var parts = booking.date.split("/");
            var date = parts[2]+"-"+parts[1]+"-"+parts[0];
            console.log(date);
        
            var day = new Date(date).getDay();
            console.log(dayArray[day]);

            if (parseInt(day) == parseInt(daySelected) ){
                
                sameDayFilteredOptions.push(booking);
                console.log("pushing to filteredOptions");
            }

            if(parseInt(time) != parseInt(booking.isMorning)){
                sameTimeFilteredOptions.push(booking);
            }
        }

    }
    
    // displayTimeTableOverlay();

    // for(var i in sameTimeFilteredOptions)
    // {
    //     var x = sameTimeFilteredOptions[i].date;
    //     var y = sameTimeFilteredOptions[i].time;
    //     var date = x+"&"+y;
    //     var element = document.getElementById(date);

    //     element.setAttribute("style","background-color:lime;");
    //     element.setAttribute("onclick","selectFilteredBooking(\""+sameTimeFilteredOptions[i].time+"\",\""+sameTimeFilteredOptions[i].endTime+"\",\""+sameTimeFilteredOptions[i].date+"\",\""+sameTimeFilteredOptions[i].doctor+"\",\""+sameTimeFilteredOptions[i].reason+"\")")
    // }
    
    // for(var i in sameDayFilteredOptions)
    // {
    //     var x = sameDayFilteredOptions[i].date;
    //     var y = sameDayFilteredOptions[i].time;
    //     var date = x+"&"+y;
    //     var element = document.getElementById(date);

    //     element.setAttribute("style","background-color:lime;");
    //     element.setAttribute("onclick","selectFilteredBooking(\""+sameDayFilteredOptions[i].time+"\",\""+sameDayFilteredOptions[i].endTime+"\",\""+sameDayFilteredOptions[i].date+"\",\""+sameDayFilteredOptions[i].doctor+"\",\""+sameDayFilteredOptions[i].reason+"\")")
    // }
    var count=0;

    var bodySelector = document.getElementById("currentOverlay");
    var innerHTML= "<p style='color:black;'>Booking options for selected day:</p><br>";
    for(var i in sameDayFilteredOptions )
    {

        var inner ="<div><p>Time: "+sameDayFilteredOptions[i].time+"</p>";
        inner+="<p>End: "+sameDayFilteredOptions[i].endTime+"</p>";
        inner+="<p>Day:"+dayArray[daySelected]+"</p>";
        inner+="<p>Date: "+sameDayFilteredOptions[i].date+"</p>";
        inner+="<p>Doctor: "+sameDayFilteredOptions[i].doctor+"</p>";
        inner+="<input type='button' value='select' onclick='selectFilteredBooking(\""+sameDayFilteredOptions[i].time+"\",\""+sameDayFilteredOptions[i].endTime+"\",\""+sameDayFilteredOptions[i].date+"\",\""+sameDayFilteredOptions[i].doctor+"\",\""+sameDayFilteredOptions[i].reason+"\")'>";
        inner+="</div>";
        innerHTML+=inner;
        count ++;
        if(count >= 5) break;
    }

    count =0;
    innerHTML+="<p>Booking options of matching time</p>";

    for(var i in sameTimeFilteredOptions)
    {
        var inner ="<div><p>Time: "+sameTimeFilteredOptions[i].time+"</p>";
        inner+="<p>End: "+sameTimeFilteredOptions[i].endTime+"</p>";
        inner+="<p>Day:"+dayArray[daySelected]+"</p>";
        inner+="<p>Date: "+sameTimeFilteredOptions[i].date+"</p>";
        inner+="<p>Doctor: "+sameTimeFilteredOptions[i].doctor+"</p>";
        inner+="<input type='button' value='select' onclick='selectFilteredBooking(\""+sameTimeFilteredOptions[i].time+"\",\""+sameTimeFilteredOptions[i].endTime+"\",\""+sameTimeFilteredOptions[i].date+"\",\""+sameTimeFilteredOptions[i].doctor+"\",\""+sameTimeFilteredOptions[i].reason+"\")'>";
        inner+="</div>";
        innerHTML+=inner;
        count++;
        if (count >=5) break;
    }

    bodySelector.innerHTML = innerHTML;
    /*
    <div id="someIdToDistinguish">
      <p>Time: time_goes_here</p>
      <p>Date: dd/mm/yyyy</p>
      <p>Day: Monday->Sunday</p>
      <p>Doctor: Doctor_Name_Here</p>
      <input type="button" value="select" onclick="selectFilteredBooking(time , end , date , doctorID)">
    </div>
    */
}

function selectFilteredBooking(time , endTime , date, doctor,reason)
{
    selectedDoctor = doctor; 
    selectedDate = date;
    selectedTime = time;
    selectedEndTime = endTime;
    selectedReason = reason;

    document.getElementById("timeInfoDisplay").innerHTML = time;
    document.getElementById("timeInfoDisplay").style.color = "lightgreen";
    
    document.getElementById("dateInfoDisplay").innerHTML = date;
    document.getElementById("dateInfoDisplay").style.color = "lightgreen";

    document.getElementById("doctorInfoDisplay").innerHTML = date;
    document.getElementById("doctorInfoDisplay").style.color = "lightgreen";

}

//=============================================================================================
//Function Developed by: Rani Arraf
//Initializes Profile Pictures
function selectDoc1(){
    resetDoc();
    checkDoc[0] = true;

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
    resetDoc();
    checkDoc[1] = true;


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
    resetDoc();
    checkDoc[2] = true;

    
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
    resetDoc();
    checkDoc[3] = true;


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
    resetDoc();
    checkDoc[4] = true;

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
    resetDoc();
    checkDoc[5] = true;


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

    resetDoc();
    checkDoc[6] = true;

    
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
    resetDoc();
    checkDoc[7] = true;


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

function resetDoc()
{
    for(var i = 0; i < 8; i++)
    {
        checkDoc[i] = false;
    }
}

function confirmPic(){
    var pictureFrame1 = document.querySelector(".profile");
    if(checkDoc[0] == true){
        
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_a_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc[1] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_b_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc[2] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_i_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc[3] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_w_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc[4] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_a_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc[5] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_b_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc[6] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_i_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc[7] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_w_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
}

function confirmPicture(){
    var avatar = "0";
    var pictureFrame1 = document.querySelector(".profile");
    if(checkDoc[0] == true){
        
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_a_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
        avatar = "0";
    }
    if(checkDoc[1] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_b_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
        avatar = "1";
    }
    if(checkDoc[2] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_i_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
        avatar = "2";
    }
    if(checkDoc[3] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_w_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
        avatar = "3";
    }
    if(checkDoc[4] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_a_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
        avatar = "4";
    }
    if(checkDoc[5] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_b_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
        avatar = "5";
    }
    if(checkDoc[6] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_i_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
        avatar = "6";
    }
    if(checkDoc[7] == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_w_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
        avatar = "7";
    }

    var response = fetch("/setAvatarChoice",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"avatar":avatar})
    });
}
//  created by: Jacobus Janse van Rensburg
//  Updated & Reviewed by: Steven Visser

var selectedDoctor;
var selectedDate;
var selectedTime;
var selectedPatient;
var selectedReason;

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
// Style development by: Rani Arraf
// creates a list of all the doctors that the receptionist is allowed to schedule bookings for
function createDoctorsList(data)
{
    var overlay = document.getElementById('currentOverlay');
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "none";
    overlay.style.display = "block";
    overlay.style.backgroundColor= "#003366";
    overlay.style.width= "300px";
    overlay.style.color= "white";
    overlay.style.marginLeft = "auto";
    overlay.style.marginRight = "auto";
    overlay.style.textAlign = "center";
    overlay.style.borderRadius = "5px";
    overlay.style.boxShadow = "1px 0px 15px 0px black";
    var replacement = "";
    for(var i in data)
    {
      if(data != null){
        replacement += "<div style='background-color: #003366; width: 300px; color: white; margin-left: auto; margin-right: auto; text-align: auto; border-radius: 5px;'>";
        replacement +='<br><li>Dr.'+data[i].surname+' ('+data[i].name+') </li><br><button class="btn btn-primary" onclick="selectDoctor(\''+data[i]._id+'\',\''+data[i].name+'\',\''+data[i].surname+'\')">Select</button> <br><br>';
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
//populates the booking table with all existing bookings & creates the schedule
function displayTimeTableOverlay()
{
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
            for(var i in data)
            {
                console.log("Bookins already made for dr: \n"+data[i]);
            }
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
        
            var dataIndex = parseInt(i) ;
            console.log(dataIndex);
    
            var date = data[dataIndex].date;
            var time = data[dataIndex].time;
            var searchPageId = date+"&"+time;
            console.log(searchPageId);
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

function setName(patient, searchPageId){
    var response = fetch("/singlePatient",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body:JSON.stringify({"patient":patient})
    });
    response.then(res => res.json().then(pat => 
    {
        console.log(pat.name);
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
    console.log(timeslot);
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
//
function createPatientSearchOverlay()
{
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "none";

    var overlay = document.getElementById("currentOverlay");
    overlay.style.display = "block";
    overlay.style.backgroundColor= "#003366";
    overlay.style.width= "300px";
    overlay.style.color= "white";
    overlay.style.marginLeft = "auto";
    overlay.style.marginRight = "auto";
    overlay.style.textAlign = "center";
    overlay.style.borderRadius = "5px";
    overlay.style.boxShadow = "1px 0px 15px 0px black";


    overlay.innerHTML ='<div style="background-color:#003366;"><div id="doctorFormSignup"><br>';
    overlay.innerHTML+='<h2> Search Patient</h2><br>';
    overlay.innerHTML+='<div class="change" class="custom-control"><input type="checkbox"  id="searchByName" name="searchBy" onclick="searchByInputDisplay()"><label class="form-check-label" style="color:white;" for="searchByName"> Search By Name </label><br>';
    overlay.innerHTML+='<input type="checkbox" id="searchBySurname" name="searchBy" onclick="searchByInputDisplay()"><label class="form-check-label" style="color:white;" for="searchBySurname"> Search By Surname </label><br>';
    overlay.innerHTML+='<input type="checkbox" id="searchByPatientID" name="searchBy" onclick="searchByInputDisplay()"><label class="form-check-label" style="color:white;" for="searchByPatientID"> Search By Patient ID </label> <br><br></div>';
    overlay.innerHTML+='<div id="inputBoxes"></div><input style="margin-bottom: 20px;" class="btn btn-danger" type="submit" class="btn" value="Search" onclick="createPatientsListForBooking()"></div></div>';

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
    var overlay = document.getElementById("currentOverlay");
    var replacement = "";
    var overlayTable = document.getElementById('currentOverlayTable');
    overlayTable.style.display = "none";
    overlay.style.display = "block";

    for (var i in data)
    {
        replacement += '<br><br><li> Name: '+data[i].name+'</li><li> Surname: '+data[i].surname+'</li><li>ID: '+data[i].idNumber+'</li><li>Cell: '+data[i].cellnumber+'</li><br><button class="btn btn-warning" onclick="selectPatient(\''+data[i]._id+'\',\''+data[i].name+'\',\''+data[i].surname+'\',\''+data[i].idNumber+'\')">Select</button><br><br>';
    }
    overlay.innerHTML = replacement;
}

// ===========================================================================================
//Function developed by: Jacobus Janse van Rensburg
//
function selectDoctor(drID,name, surname)
{
    selectedDoctor = drID;
    console.log("Selected doctor with id: "+selectedDoctor);

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
    console.log("Selected Time: "+ selectedTime+"\t selected date: "+selectedDate);

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
    console.log("Making booking with details:\nDoctor: "+selectedDoctor+"\nPatient: "+selectedPatient+"\nDate: "+selectedDate+"\nTime: "+selectedTime);
    if (selectedDoctor != null && selectedPatient!= null && selectedDate != null && selectedTime!=null)
    {

        //booking can be created
        var reason = document.getElementById("reasonForBooking").value;

        var response = fetch("/makeBooking",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({"doctor":selectedDoctor, "patient":selectedPatient,"date":selectedDate,"time":selectedTime,"reason":reason})
        });

        response.then(res=> 
        {
            console.log(res.url+ " statusCode: "+res.status);
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
        console.log("Doctor For Postponement");
        console.log(data);
        console.log(data.surname);
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
        console.log("Patient For Postponement");
        console.log(data);
        console.log(data.surname);
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
}


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
//Function Developed by:
//
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
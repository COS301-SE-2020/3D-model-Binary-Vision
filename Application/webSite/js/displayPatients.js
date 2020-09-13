// File created by:
// File modified by: Jacobus Janse van Rensburg

//================================================================================================
// Function developed by:
//
function rotateArrow(arrowID)
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

//================================================================================================
// Function developed by:
//
function moveSideBar()
{
    var bodyA = document.getElementById("sideBody");

    if(!showSideBar)
    {
        showSideBar = true;
        bodyA.classList.remove("moveSideBar");
        document.getElementById("conatinerHome").classList.remove("moveContainerHome");
    }
    else
    {
        showSideBar = false;
        bodyA.classList.add("moveSideBar");
        document.getElementById("conatinerHome").classList.add("moveContainerHome");
    }
}

//================================================================================================
// Function developed by: Rani Arraf
//
function searchTable()
{
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("patients");
    filter = input.value.toUpperCase();
    table = document.getElementById("addToTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) 
    {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) 
        {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) 
            {
                tr[i].style.display = "";
            } 
            else 
            {
                tr[i].style.display = "none";
            }
        }
    }
}

// =================================================================================
// Function developed by: Jacobus Janse van Rensburg
// function used to initiaise the page with the required information
function init()
{
    populateDoctorChoices();
    document.querySelector("#doctors").addEventListener("change", populatePatients);
}

// =================================================================================
// Function developed by: Jacobus Janse van Rensburg
//function used to retrieve the doctors and set the the fields to chose a doctor that is visible to the receptionist
function populateDoctorChoices()
{
    //retrieve the doctors using the api
    var response = fetch("/getDoctorsOfReceptionist",{
      method:"POST",
      headers:{'Content-Type': 'application/json; charset=UTF-8'}
    });

    //decode the response from the api and use the information
    response.then(res => res.json().then(data=>
    {
        if ( res.status == 200)
        {
            //there was no error fetching the data and we can pupulate the dr choice bar
            var replacement = "<option >Select Doctor</option>";
            for (var i in data)
            {
                replacement+= "<option value='"+data[i]._id+"'>Dr "+data[i].surname+" ("+data[i].name+")</option>";
            }
            document.getElementById("doctors").innerHTML=replacement;
        }
        else
        {
          //there was an error that needs to be handled in the front end RANI
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
    //get the information regarding the doctor
    var response = fetch("/getDoctorsScheduleToday",{
        method: "POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"doctor":selectedDoctor})
    });


    response.then(res=> res.json().then(data=>
    {
        var replacement ="";
        var count = 1;
        document.getElementById("patientTable").innerHTML =replacement;
        for(var i in data)
        {
            if(data[i].status == "Pending")
            {
                //fetch the patients information
                var get = fetch("/singlePatient",{
                    method:"POST",
                    headers:{'Content-Type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify({"patient":data[i].patient})
                });
              
                get.then(g => g.json().then(patientInfo=>
                {
            
                    if(g.status ==200)
                    {
                        var timeIndex = parseInt(i)+count-data.length;
                        replacement="<tr><td>"+patientInfo.name+"</td><td>"+count+"</td><td>"+patientInfo.idNumber+"</td><td>"+data[i].time+" : "+data[i].date+"</td><td>"+patientInfo.cellnumber+"</td><td><a class='btn btn-success'  type='button' href='makeBooking.html?patient="+data[i].patient+"&doctor="+selectedDoctor+"' onclick='postponeBooking(\""+data[i]._id+"\")'>POSTPONE</a><button class='btn btn-danger'  type='button' onclick='cancelBooking(\""+data[i]._id+"\")'>CANCEL</button></td></tr>";
                        count++;
                        document.getElementById("patientTable").innerHTML+=replacement;
                  
                    }
                    else
                    {
                      //error occured getting patient information for a booking
                    }
                }));
            }
        }
    }));
}

//================================================================================================
// Function developed by:Steven Visser
// Removes a booking from the database
function cancelBooking(bookingID)
{
    var response = fetch("/updateBooking",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"_id":bookingID,"status":"Cancelled"})
    });

    response.then(res => 
    {
        //remove the bar holding this booking and load the next one
        //check status code
        if(res.status == 401)
        {
            alert("You are not authorized to do this action!");
        }
        else if(res.status== 200)
        {
            //remove successful, dynamically update the page to remove the block
            populatePatients();
        }
    });
}


//================================================================================================
// Function developed by:Steven Visser
// Gets new date & time for booking,  updates database
function postponeBooking(bookingID)
{
    //cancel the booking here
    var response = fetch("/updateBooking",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"_id":bookingID,"status":"Postponed"})
    });
}

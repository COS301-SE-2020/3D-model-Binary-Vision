//Created by Jacobus Janse van Rensburg
//file intended to handel all the dynamic allocations and api calls done on the doctorSchedule.html page

var checkDoc = [];

//================================================================================================
//Function Developed by: Jacobus Janse van Rensburg
//function that sets all the various aspects of the page bassed on the doctor that logged in
function initPage()
{
    setDoctorInfo();
    setTodaysBookings();
    setDate();

    for(var i = 0; i < 8; i++)
    {
        checkDoc[i] = false;
    }
    

   var response = fetch("/getAvatarChoice",{
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    response.then(res=> res.json().then(data=> 
    {
        //data.choice is the avatar option
        var index = parseInt(data.avatar,10);
        checkDoc[index] = true;
        confirmPic();
    }));
}

//================================================================================================
// Function developed by: Jacobus janse van Rensburg
//function to fetch details of the doctor to populate the page
function setDoctorInfo()
{
    var response = fetch("/getDoctor",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'}
    })

    response.then( res=> res.json().then( data =>
    {
        // set the surname field
        document.getElementById("doctorsName").innerHTML=data.surname+" ("+data.name+")";
    }));
}

//================================================================================================
// Function developed by: Jacobus janse van Rensburg
// function to fetch all the meetings that the doctor will have for today
function setTodaysBookings()
{
    var response = fetch("/getTodaysBookings",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'}
    });

    response.then(res => res.json().then(data=>
    {
        //Send the data to various functions that will populate the different fields of the bookings

        //maybe sort the times in accending order ?? then populate the fields
        for(var i = 0; i < data.length; i++)
        {
            for(var j = i; j < data.length; j++)
            {
                if(data[i].time > data[j].time)
                {
                    var temp = data[i];
                    data[i] = data[j];
                    data[j] = temp;
                }
            }
        }

        /*for (var i in data) {
            console.log(data[i]._id);
        }*/

        for(var i in data)
        {
            if(data[i].status == "Pending")
            {
                var replacement = '<li class= "notify" id="'+data[i]._id+'">Time: '+data[i].time+'<button type="button" class="btn btn-primary" id="buttonSchedule" onclick="fixPositionConsultation(\''+data[i]._id+'\'); dynamicBarMoveAndPopulate(\''+data[i].patient+'\',\''+data[i].time+'\',\''+data[i].reason+'\',\''+data[i]._id+'\');" >Check</button></li>'
                document.getElementById("notifyContainer").innerHTML += replacement;
            }
        }
    }));
}

var lastID = null;

function resetLastID() {

    lastID = null;
}

function fixPositionConsultation(elementId, idList) {
    var element = document.getElementById(elementId);

    console.log(lastID);

    if (lastID == elementId) {
        document.getElementById(lastID).classList.remove("notifyFixed");
        lastID = null;
        
    }else if (lastID != null) {
        document.getElementById(lastID).classList.remove("notifyFixed");
        lastID = elementId;
        element.classList.add("notifyFixed");

    } else {
        lastID = elementId;
        element.classList.add("notifyFixed");
    }

    /*arrowElement.classList.contains("arrowSideBarTransform");
    arrowElement.classList.replace("arrowSideBody", "arrowSideBarTransform");
    document.getElementById("conatinerHome").classList.remove("moveContainerHome");
    document.getElementById("conatinerHome").classList.add("moveContainerHome");*/
}

//================================================================================================
// Function developed by: Jacobus Janse van Rensburg
//

function dynamicBarMoveAndPopulate(id,time,reason,booking)
{
    closeRightBar();
    populateBookings(id,time,reason,booking);
    openRightBar();
}

//================================================================================================
// Function developed by: Steven Visser
// Makes the bar on the right smaller
function closeRightBar()
{
    document.getElementById("rightSideBody").style.width = "200px";
}

//================================================================================================
// Function developed by: Steven Visser
// Makes the bar on the right bigger
function openRightBar()
{
    document.getElementById("rightSideBody").style.width = "500px";
}

//================================================================================================
// Function developed by: Jacobus Janse van Rensburg
// Function used to populate the fields of the bookings retrieved
function populateBookings(patientId,time,reason,booking)
{

        if(patientId != null)
        {
            // get the patients information

            var response = fetch("/singlePatient",{
                method:"POST",
                headers:{'Content-Type': 'application/json; charset=UTF-8'},
                body: JSON.stringify({"patient":patientId})
            });

            response.then(res=> res.json().then(patient=>
            {
                //do what needs to be done with the patients information
                //populate right bar over here
                document.getElementById("patientName").innerHTML = patient.name + " " + patient.surname;
                document.getElementById("bookingTime").innerHTML = time;
                document.getElementById("patientNotes").innerHTML = reason;
            
                document.getElementById("manageBookingForm").innerHTML = " <button class='btn btn-success' type='button' onclick='completeBooking(\""+booking+"\");' style='margin-right: 10px; margin-bottom: 10px;'>Complete</button><a class='btn btn-primary' href='/Consultation.html?bookingid="+booking+"' style='margin-right: 10px; margin-bottom: 10px;'>Consultation</a>"
            }));
        }
        else
        {
            document.getElementById("patientName").innerHTML = "N/A";
            document.getElementById("bookingTime").innerHTML = "N/A";
            document.getElementById("patientNotes").innerHTML = "N/A";
            document.getElementById("manageBookingForm").innerHTML = " <button class='btn btn-success' type='button' style='margin-right: 10px; margin-bottom: 10px;'>Complete</button><button class='btn btn-primary' type='button' style='margin-right: 10px; margin-bottom: 10px;'>Consultation</button>"
        }

}

//================================================================================================
// Function developed by:Steven Visser
// Function used to set todays date on top of schedule
function setDate()
{
    var container = document.getElementById("headerTitle");
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    hours = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);

    var date = today.getDate() + '/' + (today.getMonth()+1) +'/'+ today.getFullYear();
    container.innerHTML = date + "  -  " + hours + ":" + minutes + ":" + seconds;
    var t = setTimeout(setDate, 500);
}

//================================================================================================
// Function developed by: Marcus Werren
// Function to add a 0 if the time needs a 0
function checkTime(i)
{
    if (i < 10)
    {
        i = "0" + i;
    }
    return i;
}


//================================================================================================
// Function developed by:Steven Visser
// Completes a Booking and removes it from the databse
function completeBooking(bookingID)
{
    lastID = null;
        var response = fetch("/updateBooking",{
            method:"POST",
            headers:{'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({"_id":bookingID,"status":"Completed"})
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
                document.getElementById(bookingID).remove();
                dynamicBarMoveAndPopulate(null,null,null,null);
                closeRightBar();
            }
        });
}

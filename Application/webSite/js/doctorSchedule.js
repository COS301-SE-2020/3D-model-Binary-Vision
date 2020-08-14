//created by Jacobus Janse van Rensburg
// file intended to handel all the dynamic allocations and api calls done on the doctorSchedule.html page

//================================================================================================
//Function Developed by: Jacobus Janse van Rensburg
//function that sets all the various aspects of the page bassed on the doctor that logged in
function initPage(){
    setDoctorInfo();
    setTodaysBookings();
    setDate();
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

    response.then( res=> res.json().then( data => {

        console.log("Doctors surname: "+data.surname);
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

    response.then(res => res.json().then(data=>{
      //Send the data to various functions that will populate the different fields of the bookings

    //   maybe sort the times in accending order ?? then populate the fields
        for(var i in data){
            console.log(data[i]);
            //change id notify to booking id
            var replacement = '<li id="'+data[i]._id+'">Time: '+data[i].time+'<button type="button" class="btn btn-primary" id="buttonSchedule" onclick="dynamicBarMoveAndPopulate(\''+data[i].patient+'\',\''+data[i].time+'\',\''+data[i].reason+'\',\''+data[i]._id+'\');" >Check</button></li>'
            document.getElementById("notifyContainer").innerHTML += replacement;
        }
    }));
}

function dynamicBarMoveAndPopulate(id,time,reason,booking){
    moveRightBar();
    populateBookings(id,time,reason,booking);
}
//================================================================================================
// Function developed by: Jacobus janse van Rensburg
// Function used to populate the fields of the bookings retrieved
function populateBookings(patientId,time,reason,booking)
{
   
        // get the patients information 
        
        var response = fetch("/singlePatient",{
            method:"POST",
            headers:{'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({"patient":patientId})
        });
        console.log("booking id:"+booking);
        response.then(res=> res.json().then(patient=> {
        //    do what needs to be done with the patients information
            //populate right bar over here 
            console.log("hello "+ patient.name+" "+time+ " "+ reason);
            document.getElementById("patientName").innerHTML= patient.name ;
            document.getElementById("bookingTime").innerHTML=time;
            document.getElementById("patientNotes").innerHTML = reason;

            document.getElementById("manageBookingForm").innerHTML = " <button class='btn btn-success' type='button' onclick='completeBooking(\""+booking+"\");' style='margin-right: 10px; margin-bottom: 10px;'>Complete</button><button class='btn btn-primary' type='submit' formaction='Consultation.html' style='margin-right: 10px; margin-bottom: 10px;'>Consultation</button>"

           console.log(patient);
        }));

    
}

//================================================================================================
// Function developed by:Steven Visser
// Function used to set todays date on top of schedule
function setDate()
{
    var container = document.getElementById("headerTitle");
    var today = new Date();
    var date = today.getDate() + ' / ' + (today.getMonth()+1) +' / '+ today.getFullYear();
    container.innerHTML = "SCHEDULE FOR [" + date + "]";
}

//================================================================================================
// Function developed by:Steven Visser
// Completes a Booking and removes it from the databse
function completeBooking(bookingID)
{
    
    var response = fetch("/removeBooking",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"_id":bookingID})
    });

    response.then(res => {
        //remove the bar holding this booking and load the next one
        //check status code
        console.log(res.status);
        if(res.status == 401)
        {
            alert("You are not authorized to do this action!");
        }
        else if(res.status== 200)
        {
            //remove successful, dynamically update the page to remove the block
            document.getElementById(bookingID).remove();
        }
    });

}





//Created by Jacobus Janse van Rensburg
//file intended to handel all the dynamic allocations and api calls done on the doctorSchedule.html page

//================================================================================================
//Function Developed by: Jacobus Janse van Rensburg
//function that sets all the various aspects of the page bassed on the doctor that logged in
function initPage()
{
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

        for(var i in data)
        {
            if(data[i].status == "Pending")
            {
                var replacement = '<li class= "notify" id="'+data[i]._id+'">Time: '+data[i].time+'<button type="button" class="btn btn-primary" id="buttonSchedule" onclick="dynamicBarMoveAndPopulate(\''+data[i].patient+'\',\''+data[i].time+'\',\''+data[i].reason+'\',\''+data[i]._id+'\');" >Check</button></li>'
                document.getElementById("notifyContainer").innerHTML += replacement;
            }
        }
    }));
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

//=============================================================================================
//Function Developed by: Rani Arraf
//Initializes Profile Pictures
var checkDoc1 = false;
var checkDoc2 = false;
var checkDoc3 = false;
var checkDoc4 = false;
var checkDoc5 = false;
var checkDoc6 = false;
var checkDoc7 = false;
var checkDoc8 = false;

function selectDoc1(){
    checkDoc1 = true;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;

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
    checkDoc1 = false;
    checkDoc2 = true;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;


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
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = true;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;

    
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
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = true;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;


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
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = true;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = false;

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
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = true;
    checkDoc7 = false;
    checkDoc8 = false;


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
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = true;
    checkDoc8 = false;

    
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
    checkDoc1 = false;
    checkDoc2 = false;
    checkDoc3 = false;
    checkDoc4 = false;
    checkDoc5 = false;
    checkDoc6 = false;
    checkDoc7 = false;
    checkDoc8 = true;


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

function confirmPicture(){
    var pictureFrame1 = document.querySelector(".profile");
    if(checkDoc1 == true){
        
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_a_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc2 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_b_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc3 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_i_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc4 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_w_male.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc5 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_a_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc6 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_b_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc7 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_i_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
    if(checkDoc8 == true){
        var population = "<img id='profilePic' src='../css/images/Avatars/doc_w_female.png' alt='Profile Picture' width='200px' height='200px'>";
        pictureFrame1.innerHTML = population;
    }
}
//Created by: Marcus Werren
//This file contains functions for the consultations page

var currentTime = "";
var checkDoc = [];

//=============================================================================================
//Function Developed by: Marcus Werren
//This function rotates the arrow for the side bar on this page
function rotateArrowConsultation(arrowID) 
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
// This function moves the side bar off screen and moves the body infromation of the page to fill the page
function moveSideBar()
{
  	var bodyA = document.getElementById("sideBody");
  	var info = document.getElementsByClassName("bodyContainer");

	  if(!showSideBar)
	  {
  	  	showSideBar = true;
  	  	bodyA.classList.remove("moveSideBar");
  	  	bodyContainer.style.width = "60%";
  	  	bodyContainer.classList.remove("bodyContainerIncreaseWidth");
  	}
	else
	{
  	 	showSideBar = false;
  	 	bodyA.classList.add("moveSideBar");
  	 	bodyContainer.style.width = "75%";
  	 	bodyContainer.classList.add("bodyContainerIncreaseWidth");
  	}
}

//=============================================================================================
//Function Developed by: Marcus Werren
// This function rotates the arrows of the tabs "consultation info" and "patient info"
function rotateArrow(arrowID, currentDivID) 
{
	let arrowElement = document.getElementById(arrowID);
	let classElement = document.getElementById(currentDivID);
	
	if(arrowElement.classList.contains("arrowRotate")) 
	{
		arrowElement.classList.remove("arrowRotate");
		classElement.classList.remove("infoContainerResize");
	} else 
	{
		arrowElement.classList.add("arrowRotate");
		classElement.classList.add("infoContainerResize");
	}

	if (document.getElementById("consultationInfo").classList.contains("infoContainerResize") && document.getElementById("pateientsInfo").classList.contains("infoContainerResize")) 
	{
		document.getElementById("infoContainer").classList.add("infoContainerResize");
	} 
	else if (document.getElementById("infoContainer").classList.contains("infoContainerResize")) 
	{
		document.getElementById("infoContainer").classList.remove("infoContainerResize");
	}

	if (arrowID == "arrowConInfo") 
	{
		hideConInfo();
	} 
	else 
	{
		hidePatInfo();
	}
}

//=============================================================================================
//Function Developed by: Marcus Werren
//This funtion hides the information about the cunsultation info
function hideConInfo()
{
	let timeRemainding = document.getElementById("conInfoTime");
	let startInfo = document.getElementById("conInfoStart");
	let endInfo = document.getElementById("conInfoEnd");

	if (startInfo.style.display == "block") 
	{
		timeRemainding.innerHTML = '<span id="remainingTime" style="font-weight: bold;"></span>';
		
		if (timeRemainding.classList.contains("conInfoTimeCenterMessage"))
		{
			timeRemainding.classList.remove("conInfoTimeCenterMessage");
		}
		timeRemainding.classList.add("conInfoTimeCenter");

		startInfo.style.display = "none";
		endInfo.style.display = "none";
	} 
	else 
	{
		timeRemainding.innerHTML = 'Time Remaining: <br><span id="remainingTime" style="font-weight: bold;" ></span>';
		
		if (timeRemainding.classList.contains("conInfoTimeCenterMessage"))
		{
			timeRemainding.classList.remove("conInfoTimeCenterMessage");
		}
		timeRemainding.classList.remove("conInfoTimeCenter");
		
		startInfo.style.display = "block";
		endInfo.style.display = "block";
	}
}

//=============================================================================================
//Function Developed by: Marcus Werren
//This function hides the patients infromation tab
function hidePatInfo() 
{
 	let displayMessage = document.getElementById("patientDisplayMessage");
	let name = document.getElementById("patientName");
	let surname = document.getElementById("patientSurname");
	let id = document.getElementById("patientID");
	let gender = document.getElementById("patientGender");
	let email = document.getElementById("patientEmail");
	let contactNo = document.getElementById("patientContactNo");
	let inner = document.getElementById("patientInfoInner");

	if (displayMessage.style.display == "none") 
	{
		displayMessage.style.display = "block";
		name.style.display = "none";
		surname.style.display = "none";
		id.style.display = "none";
		gender.style.display = "none";
		email.style.display = "none";
		contactNo.style.display = "none";
		inner.classList.replace("patientInfoInner", "patientInfoInnerMessage");
	} 
	else 
	{
		displayMessage.style.display = "none";
		name.style.display = "block";
		surname.style.display = "block";
		id.style.display = "block";
		gender.style.display = "block";
		email.style.display = "block";
		contactNo.style.display = "block";
		inner.classList.replace("patientInfoInnerMessage", "patientInfoInner");
	}
}

//=============================================================================================
//Function Developed by: Steven Visser
//Saves a regular consultation
function saveConsultation(pid,reason) 
{
	let docNote = document.getElementById("doctorsNotes");

	if (docNote.value != "") 
	{
		//call the api function to save a consultation
		var response = fetch("/saveConsultation",{
			method:"POST",
			headers:{'Content-Type': 'application/json; charset=UTF-8'},
			body: JSON.stringify({"_id":pid,"note":docNote.value,"reason":reason})
		});
	
		response.then(res => 
		{
			//remove the bar holding this booking and load the next one
			//check status code
			if(res.status == 401)
			{
				alert("You are not authorized to do this action!");
			}
			else if(res.status== 201)
			{
				alert("Consultation Saved!");
			}
		});
	} 
	else 
	{
		alert("No note to be saved!");
	}
}

//=============================================================================================
//Function Developed by: Marcus Werren
//This function is used to get the current time for the page
function startTime() 
{
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();

	document.getElementById('remainingTime').innerHTML = getRemainingTime(h, m, s);

	var t = setTimeout(startTime, 500);
}

//=============================================================================================
//Function Developed by: Marcus Werren
//This fucntion is used to update the time so that it updates in real time
function checkTime(i) 
{
	if (i < 10) 
	{
		i = "0" + i;
	}
	return i;
}

//=============================================================================================
//Function Developed by: Marcus Werren
//This function calculates the remaining time for the consultation
function getRemainingTime(h, m, s) 
{
	let startTime = document.getElementById("startTime").innerHTML;
	let endTime = document.getElementById("endTime").innerHTML;

	let sh = parseInt(startTime[0] + startTime[1]);
	let sm = parseInt(startTime[3] + startTime[4]);

	let eh = parseInt(endTime[0] + endTime[1]);
	let em = parseInt(endTime[3] + endTime[4]);

	h = eh - 1 - h;
	m = (59 - m) + em;
	s = 59 - s;

	if (m > 60) 
	{
		m -= 60;
		h++;
	}

	m = checkTime(m);
	s = checkTime(s);

	if ((h == 0 && m < 5) || (h == -1 && m == 60))
	{
		document.getElementById("remainingTime").style.color = "red";
	}
	else if (h <= -1 && m < 60)  
	{
		document.getElementById("remainingTime").style.color = "green";
	}
	else
	{
		document.getElementById("remainingTime").style.color = "black";
	}
		

	if (h < 0 && m==60) 
	{
		return "00:00:" + s;
	} 
	else if (h < 0) 
	{
		let timeRemainding = document.getElementById("conInfoTime");
		if (timeRemainding.classList.contains("conInfoTimeCenter"))
		{
			timeRemainding.classList.replace("conInfoTimeCenter", "conInfoTimeCenterMessage");
		}
		return "The consultation has ended";
	} 
	else 
	{
		h = checkTime(h);
		return h + ":" + m + ":" + s;
	}
}

//=============================================================================================
//Function Developed by: Jacobus Janse van Rensburg
// function called when loading page to populate all the doctors information
function init()
{
	startTime();
	populateDoctorInformation();
	populateBookingInformation();
    setLink();

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


function setLink()
{
    console.log("SetHref");
    var url = window.location.href;
    console.log(url);
    var parts = url.split("=");
    console.log(parts);
    var replace = "Consultation.html?bookingid="+parts[1];

    document.querySelector("#consLink").href=replace;
}

//=============================================================================================
//Function Developed by: Jacobus Janse van Rensburg
//function used to get and set the information of the doctor onto this page
function populateDoctorInformation()
{
	var response = fetch("/getDoctor",{
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'}
    })

    response.then( res=> res.json().then( data => 
    {
        // set the surname field 
        document.getElementById("doctorName").innerHTML=data.surname+" ("+data.name+")";
    }));
}

//=============================================================================================
//Function Developed by: Jacobus Janse van Rensburg
//Function used to get the booking id from the url and populating the requied fields using that information
function populateBookingInformation()
{
	var url = window.location.href;
	var parts = url.split("=");
	//parts[1] holds the booking information

	//get the booking details 
	var response = fetch("/getSingleBooking",{
		method:"POST",
		headers:{'Content-Type': 'application/json; charset=UTF-8'},
		body: JSON.stringify({"booking":parts[1]})
	});

	response.then(res => res.json().then(data =>
	{
		//set different times
		document.querySelector("#startTime").innerHTML=data.time;
		var time = data.time;
		var mins = time.split(":");
        var newMins = parseInt(mins[1])+15;
        if(newMins == 0)
        {
            newMins = '00'
        }
		var endTime;
		if(newMins >=60)
		{
			newMins = '00';
            newHour = parseInt(mins[0])+1;
            if(newHour.length == 1)
            {
                newHour = '0' + newHour;
            }
			endTime = newHour+":"+newMins;
		}
		else
		{
            if(mins[0].length == 1)
            {
                endTime= '0' + mins[0]+":"+newMins;
            }
            else
            {
                endTime= mins[0]+":"+newMins;
            }
		}
		document.querySelector("#endTime").innerHTML = endTime;		
		
		//set the reason for the booking 

		//set the patient information 
		document.getElementById("recordPage").href = "recordPage.html?pid="+data.patient+"="+parts[1];
		populatePatientInfo(data.patient,data.reason);
	}));

}

//=============================================================================================
//Function Developed by: Jacobus Janse van Rensburg
// function to get the required patients information and populate the patient information
function populatePatientInfo(id,reason)
{
	document.getElementById("docnotes").innerHTML = "<p style='font-weight: bold;'>Doctors Notes:</p><textarea id='doctorsNotes' style='width: 100%; height: 100%; border-width: 2px; border-color: #003366; border-radius: 5px; max-height: 280px;'></textarea><button class='btn btn-info' id='saveDoctorNote' type='button' style='margin-top: 10px;' onclick=\"saveConsultation('"+id+"','"+reason+"')\">Save Notes</button>";

	var response = fetch ("/singlePatient",{
		method:"POST",
		headers:{'Content-Type':'application/json; charset=utf-8'},
		body: JSON.stringify({"patient":id})
	});

	response.then(res=> res.json().then(data=> 
	{
		if(res.status != 200)
		{
			//do some fix here 
		}
		else
		{
			//set the patients attributes
			document.querySelector("#patientName").innerHTML ="Name: "+data.name;
			document.querySelector("#patientSurname").innerHTML ="Surname: "+data.surname;
			document.querySelector("#patientID").innerHTML ="ID: "+data.idNumber;
			document.querySelector("#patientGender").innerHTML="Gender: "+data.gender;
			document.querySelector("#patientEmail").innerHTML="Email: "+data.email;
			document.querySelector("#patientContactNo").innerHTML="Contact Number: "+data.cellnumber; 
		}
	}));
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
//==================================================================================================================================
var stlopen = false;
var videoopen = false;

function newVideo()
{
    if(!videoopen)
    {
        if(stlopen)
        {
            closeSTL();
        }
        openVideo();
    }
    else
    {
        closeVideo();
    }
}

function newSTL()
{
    if(!stlopen)
    {
        if(videoopen)
        {
            closeVideo();
        }
        openSTL();
    }
    else
    {
        closeSTL();
    }
}

function uploadSTL(stl)
{

}

//================================================================================================================

function openVideo()
{
    document.getElementById("VideoRecorder").style.display = "block";
    videoopen = true;
}

//================================================================================================================

function closeVideo()
{
    document.getElementById("VideoRecorder").style.display = "none";
    videoopen = false;
}

//================================================================================================================

function openSTL()
{
    document.getElementById("STLUploader").style.display = "block";
    stlopen = true;
}

//================================================================================================================

function closeSTL()
{
    document.getElementById("STLUploader").style.display = "none";
    stlopen = false;
}

//================================================================================================================
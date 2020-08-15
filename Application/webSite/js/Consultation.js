//Created by:
//This file contains functions for

var currentTime = "";

//=============================================================================================
//Function Developed by:
//
function rotateArrowSideBody(arrowID) 
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
//Function Developed by:
//
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
//Function Developed by:
//
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
//Function Developed by:
//
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
//Function Developed by:
//
function saveDoctorNote() 
{
	let docNote = document.getElementById("doctorsNotes");

	if (docNote.value != "") 
	{
		alert("Note saved!");
		console.log(docNote.value);
	} 
	else 
	{
		alert("No note to be saved!");
	}
}

//=============================================================================================
//Function Developed by:
//
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
//Function Developed by:
//
function checkTime(i) 
{
	if (i < 10) 
	{
		i = "0" + i;
	}
	return i;
}

//=============================================================================================
//Function Developed by:
//
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
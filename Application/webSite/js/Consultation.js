var dt = new Date();
document.getElementById("datetime").innerHTML = dt.toLocaleTimeString();

function rotateArrow(arrowID, currentDivID) {
	let arrowElement = document.getElementById(arrowID);
	let classElement = document.getElementById(currentDivID);
	
	if(arrowElement.classList.contains("arrowRotate")) {
		arrowElement.classList.remove("arrowRotate");
		classElement.classList.remove("infoContainerResize");
	} else {
		arrowElement.classList.add("arrowRotate");
		classElement.classList.add("infoContainerResize");
	}

	if (document.getElementById("consultationInfo").classList.contains("infoContainerResize") && document.getElementById("pateientsInfo").classList.contains("infoContainerResize")) {
		document.getElementById("infoContainer").classList.add("infoContainerResize");
	} else if (document.getElementById("infoContainer").classList.contains("infoContainerResize")) {
		document.getElementById("infoContainer").classList.remove("infoContainerResize");
	}

	if (arrowID == "arrowConInfo") {
		hideConInfo();
	} else {
		hidePatInfo();
	}
}

function hideConInfo() {

	let startInfo = document.getElementById("conInfoStart");
	let endInfo = document.getElementById("conInfoEnd");
	let patInfo = document.getElementById("conInfoPatientID");

	if (startInfo.style.display == "block") {
		startInfo.style.display = "none";
		endInfo.style.display = "none";
		patInfo.style.display = "none";
	} else {
		startInfo.style.display = "block";
		endInfo.style.display = "block";
		patInfo.style.display = "block";
	}
}

function hidePatInfo() {

}
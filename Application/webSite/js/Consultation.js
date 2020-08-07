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
}
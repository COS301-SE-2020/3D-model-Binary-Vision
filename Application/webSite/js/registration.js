//Created by: Rani Arraf
//this file is used for: 

var i = 1;
//=============================================================================================
//Function Developed by:
//
function showLogin()
{
    document.getElementById('formCheck').style.visibility="visible";
    document.getElementById('container').style.display="none";
}

//=============================================================================================
//Function Developed by:
//
function find()
{
    var element = document.getElementById('showHidden');
    if(element.style.display!="block")
    {
        element.style.display="block";
    }
    else
    {
        alert("Find Patient Already Open!");
    }
}

//=============================================================================================
//Function Developed by:
//
function hide()
{
    document.getElementById('showHidden').style.display="none";
}

//=============================================================================================
//Function Developed by:
//
function addToTable(name , surname , id , gender ,email , objectId)
{
    var table = document.getElementById('addToTable');
    var row = table.insertRow(i);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = "<td id='entry'>"+i+"</td>";
    cell2.innerHTML = "<td id='idNumber'>"+idNumber+"</td>";
    cell3.innerHTML = "<td><textarea rows='3' cols ='40'></textarea></td>";
    i++;
}

//=============================================================================================
//Function Developed by:
//
function searchByInputDisplay() 
{
    var inputBoxes = document.getElementById("inputBoxes");

    inputBoxes.innerHTML = "";

    if (document.getElementById("searchByName").checked) 
    {
        inputBoxes.innerHTML += '<label for="searchName" style="color: white;">Patients name</label><br>';
        inputBoxes.innerHTML += '<input  class="box" type="text" name="name" id="searchName" placeholder="Name"  required /><br><br>';
    }

    if (document.getElementById("searchBySurname").checked) 
    {
        inputBoxes.innerHTML += '<label for="searchSurname" style="color: white;">Pateints surname</label><br>';
        inputBoxes.innerHTML += '<input id="searchSurname" name="surname" placeholder="Surname"/><br><br>';
    }

    if (document.getElementById("searchByPatientID").checked) 
    {
        inputBoxes.innerHTML += '<label for="searchPatientID" style="color: white;">Patients ID number</label><br>';
        inputBoxes.innerHTML += '<input   id="searchPatientID" name="idNumber" placeholder="Patient ID" /><br><br>';
    }
}

// Global vairables to see which tab is curretly selected
var disSearch = false;
var disAdd = false;

//=============================================================================================
//Function Developed by:
// On click for the search tab
function showDoctorForm()
{
    if (disSearch)
    {
        disSearch = false;
    }
    else
    {
        disSearch = true;
    }
    disAdd = false;
    displayTabs(disSearch, disAdd);
}

//=============================================================================================
//Function Developed by:
// On click for add tab
function showPatientForm()
{
    if (disAdd)
    {
      disAdd = false;
    }
    else
    {
      disAdd = true;
    }
    disSearch = false;
    displayTabs(disSearch, disAdd);
}

//=============================================================================================
//Function Developed by:
//
function displayTabs(displaySearch, displayAdd) 
{
    // Get the relavent tab elements
    let selectTab = document.getElementById("selectDoc");
    let selectForm = document.getElementById("doctorFormSignup");

    let addTab = document.getElementById("selectPatient");
    let addForm = document.getElementById("patientFormSignup");

    if (displaySearch && !displayAdd) // Display the search tab
    { 
        //Enable the search tab
        selectForm.style.display = "block";
        selectTab.style.backgroundColor = "#d8e6ad";

        //Disable the add tab
        addForm.style.display = "none";
        addTab.style.backgroundColor = "#003366";
    } 
    else if (!displaySearch && displayAdd) // Display the add tab
    { 
        //Disable the search tab
        selectForm.style.display = "none";
        selectTab.style.backgroundColor = "#003366";

        //Enable the add tab
        addForm.style.display = "block"
        addTab.style.backgroundColor = "#d8e6ad"
    } 
    else if (!displaySearch && !displayAdd) // Display neither tabs
    { 
        //Disable the search tab
        selectForm.style.display = "none";
        selectTab.style.backgroundColor = "#003366";

        //Disable the search tab
        addForm.style.display = "none";
        addTab.style.backgroundColor = "#003366";
    }
}

// Make the DIV element draggable:
dragElement(document.getElementById("mydiv"));

//=============================================================================================
//Function Developed by:
//
function dragElement(elmnt) 
{
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) 
    {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } 
    else 
    {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) 
    {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) 
    {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() 
    {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var rightShowSideBar = true;
//=============================================================================================
//Function Developed by:
//
function moveRightBar()
{
    var right = document.getElementById("rightSideBody");


    if(!rightShowSideBar)
    {
        rightShowSideBar = true;
        right.style.width ="200px";
    }
    else
    {
        rightShowSideBar = false;
        right.style.width ="500px";
    }
}

//=============================================================================================
//Function Developed by: Marcus Werren
// Rotates the arrows for the side bar
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
//=============================================================================================
//Function Developed by: Marcus Werren
// Moves the left side bar off screen
function moveSideBar()
{
    var bodyA = document.getElementById("sideBody");
    //var show = document.getElementById('buttonShow')

    if(!showSideBar)
    {
        showSideBar = true;
        //show.style.display = "none";
        bodyA.classList.remove("moveSideBar");
        document.getElementById("conatinerHome").classList.remove("moveContainerHome");
    }
    else
    {
        showSideBar = false;
        //show.style.display = "block";
        bodyA.classList.add("moveSideBar");
        document.getElementById("conatinerHome").classList.add("moveContainerHome");
    }
  
}

//=============================================================================================
//Function Developed by: Marcus Werren
// This hides of displays the notes for the receptionists home page
function showNote() 
{
    let note = document.getElementById("mydiv");
    let displayButton = document.getElementById("displayNote");

    if (note.style.display == "none") 
    {
        note.style.display = "block";
        displayButton.innerHTML = "Hide Note";
    } 
    else
    {
        note.style.display = "none";
        displayButton.innerHTML = "Show Note";
    }
}
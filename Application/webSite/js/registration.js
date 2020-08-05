var i = 1;
function showLogin()
{
  document.getElementById('formCheck').style.visibility="visible";
  document.getElementById('container').style.display="none";
}

function find()
{
  var element = document.getElementById('showHidden');
  if(element.style.display!="block"){
    element.style.display="block";
  }else{
    alert("Find Patient Already Open!");
  }
}

function hide()
{
  document.getElementById('showHidden').style.display="none";
}

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


  //<a  onclick=('setPatientIDCookie("+objectId+")')    >

}

// Global vairables to see which tab is curretly selected
var disSearch = false;
var disAdd = false;

// On click for the search tab
function showDoctorForm(){
  if (disSearch)
    disSearch = false;
  else
    disSearch = true;

  disAdd = false;
  displayTabs(disSearch, disAdd);
}

// On click for add tab
function showPatientForm(){
  if (disAdd)
    disAdd = false;
  else
    disAdd = true;

  disSearch = false;
  displayTabs(disSearch, disAdd);
}

function displayTabs(displaySearch, displayAdd) {
  // Get the relavent tab elements
  let selectTab = document.getElementById("selectDoc");
  let selectForm = document.getElementById("doctorFormSignup");

  let addTab = document.getElementById("selectPatient");
  let addForm = document.getElementById("patientFormSignup");

  if (displaySearch && !displayAdd) { // Display the search tab
    //Enable the search tab
    selectForm.style.display = "block";
    selectTab.style.backgroundColor = "#d8e6ad";

    //Disable the add tab
    addForm.style.display = "none";
    addTab.style.backgroundColor = "#003366";

  } else if (!displaySearch && displayAdd) { // Display the add tab
    //Disable the search tab
    selectForm.style.display = "none";
    selectTab.style.backgroundColor = "#003366";

    //Enable the add tab
    addForm.style.display = "block"
    addTab.style.backgroundColor = "#d8e6ad"

  } else if (!displaySearch && !displayAdd) { // Display neither tabs
    //Disable the search tab
    selectForm.style.display = "none";
    selectTab.style.backgroundColor = "#003366";

    //Disable the search tab
    addForm.style.display = "none";
    addTab.style.backgroundColor = "#003366";
  }
}

var showSideBar = true;

function moveSideBar(){
  var bodyA = document.getElementById("sideBody");
  var dependent = document.getElementsByClassName("conatinerHome");
  var show = document.getElementById('buttonShow')

  if(!showSideBar){
    showSideBar = true;
    show.style.display = "none";
    bodyA.classList.remove("moveSideBar");
  }
  else{
    showSideBar = false;
    show.style.display = "block";
    bodyA.classList.add("moveSideBar");
  }
  
}

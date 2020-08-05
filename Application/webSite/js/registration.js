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
var check = false;
function showDoctorForm(){

  var doctorColor = document.getElementById("selectDoc");
  var doctor = document.getElementById("doctorFormSignup");
  if(doctor.style.display === "none" && check == false)
  {
    check = true;
    doctor.style.display = "block"
    doctorColor.style.backgroundColor = "#d8e6ad"
  }
  else if(doctor.style.display === "block" && check == true)
  {
    check = false;
    doctor.style.display = "none";
    doctorColor.style.backgroundColor = "#292b2c";
  }


}

function showPatientForm(){
  var doctorColor = document.getElementById("selectPatient");
  var doctor = document.getElementById("patientFormSignup");
  if(doctor.style.display === "none" && check == false)
  {
    check = true;
    doctor.style.display = "block"
    doctorColor.style.backgroundColor = "#d8e6ad";
  }
  else if(doctor.style.display === "block" && check == true)
  {
    check = false;
    doctor.style.display = "none";
    doctorColor.style.backgroundColor = "#292b2c";
  }


}

function moveSideBar(){
  var bodyA = document.getElementById("sideBody");
  var dependent = document.getElementsByClassName("conatinerHome");
  var show = document.getElementById('buttonShow')

  if(bodyA.style.display == "none"){
    bodyA.style.display = "block";
    show.style.display = "none";
  }
  else{
    bodyA.style.display = "none";
    show.style.display = "block";
  }

}

function rotateArrow(arrowID) {
  let arrowElement = document.getElementById(arrowID);
  
  if(arrowElement.classList.contains("arrowSideBarTransform")) {
    document.getElementById("sideBarLabel").style.display = "none";
    arrowElement.classList.replace("arrowSideBarTransform", "arrowSideBody");
    moveSideBar();
  } else {
    document.getElementById("sideBarLabel").style.display = "block";
    arrowElement.classList.replace("arrowSideBody", "arrowSideBarTransform");
    moveSideBar();
  }
}

var showSideBar = true;

function moveSideBar(){
  var bodyA = document.getElementById("sideBody");
  //var show = document.getElementById('buttonShow')

  if(!showSideBar){
    showSideBar = true;
    //show.style.display = "none";
    bodyA.classList.remove("moveSideBar");
    document.getElementById("conatinerHome").classList.remove("moveContainerHome");
  }
  else{
    showSideBar = false;
    //show.style.display = "block";
    bodyA.classList.add("moveSideBar");
    document.getElementById("conatinerHome").classList.add("moveContainerHome");
  }
  
}
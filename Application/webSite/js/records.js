//Created by: Rani Arraf
//This file contains functions for the records page



//=============================================================================================
//Function Developed by: Rani Arraf
//This function moves the side bar left

function showRecord() 
{
    var rightBody = document.getElementById("rightSideBody");
    rightBody.style.width = "250px";
}

function hideRecord(){
    var rightBody = document.getElementById("rightSideBody");
    rightBody.style.width = "0px";
}
//Created by: Rani Arraf
//This file contains functions for the records page



//=============================================================================================
//Function Developed by: Rani Arraf
//This function moves the side bar left

function showRecord(date, reason,consultation,pid) 
{
    //going to use consultation id to gdt the STL ID for renderpage
    var rightBody = document.getElementById("rightSideBody");
    rightBody.style.width = "250px";
    if(reason == "undefined" || reason == null || !reason)
    {
        reason = "Model Generation from Video Upload";
    }
    var url = window.location.href;
    var parts = url.split("=");
    document.getElementById("containInfoRight").innerHTML = "<br><br>DATE: <hr> <p id='date1' style='color:black; font-weight: bold;'>"+date+"</p>  BOOKING REASON: <hr><p id='patientqq' style='color:black; font-weight: bold;'>"+reason+"</p> <br><br><br><br>RENDER<hr><a class='btn btn-success' href='../renderPage/render.html?cid="+ consultation +"="+ parts[2] + "=" + pid +"' id = 'renderpage'>Render</a><br><br>HIDE<hr><button class='btn btn-danger' onclick=hideRecord()>Hide Info</button>";
}

function hideRecord()
{
    var rightBody = document.getElementById("rightSideBody");
    rightBody.style.width = "0px";
}

function init()
{
    var url = window.location.href;
    var parts = url.split("=");
    //parts[2] has the booking id
    document.getElementById("consultlink").href = "Consultation.html?bookingid="+parts[2];
    //parts[1] = patient id
    //call getpatientsconsultations using pid
    //populate this page with all the different consultations that are there
    //if there are none then display "No Records to show"
    var response = fetch("/getPatientConsultations",{
        method: "POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({"patient":parts[1]})
    });


    response.then(res=> res.json().then(data=>
    {
        var replacement ="";
        document.getElementById("patientTable").innerHTML =replacement;
        for(var i in data)
        {
           replacement += "<tr><td>"+data[i].created+"</td><td>"+data[i].Note+"</td><td><button class='btn btn-success' onclick=\"showRecord('"+data[i].created+"','"+data[i].reason+"','"+data[i]._id+ "','" + parts[1] + "')\">View Info</button></td></tr>";
        }
        document.getElementById("patientTable").innerHTML =replacement;
    }));
}
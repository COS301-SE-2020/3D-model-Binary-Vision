//Created by: Jacobus Janse van Rensburg
//This file contains the functions needed to display the doctors shcedule

//================================================================================================
// Function developed by: Jacobus Janse van Rensburg
// function is called on the page load in order to populate the page with required info
function initPage()
{
	createTable();
	setDates();
	populateTable();
}

//================================================================================================
// Function developed by: Jacobus Janse van Rensburg
// Function modified by: Steven Visser
//Funxtion is used to dynamically populate the page with a table to be used as a time table
function createTable()
{
	var tableDiv = document.getElementById("dayTable");

	var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var times=[
        "09:00","09:15","09:30","09:45",
        "10:00","10:15","10:30","10:45",
        "11:00","11:15","11:30","11:45",
        "12:00","12:15","12:30","12:45",
        "13:00","13:15","13:30","13:45",
        "14:00","14:15","14:30","14:45",
        "15:00","15:15","15:30","15:45",
        "16:00","16:15","16:30","16:45"
       ];

    var replacement = '<table class="table table-bordered" id="dayTable">';
    replacement += '<thead id="dayTableHead">';

    var d = new Date();
    var currentMonth = d.getMonth();
    var currentDate = d.getDate();
    var currentDay = d.getDay();
    var currentYear=d.getFullYear();
    replacement+='<td style="background-color: rgb(0, 51, 102); color: white;">Time</td>';
    //set the headings now
    var count =0;
    var dd = currentDay;
    while (count<days.length)
    {
        if(dd == days.length )
        {
            dd =0;
        }
        replacement+='<td style="background-color: rgb(0, 51, 102); color: white;">'+days[dd]+','+(currentDate+(count))+'</td>';
        count++;
        dd++;
    }

    replacement += '</thead>'
    replacement+='<tbody>';
   
    for(var i = 0 ; i < times.length; i ++)
    {
       
        replacement+='<tr><td id="time">'+times[i]+'</td>';
        for (var j =0 ; j < days.length; j ++)
        {
            replacement+='<td class="selectableTimeSlot" id="'+(currentDate+j)+'/'+(currentMonth+1)+'/'+currentYear+'&'+times[i]+'" ></td>';
            replacement+='</td>';
        }
        replacement+='</tr>'
    }

	replacement+='</tbody></table>';
	tableDiv.innerHTML= replacement;

}
            
//================================================================================================
// Function developed by: Jacobus Janse van Rensburg
//  Gets all the bookings that the belongs to a doctor
function populateTable()
{


	var response = fetch("/getDoctorsBookings",{
		method:"POST",
		headers:{'Content-Type': 'application/json; charset=UTF-8'}
	});

    response.then(res => res.json().then(data => 
    {
		fillData(data);
	}));
}

//================================================================================================
// Function developed by: Jaco Janse van Rensburg
// Modified by: Steven Visser then again by Jaco Janse van Rensburg
function fillData(data)
{
    var times = [
        "09:00","09:15","09:30","09:45",
        "10:00","10:15","10:30","10:45",
        "11:00","11:15","11:30","11:45",
        "12:00","12:15","12:30","12:45",
        "13:00","13:15","13:30","13:45",
        "14:00","14:15","14:30","14:45",
        "15:00","15:15","15:30","15:45",
        "16:00","16:15","16:30","16:45"
       ];

    for(var i in data)
    {
        
        if(data[i].status == "Pending")
        {
            if(data[i].time == data[i].endTime){
                var dataIndex = parseInt(i) ;
                var date = data[dataIndex].date;
                var time = data[dataIndex].time;
                var searchPageId = date+"&"+time;
                var element = document.getElementById(searchPageId);
    
                if (element!=null)
                {
                    //mark as red since a booking already exists
                    element.setAttribute("style","background-color:red;");
                    element.setAttribute("onclick","");
                    //call api to get patient based on id, then put the patients full name ehre
                    setName(data[dataIndex].patient,searchPageId);
                }
            }
            else{
                console.log(data[i]);
                console.log("Multi slot booking")
                var dataIndex = parseInt(i) ;
                var date = data[dataIndex].date;
                console.log("date: "+ date);
                var numOfSlots;
                var timeIndex;
                for(var j = 0 ; j < times.length; j ++)
                {
                    if (times[j] == data[i].time) timeIndex = j;
                    if (times[j] == data[i].endTime) numOfSlots = j-timeIndex;

                }
                console.log("Start time: "+ times[timeIndex]+" \tEnd: "+times[timeIndex+numOfSlots])
                for (var j =0 ; j < numOfSlots ; j++){
                    var searchPageId = date+"&"+times[timeIndex+j];
                    console.log("Searching page for "+searchPageId);
                    var element = document.getElementById(searchPageId);
                    if (element!=null)
                    {
                        var colorWheel=["red","yellow","orange","blue","purple"]
                        var colorIndex;
                        switch(data[i].reason)
                        {
                            case "": {colorIndex=0; break;}
                            case "checkup": {colorIndex=3; break;}
                            case "Tooth Decay": {colorIndex=0; break;}
                            case "Gum Disease": {colorIndex=2; break;}
                            case "Tooth Sensitivity": {colorIndex=4; break;}
                            case "Tooth Extraction": {colorIndex=2; break;}
                            case "Tooth Erosion": {colorIndex=4; break;}
                            case "Moouth Sores": {colorIndex=4; break;}
                            default: colorIndex=0; break;

                        }
                        console.log("Reason: "+data[i].reason+"\tColor: "+colorWheel[colorIndex]);
                        //mark as red since a booking already exists
                        element.setAttribute("style","background-color:"+colorWheel[colorIndex]+";");
                        element.setAttribute("onclick","");
                        //call api to get patient based on id, then put the patients full name ehre
                        setName(data[dataIndex].patient,searchPageId);
                    }
                }
            }
            
        }
        
    }
}

function setName(patient, searchPageId)
{
    var response = fetch("/singlePatient",
    {
        method:"POST",
        headers:{'Content-Type': 'application/json; charset=UTF-8'},
        body:JSON.stringify({"patient":patient})
    });
    
    response.then(res => res.json().then(pat => 
    {
        document.getElementById(searchPageId).innerHTML=pat.name + " " + pat.surname;
    }));
}

//Function developed by: Steven Visser
//Dynamically sets the date 
function setDates()
{
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var months = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

    document.getElementById("firstDay").innerHTML = d;
    document.getElementById("firstMonth").innerHTML = months[m];
    document.getElementById("firstYear").innerHTML = y;

    document.getElementById("lastDay").innerHTML = (d+6);
    document.getElementById("lastMonth").innerHTML = months[m];
    document.getElementById("lastYear").innerHTML = y;
}

		
		
	




	

	
	



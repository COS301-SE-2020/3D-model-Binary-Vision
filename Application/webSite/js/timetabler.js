

function initPage(){
	createTable();
	setDates();
	populateTable();
}

function createTable()
{
	var tableDiv = document.getElementById("dayTable");

	var days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
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
    var replacement;
    replacement='<table class="table table-bordered" id="dayTable">';
    replacement+='<thead id="dayTableHead">';

    var d = new Date();
    var currentMonth = d.getMonth();
    var currentDate = d.getDate();
    var currentDay = d.getDay();
    var currentYear=d.getFullYear();
    replacement+='<td style="background-color: rgb(0, 51, 102); color: white;">Time</td>';
    //set the headings now
    var count =0;
    var dd = currentDay;
    
    while (count<days.length){
        if(dd > days.length ){
            dd =1;
        }

        replacement+='<td style="background-color: rgb(0, 51, 102); color: white;">'+days[dd-1]+','+(currentDate+(count))+'</td>';
        count++;
        dd++;
    }

    replacement += '</thead>'
    replacement+='<tbody>';
    for(var i = 0 ; i < times.length; i ++){
        replacement+='<tr><td id="time">'+times[i]+'</td>';
        for (var j =0 ; j < days.length; j ++)
        {
            replacement+='<td class="selectableTimeSlot" id="'+(currentDate+j)+'/'+currentMonth+'/'+currentYear+'&'+times[i]+'" onclick="selectTime(\''+(currentDate+j)+'/'+currentMonth+'/'+currentYear+'&'+times[i]+'\')"></td>';

            replacement+='</td>';
        }
        replacement+='</tr>'
    }

	replacement+='</tbody></table>';
	tableDiv.innerHTML= replacement;

}
			
function populateTable(){


	var response = fetch("/getDoctorsBookings",{
		method:"POST",
		headers:{'Content-Type': 'application/json; charset=UTF-8'},
		// body: JSON.stringify({"doctor":})
	});

	response.then(res => res.json().then(data => {

		console.log(data)
		fillData(data);

	}))
}

function fillData(data)
{
	for(var i in data)
    	{
        var date = data[i].date;
        var time = data[i].time;
        var searchPageId = date+"&"+time;

        var element = document.getElementById(searchPageId);
        if (element!=null)
        {
            //mark as red since a booking already exists
            element.setAttribute("style","background-color:orange;");
            element.setAttribute("onclick","");
            element.innerHTML=data[i].reason;
        }
    	}
}

//Function by: Steven Visser
function setDates()
{
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var months = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

    document.getElementById("firstDay").innerHTML = "{"+d+"}";
    document.getElementById("firstMonth").innerHTML = "{"+months[m]+"}";
    document.getElementById("firstYear").innerHTML = "{"+y+"}";

    document.getElementById("lastDay").innerHTML = "{"+(d+6)+"}";
    document.getElementById("lastMonth").innerHTML = "{"+months[m]+"}";
    document.getElementById("lastYear").innerHTML = "{"+y+"}";
    
}

		
		
	




	

	
	



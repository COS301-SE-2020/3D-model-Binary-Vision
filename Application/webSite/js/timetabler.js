
var today = new Date();
var currentDay = today.getDate();
var laterDay = today.getDate() + 6;
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();





var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = [ "Sun","Mon", "Tues", "Wed", "Thur", "Frid", "Sat"];

var getDaysInMonth = function(month,year) {
  	// Here January is 1 based
  	//Day 0 is the last day in the previous month
 	return new Date(year, month, 0).getDate();
	// Here January is 0 based
	// return new Date(year, month+1, 0).getDate();
};


//top nave of current full date
	//first half
var getCurrentDay = document.getElementById("firstDay");
getCurrentDay.innerHTML = currentDay;

var firstMonth = document.getElementById("firstMonth");
firstMonth.innerHTML = months[currentMonth];

var firstYear = document.getElementById("firstYear");
firstYear.innerHTML = currentYear;

//second half (7 days later)
var getLastDay = document.getElementById("lastDay");
var getNextMonth = document.getElementById("lastMonth");
var getNextYear = document.getElementById("lastYear");
var newDate = laterDay;

//console.log(newDate); 

if(newDate > getDaysInMonth(currentMonth, currentYear))
{
	currentMonth++;
	if(months[currentMonth] == "Dec")
	{
		currentYear++;
	}
	newDate -= getDaysInMonth(currentMonth, currentYear);
	
	getNextMonth.innerHTML = months[currentMonth];
	getLastDay.innerHTML = newDate;
	getNextYear.innerHTML = currentYear;
}
else
{
	getNextMonth.innerHTML = months[currentMonth];
	getLastDay.innerHTML = newDate;
	getNextYear.innerHTML = currentYear;
}

//set th dates
var dateWeek  = days[today.getDay()];
	
var newDay = currentDay;
var i = 0;
var j = 0;
var counter = 1;

var tableHead = document.getElementById("dayTableHead");
var row = tableHead.insertRow(0);
var cell0 = row.insertCell(0);
cell0.innerHTML = "Time";
cell0.style.backgroundColor = "#003366";
cell0.style.color = "white";
//console.log(months[currentMonth]);
//console.log(currentYear);

while(counter <= 7)
{
	console.log(months[currentMonth]);
	//console.log(newDay);
	var cell = row.insertCell(counter);

	if(newDay > getDaysInMonth(currentMonth, currentYear))
	{
		day = new Date(currentYear, currentMonth, newDay).getDay();
		newDay -= getDaysInMonth(currentMonth, currentYear);
		if(newDay == 1)
		{
			currentMonth++;
		}
		cell.innerHTML = days[day] + ", " + (newDay);
		cell.style.backgroundColor = "#003366";
		cell.style.color = "white";
	}
	else
	{
		day = new Date(currentYear, currentMonth, newDay).getDay();
		cell.innerHTML = days[day] + ", " + (newDay);
		cell.style.backgroundColor = "#003366";
		cell.style.color = "white";
		
	}
	newDay++;
	counter++;
}
			


		
		
	




	

	
	



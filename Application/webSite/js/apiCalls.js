//Created by: Jacobus Janse van Rensburg & Rani Arraf
//Modified by: Steven Visser


//=============================================================================================
//Function Developed by:
//
function getDrName()
{
    //gets the name of the dr and sets it too the heading in the page
    var response = fetch("/getDoctor",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        }
    });

    response.then(res => res.json().then( data => 
    {
        if (res.status==200)
        {
            document.getElementById("nameId").innerHTML = data.surname;
        }
        else 
        {
            alert("Doctor Not Logged In");
            var response = fetch("/logout",{
                method:"POST",
                headers: {
                  'Content-Type': 'application/json; charset=UTF-8',
                }
            });
        }
    }));

}

//=============================================================================================
//Function Developed by: Jacobus
//
function getPatients()
{
    //get the patients for the logged in doctor
    var response = fetch("/patients",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        }
    });

    response.then(res => res.json().then( data => 
    {
        //data was successfully send
        //populate the tables with the json data
        var tableContent = document.getElementById('addToTable');
        var rowNumber = 1;
            
        var counter = 1;
        if (res.status == 202)
        {
            for (var i in data)
            {
                var row = tableContent.insertRow(rowNumber);
                var num = data[i]._id;
                var number = row.insertCell(0);
                var id = row.insertCell(1);
                var surname = row.insertCell(2);
                var email = row.insertCell(3);
                var gender = row.insertCell(4);
                var link = row.insertCell(5);
                var string = []
                string [0] = data[i]._id;

                number.innerHTML = counter;
                id.innerHTML = data[i].idNumber;
                surname.innerHTML = data[i].surname;
                email.innerHTML = data[i].email;
                gender.innerHTML = data[i].gender;

                //<a onclick='selectPatient("5efb1682221ad0d67fb93495")'>link</a></td>-->
                link.innerHTML = "<a onclick='selectPatient(\""+data[i]._id+"\")' href='patientLog.html'>link</a>";

                rowNumber++;
                counter++;

            }//make the tables with this data
        }
        else if ( res.status == 500)
        {
            //something went wrong , Steven will need to tell us what to do here
        }

    }))
}

//=============================================================================================
//Function Developed by: Jacobus
//
function logout() 
{
    var resposne = fetch ("/logout",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
    }});
    //logout of cookie
}

//=============================================================================================
//Function Developed by: Steven Visser
//This function takes in the patients information & sends it to the API to add it to the database
function addPatient()
{
    var idNumber = document.getElementById("idNumber").value;
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var gender = document.getElementById("gender").value;
    var email = document.getElementById("email").value;
    var cell = document.getElementById("cell").value;

    //add the patient to the database
    var response = fetch ("/addPatient",{
        method:"POST",
        headers:{
            'Content-Type':'application/json ; charset=UTF-8',
        },
        body: JSON.stringify({"idNumber":idNumber,"name":name,"surname":surname,"email": email,"gender": gender,"cell":cell})
    });

    //check if the patient was successfully added by checking the status returned in the response
    response.then(res => res.json().then( data =>
    {
        if(res.status ==201)
        {
            //patient successfuly added and we can do something
            alert("Patient added successfully");
            console.log("patient added successfully: check database for confirmation");
        }
        else
        {
            //patient not added
            console.log("Error adding patient")
        }
    }));
}

//=============================================================================================
//Function Developed by: Jacobus
//sets the patient cookie with the patient id
function selectPatient(PatientID)
{
    var response = fetch('/selectPatient' ,{
        method:"POST",
        headers: {'Content-Type':'application/json ; charset=UTF-8',},
        body:JSON.stringify({PatientID})
    });

    response.then( res =>
    {
        if (res.status == 201)
        {
            //fine
        }
        else{
            //not fine
        }
    });
}

//=============================================================================================
//Function Developed by: Jacobus
//retrieves the doctor -> patient consultations
function getConceltations()
{
    var response = fetch('/consultations' ,{
        method:"GET",
        headers: {'Content-Type':'application/json ; charset=UTF-8',}
    });

    response.then(res => res.json.then(data=> 
    {

        if (res.status == 200)
        {
            //consultations correctly retrieved
            for(var i in data)
            {
                //do the table for data[i] with its respective fields
            }
        }
        else
        {
            //something wrong happened
            console.error(data);
        }

    }));
}

//=============================================================================================
//Function Developed by: Jacobus
//
function getSinglePatient()
{
    var response = fetch("/singlePatient",{
        method:"POST",
        headers:{'Content-Type':'application/json ; charset=UTF-8'}
    });

    response.then(res =>res.json().then(data => 
    {

        if (res.status == 200)
        {
            document.getElementById("nameLog").innerHTML = data.name+" "+data.surname;
        }
        else
        {
            console.error(data);
        }
    }));

    getSinglePatientConsultations();
}
// ====================================================================================================

$(document).ready(function(){
  $("#searchID").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tableContent tr").filter(function() {
      $(this).toggle($(this).text().indexOf(value) > -1)
    });
  });
});

//=============================================================================================
//Function Developed by: Jacobus
//
function selectConsultation(ConsultationID)
{
    var response = fetch("/consultations",{
        method:"POST",
        headers: {'Content-Type':'application/json ; charset=UTF-8',},
        body:JSON.stringify({ConsultationID})
    });

    response.then(res=> res.json().then(data=>
    {
        if (res.status == 200)
        {
            console.log("Consultation cookie set");
        }
        else 
        {
            //try again or quit ?
            console.error("Consultation cookie not set");
        }
    }));
}

//=============================================================================================
//Function Developed by: Jacobus
//
function getSinglePatientConsultations()
{
    var response = fetch("/consultations",{
        method:"GET",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });
}

//=============================================================================================
//Function Developed by: Jacobus
//
function getReceptionistNotes()
{
    var response = fetch("/getReceptionistNotes", {
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    response.then(res => res.json().then (data=> 
    {
        if(res.status == 200)
        {
            var notes = data.Notes;
        }
        else if (res.status == 404)
        {
            //receptionist not in database
        }
        else if (res.status == 401)
        {
            //receptionist not signed in
        }
    }));
}

//=============================================================================================
//Function Developed by: Jacobus
//
function saveReceptionistNotes(Notes)
{
    var response = fetch("/saveReceptionistNotes", {
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'},
        body: JSON.stringify({Notes})
    });

    response.then(res => res.json().then(data=>
    {
        if (res.status ==200)
        {
            //everything is fine with updating notes
        }
        else if (res.status == 400)
        {
            //could not update
        }
        else if(res.status == 401)
        {
            //not logged in
        }
    }));

}

//=============================================================================================
//Function Developed by: Jacobus
//
function receptionistMakeBooking()
{
    var patient,doctor, time , date , reason , employeeID;
    //Why the employeeID ?

    var response = fetch ("/makeBooking", {
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'},
        body: JSON.stringify(patient,doctor,time, date, reason)
    });

    response.then(res=>res.json().then(data=>
    {
        if(res.status == 200)
        {
            //booking made
        }
    }));
}

//=============================================================================================
//Function Developed by: Steven Visser
//Checks to see which search options are selected and then sends the appropriate data to the API to retrieve the patient data
function getAllPatients()
{
    var name = "";
    var surname = "";
    var id = "";

    if (document.getElementById("searchByName").checked)
    {
        name = document.getElementById("searchName");
    }
    
    if (document.getElementById("searchBySurname").checked) 
    {
        surname = document.getElementById("searchSurname");
    }
    
    if (document.getElementById("searchByPatientID").checked) 
    {
        id = document.getElementById("searchPatientID");
    }

    var response = fetch ("/searchPatient", {
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'},
        body: JSON.stringify(name,surname,id)
    });

    response.then(res=>res.json().then(data=>
    {
        if(res.status == 200)
        {
            //patients found, do the table population
            for (i in data)
            {
                console.log(data[i]);
            }
        }
        else
        {
            //error (maybe no patients exist on the system. Should we prompt the user to add a patient?)
        }
    }));

}

//=============================================================================================
//Function Developed by: Steven Visser
//Sends a request to the API to retrieve all doctors from the database
function getDoctors()
{
    var response = fetch('/getAllDoctors',{
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });
    response.then(res => res.json().then(data=>
    {
        if(data.status != 200)
        {
            //There was an issue
            console.log("Error: " + data);
        }
        else
        {
            console.log("Success: " + data);
        }

    }));
}

//=============================================================================================
//Function Developed by: Jacobus
//Makes a call to the API to retrive the logged in doctors bookings
function getSingleDoctorBookings()
{
    var response = fetch('/getDoctorsBookings',{
        method:"POST",
        headers:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    response.then(res => res.json().then(data => 
    {
        if(data.status != 200)
        {
            console.log("Error: " + data);
        }
        else
        {
            console.log("Success: " + data);
        }

    }));
}
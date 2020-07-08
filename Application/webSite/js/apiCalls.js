//
// AUTHORS : Jacobus AND Rani
//
//Proof read By: 


//JACO NOTE: This works 
function getDrName()
{
    //gets the name of the dr and sets it too the heading in the page
    var response = fetch("/getDoctor",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        }
        });

        response.then(res => res.json().then( data => {
            console.log(data);
            if (res.status==200)
            {
                document.getElementById("nameId").innerHTML = data.surname;
            }
            else {
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

//Jaco Notes: works perfect just needs to use the returned data to populate tables
function getPatients()
{
    //get the patients for the logged in doctor
    var response = fetch("/patients",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        }
        }); 
    
        console.log("patient data: \n\n"+ response);

    response.then(res => res.json().then( data => {

     
            //data was successfully send
            //populate the tables with the json data
        if (res.status == 202){
            for (var i in data){    
                console.log("Name: "+ data[i].name +"\nsurname: "+data[i].surname+"\nIdNumber: "+data[i].idNumber+"\nemail: "+data[i].email+"\ngender: "+data[i].gender);
                // addToTable(data[i].name , data[i].surname, data[i].idNumber, data[i].gender, data[i].email, data[i]._id)
                //RANI !!! -- use the data above to populate the table witht the fields that you made
            
            }//make the tables with this data
        
        }
        else if ( res.status == 500)
        {
            //something went wrong , Steven will need to tell us what to do here
        }
    
    }))
}

function logout() {
    var resposne = fetch ("/logout",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',    
    }});
    //logout of cookie
}

//JACO NOTES: add patient works perfect on my end to add data to the DB
function addPatient() 
{
    //RANI i made the email field in the patients page , looks ugly now , can you please fix thanks - jaco

    var idNumber = document.getElementById("idNumber").value;
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var email = document.getElementById("email").value;
    var gender = document.getElementById("gender").value;

    //RANI ----do some varification on the data eg. check that email is valid and stuff like that -jaco


    //add the patient to the database 
    var response = fetch ("/addPatient",{
        method:"POST",
        headers:{
            'Content-Type':'application/json ; charset=UTF-8',
        },
        body: JSON.stringify({idNumber,name,surname, email, gender})
    })

    //check if the patient was successfully added by checking the status returned in the response
    response.then(res => res.json().then( data =>{

        if(res.status ==201){
            //patient successfuly added and we can do something
            console.log("patient added successfully: check database for conformation");
        }
        else{
            //patient not added
            console.log("Error adding patient")
        }
        
    }))
}


//sets the patient cookie with the patient id
function selectPatient(PatientID)
{
    var response = fetch('/selectPatient' ,{
        method:"POST",
        headers: {'Content-Type':'application/json ; charset=UTF-8',},
        body:JSON.stringify({PatientID})
    })

    response.then( res =>{
        if (res.status == 201)
        {
            //fine
        }
        else{
            //not fine
        }
    })
}


//retrieves the doctor -> patient consultations
function getConceltations()
{
    var response = fetch('/consultations' ,{
        method:"GET",
        headers: {'Content-Type':'application/json ; charset=UTF-8',}
    }) 

    response.then(res => res.json.then(data=> {

        if (res.status == 200)
        {
            //consultations correctly retrieved 
            for(var i in data)
            {
                //do the table for data[i] with its respective fields
            }
        }
        else{
            //something wrong happened 
            console.error(data);
        }

    }))
}
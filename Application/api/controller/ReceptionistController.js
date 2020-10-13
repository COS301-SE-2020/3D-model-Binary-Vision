//Created by : Jacobus Janse van Rensburg
//===========================================================================

var fs = require("fs");

const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");
const { userInfo } = require("os");
const { Console } = require("console");
const { Consultation, Patient } = require("../model/3DModelModel.js");
const { parse } = require("path");

var nodeMailer = require('nodemailer');

var Doctor = require("../model/3DModelModel.js").Doctor;
var Receptionist = require("../model/3DModelModel.js").Receptionist;
var Booking = require("../model/3DModelModel.js").Booking;

var transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
           user: 'flap.jacks.cs@gmail.com',
           pass: 'ampjiedsvncvukaz'
       }
   });

module.exports ={

   //===========================================================================
   //function developed by: Jacobus Janse van Rensburg
   //return non-security fatal information about receptionist
    getReceptionistInfo: function(req,res)
    {
        if(!req.user)
        {
            res.sendStatus(401); // Updated by Marcus from status -> sendStatus
            return;
        }

        Receptionist.findOne({"_id":req.user},function(err, receptionist)
        {
            if (err)
            {
                res.status(400)
                    .send(err);
                return;
            }
            res.json({"name":receptionist.name,"surname":receptionist.surname,"practition": receptionist.practition,"Note":receptionist.Note,"username":receptionist.username})
                .status(200);
            return;
        });
    },
   //===========================================================================
   //function developed by: Jacobus Janse van Rensburg
   // return the notes that the receptionist might have saved as reminders
    getNotes : function (req, res)
    {
        if(!req.user)
        {
            res.sendStatus(401);  // Updated by Marcus from status -> sendStatus
            return;
        }

        Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)}, function (err, receptionist)
        {
            if(err)
            {
                res.status(404);
                return;
            }
            else
            {
                var Notes = receptionist.Note;
                res.status(200)
                    .json({"Note":Notes});
                return;
            }
        });
    },
   
    //===========================================================================
    //function developed by: Jacobus Janse van Rensburg
    //save a note that is accompanied to a receptionist
    saveNotes: function(req, res)
    {
        if (!req.user)
        {
            res.sendStatus(401);  // Updated by Marcus from status -> sendStatus
            return;
        }

        const Notes = req.body.Notes;

        //commented out where the error may be coming from
        Receptionist.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.user)},{$set:{"Note":Notes}}/*,{'new':false}*/,function(err)
        {
            if(err)
            {
                res.status(400)
                return;
            }
            res.sendStatus(200);  // Updated by Marcus from status -> sendStatus
            return;
        });
    },

   //===========================================================================
   //function developed by: Jacobus Janse van Rensburg
   //function that creates a booking object in the database for the receptionist
    makeBooking:function (req,res)
    {
        if (!req.user)
        {
            res.status(401).send("Unauthorised");
            return;
        }

        const {patient, doctor, time ,date, reason, endTime} = req.body;

        var newBooking = new Booking({date,time,endTime,doctor,patient,reason});
        
        newBooking.save(function(err)
        {
            if(err)
            {
                res.status(400)
                    .send(err);
                return;
            }
            madeBookingEmail(newBooking);
            res.status(200);

        });
        Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , rec)
        {
            if (err)
            {

            }
            if(rec)
            {
                updateLogFile(rec.username + "@Made a booking@BID:"+newBooking._id,rec.practition);
            }
        });
    },

   //===========================================================================
   //Function Developed By: Jacobus Janse van Rensburg
   //Returns a json list of doctors that belong to the same practition as the 
   //receptionist
    getDoctors: function(req,res)
    {
        if(!req.user)
        {
            res.status(401)
                .send("Unauthorised access to doctors");
            return;
        }

        Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)}, function(err, receptionist)
        {
            if(err)
            {
                res.status(400)
                    .send(err);
                return;
            }
 
            var practition= receptionist.practition;
        
            Doctor.find({"practition":practition},'-password -username',function(err, doctors)
            {
                if(err)
                {
                    res.status(400)
                        .send(err);
                    return;
                }
                //cant send all the information since usernames and passwords are high security breaches
    
                res.status(200)
                    .json(doctors);
                return;
    
            });
        });     
    },

    //===========================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //returns all the bookings that the doctor has in the future
    getDoctorsSchedule: function(req, res)
    {
        if (!req.user)
        {
            res.status(401)
                .send("Unauthorized access to doctors scheduling info");
            return; // Not sure if this is not supposed to be here but I added this - Marcus :)
        }

        Booking.find({"doctor":mongoose.Types.ObjectId(req.body.doctor)},function(err,bookings)
        {
            if(err)
            {
                res.status(400)
                    .send("error finding doctors bookings");
                return;
            }
            res.status(200).json(bookings);
            return;
        });
    },

    //===========================================================================
    //Function Developed By: Jacobus Janse van Rensburg
    //Returns a json list of all of the bookings scheduled for current day for specific doctor
    getDoctorScheduleToday : function (req, res)
    {
        if (!req.user)
        {
            res.status(401)
                .send("Unauthorized access to doctors scheduling info");
            return; // Not sure if this is not supposed to be here but I added this - Marcus :)
        }
        var date = new Date();    
        var d = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();

        Booking.find({"doctor":mongoose.Types.ObjectId(req.body.doctor),"date":d},function(err,bookings)
        {
            if(err)
            {
                res.status(400)
                    .send("error finding doctors bookings");
                return;
            }
            res.json(bookings);
            return;
        });
    },

    //===========================================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //function used to retrieve possible slots that a receptionist will use to create a booking using fuzzy logic
    fuzzyLogicBooking: async function(req , res)
    {
        //get the reason and the duration required for this booking
        if(!req.user)
        {
            return res.sendStatus(401);
        }

        const {reason , duration}= req.body;
        var operationTimes = [
            "09:00","09:15","09:30","09:45",
            "10:00","10:15","10:30","10:45",
            "11:00","11:15","11:30","11:45",
            "12:00","12:15","12:30","12:45",           //times that the practice is supposed to be open
            "13:00","13:15","13:30","13:45",           // in total there is 32 slots of 15 minits
            "14:00","14:15","14:30","14:45",
            "15:00","15:15","15:30","15:45",
            "16:00","16:15","16:30","16:45"
        ];
        var today = new Date();     //get the current date
        var day = parseInt(today.getDate())+1 , month = today.getMonth() , year = today.getFullYear();
        var date = day+'/'+(parseInt(month)+1)+'/'+year;
        var dayCap = getDayCap(parseInt(month)); //used to make sure that the dates are continuasly valid when checking on edge cases
        var options = [];   //create an empty array of the options that could possible be 

        var dayCounter = 0;
        while (dayCounter < 7 )//while we dont have a minumum of at least 5 options to choose from
        {  
            const bookings = await Booking.find({"date":date}); //using callback function to enforce sequential execution

            if(bookings != "")
            {
                orderedBookings = orderBookings(bookings);  //order the bookings into a 2D array based on the doctors id
                //loop through the doctors 
                for(var i =0 ; i < orderedBookings.length ; i ++)
                {
                    var doctor = orderedBookings[i][0].doctor;                      
                    var currentDoctorBookings=[];
                    var possible = []; //array to hold bookings that might be a possible match for what we need for specific doctor
                    for(var k =0 ; k < orderedBookings[i].length ; k++)
                    {
                        currentDoctorBookings.push(orderedBookings[i][k]);
                    }
                    //loop through the operating hours of to look for matches
                    for (var j = 0 ; j < operationTimes.length; j ++)
                    {
                        //loop trough the bookings that that doctor has
                        var allowed = true;
                        for(var k =0 ; k < currentDoctorBookings.length ; k++)
                        {
                            
                            if(currentDoctorBookings[k].time == operationTimes[j])
                            {
                                allowed = false;
                                continue; //ignore this time and continue with the next time 
                            }
                            else if (isOverlapping(currentDoctorBookings[k], operationTimes[j],duration, operationTimes))
                            {
                                //check if the times overlap
                                allowed= false;
                                continue; //if the isOverlapping function returns true we move on to the next available time slot
                            }
                            var holder =[];
                            for (var l in possible)
                            {
                                holder[l] =possible[l];
                            }
                            
                            var counter = 0, position =0;
                            if(possible != null)
                            {
                                while(counter < possible.length)
                                {
                                    if((isOverlapping(possible[counter], currentDoctorBookings[k].time , duration , operationTimes[j])))
                                    {
                                        allowed = false;
                                        for (var m = position ; m < holder.length - 1; m++)
                                        {
                                            var temp = holder[m+1];
                                            holder[m]= temp;
                                        }
                                        holder.pop(); //remove the last element in the array
                                        position --;
                                    }
                                    counter ++, position++;
                                }
                            }  
                        }
                        possible = [];
                        for (var l in holder)
                        {
                            possible.push(holder[l]);
                        }
                        
                        if(allowed == true)
                        {
                            //we can add this information as a possible
                            var endTimeStamp = operationTimes[j + (parseInt(duration)/15)];
                            var timeOfDay;
                            if (ot > 12)
                            {
                                timeOfDay =0;
                            }
                            else
                            {
                                timeOfDay =1;
                            }
                            var record = JSON.stringify({"doctor":doctor,"time":operationTimes[j],"endTime":endTimeStamp, "date":date,"reason":reason});
                            possible.push(record);
                            // j = j +(parseInt(duration)/15);   //look for spaced out possible booking spaces.
                        }
                    }
                        
                //add the left over possibles to the options   
                }
                   
                if(possible.length > 0)
                {
                    for (var n in possible)
                    {
                        options.push(possible[n]);
                    }
                } 
            }
            else
            {
                //there was no bookings 
                //find a doctor and use doctor to make an option
                
                const rec =  await Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)});
                //get all the doctors for said practice 
                const doc = await Doctor.find({"practition":rec.practition});
                if(!doc)
                {
                    res.status(400).send("no doctor found for practice");
                    return;
                } 
                else 
                {
                    //loop thru the doctors and make possible options for each of them 
                    for (var doctorCounter in doc)
                    {
                        //loop thru the operational times as well 
                        for ( var ot =0 ; ot < operationTimes.length ; ot++)
                        {
                            if ((parseInt(ot)+parseInt(duration)/15) < 31)
                            {
                                //valid time slot that can be used to make a booking 
                                var timeOfDay;
                                if (ot > 12)
                                {
                                    timeOfDay =0;
                                }
                                else
                                {
                                    timeOfDay =1;
                                }
                                var endTimeStamp = operationTimes[ot + (parseInt(duration)/15)];
                                var elseRecord =JSON.stringify({"doctor":doc[doctorCounter]._id, "time":operationTimes[ot], "endTime":endTimeStamp, "date": date,"reason":reason,"isMorning":timeOfDay});
                                options.push(elseRecord);
                            }
                        }
                    }
                }
            }
            //increment the date
            day = incrementDate(parseInt(day), dayCap);
            if(day == 1)
            {
                dayCap = getDayCap(parseInt(month)+1);
                if(parseInt(month)+1 == 13)
                {
                    month = 1;
                    year = parseInt(year)+1;
                }
                else
                {
                    month = parseInt(month)+1;
                }
            }
            date = day+'/'+(parseInt(month)+1)+'/'+year;
            dayCounter++;
        }

        //return the options back to the client 
        //concat all the options to be returned 
   
        res.status(200).json(options);
    }
}


//=====================================================================================================================
//Function developed by: Jacobus Janse van Rensburg
//function used as a helper function to find the amount of days that is in the current month that is given as a paramater
function getDayCap(month)
{
    var dayCap;

    switch(month)
    {
        case 2: 
            dayCap = 28;
            break;
        case 13:
            dayCap =31;
            break;
        case (month%2 == 1):
            dayCap= 31; 
            break;
        default: 
            dayCap = 30; 
            break;
    }

    return dayCap;
}

//======================================================================================================================
//function developed by: Jacobus Janse van Rensburg
//Helper function that orders the bookings into a 2d array based on the doctor that is booked 
function orderBookings(bookings)
{
    if(bookings == null)
    {
        return null;
    } 

    //find out how many doctors have bookings on given day
    var doctors =[];
    for (var i in bookings)
    {
        if (doctors == null)
        {
            doctors.push(bookings[i].doctor);
        }
        else 
        {
            var allowed = true;
            for( var j = 0 ; j < doctors.length ; j ++)
            {
                if (toString(doctors[j]) == toString(bookings[i].doctor))
                {
                    allowed = false;
                    break;
                }
            }
            if ( allowed )
            {
                doctors.push(bookings[i].doctor);
            }
        }
        // if(!doctors.includes(bookings[i].doctor))
        //     doctors.push(bookings[i].doctor);
    }

    //create the 2D array using the ammount of doctors that bas bookings
    const orderedBookings = doctors.map(doctor => []);
    // var orderedBookings = new Array(doctors.length-1);
    // for (var i in orderedBookings)
    // {
    //     orderedBookings[i] = [];
    // }

    //pace the bookings in the correct place
    for(var i in bookings)
    {
        //find the correct subscript to add the booking in
        for(var j in orderedBookings)
        {
            if (orderedBookings[j].doctor == bookings.doctor)
            {
                //correct place is found 
                orderedBookings[j].push(bookings[i]);
            }
            else if(orderedBookings[j] == null)
            {
                //the doctor subscript was not found and therefor we create subscript j to belong to this doctor
                orderedBookings[j].push(bookings[i]);
            }
        }
    }

    return orderedBookings;
}

//=======================================================================================================================
//Function Deceloped by: Jacobus Janse van Rensburg 
//Helper function to determine if the times of a booking we wish to create is overlapping with another booking
function isOverlapping(booking , startTime , duration , operationTime)
{
    var durationIndexLength = parseInt(duration)/15; 
    var bookStart;
    var bookEnd ;
    var start;
    var end;
    var a,b,c;
    //get all the index's to test for over lapping records
    for(var i in operationTime)
    {
        if (operationTime[i]==booking.time) 
        {
            a =  i ;
        }
        if (operationTime[i]==booking.endTime) 
        {
            b =i;
        }
        if (operationTime[i] == startTime) 
        {
            c = i;
        }
    }
    bookStart = parseInt(a);
    bookEnd = parseInt(b);
    start = parseInt(c);
    end = parseInt(start) + durationIndexLength;
    //test if the end time is not too late
    if ((start+durationIndexLength)>= operationTime.length)
    { 
        return true;  //booking is not allowed
    }

    //test for over lapping 
    if ( (start > bookStart && start < bookEnd) || (end < bookEnd && end > bookStart) || (bookStart > start && bookStart < end) || (bookEnd < end && bookEnd >start) )
    {
        //overlap
        return true; //booking is not allowed
    }

    //if this is reached then no overlap has occured and we return false
    return false;
}

//==========================================================================================================================
//Function developed by: Jacobus Janse van Rensburg
//helper function to increment the date that will be used to look up for bookngs 
function incrementDate(day , dayCap)
{
    if (day == dayCap)
    {
        return 1;
    }
    return day+1;
}

//======================================================================================================
//Function developed by: Steven Visser
//writes new entries to the log file
function updateLogFile(linedesc,practice)
{
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth()+1) +'/'+ today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var time = hours + ":" + minutes + ":" + seconds ;
    var line = date + "@" + time + "@" + linedesc + "\n";
    var fname = "./webSite/Logs/"+practice+".txt";
    fs.appendFile(fname,line,function(err)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Log updated.");
        }
    });
}


async function madeBookingEmail(booking){

    var patient = await Patient.findOne({'_id':mongoose.Types.ObjectId(booking.patient)});
    var doctor = await Doctor.findOne({'_id':mongoose.Types.ObjectId(booking.doctor)});

    var emailOptions={
        from: 'flap.jacks.cs@gmail.com',
            to:patient.email,//send email to the head receptionist
            subject: '3D Model Booking Made',
            html:''
    }

    var htmlreplace="<body><div id='head' style='background-color: #003366; width: 500px; text-align: center; border-radius: 5px;margin: 0 auto; margin-top: 100px; box-shadow: 1px 0px 15px 0px black;'><br></br><h2 style='color:white;'>Booking Appointment</h2><hr style='background-color: white;'><span id='words' style='color: white;'> For email: <p style='color: lightblue;' id='emailAPI' name='emailAPI'>EMAIL_REPLACE</p> Your booking has been made successfully!<br>";
    htmlreplace += "<p>Your booking date is on </p><p id='newDate' style='color: lightgreen;'>DATE_REPLACE</p> At <p style='color: lightgreen;'>TIME_REPLACE</p> With Doctor <p id='docName' style='color: lightgreen;'>DOC_REPLACE</p><p></p></span><br><br></div></body>";

    htmlreplace=htmlreplace.replace("EMAIL_REPLACE",patient.email);
    htmlreplace=htmlreplace.replace("DATE_REPLACE", booking.date);
    htmlreplace = htmlreplace.replace("DOC_REPLACE","("+doctor.name+") "+doctor.surname);
    htmlreplace = htmlreplace.replace("TIME_REPLACE",booking.time);
    emailOptions.html=htmlreplace;

    transporter.sendMail(emailOptions, function(error, info){
        if(error)
        {
            console.log(error);
        }
        else{
            console.log(info);
        }
    });
}
//Created by : Jacobus Janse van Rensburg
//===========================================================================

var fs = require("fs");

const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");
const { userInfo } = require("os");

var Doctor = require("../model/3DModelModel.js").Doctor;
var Receptionist = require("../model/3DModelModel.js").Receptionist;
var Booking = require("../model/3DModelModel.js").Booking;

module.exports ={

   //===========================================================================
   //function developed by: Jacobus Janse van Rensburg
   //return non-security fatal information about receptionist
    getReceptionistInfo: function(req,res)
    {
        if(!req.user)
        {
            res.status(401);
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
            res.json({"name":receptionist.name,"surname":receptionist.surname,"practition": receptionist.practition,"Note":receptionist.Note})
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
            res.status(401);
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
            res.status(401);
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
            res.status(200);
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
            res.status(401);
            return;
        }

        const {patient, doctor, time ,date, reason} = req.body;

        var newBooking = new Booking({date,time,doctor,patient,reason});
        
        newBooking.save(function(err)
        {
            if(err)
            {
                res.status(400)
                    .send(err);
                return;
            }
            
            res.redirect("/newHome.html");

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
        }

        Booking.find({"doctor":mongoose.Types.ObjectId(req.body.doctor)},"-reason",function(err,bookings)
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

    //===========================================================================
    //Function Developed By: Jacobus Janse van Rensburg
    //Returns a json list of all of the bookings scheduled for current day for specific doctor
    getDoctorScheduleToday : function (req, res)
    {
        if (!req.user)
        {
            res.status(401)
                .send("Unauthorized access to doctors scheduling info");
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
    fuzzyLogicBooking: function(req , res){
        //get the reason and the duration required for this booking
        if(!req.user){
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
        ] ;

        var today = new Date();     //get the current date
        var day = today.getDate() , month = today.getMonth() , year = today.getFullYear();
        var date = day+'/'+month+'/'+year;
        var dayCap = getDayCap(parseInt(month)); //used to make sure that the dates are continuasly valid when checking on edge cases
        var options = [];   //create an empty array of the options that could possible be 

        while (options.length < 5){  //while we dont have a minumum of at least 5 options to choose from

            Booking.find({"date":date}, function(err , bookings){ //using callback function to enforce sequential execution

                if(bookins){
                    orderedBookings = orderBookings(bookings);  //order the bookings into a 2D array based on the doctors id

                    //loop through the doctors 
                    for(var i =0 ; i < orderedBookings.length ; i ++){
                        var possible = []; //array to hold bookings that might be a possible match for what we need for specific doctor

                        //loop through the operating hours of to look for matches
                        for (var j = 0 ; j < operationTimes.length; i ++){
                            //loop trough the bookings that that doctor has
                            for(var k =0 ; k < orderedBookings[i].length ; k++){
                                if(orderedBookings[i][k].time == operationTimes[j])
                                {
                                    continue; //ignore this time and continue with the next time 
                                }
                                else if (isOverlapping(orderedBookings[i][k], operationTimes[j],duration, operationTimes)){
                                    //check if the times overlap
                                    continue; //if the isOverlapping function returns true we move on to the next available time slot
                                }
                                var allowed = true;

                                //test agaisnt the possible set that has been derived so long
                                for(var l in possible){
                                    //test for a overlap with this 
                                    if((isOverlapping(possible[l], operationTimes[k] , duration , operationTimes[j])) || possible[l].start == operationTimes[j]){
                                        //there is an overlap with a possible option 
                                        allowed = false;
                                        //remove the possible option
                                        for (var m = l ; m < possible.length;m++)
                                        {
                                            var temp = possible[m+1]
                                            possible[m]= temp;
                                        }
                                        possible.pop(); //remove the last element in the array
                                    }
                                }
                                if(allowed){
                                    //we can add this information as a possible
                                    var record = JSON.stringify({"doctor":orderedBookings[i].doctor,"start":operationTimes[j],"end":(operationTimes[k]+(parseInt(duration)/15))});
                                    possible.push(record);
                                    j = j +(parseInt(duration)/15);   //look for spaced out possible booking spaces.
                                }
                            }

                        }
                        //add the left over possibles to the options
                        if(possible){
                            for (var n in possible)
                            {
                                options.push(possible[n]);
                            }
                        }
                    }
                }else{
                    //there was no bookings 
                    //find a doctor and use doctor to make an option
                    var rec = Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)})
                    Doctor.findOne({"practition":rec.practition}, function(err , doc){
                        if(err || !doc){
                            res.status(400).send("no doctor found for practice");
                            return;
                        }
                        else{
                            options.push(JSON.stringify({"doctor":doc._id, "start":"12:00", "end":(opperationTimes[12]+(parseInt(duration)/15))}));
                        }
                    });
                }
            }); 
            
            //increment the date
            date = incrementDate(parseInt(day), dayCap);
            if(date == 1)
            {
                dayCap = getDayCap(parseInt(month)+1);
                if(parseInt(month)+1 == 13)
                {
                    month = 1;
                }else{
                    month = parseInt(month)+1;
                }
            }
        }

        //return the options back to the client 
        //concat all the options to be returned 
        var returnObject ;
        for (var i in options)
        {
            returnObject = returnObject.concat(options[i]);
        }

        res.status(200).send(returnObject);
    },
}


//=====================================================================================================================
//Function developed by: Jacobus Janse van Rensburg
//function used as a helper function to find the amount of days that is in the current month that is given as a paramater
function getDayCap(month){
    var dayCap;

    switch(month){
        case 2: dayCap = 28;break;
        case 13: dayCap =31;break;
        case (month%2 == 1):dayCap= 31; break;
        default: dayCap = 30; break;
    }

    return dayCap;
}

//======================================================================================================================
//function developed by: Jacobus Janse van Rensburg
//Helper function that orders the bookings into a 2d array based on the doctor that is booked 
function orderBookings(bookings){
    if(bookings == null) return null;

    //find out how many doctors have bookings on given day
    var doctors =[];
    for (var i in bookings)
    {
        if(doctors.includes(bookings[i].doctor))
            continue;
        bookings.push(bookings[i].doctor);
    }

    //create the 2D array using the ammount of doctors that bas bookings
    var orderedBookings = [doctors.length-1];
    for (var i in orderedBookings)
    {
        orderedBookings[i]= new Array();
    }

    //pace the bookings in the correct place
    for(var i in bookings)
    {
        //find the correct subscript to add the booking in
        for(var j in orderedBookings){
            if(orderedBookings[j] == null){
                //the doctor subscript was not found and therefor we create subscript j to belong to this doctor
                orderedBookings[j].push(bookings[i]);
            }
            else if (orderedBookings[j].doctor == bookings.doctor)
            {
                //correct place is found 
                orderedBookings[j].push(bookings[i]);
            }
        }
    }

    return orderedBookings;
}

//=======================================================================================================================
//Function Deceloped by: Jacobus Janse van Rensburg 
//Helper function to determine if the times of a booking we wish to create is overlapping with another booking
function isOverlapping(booking , startTime , duration , operationTime){
    var durationIndexLength = parseInt(duration)/15; 
    var bookStart, bookEnd , start, end;

    //get all the index's to test for over lapping records
    for(var i in operationTime)
    {
        if (operationTime[i]==bookings.time) bookStart = i;
        if (operationTime[i]==booking.endTime) bookEnd =i;
        if (operationTime[i] == startTime) start = i;
    }
    //test if the end time is not too late
    if ((start+durationIndexLength)>= operationTime.length)
    {
        return true;  //booking is not allowed
    }

    //test for over lapping 
    if ( (start > bookStart && start < bookEnd) || (end < bookEnd && end > bookStart) ){
        //overlap
        return true; //booking is not allowed
    }

    //if this is reached then no overlap has occured and we return false
    return false;
}

//==========================================================================================================================
//Function developed by: Jacobus Janse van Rensburg
//helper function to increment the date that will be used to look up for bookngs 
function incrementDate(day , dayCap){

    if (day == dayCap)
    {
        return 1;
    }

    return day+1;
}
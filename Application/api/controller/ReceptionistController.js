//Created by : Jacobus Janse van Rensburg
//===========================================================================

var fs = require("fs");

const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");
const { userInfo } = require("os");
const { Console } = require("console");
const { Consultation } = require("../model/3DModelModel.js");

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
            
            res.redirect("/newHome.html");

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
    fuzzyLogicBooking: async function(req , res){
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
        ];

        var today = new Date();     //get the current date
        var day = today.getDate() , month = today.getMonth() , year = today.getFullYear();
        var date = day+'/'+(parseInt(month)+1)+'/'+year;
        var dayCap = getDayCap(parseInt(month)); //used to make sure that the dates are continuasly valid when checking on edge cases
        var options = [];   //create an empty array of the options that could possible be 

        console.log(date);
        // while (options.length < 5){  //while we dont have a minumum of at least 5 options to choose from
            const bookings = await Booking.find({"date":date}); //using callback function to enforce sequential execution

                if(bookings!=""){

                    orderedBookings = orderBookings(bookings);  //order the bookings into a 2D array based on the doctors id

                    //loop through the doctors 
                    console.log(orderedBookings.length);
                    for(var i =0 ; i < orderedBookings.length ; i ++){
                        var doctor = orderedBookings[i][0].doctor;
                        var orderedBookingsLength = orderedBookings[i].length;
                        
                        var currentDoctorBookings=[];
                       
                        var possible = []; //array to hold bookings that might be a possible match for what we need for specific doctor

                        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                            console.log("Adding current doctors booking array:");
                            console.log("For Doctor "+(j+1))
                            for(var k =0 ; k < orderedBookings[i].length ; k++){
                                console.log("Start Time: "+ orderedBookings[i][k].time+"\t endTime: "+orderedBookings[i][k].endTime);
                                currentDoctorBookings.push(orderedBookings[i][k]);
                            }

                        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n");
                        //loop through the operating hours of to look for matches
                        for (var j = 0 ; j < operationTimes.length; j ++){
                            //loop trough the bookings that that doctor has
                            console.log("\n+=+=+=+=+=+=+=+==+=++=+===+++++==++=+=+++++==+=++=++=")
                            console.log("FOR OPERATIONAL TIME: "+operationTimes[j]);
                            console.log("Time from ordered bookings: "+currentDoctorBookings[0].time );

                            //Removable logs
                            if(possible!=null){
                                console.log("Posible options: "); 
                                for(var k in possible)
                                {
                                    console.log(possible[k]);
                                }
                            }
                           
                            var allowed = true;
                            console.log("Amount of bookings for doctor: "+currentDoctorBookings.length)
                            for(var k =0 ; k < currentDoctorBookings.length ; k++){

                                console.log("\nFor orderedBooking:\tStart:"+currentDoctorBookings[k].time +"\tend:"+ currentDoctorBookings[k].endTime+"\n")


                                if(currentDoctorBookings[k].time == operationTimes[j])
                                {
                                    allowed = false;
                                    console.log("operation time is the same as current booking and therefore not allowed");
                                    continue; //ignore this time and continue with the next time 
                                }
                                else if (isOverlapping(currentDoctorBookings[k], operationTimes[j],duration, operationTimes)){
                                    //check if the times overlap
                                    allowed= false;
                                    console.log("The times overlap with the current booking and therefore is discarded");
                                    continue; //if the isOverlapping function returns true we move on to the next available time slot
                                }

                                console.log("possibles:\n");
                                var holder =[];
                                for (var l in possible)
                                {
                                    console.log("holy fuck can this fucking thing please just work!!!!!!!")
                                    holder[l] =possible[l];
                                }
                                console.log("holder length: "+holder.length);
                                var counter = 0, position =0;
                                if(possible != null){
                                    while(counter < possible.length){
                                        console.log(possible[counter]);
                                        if((isOverlapping(possible[counter], currentDoctorBookings[k].time , duration , operationTimes[j]))){

                                            allowed = false;
                                            for (var m = position ; m < holder.length - 1; m++)
                                                {
                                                    console.log("removing; "+ holder[m])
                                                    var temp = holder[m+1];
                                                    holder[m]= temp;
                                                }
                                            holder.pop(); //remove the last element in the array
                                            }
                                            position --;
                                        }
                                        counter ++, position++;
                                    }  
                                }

                                // possible = [];
                                console.log("holder length: "+holder.length);
                                for (var l in holder)
                                {
                                    console.log("holder: "+holder[l]);
                                    possible.push(holder[l]);
                                }

                                console.log("AAAAAAH: \n");
                                for (var i in possible)
                                {
                                    console.log(possible[i]);
                                }
                                // console.log("allowed: "+ allowed);
                                if(allowed == true){
                                    //we can add this information as a possible
                                    // console.log("possible");
                                    var endTimeStamp = operationTimes[j + (parseInt(duration)/15)];

                                    var record = JSON.stringify({"doctor":doctor,"start":operationTimes[j],"end":endTimeStamp, "date":date});
                                    console.log("Adding record to possibles: "+ record);

                                    possible.push(record);
                                    j = j +(parseInt(duration)/15);   //look for spaced out possible booking spaces.
                                }
                            }

                        }
                        //add the left over possibles to the options
                        for(var n in possible)
                        {
                            console.log(possible[n]);
                        }
                        if(possible.length > 0){
                            for (var n in possible)
                            {
                                if(options.length<5)
                                    options.push(possible[n]);
                                else {
                                    break;
                                }
                            }
                            
                        }
                    }
                    else{
                        console.log("in else");
                    //there was no bookings 
                    //find a doctor and use doctor to make an option
                    const rec =  await Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)});
                    const doc = await Doctor.findOne({"practition":rec.practition});
                    if(!doc){
                        res.status(400).send("no doctor found for practice");
                        return;
                    } else {
                        var endTimeStamp = operationTimes[12+ (parseInt(duration)/15)];
                        options.push(JSON.stringify({"doctor":doc._id, "start":"12:00", "end":endTimeStamp, "date": date}));
                        // console.log("options size: "+options.length);
                    }
                }
             
            
            //increment the date
            day = incrementDate(parseInt(day), dayCap);
            if(date == 1)
            {
                dayCap = getDayCap(parseInt(month)+1);
                if(parseInt(month)+1 == 13)
                {
                    month = 1;
                    year = parseInt(year)+1;
                }else{
                    month = parseInt(month)+1;
                }
            }
            date = day+'/'+(parseInt(month)+1)+'/'+year;
        // }

        //return the options back to the client 
        //concat all the options to be returned 
        var returnObject = "";
        for (var i in options)
        {
            returnObject += options[i];
        }
        
        console.log("returning: \n");
        for (var i in options)
        {
            console.log(options[i]);
        }
        res.status(200).json(options);
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
        doctors.push(bookings[i].doctor);
    }

    console.log("doctorsLength: "+doctors.length);
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
    console.log("=========================================")
    console.log("THE ORDERED BOOKINGS THAT WAS GENERATED: ")
    for (var i =0 ; i < orderedBookings.length; i ++){
        console.log("FOR DOCTOR: "+ orderedBookings[i][0].doctor+"\n++++++++++++++++++++++++++++++++++");
        for(var j =0 ; j < orderedBookings[i].length; j ++){
            console.log("Booking "+(j+1)+" \tstart:"+orderedBookings[i][j].time +"\tEND: "+orderedBookings[i][j].endTime);
        }
        
    }
    return orderedBookings;
}

//=======================================================================================================================
//Function Deceloped by: Jacobus Janse van Rensburg 
//Helper function to determine if the times of a booking we wish to create is overlapping with another booking
function isOverlapping(booking , startTime , duration , operationTime){

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log("Checking for overlap between \nbooking start: "+booking.time +"\t end:"+booking.endTime);
    console.log("With start:"+start+"\tduration: "+duration)


    var durationIndexLength = parseInt(duration)/15; 
    console.log("value of duration index:"+durationIndexLength);
    var bookStart, bookEnd , start, end;

    //get all the index's to test for over lapping records
    for(var i in operationTime)
    {
        if (operationTime[i]==booking.time) {
            bookStart =  i;
            console.log("found bookStart "+ i);
        }
        if (operationTime[i]==booking.endTime) {
            bookEnd =i;
            console.log("found bookEnd "+ i);
        }
        if (operationTime[i] == startTime) {
            start = i ;
            console.log("found start "+ start);
        }
    }
    end = parseInt(start) + durationIndexLength;
    console.log("indices: bookStart:"+bookStart+"\tbookEnd: "+bookEnd+"\nstart: "+start+"\tend: "+end);
    //test if the end time is not too late
    if ((start+durationIndexLength)>= operationTime.length)
    {
        console.log("indexout of bounds therefore not allowed");
        console.log("end time: "+ (start+durationIndexLength));

        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

        return true;  //booking is not allowed
    }

    //test for over lapping 
    if ( (start > bookStart && start < bookEnd) || (end < bookEnd && end > bookStart) ){
        //overlap
        console.log("Overlapping");
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

        return true; //booking is not allowed
    }
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

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

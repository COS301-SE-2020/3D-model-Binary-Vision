//Created by: Jacobus Janse van Rensburg
//Modified by: Steven Visser
//
//This is the Model file. This is where the Schemas for the MongoDB database are created and set.

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoctorSchema = new Schema({
    name:{
        type:String,
        required: 'This field is required!'
    },
    surname:{
        type:String,
        required: 'This field is required!'
    },
    username:{ 
        type: String ,
        required: 'This field is required!'
    },
    email:{
        type:String,
        required: 'This field is required!'
    },
    password:{
        type:String,
        required: 'This field is required!'
    },
    practition:{
        type:String,
        required: 'This field is required!'
    }
});

var PatientSchema = new Schema({
    idNumber:{ 
        type: String, 
        required: 'This field is required!'
    },
    name:{
        type:String,
        required: 'This field is required!'
    },
    surname:{
        type:String,
        required: 'This field is required!'
    },
    email:{
        type:String,
        required: 'This field is required!'
    },
    gender:
    {
        type:String
    },
    cellnumber:
    {
        type:String,
        required: 'This field is required!'
    }
});

var Receptionist = new Schema({
    name:{type:String},
    surname:{type:String},
    email:{type:String},
    username:{type:String, required:true},
    password:{type:String, required:true},
    practition:{
        type:String, required: true
    },
    Note:{
        type:String
    }
});

var ConsultationSchema = new Schema({
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    doctor: {
        type: Schema.Types.ObjectId,
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        required: true
    },
    STL: {
        type: Schema.Types.ObjectId
    },
    Note:{
        type:String, 
        required: true
    }
});

var Booking = new Schema({
    date:{type:String,required:true},
    time:{type:String,required:true},
    patient:{type:mongoose.Types.ObjectId,required:true},
    doctor:{type:mongoose.Types.ObjectId,required:true},
    reason:{type:String}
})

module.exports = {
    Doctor: mongoose.model("Doctor",DoctorSchema),
    Patient: mongoose.model("Patient", PatientSchema),
    Consultation: mongoose.model("Consultation", ConsultationSchema),
    Receptionist: mongoose.model("Receptionist", Receptionist),
    Booking:mongoose.model("Booking", Booking)
}

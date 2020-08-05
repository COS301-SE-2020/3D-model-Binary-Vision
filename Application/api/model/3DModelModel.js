'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoctorSchema = new Schema({
    name:{
        type:String,
        required: 'kindly enter name'
    },
    surname:{
        type:String
    },
    username: { type: String },
    email:{type:String},
    password:{
        type:String
    },
});

var PatientSchema = new Schema({
    idNumber: { type: String, required: true },
    name:{
        type:String
    },
    surname:{
        type:String
    },
    email:{
        type:String
    },
    gender:
    {
        type:String
    },
    doctor:{
        type: Schema.Types.ObjectId
    }
});

var Receptionist = new Schema({
    idNumber:{type:"String", required:true},
    name:{type:"String"},
    surname:{type:"String"},
    email:{type:"String"}
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
    date:{type:Date,require:true},
    time:{type:"String", required:true},
    patient:{type: Schema.Types.ObjectId, requred: true},
    doctor:{type: Schema.Types.ObjectId , require: true}
});

module.exports = {
    Doctor: mongoose.model("Doctor",DoctorSchema),
    Patient: mongoose.model("Patient", PatientSchema),
    Consultation: mongoose.model("Consultation", ConsultationSchema),
    Receptionist: mongoose.model("Receptionist", Receptionist),
    Bookings : mongoose.model("Bookings",Bookings)
}
// module.exports = mongoose.model("Records", RecordsSchema);

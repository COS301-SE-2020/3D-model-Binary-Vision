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
    practition:{
        type:String,require: false
    }
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
    name:{type:String},
    surname:{type:String},
    email:{type:String},
    practition:{
        type:String, required: false
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


module.exports = {
    Doctor: mongoose.model("Doctor",DoctorSchema),
    Patient: mongoose.model("Patient", PatientSchema),
    Consultation: mongoose.model("Consultation", ConsultationSchema),
    Receptionist: mongoose.model("Receptionist", Receptionist)
}
// module.exports = mongoose.model("Records", RecordsSchema);

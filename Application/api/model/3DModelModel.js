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
    }
});


module.exports = {
    Doctor: mongoose.model("Doctor",DoctorSchema),
    Patient: mongoose.model("Patient", PatientSchema),
    Consultation: mongoose.model("Consultation", ConsultationSchema)
}
// module.exports = mongoose.model("Records", RecordsSchema);

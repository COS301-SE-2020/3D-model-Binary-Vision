//Created by: Jacobus Janse van Rensburg
//Modified by: Steven Visser
//
//This is the Model file. This is where the Schemas for the MongoDB database are created and set.

'use strict';

var mongoose = require('mongoose');
const { passwordChange } = require('../controller/3DModelController');
var Schema = mongoose.Schema;

var DoctorSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    surname:{
        type:String,
        required: true
    },
    username:{ 
        type: String ,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    practition:{
        type:String,
        required: true
    },
    active:{
        type: Boolean, required: true , default: false
    },
    avatar:{
        type:String,
        default:"0"
    }
});

var PatientSchema = new Schema({
    idNumber:{ 
        type: String, 
        required: true
    },
    name:{
        type:String,
        required: true
    },
    surname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    gender:{
        type:String
    },
    cellnumber:{
        type:String,
        required: true
    },
    practice:{
        type: String,
        required: true
    }
});

var Receptionist = new Schema({
    name:{
        type:String,
        required: true
    },
    surname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String, 
        required:true
    },
    practition:{
        type:String, 
        required: true
    },
    Note:{
        type:String
    },
    active:{
        type: Boolean , default:false
    },
    avatar:{
        type:String,
        default:"0"
    }
});

var ConsultationSchema = new Schema({
    created:{
        type: String
    },
    doctor:{
        type: Schema.Types.ObjectId,
        required: true
    },
    patient:{
        type: Schema.Types.ObjectId
    },
    video:{
        type: Schema.Types.ObjectId,
        default:null
    },
    OBJ:{
        type: Schema.Types.ObjectId,
        default:null
    },
    MTL:{
        type: Schema.Types.ObjectId,
        default:null
    },
    TEX:{
        type: Schema.Types.ObjectId,
        default:null
    },
    Note:{
        type:String, 
    },
    reason:{
        type:String,
    }
});

var Booking = new Schema({
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        default: this.time
    },
    patient:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    doctor:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    reason:{
        type:String
    },
    status:{
        type:String,
        default:'Pending'
    }
})

var PasswordChanges = new Schema({
    email:{
        type: String,
        required: true
    }
})

var Practice = new Schema({
    practice: {
        type:String,
        required: true
    },
    securityCode:{
        type: String,
        required: true
    },
    headReceptionist: {
        type: String,
        required: true
    }
})

module.exports = {
    Doctor: mongoose.model("Doctor",DoctorSchema),
    Patient: mongoose.model("Patient", PatientSchema),
    Consultation: mongoose.model("Consultation", ConsultationSchema),
    Receptionist: mongoose.model("Receptionist", Receptionist),
    Booking:mongoose.model("Booking", Booking),
    PasswordChanges: mongoose.model("PasswordChanges",PasswordChanges),
    Practice: mongoose.model("Practice",Practice)
}

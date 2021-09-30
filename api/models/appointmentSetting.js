const mongoose = require('mongoose');

const appointmentSettingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId,ref: 'User', required: true},
    onlineBookingFlag: { type:Boolean, required: true},
    saturdayFlag: { type:Boolean, required: true},
    saturdayStartTime: { type: String , required: true},
    saturdayEndTime: { type: String, required: true },
    sundayFlag: { type:Boolean, required: true},
    sundayStartTime: { type: String , required: true},
    sundayEndTime: { type: String , required: true},
    mondayFlag: { type:Boolean, required: true},
    mondayStartTime: { type: String, required: true},
    mondayEndTime: { type: String, required: true },
    tuesdayFlag: { type:Boolean, required: true},
    tuesdayStartTime: { type: String, required: true },
    tuesdayEndTime: { type: String, required: true },
    wednesdayFlag: { type:Boolean, required: true},
    wednesdayStartTime: { type: String, required: true },
    wednesdayEndTime: { type: String, required: true },
    thursdayFlag: { type:Boolean, required: true},
    thursdayStartTime: { type: String, required: true },
    thursdayEndTime: { type: String, required: true },
    fridayFlag: { type:Boolean, required: true},
    fridayStartTime: { type: String, required: true },
    fridayEndTime: { type: String, required: true },
    appointmentApprovalFlag: { type: Boolean, required: true },
    advanceBooking: { type: Number, required: true },
    timeInterval: { type: Number, required: true },
   
});

module.exports = mongoose.model('AppointmentSetting', appointmentSettingSchema);
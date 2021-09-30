const mongoose = require('mongoose');
const Appointment = require('../models/appointment');
const User = require('../models/user');

// Retrieve and return all specialistes from the database.
exports.findAll = (req, res) => {
    console.log('here findAll!!------->appointment.js');
    Appointment.find().sort({
        "createdAt": -1,
        "updatedAt": -1
    })
        .populate('doctorId', 'name')
        .exec()
        .then(appointments => {
            res.send(appointments);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving specialistes."
            });
        });
};

exports.findByDoctorId = (req, res, next) => {
    const doctorId = req.params.doctorId;
    console.log('doctorId: ' + doctorId);
    Appointment.find({
        doctorId: doctorId
    }).sort({
        "updatedAt": -1,
        "createdAt": -1
    })
        .exec()
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}


exports.countPendingRequestsByDoctorId = (req, res, next) => {
    const doctorId = req.params.doctorId;
    Appointment.find({
        doctorId: doctorId,
        status: 'pending'
    })
        .count()
        .exec()
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}

exports.getAppointmentsByDoctorIdAndDate = (req, res, next) => {
    const doctorId = req.params.doctorId;
    console.log('doctorId: ' + doctorId);
    const date = req.params.date;
    console.log('date: ' + date);
    Appointment.find({
        doctorId: doctorId,
        date: date
    }).sort({
        "updatedAt": -1,
        "createdAt": -1
    })
        .exec()
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}

exports.findByUserId = (req, res, next) => {
    const userId = req.params.userId;
    console.log('userId: ' + userId);
    Appointment.find({
        userId: userId
    }).sort({
        "updatedAt": -1,
        "createdAt": -1
    })
        .populate('doctorId', 'name')
        .exec()
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}

exports.appointment_create_appointment = (req, res, next) => {
    const userId = req.params.userId;
    const createOps = {};
    createOps["_id"] = new mongoose.Types.ObjectId();
    for (const [key, value] of Object.entries(req.body)) {
        createOps[key] = value;
    }
    console.log('createOps' + JSON.stringify(createOps));
    User.findById(req.body.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            const appointment = new Appointment(createOps);
            return appointment.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'User not found ',
                error: err
            });
        });

}


exports.appointment_get_appointment = (req, res, next) => {
    const id = req.params.appointmentId;
    Appointment.findById(id).sort({
        "updatedAt": -1,
        "createdAt": -1
    })
        .exec()
        .then(doc => {
            // console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No Valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}



exports.appointment_update_appointment = (req, res, next) => {
    console.log('appointment_update_appointment..called..');
    if (Object.keys(req.body).length === 0) {
        console.log('req.body is empty');
        return res.status(400).send({
            message: "Appointment content can not be empty"
        });
        // Do something
    } else {
        console.log('req.body is\'not empty');
    }
    const appointmentId = req.params.appointmentId;
    const updateOps = {};
    // console.log('updateOps:');
    for (const [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
        console.log('key:' + key + ' value:' + value);
    }

    Appointment.findByIdAndUpdate({
        _id: appointmentId
    }, {
        $set: updateOps
    }, {
        new: true
    })
        .exec()
        .then(result => {
            console.log(result);
            if (!result) {
                return res.status(404).send({
                    message: "Appointment not found with id " + req.params.appointmentId
                });
            }
            res.status(200).json(result);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Appointment not found with id " + req.params.appointmentId
                });
            }
            return res.status(500).send({
                message: "Error updating Appointment with id " + req.params.appointmentId
            });
        });
};



exports.appointment_delete_appointment = (req, res, next) => {

    const id = req.params.appointmentId;
    Appointment.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Appointment Deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}
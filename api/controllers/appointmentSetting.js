const mongoose = require('mongoose');
const AppointmentSetting = require('../models/appointmentSetting');
const User = require('../models/user');

// Retrieve and return all specialistes from the database.
exports.findAll = (req, res) => {
    console.log('here findAll!!---------->setttings.js');
    AppointmentSetting.find()
        .then(appointmentSettings => {
            res.send(appointmentSettings);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving specialistes."
            });
        });
};

exports.findByUserId = (req, res, next) => {
    console.log('findByUserId: entered!!');
    const userId = req.params.userId;
     console.log('userId: ' + userId);
    AppointmentSetting.findOne({
            userId: userId
        })
        .exec()
        .then(response => {
             console.log('response:', response);
            if (!response) {
                return res.status(404).json({
                    message: 'AppointmentSetting not found',
                });
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}

exports.appointmentSetting_create_appointmentSetting = (req, res, next) => {
    // Validate request
    // if (!req.body.name) {
    //     return res.status(400).send({
    //         message: "Specialiste content can not be empty"
    //     });
    // }
    const userId = req.params.userId;
    const createOps = {};
    for (const [key, value] of Object.entries(req.body)) {
        if (key === '_id') continue;
        createOps[key] = value;
    }
    createOps["_id"] = new mongoose.Types.ObjectId();
    // console.log('createOps' + JSON.stringify(createOps));

    const appointmentSetting = new AppointmentSetting(createOps);

    User.findById(req.body.userId)
        .then(user => {
            if (!user) {
                console.log('user null!');
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            return appointmentSetting.save().then(result => {
                console.log(result);
                res.status(201).json(result);
            });

        }).catch(err => {
            console.log(err);
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Specialiste."
            });
        });


}


exports.appointmentSetting_get_appointmentSetting = (req, res, next) => {
    const id = req.params.appointmentSettingId;
    AppointmentSetting.findById(id)
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



exports.appointmentSetting_update_appointmentSetting = (req, res, next) => {
    console.log('appointmentSetting_update_appointmentSetting..called..');
    if (Object.keys(req.body).length === 0) {
        console.log('req.body is empty');
        return res.status(400).send({
            message: "AppointmentSetting content can not be empty"
        });
        // Do something
    } else {
        console.log('req.body is\'not empty');
    }
    const appointmentSettingId = req.params.appointmentSettingId;
    const updateOps = {};
    // console.log('updateOps:');
    for (const [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
        console.log('key:' + key + ' value:' + value);
    }

    AppointmentSetting.findByIdAndUpdate({
            _id: appointmentSettingId
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
                    message: "AppointmentSetting not found with id " + req.params.appointmentSettingId
                });
            }
            res.status(200).json(result);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "AppointmentSetting not found with id " + req.params.appointmentSettingId
                });
            }
            return res.status(500).send({
                message: "Error updating AppointmentSetting with id " + req.params.appointmentSettingId
            });
        });
};



exports.appointmentSetting_delete_appointmentSetting = (req, res, next) => {

    const id = req.params.appointmentSettingId;
    AppointmentSetting.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'AppointmentSetting Deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}
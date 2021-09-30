const Doctor = require('../models/doctor');
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    console.log('here findAll!!------------->doctors');
    Doctor.find().
        populate("user").
        exec(function (err, nws) {
            if (err) {
                res.writeHead(500, err.message)
            }
            res.send(nws);
        });
}

exports.doctors_create_doctor = (req, res, next) => {
    console.log('doctors_create_doctor called ',req.body.email);
    // save user first 
    User.find({
        email: req.body.email
    })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                console.log("enter------");
                bcrypt.hash(req.body.password, 10, (err, hash) => {                    
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const createOps = {};
                        createOps["_id"] = new mongoose.Types.ObjectId();
                        createOps["password"] = hash;
                        for (const [key, value] of Object.entries(req.body)) {
                            if (key === "password") continue;
                            createOps[key] = value;
                        }
                        console.log('createOps' + JSON.stringify(createOps));
                        const user = new User(createOps);
                        console.log("userForSaving", user);
                        user.save()
                            .then(result => {
                                // user created here . 
                                // now create the new doc
                                console.log("user Saved!", result);
                                const filePath = '';
                                if (req.file) filePath = req.file.path;
                                const doctor = new Doctor({
                                    _id: new mongoose.Types.ObjectId(),
                                    _user: user._id,
                                    username: req.body.username,
                                    doctorImage: filePath
                                });
                                doctor.save()
                                    .then(result => {
                                        console.log("doctor Saved!", result);
                                        res.status(201).json({
                                            message: 'Created Doctor Successfully ',
                                            createdDoctor: result
                                        });
                                    })
                                    .catch(err => {
                                        User.findOneAndRemove({
                                            email: req.body.email
                                        })
                                            .exec()
                                            .then(result => {
                                                console.log('user removed!');
                                                console.log('result', result);
                                            });
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });

}


exports.doctors_get_doctor = (req, res, next) => {
    const id = req.params.doctorId;
    console.log("doctors_get_doctor",id);
    Doctor.findOne({
        _user: id
    })
        .populate("user")
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
exports.doctors_update_doctor = (req, res, next) => {
    console.log('patch method!!' + req);
    const id = req.params.doctorId;
    const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    //  console.log(req.body);
    for (const [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
    }
    Doctor.update({
        _id: id
    }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Doctor Updated !'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}


exports.doctors_delete_doctor = (req, res, next) => {

    const id = req.params.doctorId;
    Doctor.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}
// NPM Packages
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const aqp = require('api-query-params');
const S3 = require('aws-s3');
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const passwordResetToken = require('../models/resettoken');
var transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'mshenawy',
        pass: 'mo7amed&*771991'
    }
});

// AWS.config.loadFromPath('aws_config.json');

const config = {
    bucketName: 'dranner',
    dirName: 'photos',
    /* optional */
    region: 'eu-west-1',
    accessKeyId: 'AKIARDJSX6CA726GTO4P',
    secretAccessKey: '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',
    s3Url: 'https://dranner.s3.amazonaws.com/',
    /* optional */
}

const S3Client = new S3(config);
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

/* This is optional */
const newFileName = 'my-awesome-file';

// })

/**
 * {
 *   Response: {
 *     bucket: "your-bucket-name",
 *     key: "photos/image.jpg",
 *     location: "https://your-bucket.s3.amazonaws.com/photos/image.jpg"
 *   }
 * }
 */

exports.loginSoial = (req, res, next) => {
    console.log('loginSoial email----->', req.body.email);
    User.findOne({
            email: req.body.email
        }).exec()
        .then(user => {
            // console.log('loginSoial user ------>', user);

            if (user && user._id) {
                // console.log('loginSoial user found login ------>', user);
                if (user) {
                    const jwtBearerToken = jwt.sign({
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "7d" //ih
                        }
                    );
                    // // set it in an HTTP Only + Secure Cookie
                    // res.cookie("SESSIONID", jwtBearerToken, {
                    //     httpOnly: true,
                    //     secure: true
                    // });
                    return res.status(200).json({
                        message: 'auth_success_msg',
                        token: jwtBearerToken,
                        expiresIn: "7d",
                        user: user
                    });
                }

            } else { // not exist 
                console.log('loginSoial user not found found , register ------>');

                const createOps = {};
                createOps["_id"] = new mongoose.Types.ObjectId();
                createOps["email"] = req.body.email;
                createOps["name"] = req.body.name;
                createOps["profileImage"] = req.body.profileImage;

                console.log('loginSoial createOps' + JSON.stringify(createOps));
                const user = new User(createOps);
                console.log("userForSaving", user);
                user.save()
                    .then(result => {

                        const token = jwt.sign({
                                email: user.email,
                                userId: user._id
                            },
                            process.env.JWT_KEY, {
                                expiresIn: "1h"
                            }
                        );
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created Successful',
                            token: token,
                            user: user
                        });

                    })
                    .catch(err => {
                        console.log('500 err', err);
                        res.status(500).json({
                            message: 'Some errors happened ',
                            error: err
                        });
                    });

            }
        });
}


exports.user_signup = (req, res, next) => {

    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            // console.log('user res ', user);
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const createOps = {};
                        createOps["_id"] = new mongoose.Types.ObjectId();
                        createOps["password"] = hash;
                        // createOps["userType"] = 'user';
                        for (const [key, value] of Object.entries(req.body)) {
                            if (key === "password") continue;
                            createOps[key] = value;
                        }
                        console.log('createOps', createOps);
                        if (createOps["userType"] === 'doctor') {
                            console.log('this is doctor !!');
                        }
                        const filePath = '';
                        if (req.file) {
                            filePath = req.file.path;
                            console.log('req.file', req.file);
                            createOps["profileImage"] = filePath;
                        }
                        console.log('createOps' + JSON.stringify(createOps));
                        const user = new User(createOps);
                        console.log("userForSaving", user);
                        user.save()
                            .then(result => {

                                const token = jwt.sign({
                                        email: user.email,
                                        userId: user._id
                                    },
                                    process.env.JWT_KEY, {
                                        expiresIn: "1h"
                                    }
                                );
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created Successful',
                                    token: token,
                                    user: user
                                });
                            })
                            .catch(err => {
                                console.log('500 err', err);
                                res.status(500).json({
                                    message: 'Some errors happened ',
                                    error: err
                                });
                            });
                    }
                });
            }
        });

}

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    console.log('here findAll!!---------->user');
    User.find()
        .populate('doctorInfo.specialistes', 'name name_ar')
        .populate('doctorInfo.networkInsurances', 'name name_ar')
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// search for doctor users from the database.
exports.searchdoctors = (req, res) => {
    console.log('here searchdoctors!!');
    // ref https://www.npmjs.com/package/api-query-params
    // const query = aqp(
    //     'status=sent&timestamp>2016-01-01&author.firstName=/john/i&limit=100&skip=50&sort=-timestamp&populate=logs&fields=id,logs.ip'
    // );
    console.log('here searchdoctors!! end .. query', aqp(req.query));
    const {
        filter,
        // skip,
        // limit,
        // sort,
        projection,
        population
    } = aqp(req.query);
    // console.log('here searchdoctors!! end .. query', aqp(req.query));
    console.log('here searchdoctors!! start .. filter', filter);

    

    const lang = filter['lang'];
    if (filter.lang) {
        delete filter.lang;
    }

    filter.userType = 'doctor';
    if (filter.title) {
        filter['doctorInfo.title'] = filter.title;
        delete filter.title;
    }
    if (filter.name) {
        filter['name'] = new RegExp(filter.name, "i");
    }
    if (filter.address) {
        if (lang === 'en') {
            filter['doctorInfo.address.location'] = new RegExp(filter.address, "i");
        } else {
            filter['doctorInfo.address.location_ar'] = new RegExp(filter.address, "i");
        }
        delete filter.address;
    }
    if (filter.networkInsurances) {
        filter['doctorInfo.networkInsurances'] = filter.networkInsurances;
        delete filter.networkInsurances;
    }
    if (filter.drSpecialtyId) {
        filter['doctorInfo.specialistes'] = filter.drSpecialtyId;
        delete filter.drSpecialtyId;
    }
    if (filter.drSpecialty) {
        delete filter.drSpecialty;
    }
    if (filter.fees) {
        filter['doctorInfo.fees'] = filter.fees
        delete filter.fees;
    }
    if (filter.rating) {
        filter['doctorInfo.overAll_rating'] = filter.rating
        // filter['doctorInfo.overAll_rating'] = {
        //     $gte: filter.minRating
        // };
        delete filter.rating;
    }

    filter['doctorInfo.verifiedFlag'] = true
    // 'doctorInfo.title': { '$in': [ 'MD', 'DO' ] },
    // filter['doctorInfo.networkInsurances'] = '5db0681e6d8db014d41bc6ca';
    // filter['doctorInfo.networkInsurances'] = {
    //     // $size: 2
    //     $elemMatch: {
    //         '$in': [ {'_id':'5db0681e6d8db014d41bc6ca' }]
    //         // "$or" : [
    //         //     { "name" : "Egymed" },
    //         //     { "_id" : "5db0681e6d8db014d41bc6ca" }
    //         //  ]
    //     }
    // };
    let page = filter['page'];
    if (filter.page) {
        delete filter.page;
    }else {
        page = 1;
    }

    const limit = 10;
    const skip = limit * (page - 1);

    const sort = '-doctorInfo.total_ratings -doctorInfo.overAll_rating -doctorInfo.viewCount'
    // console.log('here searchdoctors!! end .. sort', sort);
    console.log('here searchdoctors!! end .. filter', filter);
    var count = 0;
    //estimatedDocumentCount faster but without filter

    User.find(filter).countDocuments().then(num => {
        console.log(count, "count");
        count = num;
        User.find(filter)
            .populate('doctorInfo.specialistes', 'name name_ar')
            .populate('doctorInfo.networkInsurances', 'name name_ar')
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .then(users => {
                // console.log("users----><><",users)
                res.send({
                    total: count,
                    page: page,
                    items: users
                });
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving users."
                });
            });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
    // console.log('count', count);

};


exports.user_get_id = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .populate('doctorInfo.specialistes')
        .populate('doctorInfo.networkInsurances')
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

exports.user_get_by_username = (req, res, next) => {
    console.log('user_get_by_username');
    const username = req.params.username;
    User.findOne({
            'doctorInfo.username': username
        })
        .populate('doctorInfo.specialistes', 'name name_ar')
        .populate('doctorInfo.networkInsurances', 'name name_ar')
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

exports.user_update_view_count = (req, res, next) => {
    console.log('user_update_view_count');
    const username = req.params.username;
    User.findOneAndUpdate({
            'doctorInfo.username': username
        }, {
            $inc: {
                "doctorInfo.viewCount": 1
            }
        })
        .populate('doctorInfo.specialistes', 'name name_ar')
        .populate('doctorInfo.networkInsurances', 'name name_ar')
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


exports.user_login = (req, res, next) => {
    User.findOne({
            $or: [{
                    email: req.body.email
                },
                {
                    'doctorInfo.username': req.body.email
                },
                {
                    'doctorInfo.phoneNumber': req.body.email
                }
            ]
        })
        .exec()
        .then(user => {
            if (user == null || user.length < 1) { // got no user
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            } else { // got the user check password now
                console.log('user: ' + user);
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth Failed'
                        });
                    }
                    if (result) {
                        const jwtBearerToken = jwt.sign({
                                email: user.email,
                                userId: user._id
                            },
                            process.env.JWT_KEY, {
                                expiresIn: "7d" //ih
                            }
                        );
                        // // set it in an HTTP Only + Secure Cookie
                        // res.cookie("SESSIONID", jwtBearerToken, {
                        //     httpOnly: true,
                        //     secure: true
                        // });
                        return res.status(200).json({
                            message: 'auth_success_msg',
                            token: jwtBearerToken,
                            expiresIn: "7d",
                            user: user
                        });
                    }
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
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

exports.users_update_user = (req, res, next) => {
    console.log('patch method users_update_user' + req);
    const id = req.params.userId;
    const updateOps = {};
    for (const [key, value] of Object.entries(req.body)) {
        console.log("key----->", key);
        if (key === "password") continue;
        if (key === "specialistes") {
            updateOps["doctorInfo.specialistes"] = value;
            continue;
        }
        if (key === "phoneNumber") {
            updateOps["doctorInfo.phoneNumber"] = value;
            continue;
        }
       
        if (key === "about") {
            updateOps["doctorInfo.about"] = value;
            continue;
        }
        if (key === "title") {
            updateOps["doctorInfo.title"] = value;
            continue;
        }
        if (key === "education") {
            updateOps["doctorInfo.education"] = value;
            continue;
        }
        if (key === "awards") {
            updateOps["doctorInfo.awards"] = value;
            continue;
        }
        if (key === "networkInsurances") {
            updateOps["doctorInfo.networkInsurances"] = value;
            continue;
        }
        if (key === "latitude") {
            updateOps["doctorInfo.address.latitude"] = value;
            continue;
        }
        if (key === "longitude") {
            updateOps["doctorInfo.address.longitude"] = value;
            continue;
        }
        if (key === "location_ar") {
            updateOps["doctorInfo.address.location_ar"] = value;
            continue;
        }
        if (key === "location") {
            updateOps["doctorInfo.address.location"] = value;
            continue;
        }
        if (key === "fees") {
            updateOps["doctorInfo.fees"] = value;
            continue;
        }
        if (key === "currency") {
            updateOps["doctorInfo.currency"] = value;
            continue;
        }
        updateOps[key] = value;
    }
    console.log("updateOps----->", updateOps);
    User.findOneAndUpdate({
            _id: id
        }, {
            $set: updateOps
        }, {
            new: true
        })
        .populate('doctorInfo.specialistes', 'name name_ar')
        .populate('doctorInfo.networkInsurances', 'name name_ar')
        .exec()
        .then(result => {
            console.log(result);
            if (!result) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating User with id " + req.params.userId
            });
        });

}
exports.validpasswordtoken = async (req, res, next) => {
    console.log("passwordYYYYYYYY");
    if (!req.body.resettoken) {
        return res
            .status(500)
            .json({
                message: 'Token is required'
            });
    }
    passwordResetToken.findOne({
            resettoken: req.body.resettoken
        }).exec()
        .then(user => {
            console.log(user);
            console.log(user._userId, "user");
            if (!user) {
                return res
                    .status(409)
                    .json({
                        message: 'Invalid URL'
                    });
            }
            User.findOne({
                _id: user._userId
            }).then(() => {
                res.status(200).json({
                    message: 'Token verified successfully.'
                });
            }).catch((err) => {
                return res.status(500).send({
                    msg: err.message
                });
            });
        });


}
exports.NewPassword = async (req, res, next) => {
    console.log("New Password");
    passwordResetToken.findOne({
        resettoken: req.body.resettoken
    }, function (err, userToken, next) {
        if (!userToken) {
            return res
                .status(409)
                .json({
                    message: 'Token has expired'
                });
        }

        User.findOne({
            _id: userToken._userId
        }, function (err, userEmail, next) {
            if (!userEmail) {
                return res
                    .status(409)
                    .json({
                        message: 'User does not exist'
                    });
            }
            return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                if (err) {
                    return res
                        .status(400)
                        .json({
                            message: 'Error hashing password'
                        });
                }
                userEmail.password = hash;
                userEmail.save(function (err) {
                    if (err) {
                        return res
                            .status(400)
                            .json({
                                message: 'Password can not reset.'
                            });
                    } else {
                        userToken.remove();
                        return res
                            .status(201)
                            .json({
                                message: 'Password reset successfully'
                            });
                    }

                });
            });
        });

    })
}


exports.passwordResetRequest = async (req, res, next) => {
    const email = req.body.email;

    const user = User.findOne({
            email: email
        }).exec()
        .then(user => {
            console.log(user);

            const createOps = {};
            createOps["_id"] = new mongoose.Types.ObjectId();
            for (const [key, value] of Object.entries(req.body)) {
                createOps[key] = value;
            }
            createOps["resettoken"] = crypto.randomBytes(16).toString('hex');
            createOps["_userId"] = user._id;
            console.log('createOps', createOps);
            var resettoken = new passwordResetToken(createOps);
            console.log('email', email);

            resettoken.save(function (err) {
                if (err) {
                    return res.status(500).send({
                        msg: err.message
                    });
                }
                passwordResetToken.find({
                    _userId: user._id,
                    resettoken: {
                        $ne: resettoken.resettoken
                    }
                }).remove().exec();
                res.status(200).json({
                    message: 'Reset Password successfully.'
                });
                const passwordResetUrl = 'https://modawy.com/ar/response-reset-password/' + resettoken.resettoken;

                const msg = {
                    from: 'noreply@modawy.com',
                    to: email,
                    subject: 'Forgot Password‏',
                    text: `Modawy.com
            `,
                    html: `
                <p>
        We received an account recovery request on Vezeeta.com for your email address.If you initiated this request click
                    <a href="${passwordResetUrl}">here</a>
                </p>
            `,
                };

                transporter.sendMail(msg, function (err, info) {
                    if (err) {
                        console.log(err);
                        console.log('send email.... ');
                        res.status(500).json({
                            message: err
                        });
                    } else {
                        console.log(info);
                        console.log('send email.... ');
                        res.status(201).json({
                            message: 'Email sent Successful',
                            res: info
                        });
                    }

                });

            });

        });

}
exports.users_update_user_password = (req, res, next) => {
    console.log('users_update_user_password patch method!!' + req);
    const id = req.params.userId;
    const updateOps = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
        console.log(key, value);
    }
    User.findOne({
            _id: id
        })
        .exec()
        .then(user => {
            console.log(user);
            if (user == null || user.length < 1) { // got no user
                return res.status(401).json({
                    message: 'User not found!'
                });
            } else {
                bcrypt.compare(updateOps['oldPassword'], user.password, (err, result) => {
                    console.log("err", result);
                    console.log(err, result);
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    if (result) {
                        console.log('passwordNew', updateOps);
                        bcrypt.hash(updateOps['password'], 10, (err, hash) => {
                            console.log("err23", err);
                            console.log("hash", hash);
                            if (err) {
                                res.status(500).json({
                                    error: err
                                });
                            } else {
                                User.updateOne({
                                        _id: id
                                    }, {
                                        $set: {
                                            password: hash
                                        }
                                    })
                                    .exec()
                                    .then(result => {
                                        console.log(result);
                                        res.status(200).json({
                                            message: 'Password Updated !',
                                            user: user
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                        // res.status(500).json({
                                        //     error: err
                                        // });
                                    });

                            }
                        });
                    } else {
                        return res.status(401).json({
                            message: 'Password is not true'
                        });
                    }
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });


    console.log('users_update_user_password end method!!' + res);
}


exports.user_delete_user = (req, res, next) => {

    User.remove({
            _user: req.params.userId
        })
        .exec()
        .then(result => {
            console.log('users with this user deleted');
            User.remove({
                    _id: req.params.userId
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "User deleted"
                    });
                })
                .catch(err => {
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



exports.addToFavouriteList = (req, res, next) => {
    console.log('addToFavouriteList called ------>', req);
}

exports.users_create_doctor = (req, res, next) => {
    console.log('doctors_create_doctor called ------>', req.body.email);
    // save user first 
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                console.log('exists !');
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                console.log('Mail not exists !');
                User.find({
                        'doctorInfo.username': req.body.username
                    })
                    .exec()
                    .then(user => {
                        if (user.length >= 1) {
                            return res.status(410).json({
                                message: 'username exists'
                            });

                        } else {
                            // console.log('user name not found !', req.body.username);
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

                                    // add doctor info
                                    createOps["userType"] = 'doctor';
                                    const doctorInfo = {};
                                    doctorInfo['username'] = req.body.username;
                                    doctorInfo['specialistes'] = req.body.specialistes;
                                    doctorInfo['phoneNumber'] = req.body.phoneNumber;
                                    const filePath = '';
                                    if (req.file) filePath = req.file.path;
                                    doctorInfo['doctorImage'] = filePath;

                                    createOps["doctorInfo"] = doctorInfo;

                                    console.log('createOps' + JSON.stringify(createOps));

                                    const user = new User(createOps);
                                    console.log("userForSaving", user);
                                    user.save()
                                        .then(result => {
                                            // user created here . 
                                            // now create the new doc
                                            console.log("user Saved!", result);
                                            res.status(200).json({
                                                message: 'doctor created Successfully!',
                                                user: result
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

                    })
            }
        });

}
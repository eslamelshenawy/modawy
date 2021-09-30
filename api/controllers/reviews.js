const mongoose = require('mongoose');
const Review = require('../models/review');
const User = require('../models/user');

exports.reviews_get_all = (req, res, next) => {
    Review.find()
        .sort({
            date: 'desc'
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

exports.findByDoctorId = (req, res, next) => {
    const doctorId = req.params.doctorId;
    console.log('doctorId: ' + doctorId);
    Review.find({
            doctorId: doctorId
        }).sort({
            date: 'desc'
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
exports.findByAppointmentId = (req, res, next) => {
    const appointmentId = req.params.appointmentId;
    console.log('appointmentId: ' + appointmentId);
    Review.findOne({
            appointmentId: appointmentId
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

exports.findByDoctorIdAndUserId = (req, res, next) => {
    const doctorId = req.params.doctorId;
    const userId = req.params.userId;
    console.log('doctorId: ' + doctorId);
    Review.findOne({
            doctorId: doctorId,
            userId: userId,
            appointmentId: null
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

exports.updateStatisticsByDoctorId = (doctorId) => {
    console.log('updateStatisticsByDoctorId doctorId: ' + doctorId);
    Review.find({
            doctorId: doctorId
        })
        .exec()
        .then(response => {
            const size = response.length;
            let oneStartCount = 0;
            let twoStartCount = 0;
            let threeStartCount = 0;
            let fourStartCount = 0;
            let fiveStartCount = 0;

            let oneStartPercentage = 0;
            let twoStartPercentage = 0;
            let threeStartPercentage = 0;
            let fourStartPercentage = 0;
            let fiveStartPercentage = 0;

            for (let i = 0; i < response.length; i++) {
                const element = response[i];
                if (element.rating === 1)
                    oneStartCount++;
                if (element.rating === 2)
                    twoStartCount++;
                if (element.rating === 3)
                    threeStartCount++;
                if (element.rating === 4)
                    fourStartCount++;
                if (element.rating === 5)
                    fiveStartCount++;
            }
            oneStartPercentage = oneStartCount * 100 / size;
            twoStartPercentage = twoStartCount * 100 / size;
            threeStartPercentage = threeStartCount * 100 / size;
            fourStartPercentage = fourStartCount * 100 / size;
            fiveStartPercentage = fiveStartCount * 100 / size;

            let totalSum = oneStartCount + twoStartCount + threeStartCount + fourStartCount + fiveStartCount;
            let overAllRate = (oneStartCount * 1) + (twoStartCount * 2) + (threeStartCount * 3) + (fourStartCount * 4) + (fiveStartCount * 5);
            overAllRate /= size * 5;
            overAllRate *= 5;
            overAllRate *= 10; // to get one digit after ,
            overAllRate = Math.round(overAllRate) / 10; // to get one digit after ,

            const updateOps = {};
            updateOps['doctorInfo.overAll_rating'] = overAllRate;
            updateOps['doctorInfo.total_ratings'] = size;
            console.log('updateOps:', updateOps);

            User.updateOne({
                    _id: doctorId
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    // console.log(result);
                    console.log('Statistics By DoctorId update successfully ');
                });

        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.findStatisticsByDoctorId = (req, res, next) => {
    const doctorId = req.params.doctorId;
    console.log('doctorId: ' + doctorId);
    Review.find({
            doctorId: doctorId
        }).sort({
            updatedAt: 'desc'
        })
        .exec()
        .then(response => {
            const size = response.length;
            let oneStartCount = 0;
            let twoStartCount = 0;
            let threeStartCount = 0;
            let fourStartCount = 0;
            let fiveStartCount = 0;

            let oneStartPercentage = 0;
            let twoStartPercentage = 0;
            let threeStartPercentage = 0;
            let fourStartPercentage = 0;
            let fiveStartPercentage = 0;

            for (let i = 0; i < response.length; i++) {
                const element = response[i];
                if (element.rating === 1)
                    oneStartCount++;
                if (element.rating === 2)
                    twoStartCount++;
                if (element.rating === 3)
                    threeStartCount++;
                if (element.rating === 4)
                    fourStartCount++;
                if (element.rating === 5)
                    fiveStartCount++;
            }
            oneStartPercentage = oneStartCount * 100 / size;
            twoStartPercentage = twoStartCount * 100 / size;
            threeStartPercentage = threeStartCount * 100 / size;
            fourStartPercentage = fourStartCount * 100 / size;
            fiveStartPercentage = fiveStartCount * 100 / size;

            let totalSum = oneStartCount + twoStartCount + threeStartCount + fourStartCount + fiveStartCount;
            let overAllRate = (oneStartCount * 1) + (twoStartCount * 2) + (threeStartCount * 3) + (fourStartCount * 4) + (fiveStartCount * 5);
            overAllRate /= size * 5;
            overAllRate *= 5;
            overAllRate *= 10; // to get one digit after ,
            overAllRate = Math.round(overAllRate) / 10; // to get one digit after ,

            res.status(200).json({
                size: size,
                overAllRate: overAllRate,
                oneStartCount: oneStartCount,
                oneStartPercentage: oneStartPercentage,
                twoStartCount: twoStartCount,
                twoStartPercentage: twoStartPercentage,
                threeStartCount: threeStartCount,
                threeStartPercentage: threeStartPercentage,
                fourStartCount: fourStartCount,
                fourStartPercentage: fourStartPercentage,
                fiveStartCount: fiveStartCount,
                fiveStartPercentage: fiveStartPercentage,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}

exports.findByDoctorIdBagination = (req, res, next) => {
    const doctorId = req.params.doctorId;
    var pageNo = parseInt(req.params.pageNo);
    var size = parseInt(req.params.size);
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = {
            "error": true,
            "message": "invalid page number, should start with 1"
        };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    var count = 0;
    //estimatedDocumentCount faster but without filter
    Review.find({
        doctorId: doctorId
    }).countDocuments().then(num => {
        count = num;
    });

    console.log('doctorId: ' + doctorId);
    Review.find({
            doctorId: doctorId
        }, {}, query, function (err, data) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                response = {
                    "error": false,
                    total: count,
                    "message": data
                };
            }
            res.json(response);
        })
        .sort({
            "createdAt": -1
        })
        .populate({
            path: 'userId',
            select: 'name -_id profileImage'
        });
}



exports.reviews_create_review = (req, res, next) => {
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
            const review = new Review(createOps);
            return review.save();
        })
        .then(result => {
            //console.log(result);
            this.updateStatisticsByDoctorId(createOps["doctorId"]);
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

exports.reviews_get_review = (req, res, next) => {
    const id = req.params.reviewId;
    Review.findById(id)
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



exports.reviews_update_review = (req, res, next) => {

    if (Object.keys(req.body).length === 0) {
        // Do something
        console.log('req.body is empty');
    } else {
        console.log('req.body is\'not empty');
    }
    const id = req.params.reviewId;
    const updateOps = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
    }
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    // console.log(req.body);
    Review.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            this.updateStatisticsByDoctorId(updateOps["doctorId"]);
            res.status(200).json({
                message: 'Review Updated !'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}


exports.reviews_delete_review = (req, res, next) => {

    const id = req.params.reviewId;
    Review.remove({
            _id: id
        })
        .exec()
        .then(result => {
            this.updateStatisticsByDoctorId(req.params.doctorId);
            res.status(200).json({
                message: 'Review Deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}
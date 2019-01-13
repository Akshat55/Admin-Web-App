const mongoose = require('mongoose');
require('dotenv').config();
let Schema = mongoose.Schema;


//Schema for comments
var commentSchema = new Schema({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "commentText": String,
    "postedDate": Date,
    "replies": [{
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date,
    }]
});

let Comment; //To be defined on new connection



//Initializes teh database
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.MONGO_COMMENT_CONNECTION, {
            useNewUrlParser: true
        });


        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            Comment = db.model("comments", commentSchema);
            resolve();
        });
    });
};



//Adds comment to the database
module.exports.addComment = function (data) {
    return new Promise((resolve, reject) => {
        data.postedDate = Date.now();
        let newComment = new Comment(data);
        newComment.save().then(() => {
            resolve(newComment._id);
        }).catch((error) => {
            reject("There was an error saving the comment: " + error);
        })
    });
}



//Returns all of the data(Comments)
module.exports.getAllComments = function () {
    return new Promise((resolve, reject) => {
        Comment.find().sort({ postedDate: 1 }).exec().then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}



//Adds a replay message to an existing Comment
module.exports.addReply = function (data) {
    return new Promise((resolve, reject) => {
        data.repliedDate = Date.now();
        Comment.update({ _id: data.comment_id },
            { $addToSet: { replies: data } },
            { multi: true }
        ).exec().then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    })
}




const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
let Schema = mongoose.Schema;


var userSchema = new Schema({
    user: { type: String, unique: true },  //Ensures the usernames are unique
    pass: String
});

let User; // to be defined on new connection (see initialize)


//Initializes the database
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.MONGO_LOGIN_CONNECTION, {
            useNewUrlParser: true
        });

        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};



//Registers user in to the database
module.exports.registerUser = function (userData) {
    return new Promise((resolve, reject) => {
        //Check if passwords match
        if (userData.password != userData.password2) {
            reject("Passwords do not match.");
        } else {
            //Makes the user variable (Ensures not all variables under userData are used)
            bcrypt.genSalt(10, function (err, salt) { // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, function (err, hash) { // encrypt the password
                    //Check for hash
                    if (err) {
                        reject("There was an error encrypting the password");
                    } else {
                        //Create user if hash doesn't return error
                        let newUser = new User({ user: userData.user, pass: hash });
                        newUser.save().then(() => {
                            resolve();                  //user successfully created
                        }).catch((error) => {
                            if (error.code == 11000) {
                                reject("User Name already taken");
                            } else {
                                reject("There was an error creating the user: " + error);
                            }
                        });
                    }
                });
            });
        }
    });
}



//Searches for the user within the database
module.exports.checkUser = function (userData) {
    return new Promise((resolve, reject) => {
        User.find({ user: userData.user }).exec()
            .then((data) => {
                if (data[0].length == 0) {                //Check for empty array
                    reject("Unable to find user:" + userData.user);
                } else {
                    bcrypt.compare(userData.password, data[0].pass).then((res) => {

                        // res === true if it matches and res === false if it does not match
                        if (res === true) {
                            resolve();
                        } else if (res === false) {
                            reject("Incorrect Password for user: " + userData.user);
                        }
                    })
                }

            }).catch((error) => {
                reject("Unable to find user: " + userData.user);
            });
    });
}



//Updating user information
module.exports.updatePassword = function (userData) {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Passwords do not match!");
        } else {

            bcrypt.genSalt(10, function (err, salt) { // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, function (err, hash) { // encrypt the new password
                    // Update the hash value in database
                    if (err) {
                        reject("There was an error encrypting the password");
                    } else {

                        User.update({ user: userData.user },
                            { $set: { pass: hash } },
                            { multi: false })
                            .exec()
                            .then(resolve())
                            .catch((error) => {
                                reject("There was an error updating the password for user: " + userData.user);
                            });
                    }
                });
            });

        }
    });
}

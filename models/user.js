const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

var jwtSecret = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    userName: {type: String, require: true, minlength: 2, maxlength: 255},
    email: { type: String, require: true, minlength: 2, maxlength: 255 },
    password: { type: String, require: true, minlength: 3, maxlength: 1024 },
    games: {type: String, default: 0},
    wins: {type: String, default: 0},
    loses: {type: String, default: 0}
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            games: this.games,
            wins: this.wins,
            loses: this.loses
        },
        jwtSecret || config.get("jwtSecret")
    );
}

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().min(2).max(255).required().email(),
        password: Joi.string().min(3).max(1024).required(),
        userName: Joi.string().min(2).max(50).required()
    });
    return schema.validate(user);
}
const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateUser = validateUser;
exports.userSchema = userSchema;

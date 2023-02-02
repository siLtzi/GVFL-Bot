const mongoose = require('mongoose');

const ProfileSC = new mongoose.Schema({
    userName: { type: String, required: true },
    userID: { type: String, required: true, unique: true },
    serverID: { type: String, required: true },
    points: { type: Number, default: 0 },
    firstPlace: { type: Number, default: 0 },
    secondPlace: { type: Number, default: 0 },
    thirdPlace: { type: Number, default: 0 }
});

const model = mongoose.model('leaderboard', ProfileSC);
module.exports = model;
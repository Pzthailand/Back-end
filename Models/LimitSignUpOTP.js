const mongoose = require('mongoose');

const LimitSignUpOTPSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    count: { type: Number, default: 0 },
    requestDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LimitSignUpOTP', LimitSignUpOTPSchema);
const mongoose = require('mongoose');

const LimitPhoneOTPSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phone: { type: String, required: true },
    count: { type: Number, default: 0 },
    requestDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LimitPhoneOTP', LimitPhoneOTPSchema);


/*// Validate input
 if (!username || !phone) {
    return res.status(400).send('Username and Phone Number are required.');
}

// Check or create OTP request data
let otpRequest = await LimitPhoneOTP.findOne({ username, phone });

const currentTime = Date.now();
const OTP_REQUEST_LIMIT = 5; // Limit to 5 requests per day
const ONE_DAY = 24 * 60 * 60 * 1000; // Milliseconds in one day

if (!otpRequest) {
    otpRequest = new LimitPhoneOTP({ username, phone, requestDate: currentTime, count: 0 });
}

// Check if the day has changed
if (currentTime - otpRequest.requestDate > ONE_DAY) {
    otpRequest.count = 0; // Reset count for a new day
    otpRequest.requestDate = currentTime; // Update request date
}

// Check OTP request count
if (otpRequest.count >= OTP_REQUEST_LIMIT) {
    return res.status(429).send('Too many OTP requests today. Please try again tomorrow.');
}

// Increment the request count
otpRequest.count++;
await otpRequest.save(); // Ensure this is awaited*/
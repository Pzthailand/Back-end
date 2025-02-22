const Users = require('../Models/Users')
const LimitSignUpOTP = require('../Models/LimitSignUpOTP')
const LimitEmailOTP = require('../Models/LimitEmailOTP')
const LimitPhoneOTP = require('../Models/LimitPhoneOTP')
const fs = require('fs') //npm install fs-extra
const bcrypt = require('bcryptjs'); //npm install bcrypt bcryptjs
const jwt = require('jsonwebtoken') //npm install jsonwebtoken
require('dotenv').config() //npm install dotenv --save


const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

function generateOTP() { 
    // Declare a digits variable  
    // which stores all digits  
    //let digits =  '0123456789abcdefghijklmnopqrstuvwxyz';
    let digits =  '0123456789'; 
    let OTP = ''; 
    let len = digits.length 
    for (let i = 0; i < 6; i++) { 
        OTP += digits[Math.floor(Math.random() * len)]; 
    } 
    return OTP; 
}

exports.SignUp_By_Email = async (req,res) => {
    try{
        const { email } = req.body
        // Convert to lowercase
        const lowercaseEmail = email.toLowerCase();
        var mail = await Users.findOne({email : lowercaseEmail})
        if(mail){
            return res.status(400).send('Email Address Already Exists!!!')
        }else{
        const otp = generateOTP()  //Send otp to Email
        console.log('Sign up : ', email, ' OTP : ',otp)
        
         var payload={
             user:{
                 email : email,
                 otp : otp
             }
        } 
        //Send paylaod to frontend
        res.send(payload) 
        // Email options
         /*let mailOptions = {
             from: process.env.email, // Sender address
             to: email, // List of recipients
             subject: 'One Time Password', // Subject line
             text: 'Your OTP :'+otp, // Plain text body
             html: 'Your OTP :'+otp // HTML body
         };
         // Send email
         transporter.sendMail(mailOptions, (error, info) => {
             if (error) {
                 return console.log(`Error: ${error}`);
             }
             console.log(`Message Sent: ${info.response}`);
         });*/
    }
    }catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.SignUp_By_Phone = async (req,res) => {
    try{
        const { phone } = req.body

         // Validate input
         if (!phone) {
            return res.status(400).send('Phone Number are required.');
        }

        // Check or create OTP request data
        let otpRequest = await LimitSignUpOTP.findOne({ phone });

        const currentTime = Date.now();
        const OTP_REQUEST_LIMIT = 5; // Limit to 5 requests per day
        const ONE_DAY = 24 * 60 * 60 * 1000; // Milliseconds in one day

        if (!otpRequest) {
            otpRequest = new LimitSignUpOTP({ phone, requestDate: currentTime, count: 0 });
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
        await otpRequest.save(); // Ensure this is awaited

        var phonenumber = await Users.findOne({phone})
        if(phonenumber){
            return res.status(400).send('Phone Number Already Exists!!!')
        }else{
        const otp = generateOTP()  //Send otp to Email
        console.log('Sign up' ,'Phone Number : ', phone, ' OTP : ',otp)
        
         var payload={
             user:{
                 phone : phone,
                 otp : otp
             }
        } 
        //Send paylaod to frontend
        res.send(payload) 
        //API Phone SMS
    }
    }catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.SignUp = async (req,res) => {
    try{
            //req : Frontend
            const { username , password, role , fname, lname , gender,  birthday , email, phone, addres, zipcode} = req.body
            console.log(req.body)

            // Convert to lowercase
            const lowercaseUsername = username.toLowerCase();
            const lowercaseEmail = email.toLowerCase();

            //1.Check-Username
            var user = await Users.findOne({ username : lowercaseUsername })
            if(user){
                return res.status(400).send('User Already Exists!!!')
            }
            //2.Check-Email
            var mail = await Users.findOne({email : lowercaseEmail})
            if(mail){
                return res.status(400).send('Email Address Already Exists!!!')
            }
            //3.Check Phone Number
            var phonenumber = await Users.findOne({phone})
            if(phonenumber)
            {
                return res.status(400).send('Phone Number Already Exists!!!')
            }
            //4.Encrypt
            const salt = await bcrypt.genSalt(10)
            user = new Users({
                username : lowercaseUsername,
                password,
                role,
                fname,
                lname,
                gender,
                birthday,
                email : lowercaseEmail,
                phone,
                addres,
                zipcode
            })
            user.password = await bcrypt.hash(password,salt)
            //5.Save
            user.save()
            res.status(201).send('Sign up Success')
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.SignIn = async (req,res) => {
    try{
            //1. CheckUser
            const {username , password} = req.body
            const lowercaseUsername = username.toLowerCase();
            
            var user = await Users.findOneAndUpdate({username: lowercaseUsername},{new : true})
            if(user){
                const Passthen = await bcrypt.compare(password, user.password)
                if(!Passthen){
                    return res.status(400).send('Password Invalid')
                } 
                if(user.enabled === false){
                    return res.status(400).send('This user is not available')
                }else{
                //2. Payload
                var payload={
                    user:{
                        id : user._id,  
                        username : user.username,
                        role : user.role,
                        email : user.email,  
                        phone : user.phone, 
                        file : user.file,
                        cart : user.cart,
                        problemstatus : user.problemstatus,
                    }
                }
            }   
            //3. Generate
            jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '30D'},(err,token)=>{
                    if(err) throw err;
                    res.json({token,payload})
                })
            }else {
                return res.status(404).send('User Not Found!!!')
            }
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.CurrentUser = async (req,res) => {
    try{
        const user = await Users.findOne({username:req.user.username}).select('-password').exec();
        res.send(user)
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.Profile = async (req,res) => {
    try {
        const id = req.params.id
        //1. Checkuser
        var user = await Users.findOne({_id : id}).select('-password').exec();
            if(user){
                res.send(user)
            }else{
                return res.status(404).send('User Not Found!!!')
            }
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.ProfileUpdate = async (req, res) => {
    try {
        const id = req.params.id;
        let NewData = req.body;

        console.log("New data received: ", NewData);

        // Handle file upload if present
        if (typeof req.file !== 'undefined') {
            NewData.file = req.file.filename;

            if (NewData.fileold) {
                try {
                    // ลบไฟล์จาก Cloudinary
                    await cloudinary.uploader.destroy(NewData.fileold);
                    console.log('Old image removed from Cloudinary');
                } catch (err) {
                    console.error('Error removing old image from Cloudinary:', err);
                }
            }
        }

        // Add updatedAt timestamp
        NewData.updatedAt = new Date();

        // Update user data in the database
        const updated = await Users.findOneAndUpdate(
            { _id: id },
            NewData,
            { new: true }
        ).exec();

        // If the user was not found, return an error
        if (!updated) {
            return res.status(404).send('User not found');
        }

        // Send updated profile data back to the client
        res.status(200).send({ message: 'Profile update success', updatedProfile: updated });

    } catch (err) {
        console.error('Error during profile update:', err);
        res.status(500).send('Server Error');
    }
};

/*exports.ProfileUpdate = async (req,res) => {
    try{
        const id = req.params.id
        var NewData = req.body
        
        console.log(NewData)

        if(typeof req.file !== 'undefined'){
            NewData.file = req.file.filename
            await fs.unlink('./UserImages/' + NewData.fileold,(err)=>{
                if(err){
                    console.log(err)
                } else {
                    console.log('Remove old image success')
                }
            })
        }

        //updateAt
        NewData.updatedAt = new Date();

        const updated = await Users.findOneAndUpdate({_id: id},NewData,{new: true}).exec();
        res.status(200).send('Profile update success')
        //const updated = await Product.findOneAndUpdate({_id: id},req.body,{new: true}).exec();
        //res.send(id)
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}*/

/*exports.ProfileUpdate = async (req,res) => {
    try {
        //1. Req id
        const id = req.params.id
        const { fname, lname , addres, zipcode} = req.body
        //2. Update
        Users.findOneAndUpdate({_id: id},{fname,lname,addres,zipcode},{new: true}).exec();
        res.status(200).send('Change Profile Success') 
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}*/


exports.ForgotPassword_By_Email = async (req,res) => {
    try {
        const {username , email} = req.body

        // Convert to lowercase
        const lowercaseUsername = username.toLowerCase();
        const lowercaseEmail = email.toLowerCase();

        const user = await Users.findOne({username : lowercaseUsername ,email : lowercaseEmail},{new: true}).exec();
        if(!user){
            return res.status(404).send('Email Address not match or User Not Found')
        }else{
           //res.send(user)
           const otp = generateOTP()  //Send otp to Email
           console.log('Username : ', username, 'Forgot Password By Email Address OTP : ',otp)
           
            var payload={
                user:{
                    id : user._id,  
                    otp : otp
                }
           } 
           //Send paylaod to frontend
           res.send(payload) 
           // Email options
            /*let mailOptions = {
                from: process.env.email, // Sender address
                to: email, // List of recipients
                subject: 'One Time Password', // Subject line
                text: 'Your OTP :'+otp, // Plain text body
                html: 'Your OTP :'+otp // HTML body
            };
            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(`Error: ${error}`);
                }
                console.log(`Message Sent: ${info.response}`);
            });*/
          };
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.ResetPassword_By_Email = async (req,res) => {
    try{
        const id = req.params.id
        //1. Req email , password
        var {email , password} = req.body
        //2. Encrypt Password
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password,salt)
        //console.log('Change Password', password)
        //3. Update By id 
        Users.findOneAndUpdate({_id: id},{email , password},{new: true}).exec();
        res.status(200).send('Reset Password Success')
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.ForgotPassword_By_Phone = async (req,res) => {
    try {
        const {username , phone} = req.body

        // Convert to lowercase
        const lowercaseUsername = username.toLowerCase();

        const user = await Users.findOne({username : lowercaseUsername ,phone},{new: true}).exec();
        if(!user){
            return res.status(404).send('Phone Number not match or User Not Found')
        }else{
           //res.send(user)
           const otp = generateOTP()  //Send otp to SMS
           console.log('Username : ', username, 'Forgot Password By Phone OTP : ',otp)
           
            var payload={
                user:{
                    id : user._id,  
                    otp : otp
                }
           } 
           //Send paylaod to frontend
           res.send(payload) 
            //API OTP SMS
          };
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.ResetPassword_By_Phone = async (req,res) => {
    try{
        const id = req.params.id
        //1. Req email , password
        var {phone , password} = req.body
        //2. Encrypt Password
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password,salt)
        //console.log('Change Password', password)
        //3. Update By id 
        Users.findOneAndUpdate({_id: id},{phone , password},{new: true}).exec();
        res.status(200).send('Reset Password Success')
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.VerifyEmailOTP = async (req, res) => {
    try {
        const { username, email } = req.body;

        // Validate input
        if (!username || !email) {
            return res.status(400).send('Username and email address are required.');
        }

        // Check or create OTP request data
        let otpRequest = await LimitEmailOTP.findOne({ username, email });

        const currentTime = Date.now();
        const OTP_REQUEST_LIMIT = 5; // Limit to 5 requests per day
        const ONE_DAY = 24 * 60 * 60 * 1000; // Milliseconds in one day

        if (!otpRequest) {
            otpRequest = new LimitEmailOTP({ username, email, requestDate: currentTime, count: 0 });
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
        await otpRequest.save(); // Ensure this is awaited

        const user = await Users.findOne({ username, email }).exec();
        if (!user) {
            return res.status(404).send('Email address does not match or user not found.');
        } else {
            const otp = generateOTP(); // Function to generate OTP
            console.log('Username : ', username, 'Request Email Address OTP : ', otp);
            const payload = {
                user: {
                    id: user._id,
                    otp: otp
                }
            };
            res.send(payload);
            // Implement email sending logic here
        }
    } catch (err) {
        console.error(err); // Log the error
        res.status(500).send('Internal server error.'); // More generic response for security
    }
};


/*exports.VerifyEmailOTP = async (req,res) => {
    try {
        const {username , email} = req.body
        
        const user = await Users.findOne({username,email},{new: true}).exec();
        if(!user){
            return res.status(404).send('Email Address not match or User Not Found')
        }else{
           //res.send(user)
           const otp = generateOTP()  //Send otp to Email
           console.log('Username : ', username, 'Request Email Address OTP : ',otp)
            var payload={
                user:{
                    id : user._id,  
                    otp : otp
                }
           } 
           //Send paylaod to frontend
           res.send(payload) 
           // Email options
            /*let mailOptions = {
                from: process.env.email, // Sender address
                to: email, // List of recipients
                subject: 'One Time Password', // Subject line
                text: 'Your OTP :'+otp, // Plain text body
                html: 'Your OTP :'+otp // HTML body
            };
            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(`Error: ${error}`);
                }
                console.log(`Message Sent: ${info.response}`);
            });*/
          /*};
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}*/

exports.ChangeEmail = async (req,res) => {
    try{
        const {email} = req.body
        const lowercaseEmail = email.toLowerCase();    
        var mail = await Users.findOne({email : lowercaseEmail})
        //1. Check Email
        if(mail){
            return res.status(400).send('Email Address Already Exits!!!')
        }else{
            //2. Req Email By id
            const id = req.params.id
            //3. Update By id 
            Users.findOneAndUpdate({_id: id},{email : lowercaseEmail},{new: true}).exec();
            res.status(200).send('Change Email Address Success')
        }
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.VerifyPhoneOTP = async (req,res) => {
    try {
        const {username , phone} = req.body

         // Validate input
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
        await otpRequest.save(); // Ensure this is awaited

        const user = await Users.findOne({username,phone},{new: true}).exec();
        if(!user){
            return res.status(404).send('Phone Number not match or User Not Found')
        }else{
           //res.send(user)
           const otp = generateOTP()  //Send otp to Email
           console.log('Username : ', username, 'Request Phone Number OTP : ',otp)
           
            var payload={
                user:{
                    id : user._id,  
                    otp : otp
                }
           } 
           //Send paylaod to frontend
           res.send(payload) 
           // Implement phone sending logic here
          };
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.ChangePhone = async (req,res) => {
    try{
        const {phone} = req.body    
        var phonenumber = await Users.findOne({phone})
        //1. Check Phone
        if(phonenumber){
            return res.status(400).send('Phone Number Already Exits!!!')
        }else{
            //2. Req Phone By id
            const id = req.params.id
            //3. Update By id 
            Users.findOneAndUpdate({_id: id},{phone},{new: true}).exec();
            res.status(200).send('Change Phone Number Success')
        }
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}

 




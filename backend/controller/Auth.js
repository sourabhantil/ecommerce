const { userModel } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser, sendMail, getHost } = require("../services/common");
const jwt = require("jsonwebtoken");

exports.createUser = async (req,res)=>{
    try{
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword){
            
            const user = new userModel({...req.body,password:hashedPassword,salt});
            const savedUser = await user.save();
            //imp: req.login(argument) it sends the argument to serializer that sets this value to req.user
            // it doesn't verify id and pass just directly set the values to req.user
            // use this function after signup to login the user
            req.login(sanitizeUser(savedUser),(err)=>{
                if(err){
                    res.status(400).json(err);
                }
                else{
                    const token = jwt.sign(sanitizeUser(savedUser),process.env.JWT_SECRET_KEY);
                    res.status(201).cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }).json(req.user);
                }
            });
        })
    }
    catch(err){
        res.status(400).json(err);
    }
}
exports.loginUser = async (req,res)=>{
    //req.user is created by passport.js after user is authenticated
    // TODO: we'll need token to set as cookie on front end
    const user = req.user; //this contains sanitize user and token
    res.status(200).
    cookie('jwt', user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true })
    .json(sanitizeUser(user));
}
exports.checkAuth = async (req,res)=>{
    if(req.user){
        res.status(200).json(req.user);
    }
    else{
        res.sendStatus(500);
    }
}
exports.resetPasswordRequest = async (req,res)=>{
    //let send email and a token in the mail body so we can verify that user has clicked right link
    const {email} = req.body;
    let user = false;
    if(email){
        user = await userModel.findOne({email});
    }
    if(user){
        const token = crypto.randomBytes(48).toString("hex");
        user.resetPasswordToken = token;
        await user.save();
        const to = email;
        const hostlink = getHost(req);
        const resetPageLink = `${hostlink}/reset-password?token=${token}&email=${email}`; 
        const subject = "reset password for e-commerce";
        const html = `<p>click <a href=${resetPageLink}>here</a> to reset your password</p>`
        const text = `visit this link to reset your password ${resetPageLink}`
        const response = await sendMail({to,subject,html,text});
        res.status(200).json(response);
    }
    else{
        res.sendStatus(400);
    }
}
exports.resetPassword = async (req,res)=>{
    const {email,token,password} = req.body;
    let user = false;
    if(email && token){
        user = await userModel.findOne({email,resetPasswordToken:token});
    }
    if(user){
        try{
            const salt = crypto.randomBytes(16);
            crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function(err, hashedPassword){
                user.password = hashedPassword;
                user.salt = salt;
                user.resetPasswordToken = "";
                await user.save();
                const to = email; 
                const subject = "password reset successfull for e-commerce";
                const html = `<p>Please login with your new password</p>`
                const text = `Please login with your new password`
                await sendMail({to,subject,html,text});
                res.status(200).json({message:"success"});
            })
        }
        catch(err){
            res.status(400);
        }
    }
    else{
        res.sendStatus(400);
    }
}

exports.logout = (req,res)=>{
    res.
    cookie('jwt', null, { expires: new Date(Date.now()), httpOnly: true })
    .sendStatus(200);
}
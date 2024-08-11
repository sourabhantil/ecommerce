const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    email: {type: String,required: true, unique : true},
    password : {type: Buffer,required: true},
    role : {type: String,required:true,default:"user"},
    // TODO: we can make a separate schema for address
    addresses : {type: [Schema.Types.Mixed]},
    name : {type : String,default:"anonymous"},
    orders : {type: [Schema.Types.Mixed]},
    salt : Buffer,
    resetPasswordToken: {type: String,default:""}
},{timestamps:true});

// on response it will return _id: objectId("64cb2f15f964d410f2725515") as id : "64cb2f15f964d410f2725515"
// this get calculated at run time only it'll not get saved in the db
const virtual = userSchema.virtual("id");
virtual.get(function (){
    return this._id;
})

userSchema.set("toJSON",{
    virtuals : true,
    versionKey : false,
    transform : function (doc,ret){delete ret._id}
})

exports.userModel = mongoose.model("user",userSchema);
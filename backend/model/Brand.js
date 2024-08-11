const mongoose = require("mongoose");
const {Schema} = mongoose;

const brandSchema = new Schema({
    label: {type: String,required: true, unique : true},
    value : {type: String,required: true, unique: true},
});

// on response it will return _id: objectId("64cb2f15f964d410f2725515") as id : "64cb2f15f964d410f2725515"
// this get calculated at run time only it'll not get saved in the db
const virtual = brandSchema.virtual("id");
virtual.get(function (){
    return this._id;
})

brandSchema.set("toJSON",{
    virtuals : true,
    versionKey : false,
    transform : function (doc,ret){delete ret._id}
})

exports.brandModel = mongoose.model("brand",brandSchema);
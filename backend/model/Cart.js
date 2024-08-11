const mongoose = require("mongoose");
const {Schema} = mongoose;

// TODO: optimize cart schema to store all products in one cart
const cartSchema = new Schema({
    quantity : {type: Number,required:true},
    product : {type: Schema.Types.ObjectId, ref:"product",required:true},
    user : {type: Schema.Types.ObjectId, ref:"user",required:true},
    size : {type: Schema.Types.Mixed},
    color : {type: Schema.Types.Mixed},
});

// on response it will return _id: objectId("64cb2f15f964d410f2725515") as id : "64cb2f15f964d410f2725515"
// this get calculated at run time only it'll not get saved in the db
const virtual = cartSchema.virtual("id");
virtual.get(function (){
    return this._id;
})

cartSchema.set("toJSON",{
    virtuals : true,
    versionKey : false,
    transform : function (doc,ret){delete ret._id}
})

exports.cartModel = mongoose.model("cart",cartSchema);
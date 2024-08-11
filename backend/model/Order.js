const mongoose = require("mongoose");
const {Schema} = mongoose;

const paymentTypes = {
    values: ["card","cash"],
    message : "enum validator failed for payment methods"
}
const orderSchema = new Schema({
    // TODO: we can use items object id then populate it
    items : {type: [Schema.Types.Mixed],required:true},
    totalAmount : {type: Number},
    totalItems : {type: Number},
    user : {type : Schema.Types.ObjectId,ref:"user",required:true},
    paymentMethod: {type:String,required:true,enum: paymentTypes},
    paymentStatus: {type:String,default:"pending"},
    status : {type:String,default:"pending"},
    selectedAddress:{type: Schema.Types.Mixed,required:true},
},
{timestamps:true}
);

// on response it will return _id: objectId("64cb2f15f964d410f2725515") as id : "64cb2f15f964d410f2725515"
// this get calculated at run time only it'll not get saved in the db
const virtual = orderSchema.virtual("id");
virtual.get(function (){
    return this._id;
})

orderSchema.set("toJSON",{
    virtuals : true,
    versionKey : false,
    transform : function (doc,ret){delete ret._id}
})

exports.orderModel = mongoose.model("order",orderSchema);
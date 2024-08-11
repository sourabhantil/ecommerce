const mongoose = require("mongoose");
const {Schema} = mongoose;

const productSchema = new Schema({
    title: {type: String,required: true, unique : true},
    description : {type: String,required: true},
    price : {type: Number,required:true,min:[1,"Wrong min price"],max:[10000,"wrong max price"]},
    discountPercentage : {type: Number,min:[1,"Wrong min discount"],max:[100,"wrong max discount"]},
    rating : {type: Number,default:0,min:[0,"Wrong min rating"],max:[5,"wrong max rating"]},
    stock : {type: Number,required:true,min:[0,"Wrong min stock"],default:0},
    brand : {type: String,required:true},
    category : {type: String,required:true},
    thumbnail : {type: String,required:true},
    images : {type: [String],required:true},
    colors : {type: [Schema.Types.Mixed]},
    sizes : {type: [Schema.Types.Mixed]},
    highlights : {type: [Schema.Types.Mixed]},
    discountPrice : {type: Number},
    deleted : {type: Boolean,default:false},
});

// on response it will return _id: objectId("64cb2f15f964d410f2725515") as id : "64cb2f15f964d410f2725515"
// this get calculated at run time only it'll not get saved in the db
const virtual = productSchema.virtual("id");
virtual.get(function (){
    return this._id;
})

//we cant sort using the virtual fields better to make this field at time of doc creation
// const virtualDiscountPrice = productSchema.virtual("discountPrice");
// virtualDiscountPrice.get(function (){
//     return Math.round(this.price*(1-this.discountPercentage/100));
// })

productSchema.set("toJSON",{
    virtuals : true,
    versionKey : false,
    transform : function (doc,ret){delete ret._id}
})

exports.productModel = mongoose.model("product",productSchema);
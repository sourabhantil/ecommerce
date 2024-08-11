const { cartModel } = require("../model/Cart");

exports.fetchCartByUser = async (req,res)=>{
    const {id} = req.user;
    try{
        const cart = await cartModel.find({user:id}).populate("product");
        res.status(200).json(cart);
    }
    catch(err){
        res.status(400).json(err);
    }

}

exports.addToCart = async (req,res)=>{
    const {id} = req.user;
    const cart = new cartModel({...req.body,user:id});
    try{
        const doc = await cart.save();
        const result = await doc.populate("product");
        return res.status(201).json(result);
    }
    catch(err){
        return res.status(400).json(err);
    }
}

exports.deleteFromCart = async (req,res)=>{
    const {id} = req.params;
    try{
        const cart = await cartModel.findByIdAndDelete(id);
        return res.status(200).json(cart);
    }
    catch(err){
        return res.status(400).json(err);
    }
}

exports.updateCart = async (req,res)=>{
    const {id} = req.params;
    try{
        const cart = await cartModel.findByIdAndUpdate(id,req.body,{new:true});
        const result = await cart.populate("product");
        return res.status(201).json(result);
    }
    catch(err){
        return res.status(400).json(err);
    }
}
const { userModel } = require("../model/User");

exports.fetchUserById = async (req,res)=>{
    const {id} = req.user;
    try{
        // we are only fetching required fields from db : name,email,id,role,addresses,orders
        //or we can filter user by deleting sensitive data
        const user = await userModel.findById(id,"name email role addresses orders");
        // TODO: dont send id to frontEnd
        res.status(200).json(user);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.updateUser = async (req,res)=>{
    const {id} = req.user;
    try{
        const user = await userModel.findByIdAndUpdate(id,req.body,{new:true});
        return res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role,orders:user.orders});
    }
    catch(err){
        return res.status(400).json(err);
    }
}
const { brandModel } = require("../model/Brand")

exports.fetchBrands = async (req,res)=>{

    try{
        const brands = await brandModel.find({});
        res.status(200).json(brands);
    }
    catch(err){
        res.status(400).json(err);
    }

}

exports.createBrand = async (req,res)=>{
    const brand = new brandModel(req.body);
    try{
        const doc = await brand.save();
        return res.status(201).json(doc);
    }
    catch(err){
        return res.status(400).json(err);
    }
}
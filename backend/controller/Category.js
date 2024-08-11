const { categoryModel } = require("../model/Category");

exports.fetchCategories = async (req,res)=>{

    try{
        const categories = await categoryModel.find({});
        res.status(200).json(categories);
    }
    catch(err){
        res.status(400).json(err);
    }

}

exports.createCategory = async (req,res)=>{
    const category = new categoryModel(req.body);
    try{
        const doc = await category.save();
        return res.status(201).json(doc);
    }
    catch(err){
        return res.status(400).json(err);
    }
}
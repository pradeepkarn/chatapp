const db = require("../models/index.js");
//create main models
const Product = db.products
// const Review = db.reviews

//main works

//create product
const addProduct = async (req, res)=>{
    console.log(req.body)

    // let info = 
    // console.log(info)
    const product = await Product.create({
        title : req.body.title,
        price : req.body.price,
        description : req.body.description,
        published: req.body.published ? req.body.published : false
    });
    res.status(200).send(product)

    console.log(product)
}

//get products all or limited by columns
const getAllProducts = async (req,res)=>{
    //for all data
    let product = await Product.findAll({});
    //for title and price only
    // let product = await Product.findAll({
    //     attributes : [
    //         'title',
    //         'price'
    //     ]
    // })
    res.status(200).send(product)
}

//get one product

const getOneProduct = async (req,res)=>{
    let id = req.params.id
    let product = await Product.findeOne({where : {id:id}})
    res.status(200).send(product)
}

//update product

const updateProduct = async (req,res)=>{
    let id = req.params.id
    let product = await Product.update(req.body, {where : {id:id}})
    res.status(200).send(product)
}


//delete product

const deleteProduct = async (req,res)=>{
    let id = req.params.id
    await Product.destroy({where : {id:id}})
    res.status(200).send("Product is deleted")
}

//publish product

const getPublishedProduct = async (req,res)=>{
    let products = await Product.findAll({where : {published: true}});
    res.status(200).send(products)
}



module.exports = {
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    getPublishedProduct
}
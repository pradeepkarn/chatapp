const db = require("../models/index.js");
//create main models
const jwt = require('jsonwebtoken')
const User = db.users
//main works

// sign up
const signUp = async (req, res)=>{
    const signUpData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile : req.body.mobile,
        password : req.body.password,
        token: null,
        active: 1
    }
    if (req.body.mobile=="") {
        const data = {status:false,msg:"Empty mobile number is not allowed",data:null}
        res.status(200).send(data)
        return;
    }
    let userExist = await User.findOne({where : {mobile:req.body.mobile}})
    if (userExist) {
        const data = {status:false,msg:"User already registered",data:null}
        res.status(200).send(data)
        return;
    }else{
        const user = await User.create(signUpData);
        if (user) {
            const data = {status:true,msg:"Signup success",data:signUpData}
            res.status(200).send(data)
        }else{
            const data = {status:false,msg:"Signup failed",data:null}
            res.status(200).send(data)
        }
        return;
    }
}

// get products all or limited by columns
// const getAllUser = async (req,res)=>{
//     let user = await User.findAll({});
//     res.status(200).send(user)
// }

// get one user

// const getOneUser = async (req,res)=>{
//     let id = req.params.id
//     let user = await User.findeOne({where : {id:id}})
//     res.status(200).send(user)
// }

const logIn = async (req,res)=>{
    let mobile = req.body.mobile
    let password = req.body.password
    if (mobile && password) {
        let user = await User.findOne({where : {mobile:mobile,password:password}})
        if (user) {
            const token = jwt.sign({userId: user.id},
                process.env.JWT_SECRET_KEY, {expiresIn: "5d"}
                )
                //update token after sign in
            await User.update({token:token}, {where : {id:user.id}})
            //create response user
            const responeUser = {
                token: token
            }
            //create response object
            const data = {status:true,msg:"User found",data:responeUser}
            //send data after success sign in
            res.status(200).send(data)
            return;
        }else{
            //send data after failed sign in
            const data = {status:false,msg:"User not found",data:null}
            res.status(200).send(data)
            return;
        }
        
    }else{
        res.status(200).send("All fields are mandetory")
        return;
    }
    
}


const logInViaToken = async (req,res)=>{
    let token = req.body.token
    if (token) {
        let user = await User.findOne({where : {token:token}})
        if (user) {
            //create response user
            const responeUser = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                mobile: user.mobile,
                image: user.image,
                gender: user.gender,
                dob: user.dob,
                country: user.country,
                level: user.level,
                token: token
            }
            //create response object
            const data = {status:true,msg:"User found",data:responeUser}
            //send data after success sign in
            res.status(200).send(data)
        }else{
            //send data after failed sign in
            const data = {status:false,msg:"User not found",data:null}
            res.status(200).send(data)
        }
        
    }else{
        res.status(200).send("All fields are mandetory")
    }
    
}
//update user

// const updateUser = async (req,res)=>{
//     let id = req.params.id
//     let user = await User.update(req.body, {where : {id:id}})
//     res.status(200).send(user)
// }


//delete user

// const deleteUser = async (req,res)=>{
//     let id = req.params.id
//     await User.destroy({where : {id:id}})
//     res.status(200).send("User is deleted")
// }

//publish user

// const getActiveUser = async (req,res)=>{
//     let user = await User.findAll({where : {active: true}});
//     res.status(200).send(user)
// }



module.exports = {
    logIn,
    logInViaToken,
    signUp
}
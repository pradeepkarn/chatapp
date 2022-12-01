const db = require("../models/index.js");
const path = require("path")
const multer = require("multer")
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
        // is_admin : req.body.is_admin,
        token: null,
        active: 1
    }
    if (req.body.mobile=="") {
        const data = {status:false,msg:"Empty mobile number is not allowed",data:null}
        res.status(200).json(data)
        return;
    }
    let userExist = await User.findOne({where : {mobile:req.body.mobile}})
    if (userExist) {
        const data = {status:false,msg:"User already registered",data:null}
        res.status(200).json(data)
        return;
    }else{
        const user = await User.create(signUpData);
        if (user) {
            const data = {status:true,msg:"Signup success",data:signUpData}
            res.status(200).json(data)
        }else{
            const data = {status:false,msg:"Signup failed",data:null}
            res.status(200).json(data)
        }
        return;
    }
}


 

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
            //json data after success sign in
            res.status(200).json(data)
            return;
        }else{
            //json data after failed sign in
            const data = {status:false,msg:"User not found",data:null}
            res.status(200).json(data)
            return;
        }
        
    }else{
        res.status(200).json("All fields are mandetory")
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
                cover_image: user.cover_image,
                gender: user.gender,
                dob: user.dob,
                country: user.country,
                bio: user.bio,
                level: user.level,
                token: token
            }
            //create response object
            const data = {status:true,msg:"User found",data:responeUser}
            //json data after success sign in
            res.status(200).json(data)
        }else{
            //json data after failed sign in
            const data = {status:false,msg:"User not found",data:null}
            res.status(200).json(data)
        }
        
    }else{
        res.status(200).json("All fields are mandetory")
    }
    
}

const getProfileById = async (req,res)=>{
    let token = req.body.id
    if (token) {
        let user = await User.findOne({where : {id:id}})
        if (user) {
            //create response user
            const responeUser = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                mobile: user.mobile,
                image: user.image,
                cover_image: user.cover_image,
                gender: user.gender,
                dob: user.dob,
                country: user.country,
                bio: user.bio,
                level: user.level
            }
            //create response object
            const data = {status:true,msg:"User found",data:responeUser}
            //json data after success sign in
            res.status(200).json(data)
        }else{
            //json data after failed sign in
            const data = {status:false,msg:"User not found",data:null}
            res.status(200).json(data)
        }
        
    }else{
        res.status(200).json("All fields are mandetory")
    }
    
}

const profileEdit = async (req,res)=>{
    let token = req.body.token
    const edit = req.body;
    if (token) {
        let user = await User.findOne({where : {token:token}})
        if (user) {
            //create response user
            const updateUserData = {
                first_name: edit.first_name?edit.first_name:user.first_name,
                last_name: edit.last_name?edit.last_name:user.last_name,
                image: edit.image?edit.image:user.image,
                gender: edit.gender?edit.gender:user.gender,
                dob: edit.dob?edit.dob:user.dob,
                country: edit.country?edit.country:user.country,
                bio: edit.bio?edit.bio:user.bio,
            }
            //update user if not null
            
            //json data after success sign in
            User.update(updateUserData, {where : {token:token}})
            if (user) {
                
                const data = {status:true,msg:"Updated",data:null}
                res.status(200).json(data)
            }else{
                const data = {status:false,msg:"Not updated",data:null}
                res.status(200).json(data)
            }
            return;
        }else{
            //json data after failed sign in
            const data = {status:false,msg:"User not found",data:null}
            res.status(200).json(data)
        }
        
    }else{
        const data = {status:false,msg:"Invali token",data:null}
        res.status(200).json(data)
    }
    
}


const profilePasswordReset = async (req,res)=>{
    let token = req.body.token
    const edit = req.body;
    if (token) {
        let user = await User.findOne({where : {token:token}})
        if (user) {
            //create response user
            const updateUserData = {
                first_name: edit.first_name?edit.first_name:user.first_name,
                last_name: edit.last_name?edit.last_name:user.last_name,
                image: edit.image?edit.image:user.image,
                gender: edit.gender?edit.gender:user.gender,
                dob: edit.dob?edit.dob:user.dob,
                country: edit.country?edit.country:user.country,
            }
            //update user if not null
            
            //json data after success sign in
            User.update(updateUserData, {where : {token:token}})
            if (user) {
                
                const data = {status:true,msg:"Updated",data:null}
                res.status(200).json(data)
            }else{
                const data = {status:false,msg:"Not updated",data:null}
                res.status(200).json(data)
            }
            return;
        }else{
            //json data after failed sign in
            const data = {status:false,msg:"User not found",data:null}
            res.status(200).json(data)
        }
        
    }else{
        const data = {status:false,msg:"Invali token",data:null}
        res.status(200).json(data)
    }
    
}

const coverUpload = async (req,res)=>{
    const User = db.users
    const token = req.body.token;
    const imageName = req.file.filename;
    
    if (token) {
      let user = await User.findOne({where : {token:token}})
      if (user) {
          //create response user
          const updateUserData = {
              cover_image: imageName?imageName:user.cover_image
          }
          //update user if not null
          
          //json data after success sign in
          User.update(updateUserData, {where : {token:token}})
          if (user) {
            try {
              var fs = require('fs');
              var filePathToUnlink = __dirname+`/../static/media/covers/${user.cover_image}`; 
              fs.unlinkSync(filePathToUnlink);
            } catch (error) {
              console.error('there was an error:', error.message);
            }
              const data = {status:true,msg:"Updated",data:imageName}
              res.status(200).json(data)
          }else{
            try {
              var fs = require('fs');
              var filePathToUnlink = __dirname+`/../static/media/covers/${imageName}`; 
              fs.unlinkSync(filePathToUnlink);
            } catch (error) {
              console.error('there was an error:', error.message);
            }
              const data = {status:false,msg:"Not updated",data:null}
              res.status(200).json(data)
          }
          return;
      }else{
        const data = {status:true,msg:"Invalid token",data:null}
        return res.status(200).json(data)
      }
    }
    const data = {status:true,msg:"You are not logged in",data:null}
    return res.status(200).json(data)
}


// const addFriend = async (req,res)=>{
//     let token = req.body.token
//     const edit = req.body;
//     if (token) {
//         let user = await User.findOne({where : {token:token}})
//         if (user) {
//             //create response user
//             const updateUserData = {
//                 first_name: edit.first_name?edit.first_name:user.first_name,
//                 last_name: edit.last_name?edit.last_name:user.last_name,
//                 image: edit.image?edit.image:user.image,
//                 gender: edit.gender?edit.gender:user.gender,
//                 dob: edit.dob?edit.dob:user.dob,
//                 country: edit.country?edit.country:user.country,
//             }
//             //update user if not null
            
//             //json data after success sign in
//             User.update(updateUserData, {where : {token:token}})
//             if (user) {
                
//                 const data = {status:true,msg:"Updated",data:null}
//                 res.status(200).json(data)
//             }else{
//                 const data = {status:false,msg:"Not updated",data:null}
//                 res.status(200).json(data)
//             }
//             return;
//         }else{
//             //json data after failed sign in
//             const data = {status:false,msg:"User not found",data:null}
//             res.status(200).json(data)
//         }
        
//     }else{
//         const data = {status:false,msg:"Invali token",data:null}
//         res.status(200).json(data)
//     }
    
// }
   
  

  

    


//update user

// const updateUser = async (req,res)=>{
//     let id = req.params.id
//     let user = await User.update(req.body, {where : {id:id}})
//     res.status(200).json(user)
// }


//delete user

// const deleteUser = async (req,res)=>{
//     let id = req.params.id
//     await User.destroy({where : {id:id}})
//     res.status(200).json("User is deleted")
// }

//publish user

// const getActiveUser = async (req,res)=>{
//     let user = await User.findAll({where : {active: true}});
//     res.status(200).json(user)
// }



module.exports = {
    logIn,
    logInViaToken,
    signUp,
    profileEdit,
    coverUpload
}
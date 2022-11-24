const db = require("../models/index.js");
const Follow = db.follows
const User = db.users
//main works

const d = new Date();
let dateText = d.toISOString();


const requestFollow = async (req,res)=>{
    const token = req.body.token
    const follow_to_id = req.body.follow_to_id;
    if (token && follow_to_id) {
        let user = await User.findOne({where : {token:token}})
        let follow = await User.findOne({where : {id:follow_id}})
        if (!follow) {
            const data = {status:true,msg:"Person does not exist",data:null}
            res.status(200).json(data)
            return;
        }
        if (follow_to_id==user.id) {
            const data = {status:true,msg:"You can not send follow request to yourself",data:null}
            res.status(200).json(data)
            return;
        }
        if (user) {
            try {
                const addfollowListData = {
                    myid: user.id,
                    follower_id: follow_to_id,
                    group: "follow"
                }
                let FollowRequestExists = await Follow.findOne({where : {myid: user.id, follower_id:user.id, group:"follow"}})
                let FollowExists = await Follow.findOne({where : {myid: follow_to_id, follower_id: user.id, group:"follow"}})
                if (FollowRequestExists) {
                    var status = FollowRequestExists.status
                    await Follow.update({updatedAt: dateText}, {where : {id:FollowRequestExists.id}})
                    const data = {status:true,msg:`You already have sent follow request and status is ${status}`,data:null}
                    res.status(200).json(data)
                    return;
                }
                if (FollowExists) {
                    var status = FollowExists.status
                    await Follow.update({updatedAt: dateText}, {where : {id:FollowExists.id}})
                    const data = {status:true,msg:`You already have connected with this user and status is ${status}`,data:null}
                    res.status(200).json(data)
                    return;
                }
                const newfollow = Follow.create(addfollowListData)
                if (newfollow) {
                    const data = {status:true,msg:"Request sent, wait for approval",data:null}
                    res.status(200).json(data)
                }else{
                    const data = {status:false,msg:"Not updated",data:null}
                    res.status(200).json(data)
                }
                return;
            } catch (error) {
                console.log(error)
                const data = {status:false,msg:"Something went wrong",data:null}
                res.status(200).json(data)
                return;
            }
        }else{
            const data = {status:false,msg:"You are not logged in",data:null}
            res.status(200).json(data)
            return;
        }
        
    }else{
        const data = {status:false,msg:"Invalid token or follow's id",data:null}
        res.status(200).json(data)
    }
    
}
   





  
module.exports = {
    requestFollow
}

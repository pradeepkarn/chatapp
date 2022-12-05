const db = require("../models/index.js");
const Follow = db.friends
const User = db.users
//main works

const d = new Date();
let dateText = d.toISOString();


const requestFollow = async (req,res)=>{
    const token = req.body.token
    const follow_to_id = req.body.follow_to_id;
    if (token && follow_to_id) {
        let user = await User.findOne({where : {token:token}})
        let follow = await User.findOne({where : {id:follow_to_id}})
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
                    myid: follow_to_id,
                    friend_id: user.id,
                    group: "follow",
                    status: "accepted"
                }
                // let FollowRequestExists = await Follow.findOne({where : {myid: user.id, follower_id:user.id, group:"follow"}})
                let FollowExists = await Follow.findOne({where : {myid: follow_to_id, friend_id: user.id, group:"follow"}})
                // if (FollowRequestExists) {
                //     var status = FollowRequestExists.status
                //     await Follow.update({updatedAt: dateText}, {where : {id:FollowRequestExists.id}})
                //     const data = {status:true,msg:`You already have sent follow request and status is ${status}`,data:null}
                //     res.status(200).json(data)
                //     return;
                // }
                if (FollowExists) {
                    var status = FollowExists.status
                    await Follow.update({updatedAt: dateText}, {where : {id:FollowExists.id}})
                    const data = {status:true,msg:`You already are following ${follow.first_name} ${follow.last_name} and status is ${status}`,data:null}
                    res.status(200).json(data)
                    return;
                }
                const newfollow = Follow.create(addfollowListData)
                if (newfollow) {
                    const data = {status:true,msg:`Congartulations!, you are following ${follow.first_name} ${follow.last_name} now.`,data:null}
                    res.status(200).json(data)
                }else{
                    const data = {status:false,msg:"Request failed",data:null}
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
        const data = {status:false,msg:"Invalid token or follow to id",data:null}
        res.status(200).json(data)
    }
    
}

const unFollow = async (req,res)=>{
    const token = req.body.token
    const follow_id = req.body.follow_id;
    var msg = "";
    if (token && follow_id) {
        const me = await User.findOne({where : {token:token}})
        if (me) {
            try {
                let i_had_requested = await Follow.findOne({where : {myid: me.id, friend_id: follow_id, group:"follow"}})
                if (i_had_requested) {
                    await Follow.destroy({where : {id:i_had_requested.id}})
                    msg = "removed him/her from your"
                    const data = {status:true,msg: `You have ${msg} follower list`,data:null}
                    res.status(200).json(data)
                    return;
                }
                let i_was_requested = await Follow.findOne({where : {myid: follow_id, friend_id:me.id, group:"follow"}})
                if (i_was_requested) {
                    await Follow.destroy({where : {id:i_was_requested.id}})
                    msg = "left out from his/her"
                    const data = {status:true, msg: `You have ${msg} follower list`,data:null}
                    res.status(200).json(data)
                    return;
                }else{
                    const data = {status:false, msg: `following does not exist`,data:null}
                    res.status(200).json(data)
                    return;
                }
                
            } catch (error) {
                console.log(error)
                const data = {status:false, msg:"Something went wrong",data:null}
                res.status(200).json(data)
                return;
            }
        }else{
            const data = {status:false, msg:"You are not logged in",data:null}
            res.status(200).json(data)
            return;
        }
        
    }else{
        const data = {status:false,msg:"Invalid token",data:null}
        res.status(200).json(data)
    }
    
}
  
module.exports = {
    requestFollow,
    unFollow
}

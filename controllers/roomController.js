const db = require("../models/index.js");
//create main models
const Room = db.rooms

const addRoom = async (req, res)=>{
    let roomExist = await Room.findOne({where : {room_name:req.body.room_name}})
    if (roomExist) {
        const data = {status:false,msg:"This room is already registered",data:null}
        res.status(200).send(data)
        return;
    }else{
        const room = await Room.create({
            room_name : req.body.room_name,
            created_by : req.body.created_by,
            users : req.body.users,
            image : null,
            info : req.body.info,
            active : true,
        });
        const data = {status:true,msg:"Room found",data:room}
        res.status(200).send(data)
    }
}

const getRoom = async (req,res)=>{
    let id = req.params.id
    if (id) {
        let room = await Room.findOne({where : {id:id}})
        if (room) {
            //create response user
            // const responseRoom = {
            //     id: room.id,
            //     room_name: room.room_name,
            //     users: room.users,
            //     image: room.image,
            //     info: room.info,
            //     active: room.active
            // }
            //create response object
            const data = {status:true,msg:"Room found",data:room}
            //send data after success sign in
            res.status(200).send(data)
        }else{
            //send data after failed sign in
            const data = {status:false,msg:"room not found",data:null}
            res.status(200).send(data)
        }
        
    }else{
        res.status(200).send("All fields are mandetory")
    }
    
}

const getAllRooms = async (req,res)=>{
    //for all data
    let rooms = await Room.findAll({});
    const data = {status:true,msg:"Room found",data:rooms}
    res.status(200).send(data)
}

const _getRooms = async ()=>{
    let rooms = await Room.findAll({});
    // return JSON.stringify(rooms);
    return rooms;
}

module.exports = {
    addRoom,
    getRoom,
    getAllRooms,
    _getRooms
}
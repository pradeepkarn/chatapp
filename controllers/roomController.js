const db = require("../models/index.js");
//create main models
const Room = db.rooms

const addRoom = async (req, res)=>{
    const room = await Room.create({
        room_name : req.body.room_name,
        created_by : req.body.created_by,
        users : req.body.users,
        image : null,
        info : req.body.info,
        active : true,
    });
    res.status(200).send(room)
}
module.exports = {
    addRoom,
    
}
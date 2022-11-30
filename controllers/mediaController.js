const db = require("../models/index.js");
//create main models
const Media = db.medias
//main works

//create media
const addMedia = async (req, res)=>{
    
    let imageName = null;
    if (req.file) {
        imageName = req.file.filename;
    }else{
        imageName = null;
    }
    console.log(imageName)
    
      await Media.create({
            obj_id : 0,
            obj : imageName,
            group : "app-banner",
            active : true
        });
        res.redirect('back');
}

//get products all or limited by columns
const getAllAppBanners = async (req,res)=>{
    if (!req.session.token) {
        res.redirect("/")
        res.end();
        return;
      }
    let medias = await Media.findAll({where: { group: "app-banner" }});
    res.render('pages/app-banners',{banners: medias});
}

const destroyMedia = async (req, res)=>{
    if (!req.session.token) {
        res.redirect("/")
        res.end();
        return;
      }
    let media = await Media.findOne({where: { id: req.body.delid }});
    
    if (media) {
        try {
            // console.log(media)
            var fs = require('fs');
            var filePathToUnlink = __dirname+`/../static/media/gallery/${media.obj}`; 
            fs.unlinkSync(filePathToUnlink);
          } catch (error) {
            console.log('there was an error:', error.message);
          }
          try {
            await Media.destroy({where: { id: req.body.delid }});
          } catch (error) {
            console.log('there was an error when deleting media row:', error.message);
          }
    }
    res.redirect('back');
}

//api##############################################################

const getAllAppBannersForApi = async (req,res)=>{
    // if (!req.session.token) {
    //     res.redirect("/")
    //     res.end();
    //     return;
    //   }
    let medias = await Media.findAll({where: { group: "app-banner" }});
    const data = {status:true,msg:"Post created",data:medias}
    res.status(200).json(data)
}
module.exports = {
    addMedia,
    getAllAppBanners,
    destroyMedia,
    getAllAppBannersForApi
}
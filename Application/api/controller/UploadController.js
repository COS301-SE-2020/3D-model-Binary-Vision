const { model } = require("mongoose");
//file creates by: Jacobus Janse van Rensburg
//controller for all the uploads and retrievals as well as the integrating of the c++ program 


const multer = require('multer');

module.exports = {
    

    uploadImages: function(req, res){

        // get the images from the req files 
        const images = req.files;
        if (!images)
        {
            //if no images was sent we handle this by returning a error status 404
            console.log("no images");
            res.status(404);
            return;
        }
        else {
            //there is images and we can do someting with them 
            //just return them for now 
            res.send(images);
        }
    }
}
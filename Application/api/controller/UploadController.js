//file creates by: Jacobus Janse van Rensburg
//controller for all the uploads and retrievals as well as the integrating of the c++ program 

const formidable = require("formidable");
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

module.exports = {
    

    uploadImages: function(req, res){


        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => 
        {
            if(err)
            {
                console.log(err);
                return;
            }
            const images = files;

            if (!images)
            {
                //if no images was sent we handle this by returning a error status 404
                res.status(404).send("no images");
                return;
            }
            else {
                //get image data from disk using path (use fs package)
                //use the file paths to send the images to the c++ program to find the images
                
                //temp store file 
                var dir=""+req.user+"-"+Date.now()
                console.log(dir);
                fs.mkdirSync(dir);
                console.log(images);
                for (let image of images["images[]"] ) {
                    console.log("path: "+image.path+"\tname: "+image.name)
                    fs.copyFileSync(image.path, path.join(dir, image.name));
                }

                //connect c++ program here and send file name when done c++ deletes file 

                // res.send(images);
                res.status(200);
                return;
            }
        }
        );
    }
}
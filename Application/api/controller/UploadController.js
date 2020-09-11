//file creates by: Jacobus Janse van Rensburg
//controller for all the uploads and retrievals as well as the integrating of the c++ program 

const formidable = require("formidable");
const { createModel } = require('mongoose-gridfs');
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');


module.exports = {
    
//================================================================================================
// Function developed by: Jacobus Janse van Rensburg
// Function used to upload multiple images , store them in a temp directory/file and start the c++ program
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
                fs.mkdirSync(dir);
                for (let image of images["images[]"] ) {
                    fs.copyFileSync(image.path, path.join(dir, image.name));
                }

                //connect c++ program here and send file name when done c++ deletes file
                //using spawn as a chid-process 
                const ls = spawn('./smfAlgorithm/Code/main ', [dir]);


                ls.on('close', code=>{
                    if (code ==0 )
                    {
                        //every thing is fine 

                        //check that stl exists and store it in the db
                        //write to the db 
                        //read from disk with directory

                        var stlFile = fs.createReadStream(dir+"/stlFile.stl");
                        const options = ({ filename: req.body.consID , contentType: 'model/stl' });

                        var attachment = createModel();
                        attachment.write(options , stlFile , function(err, saved){

                            if( err)
                            {
                                res.status(500).send("error saving stl file: "+ err);
                            }
                            else{
                                res.status(200);
                            }
                        });

                    }
                    else {
                        res.sendStatus(500);
                    }
                })

                res.status(200);
                return;
            }
        }
        );
    }
}
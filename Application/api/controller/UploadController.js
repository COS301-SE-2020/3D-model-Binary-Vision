//file creates by: Jacobus Janse van Rensburg
//controller for all the uploads and retrievals as well as the integrating of the c++ program 

const formidable = require("formidable");
const { createModel } = require('mongoose-gridfs');
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Console } = require("console");

module.exports = {
    
//================================================================================================
// Function developed by: Jacobus Janse van Rensburg
// Function used to upload multiple images , store them in a temp directory/file and start the c++ program
    uploadImages: function(req, res)
    {
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => 
        {
            if(err)
            {
                console.log(err);
                return;
            }
            const images = files;

            if (!images || isEmpty(images))
            {
                //if no images was sent we handle this by returning a error status 404
                res.status(404).send("no images");
                return;
            }
            else 
            {
                //get image data from disk using path (use fs package)
                //use the file paths to send the images to the c++ program to find the images
                
                //temp store file 
                var f = Date.now();
                var dir="sfmAlgorithm_linux/Executable/imageData/"+req.user+"-"+f;
                fs.mkdirSync(dir);
                for (let image of images["images[]"] ) 
                {
                    fs.copyFileSync(image.path, path.join(dir, image.name));
                }

                //connect c++ program here and send file name when done c++ deletes file
                //using spawn as a chid-process 

                const workingDirectory = "sfmAlgorithm_linux/Executable";
                console.log(workingDirectory);
                var d = req.user+"-"+f;
                
                exec(`./main ${d}`,{ cwd: workingDirectory, shell: true }, (error, stdout, stderr) => {
                    // console.log(stdout);
                    // console.log(stderr);
                    if (error) {
                        console.log(`Process exited with error: ${error.code}`);
                        return res.sendStatus(500);
                    } else {
                        //get stl file and save it to a consultations ID
                        // const stlStream = fs.createReadStream(path.join(dir,"stlFile.stl"));
                        // const Files = createModel();
                        // const options = {
                        //     filename: video.name,
                        //     contentType: video.type
                        //   }
                        // Files.write(options, readStream, (err, file) => {
                        //     if (err) 
                        //     {
                        //         res.send(err);
                        //     }
                        //     else{
                        // 
                        //         const consultation = new Consultation(
                        //         {
                        //             doctor: req.user, // get from session, e.g. cookies
                        //             patient: patient._id,
                        //             STL: file._id,
                        //             Note: "Video Upload"
                        //         });
                        //         consultation.save(function (err) 
                        //         {
                        //             if (err)
                        //             {
                        //               res.send(400);
                        //             }
                        //             res.status(201);
                        //         });
                        //     }
                        // });
                        //remove
                         res.status(200).send("Success");
                         rimraf(dir);
                    }
                });

                
            }
        });
        
        //remove directory to save space
        return;

    }
}


//remove a directory of images to savespace on the server 
/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

//================================================================================================
// Function developed by: Marcus Werren
// Function used to check if images object is empty
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }
  return JSON.stringify(obj) === JSON.stringify({});
}
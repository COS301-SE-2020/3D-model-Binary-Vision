//file creates by: Jacobus Janse van Rensburg
//controller for all the uploads and retrievals as well as the integrating of the c++ program 

const Consultation = require("../model/3DModelModel.js").Consultation;
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
            console.log(fields);

            if(err)
            {
                console.log(err);
                return;
            }
            // console.log(files);
            const images = files;

            if (!images || isEmpty(images))
            {
                //if no images was sent we handle this by returning a error status 404
                console.log("No photos found");
                res.status(404).send(images);
                return;
            }
            else 
            {
                //get image data from disk using path (use fs package)
                //use the file paths to send the images to the c++ program to find the images
                
                //temp store file 
                var f = Date.now();
                var dir="sfmAlgorithm_linux/Executable/imageData/"+req.user+"-"+f+"/";
                // console.log("making directory : "+ dir);
                fs.mkdirSync(dir);
                var  count =0;
                for (let image of images["images[]"] ) 
                {
                    // console.log("Saving image: "+image.name);
                    fs.copyFileSync(image.path, path.join(dir, image.name+"-"+count+".png"));
                    count++;
                }

                console.log("\n\n\n");
                //connect c++ program here and send file name when done c++ deletes file
                //using spawn as a chid-process 

                const workingDirectory = "sfmAlgorithm_linux/Executable/";
                console.log(workingDirectory);
                var d = "sample_test";//req.user+"-"+f;
                
                exec(`./main ${d}`,{ cwd: workingDirectory, shell: true }, (error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(stderr);
                    if (error) {
                        console.log(`Process exited with error: ${error.code}`);
                        
                        //remove created directories
                        // console.log("Deleting directory "+ dir);
                        // rimraf(dir);


                        return res.sendStatus(500);
                    } else {
                        //get stl file and save it to a consultations ID
                        var fileLocation = "sfmAlgorithm_linux/Executable/output_obj/"+d+"/";
                        const objStream = fs.createReadStream(path.join(fileLocation, d+".obj" ));
                        const Files = createModel();
                        const options = {
                            filename: d+".obj",
                            contentType: "text/plain" 
                          }
                        Files.write(options, objStream, (err, file) => {
                            if (err) 
                            {
                                res.send(err);
                                return;
                            }
                            else{
                                const consultation = new Consultation(
                                {
                                    doctor: req.user, // get from session, e.g. cookies
                                    patient: fields.id,
                                    STL: file._id,
                                    Note: "Video Upload"
                                });
                                consultation.save(function (err) 
                                {
                                    if (err)
                                    {
                                      res.status(400);
                                    }
                                    res.status(201);
                                });
                            }
                        });
                        
                        //remove created directories 
                        // console.log("Deleting directory "+ dir);
                        // rimraf(dir);
                        res.status(200).send("Success");
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
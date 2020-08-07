
var stlopen = false;
var videoopen = false;

function newVideo()
{
    if(!videoopen)
    {
        document.getElementById("videoRec").innerHTML = "<hr><h1>Video Recorder</h1><br><br><input type='file' id='UploadVideo' accept='video/mp4'/><input class='btn btn-dark' type='submit' value='Upload Video' onclick='uploadVideo(document.getElementById(" + '"uploadVideo"' + ").files[0])'><br><br><div id='uploadedVideoElement'></div><div id='submitVideoUploadElement'></div><input class='btn btn-dark' type='submit' name='takeVideoStream' value='Stream Video' onclick='takeVideoStream()'/><div id='videoStreamElement'></div><div id='submitVideoStreamElement'></div><div class='footer' style='position: fixed; right: 10px; top: 0; color: black;'><p>Created by:<br>Flap Jacks (University of Pretoria)</p></div>";
    }
    else{
        document.getElementById("videoRec").innerHTML = "";
    }
    
    stlopen = false;
    videoopen = !videoopen;
}

function newSTL()
{
    if(!stlopen)
    {
        document.getElementById("videoRec").innerHTML = "<hr><h1>STL Upload</h1><br><br><input type='file' id='STLUpload'/><input class='btn btn-dark' type='submit' value='Upload Model' onclick='uploadSTL(document.getElementById(" + '"STLUpload"' + ").files[0])'><br><br><div class='footer' style='position: fixed; right: 10px; top: 0; color: black;'><p>Created by:<br>Flap Jacks (University of Pretoria)</p></div>";
    }
    else{
        document.getElementById("videoRec").innerHTML = "";
    }
    
    videoopen = false;
    stlopen = !stlopen;
   
}

function uploadSTL(stl)
{

}
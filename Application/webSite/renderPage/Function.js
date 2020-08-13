
var stlopen = false;
var videoopen = false;

function newVideo()
{
    if(!videoopen)
    {
        /*document.getElementById("videoRec").innerHTML = "<hr><h1>Video Recorder</h1><br><br>";
        document.getElementById("videoRec").innerHTML = "<input type='file' id='UploadVideo' accept='video/mp4'/>";
        document.getElementById("videoRec").innerHTML = "<input class='btn btn-dark' type='submit' value='Upload Video' onclick='uploadVideo(document.getElementById(" + '"uploadVideo"' + ").files[0])'>";
        document.getElementById("videoRec").innerHTML = "<br><br>";
        document.getElementById("videoRec").innerHTML = "<div id='uploadedVideoElement'></div><div id='submitVideoUploadElement'></div>";
        document.getElementById("videoRec").innerHTML = "<input class='btn btn-dark' type='submit' name='takeVideoStream' value='Stream Video' onclick='takeVideoStream()'/>";
        document.getElementById("videoRec").innerHTML = "<div id='videoStreamElement'></div><div id='submitVideoStreamElement'></div>";*/
        document.getElementById("VideoRecorder").style.display = "block";
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
        document.getElementById("videoRec").innerHTML = "<hr><h1>STL Upload</h1><br><br>";
        document.getElementById("videoRec").innerHTML = "<input type='file' id='STLUpload'/>";
        document.getElementById("videoRec").innerHTML = "<input class='btn btn-dark' type='submit' value='Upload Model' onclick='uploadSTL(document.getElementById(" + '"STLUpload"' + ").files[0])'>";
        document.getElementById("videoRec").innerHTML = "<br><br>";
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
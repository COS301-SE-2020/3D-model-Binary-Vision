
var stlopen = false;
var videoopen = false;

function newVideo()
{
    if(!videoopen)
    {
        if(stlopen)
        {
            closeSTL();
        }
        openVideo();
    }
    else
    {
        closeVideo();
    }
}

function newSTL()
{
    if(!stlopen)
    {
        if(videoopen)
        {
            closeVideo();
        }
        openSTL();
    }
    else
    {
        closeSTL();
    }
}

function uploadSTL(stl)
{

}

//================================================================================================================
//All functions below this point were developed by Steven Visser

function openVideo()
{
    document.getElementById("VideoRecorder").style.display = "block";
    videoopen = true;
}

//================================================================================================================

function closeVideo()
{
    document.getElementById("VideoRecorder").style.display = "none";
    videoopen = false;
}

//================================================================================================================

function openSTL()
{
    document.getElementById("STLUploader").style.display = "block";
    stlopen = true;
}

//================================================================================================================

function closeSTL()
{
    document.getElementById("STLUploader").style.display = "none";
    stlopen = false;
}

//================================================================================================================
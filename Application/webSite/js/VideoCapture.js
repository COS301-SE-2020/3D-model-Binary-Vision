// chrome://settings/content/camera

var canvas = document.createElement('canvas'); // Create a canvas so that the video footage can be converted into images

canvas.width = "640";
canvas.height = "480";

//canvas.width = "1280";
//canvas.height = "960";

var images = []; // The array to store the images generated 

//=============================================================================================
//Function Developed by: Marcus Werren
// The main function to upload an video file
function uploadVideo(videoFile) 
{
	cleanElements(); // CLean all the elements 

	// create a new video tag
	var uploadedVideoElement = document.getElementById("uploadedVideoElement");
	uploadedVideoElement.innerHTML = '<video id="uploadedVideo" controls width="320" height="240"></video><br>';

	var uploadedVideo = document.getElementById('uploadedVideo');

	// link the video sent by the user and the video tag
	let videoURL = window.URL.createObjectURL(videoFile);
	uploadedVideo.src = videoURL;

	images = new Array();
	generateImages(document.getElementById("uploadedVideo"));
	//generateImages(document.getElementById("uploadedVideo"));*/

	fetchVideo(uploadedVideo.src).then(blob => 
	{
		sendBlob(blob);
	});
}

//=============================================================================================
//Function Developed by: Marcus Werren
// Send the video blob to the submit function
function sendBlob(blob) 
{
  submitVideo(blob, false); // Submit the video
}

//=============================================================================================
//Function Developed by: Marcus Werren
// Fet the blob of the video
function fetchVideo(url) 
{
  return fetch(url).then(response => {        
	return response.blob();
  });
}

//=============================================================================================
//Function Developed by: Marcus Werren
// The main function to capture the video stream
function takeVideoStream() 
{
	cleanElements(); // CLean all the elements
	
	// Create the start, stop and video elements for the video stream
	var videoStreamElement = document.getElementById("videoStreamElement");
	videoStreamElement.style.display = "block";
	videoStreamElement.innerHTML = '<br><div id="recordButtonsContainer">';
	videoStreamElement.innerHTML += '<button class="btn btn-success" id="startStream" style="position: relative; margin-left: auto;	margin-right: auto;	text-align: center;">Start recording</button>';
	videoStreamElement.innerHTML += '<button class="btn btn-danger" id="stopStream" style="position: relative; margin-left: auto;	margin-right: auto;	text-align: center;">Stop recording</button><div>';
	videoStreamElement.innerHTML += '<br><br><video id="liveVideoStream"></video>';
	videoStreamElement.innerHTML += '<br><br><video id="capturedVideoStream" controls></video>';

	var start = document.getElementById("startStream");
	var stop = document.getElementById("stopStream");

	stop.style.display = "none";

	var liveVideoStream = document.getElementById("liveVideoStream");
	var capturedVideoStream = document.getElementById("capturedVideoStream");
	capturedVideoStream.style.visibility = "hidden"; // Hide the second video element (the captured video element)


	// The constraints for the media
	let constraint = {
		audio: false,
		video: { facingMode: "user" }
	}

	// Handle old browsers that do not support the medie capture API
	if (navigator.mediaDevices == undefined) 
	{
		navigator.mediaDevices = {};
		navigator.mediaDevices.getUserMedia = function(constraintObj) {
			let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if (!getUserMedia) {
				return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
			}
			return new Promise(function(resolve, reject) {
				getUserMedia.call(navigator, constraintObj, resolve, reject);
			});
		}
	} 
	else 
	{ // List all the devices ... this is where we can implement the select video capture device
		navigator.mediaDevices.enumerateDevices().then(devices => 
		{
			devices.forEach(device => 
			{
				console.log(device.kind.toUpperCase(), device.label);
			});
		}).catch( error => 
		{
			console.log(error.name, error.message);
		});
	}

	navigator.mediaDevices.getUserMedia(constraint).then(stream => 
	{
		// Connect the video stream to the the video element
		let video = document.querySelector('video');
		if ("srcObject" in video)
		{
			video.srcObject = stream; // send the stream to the video element
		}
		else
		{
			video.src = window.URL.createObjectURL(stream); //For old browers
		}
			
		video.onloadedmetadata = function(ev) 
		{
			video.play(); // Display the video stream in the video element.
		}

		//store the blobs of the video stream
		let mediaRecorder = new MediaRecorder(stream);
		let recordedBlobs = [];
		var timedInterval;

		// Start recording
		start.addEventListener('click', (ev) => 
		{	
			liveVideoStream.classList.remove("liveVideoStreamScale");
			capturedVideoStream.classList.remove("capturedVideoStreamScale");
			start.style.display = "none";
			stop.style.display = "block";
			mediaRecorder.start();
			console.log(mediaRecorder.state);
			capturedVideoStream.style.visibility = "hidden"; // Hide the second video element (the captured video element)
			document.getElementById("VideoRecorder").style.height = "1000px";
		});

		// Stop recording
		stop.addEventListener('click', (ev)=> 
		{	
			liveVideoStream.classList.add("liveVideoStreamScale");
			capturedVideoStream.classList.add("capturedVideoStreamScale");
			start.style.display = "block";
			stop.style.display = "none";
			mediaRecorder.stop();
			console.log(mediaRecorder.state);
			clearInterval(timedInterval);
		});

		// Record all of the blobs
		mediaRecorder.ondataavailable = function(ev)
		{
			recordedBlobs.push(ev.data);
		};

		// When the stop recoding button is clicked
		mediaRecorder.onstop = (ev)=> 
		{
			let blob = new Blob(recordedBlobs, { 'type': 'video/mp4;'});

			recordedBlobs = [];
			let videoURL = window.URL.createObjectURL(blob);

			capturedVideoStream.style.visibility = "visible"; // Make the captured video element visiable
			capturedVideoStream.src = videoURL;

			images = new Array();
			generateImages(document.getElementById("capturedVideoStream"));

			//console.log(images);

			submitVideo(blob, true); // Submit the video
		};
	}).catch(error => 
	{
		console.log(error.name, error.message);
	});
}

//=============================================================================================
//Function Developed by: Marcus Werren
// This function is the called when the submit button is clicked and will send the captured data from the video recorder
function submitVideo(video, videoStreamed) 
{

	if (!videoStreamed)
	{
		var submitVideoElement = document.getElementById('submitVideoUploadElement');
		submitVideoElement.innerHTML = '<br><button class="btn btn-primary" id="submitVideo">Submit Video</button><br><br><br>';
	}
	else
	{
		var submitVideoElement = document.getElementById('submitVideoStreamElement');
		submitVideoElement.innerHTML = '<br><button class="btn btn-primary" id="submitVideo" style="transform: translateY(-370px);">Submit Video</button><br><br><br>';
		document.getElementById("VideoRecorder").style.height = "1000px";
	}

	var url = window.location.href;
	var parts = url.split("=");
	var bookingID = parts[1];

	const booking = fetch ("/getSingleBooking",{
		method:"POST",
		headers:{'Content-Type': 'application/json; charset=UTF-8'},
		body:JSON.stringify({"booking":bookingID})
	})	

	booking.then(book=>book.json().then(data =>{

		var submitVideoButton = document.getElementById('submitVideo');

		submitVideoButton.addEventListener('click', (ev) => 
		{
			displayModal();
			//alert("ACTION: Video sent (" + video + ")");
			//post method
			var VideoSending = new FormData();
			//will need to append the patient ID / consultation ID to save it in the database "Jaco"	
			//VideoSending.append("video", video); // Append the actual video to the form
			
	
			for (var i=0; i<images.length; i++)
				VideoSending.append('images[]', images[i]); // Append the images to the form
	
			for (var pair of VideoSending.entries()) {
				console.log(pair[1]); 
			}

			VideoSending.append("id",data.patient);
	
			var response = fetch("/uploadImages",{
				method:"POST",
				body: VideoSending
			});
			
			response.then(res=> {
				
				var modalHeader = document.getElementById("renderModalHeader");
				document.getElementById("loadingGif").style.display = "none";

				if (res.status == 200) {
					modalHeader.style.color = "green"; 
					modalHeader.innerHTML = "Model generated successfully!";
				} else {
					modalHeader.style.color = "red";
					modalHeader.innerHTML = "Model failed to be generated!";
				}
				document.getElementById("closeRenderModal").style.display = "block";
			});
		});

	}));

}

//=============================================================================================
//Function Developed by: Marcus Werren
// Function to clean out all fo the elements
function cleanElements() 
{
	var element = document.getElementById('uploadedVideoElement');
	element.innerHTML = "";

	element = document.getElementById('submitVideoUploadElement');
	element.innerHTML = "";

	element = document.getElementById('videoStreamElement');
	element.innerHTML = "";

	element = document.getElementById('submitVideoStreamElement');
	element.innerHTML = "";
}

//=============================================================================================
//Function Developed by: Marcus Werren
// Generate the images form the videos stored in the relavent tags
function generateImages(video) 
{
	var i = 0;

	video.addEventListener('loadeddata', function() 
	{
		this.currentTime = i;
	});

	video.addEventListener('seeked', function() 
	{
		generateImage(i, video);
		i += 0.2; // get an image every 0.5 seconds
		if (i <= this.duration)
		{
			this.currentTime = i;
		}	
	});
}

//=============================================================================================
//Function Developed by: Marcus Werren
// Generate a image at that time stamp i.e. 'i'
function generateImage(i, video) 
{ 
	// Generate and load the image into the canvas
	var context = canvas.getContext('2d');

	// Set the smotthing quality of the image
	context.imageSmoothingEnabled = false;
	context.imageSmoothingQuality = "low";

	//context.drawImage(video, 0, 0, 240, 150);
	context.drawImage(video, 0, 0, 640, 480); // 323.84 KB
	//context.drawImage(video, 0, 0, 1280, 960); // 955.347 KB
	var dataURL = canvas.toDataURL();

	// Create the src's for each image ... probably not needed
	var img = document.createElement('img');
	img.setAttribute('src', dataURL);

	fetch(dataURL)
	.then(function (response) {
		return response.blob();
	})
	.then(function (blob) {
		//console.log("blob.size = " + blob.size);
		//console.log("blob.type = " + blob.type);
		//console.log(blob);
		images.push(blob);
	});
	//document.getElementById('testDraw').appendChild(img);
}

function getPatientID() {
	return "123456789";
}

function displayModal(){
	var modal = document.getElementById("renderModal");
	modal.style.display = "block";
}

function shrinkModal() {
	var modal = document.getElementById("renderModal");
	modal.style.width = "240px";

	var butt = document.getElementById("closeButtonRender");
	butt.style.display = "none";
}

function closeModel() {
	var modalHeader = document.getElementById("renderModalHeader");
	document.getElementById("loadingGif").style.display = "block";

	modalHeader.style.color = "white"; 
	modalHeader.innerHTML = "Generating Teeth Model";

	document.getElementById("renderModal").style.display = "none";

	var modal = document.getElementById("renderModal");
	modal.style.width = "100%";

	var butt = document.getElementById("closeButtonRender");
	butt.style.display = "block";
}
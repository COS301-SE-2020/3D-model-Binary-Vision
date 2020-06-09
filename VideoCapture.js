// chrome://settings/content/camera

// The main function to upload an video file
function uploadVideo(videoFile) {
	cleanElements(); // CLean all the elements

	// create a new video tag
	var uploadedVideoElement = document.getElementById("uploadedVideoElement");
	uploadedVideoElement.innerHTML = '<video id="uploadedVideo" controls></video><br>';

	var uploadedVideo = document.getElementById('uploadedVideo');

	// link the video sent by the user and the video tag
	let videoURL = window.URL.createObjectURL(videoFile);
	uploadedVideo.src = videoURL;

	fetchVideo(uploadedVideo.src).then(blob => {
		sendBlob(blob);
	});
}

function sendBlob(blob) {
  submitVideo(blob, false); // Submit the video
}

function fetchVideo(url) {
  return fetch(url).then(response => {        
    return response.blob();
  });
}

// The main function to capture the video stream
function takeVideoStream() {
	cleanElements(); // CLean all the elements
	
	// Create the start, stop and video elements for the video stream
	var videoStreamElement = document.getElementById("videoStreamElement");
	videoStreamElement.innerHTML = '<br><button id="startStream">Start recording</button>';
	videoStreamElement.innerHTML += '<button id="stopStream">Stop recording</button>';
	videoStreamElement.innerHTML += '<br><br><video></video>';
	videoStreamElement.innerHTML += '<br><br><video id="capturedVideoStream" controls></video>';

	var start = document.getElementById("startStream");
	var stop = document.getElementById("stopStream");
	var capturedVideoStream = document.getElementById("capturedVideoStream");
	capturedVideoStream.style.visibility = "hidden"; // Hide the second video element (the captured video element)


	// The constraints for the media
	let constraint = {
		audio: false,
		video: { facingMode: "user" }
	}

	// Handle old browsers that do not support the medie capture API
	if (navigator.mediaDevices == undefined) {
		/*navigator.mediaDevices = {};
		navigator.mediaDevices.getUserMedia = function(constraintObj) {
			let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if (!getUserMedia) {
				return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
			}
			return new Promise(function(resolve, reject) {
				getUserMedia.call(navigator, constraintObj, resolve, reject);
			});
		}*/
	} else { // List all the devices ... this is where we can implement the select video capture device
		navigator.mediaDevices.enumerateDevices().then(devices => {
			devices.forEach(device => {
				console.log(device.kind.toUpperCase(), device.label);
			});
		}).catch( error => {
			console.log(error.name, error.message);
		});
	}

	navigator.mediaDevices.getUserMedia(constraint).then(stream => {
		// Connect the video stream to the the video element
		let video = document.querySelector('video');
		if ("srcObject" in video)
			video.srcObject = stream; // send the stream to the video element
		else
			video.src = window.URL.createObjectURL(stream); //For old browers

		video.onloadedmetadata = function(ev) {
			video.play(); // Display the video stream in the video element.
		}

		//store the blobs of the video stream
		let mediaRecorder = new MediaRecorder(stream);
		let recordedBlobs = [];

		// Start recording
		start.addEventListener('click', (ev) => {
			mediaRecorder.start();
			console.log(mediaRecorder.state);
			capturedVideoStream.style.visibility = "hidden"; // Hide the second video element (the captured video element)
		});

		// Stop recording
		stop.addEventListener('click', (ev)=> {
			mediaRecorder.stop();
			console.log(mediaRecorder.state);
		});

		// Record all of the blobs
		mediaRecorder.ondataavailable = function(ev) {
			recordedBlobs.push(ev.data);
		};

		// When the stop recoding button is clicked
		mediaRecorder.onstop = (ev)=> {
			let blob = new Blob(recordedBlobs, { 'type': 'video/mp4;'});

			recordedBlobs = [];
			let videoURL = window.URL.createObjectURL(blob);

			capturedVideoStream.style.visibility = "visible"; // Make the captured video element visiable
			capturedVideoStream.src = videoURL;

			submitVideo(blob, true); // Submit the video
		};
	}).catch(error => {
		console.log(error.name, error.message);
	});
}

function submitVideo(video, videoStreamed) {

	if (!videoStreamed)
		var submitVideoElement = document.getElementById('submitVideoUploadElement');
	else
		var submitVideoElement = document.getElementById('submitVideoStreamElement');

	submitVideoElement.innerHTML = '<br><button id="submitVideo">Submit Video</button>';

	var submitVideoButton = document.getElementById('submitVideo');

	submitVideoButton.addEventListener('click', (ev) => {
		alert("ACTION: Video sent (" + video + ")");
	});
}

// Function to clean out all fo the elements
function cleanElements() {
	var element = document.getElementById('uploadedVideoElement');
	element.innerHTML = "";

	element = document.getElementById('submitVideoUploadElement');
	element.innerHTML = "";

	element = document.getElementById('videoStreamElement');
	element.innerHTML = "";

	element = document.getElementById('submitVideoStreamElement');
	element.innerHTML = "";
}
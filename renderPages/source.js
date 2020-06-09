var vertex_data  = [];
var gl_context = null;
var canvas = null;

var location_PVM = null;

var RESOLUTION_WIDTH = 800;
var RESOLUTION_HEIGHT = 600;

var FIELD_OF_VIEW = 70.0;
var nearPlane = 0.001;
var farPlane = 1000;

var shader_program = null;

var projectionMatrix = null;
var viewMatrix = null;
var modelMatrix = null;
var PVM = null;

var deltaTime = 0;
var then = 0;

var vertexPosition = null;
var vertexBuffer = null;


function createModel(_data){
	
	
	convert(_data);
	
	createCanvas();
	initialiseContext();	
	
	gl_context.viewport(0,0, RESOLUTION_WIDTH, RESOLUTION_HEIGHT);
	gl_context.clearColor(0.3,0.3,0.3,1.0);
	
	initialiseShaders();

	
	projectionMatrix = createProjectionMatrix();
	viewMatrix = calculateTransformedMatrix(0.0, 0.0, 0.0);
	modelMatrix = calculateTransformedMatrix(0.0, 0.0, -4.0);

	
		
	PVM = mult(viewMatrix, projectionMatrix);
	PVM = mult(modelMatrix, PVM);
		
	location_PVM = gl_context.getUniformLocation(shader_program, "PVM");
	gl_context.uniformMatrix4fv(location_PVM, false, PVM); 
	
	bindBuffers();
	
	window.requestAnimationFrame(render);
}

//MAIN LOOP
function render(now){
		now *= 0.001;
		deltaTime = now - then;
		then = now;
		gl_context.clear(gl_context.COLOR_BUFFER_BIT | gl_context.DEPTH_BUFFER_BIT);
		
		modelMatrix = rotateMatY(modelMatrix, deltaTime);
		PVM = mult(viewMatrix, projectionMatrix);
		PVM = mult(modelMatrix, PVM);
		
		gl_context.uniformMatrix4fv(location_PVM, false, PVM); 

		gl_context.drawArrays(gl_context.TRIANGLES, 0, vertex_data.length/3);
		
		window.requestAnimationFrame(render);
}

function convert(_data){
	vertex_data = new Float32Array(_data.length);
	for (var i = 0 ; i < _data.length; i++){
		vertex_data[i] = _data[i];
	}
}

function bindBuffers(){
    vertexBuffer = gl_context.createBuffer();
    gl_context.bindBuffer(gl_context.ARRAY_BUFFER, vertexBuffer);
    gl_context.bufferData(gl_context.ARRAY_BUFFER, vertex_data, gl_context.STATIC_DRAW);
	
    vertexPosition = gl_context.getAttribLocation(shader_program, "vPosition");
    gl_context.vertexAttribPointer(vertexPosition, 3, gl_context.FLOAT, false, 0, 0);
    gl_context.enableVertexAttribArray(vertexPosition);
	
}

function createCanvas()
{
canvas = document.createElement('canvas');
canvas.id = "gl_canvas";
canvas.width = RESOLUTION_WIDTH;
canvas.height = RESOLUTION_HEIGHT;
canvas.style.border = "1px solid";
var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);
}

function initialiseContext()
{
	var support_list = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

	for (var i = 0; i < support_list.length; i++) {
		try{
			gl_context = canvas.getContext(support_list[i]);
		} catch(err){
			console.log("browser does not support " + support_list[i]);
		}
		if (gl_context){ return; }
		if (i != support_list.length-1)
		console.log("trying " + support_list[i+1] + " instead...");
		else
		console.log("browser does not support any form of webgl");
	}
}


function initialiseShaders()
{
    var vertexShader = gl_context.createShader( gl_context.VERTEX_SHADER );
	var fragmentShader = gl_context.createShader(gl_context.FRAGMENT_SHADER);
   
    gl_context.shaderSource(vertexShader, vertexShaderCode);
	gl_context.shaderSource( fragmentShader, fragmentShaderCode );
	
    gl_context.compileShader(vertexShader);
    if (!gl_context.getShaderParameter(vertexShader, gl_context.COMPILE_STATUS)) {
            console.log("Vertex shader error: " + gl_context.getShaderInfoLog(vertexShader));
            return;
    }
	
	gl_context.compileShader(fragmentShader);
    if (!gl_context.getShaderParameter(fragmentShader, gl_context.COMPILE_STATUS)) {
            console.log("Fragment shader error: " + gl_context.getShaderInfoLog(fragmentShader));
            return;
    }

    shader_program = gl_context.createProgram();
    gl_context.attachShader(shader_program, vertexShader);
    gl_context.attachShader(shader_program, fragmentShader);
    gl_context.linkProgram(shader_program);
    
    if (!gl_context.getProgramParameter(shader_program, gl_context.LINK_STATUS)) {
            console.log("Program linking error: " + gl_context.getProgramInfoLog(shader_program));
            return;
    }
	gl_context.useProgram(shader_program);
}

var vertexShaderCode =
"attribute vec3 vPosition;																	" + '\n'+
"uniform mat4 PVM;																			" + '\n'+   
"void main() {																				" + '\n'+ 
" 	gl_Position =  PVM * vec4(vPosition, 1.0);												" + '\n'+ 
" }																							";

var fragmentShaderCode =  
"void main() {" + '\n'+ 
"gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);" + '\n'+ 
" }";





//MATH

function calculateTransformedMatrix(x, y, z) {
		return [1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				x, y, z, 1
				];
};

function mult(mat1, mat2){
	var res_mat = [
	(mat1[0]*mat2[0])+(mat1[1]*mat2[4])+(mat1[2]*mat2[8])+(mat1[3]*mat2[12]), (mat1[0]*mat2[1])+(mat1[1]*mat2[5])+(mat1[2]*mat2[9])+(mat1[3]*mat2[13]), (mat1[0]*mat2[2])+(mat1[1]*mat2[6])+(mat1[2]*mat2[10])+(mat1[3]*mat2[14]), (mat1[0]*mat2[3])+(mat1[1]*mat2[7])+(mat1[2]*mat2[11])+(mat1[3]*mat2[15]),
	(mat1[4]*mat2[0])+(mat1[5]*mat2[4])+(mat1[6]*mat2[8])+(mat1[7]*mat2[12]), (mat1[4]*mat2[1])+(mat1[5]*mat2[5])+(mat1[6]*mat2[9])+(mat1[7]*mat2[13]), (mat1[4]*mat2[2])+(mat1[5]*mat2[6])+(mat1[6]*mat2[10])+(mat1[7]*mat2[14]), (mat1[4]*mat2[3])+(mat1[5]*mat2[7])+(mat1[6]*mat2[11])+(mat1[7]*mat2[15]),
	(mat1[8]*mat2[0])+(mat1[9]*mat2[4])+(mat1[10]*mat2[8])+(mat1[11]*mat2[12]), (mat1[8]*mat2[1])+(mat1[9]*mat2[5])+(mat1[10]*mat2[9])+(mat1[11]*mat2[13]), (mat1[8]*mat2[2])+(mat1[9]*mat2[6])+(mat1[10]*mat2[10])+(mat1[11]*mat2[14]), (mat1[8]*mat2[3])+(mat1[9]*mat2[7])+(mat1[10]*mat2[11])+(mat1[11]*mat2[15]),
	(mat1[12]*mat2[0])+(mat1[13]*mat2[4])+(mat1[14]*mat2[8])+(mat1[15]*mat2[12]), (mat1[12]*mat2[1])+(mat1[13]*mat2[5])+(mat1[14]*mat2[9])+(mat1[15]*mat2[13]), (mat1[12]*mat2[2])+(mat1[13]*mat2[6])+(mat1[14]*mat2[10])+(mat1[15]*mat2[14]), (mat1[12]*mat2[3])+(mat1[13]*mat2[7])+(mat1[14]*mat2[11])+(mat1[15]*mat2[15])
	]
	
	return res_mat;
}

function createProjectionMatrix(){
	var aspectRatio =  canvas.width/canvas.height;
	var y_scale = (1.0 / Math.tan(((FIELD_OF_VIEW*Math.PI/180) / 2.0)));
	var x_scale = y_scale / aspectRatio;
	var frustum_length = farPlane - nearPlane;

	var	_projectionMatrix = [
		x_scale, 		0,				 0, 												0,
		0,				y_scale, 		 0, 												0,
		0, 				0, 				 -((farPlane+nearPlane)/frustum_length), 			-1,
		0, 				0,				 -((2*nearPlane*farPlane)/frustum_length),	 		0
		];
	return _projectionMatrix;
}

function rotateMatY(mat, value){
	var cAngle = Math.cos(value);
	var sAngle = Math.sin(value);
	var rotate = [
		cAngle, 0.0, -sAngle, 0.0,
		0.0, 1.0,  0.0, 0.0,
		sAngle, 0.0,  cAngle, 0.0,
		0.0, 0.0,  0.0, 1.0 
	]
	
	return mult(rotate, mat);
}

function getIdentity(){
	return [1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1];
}


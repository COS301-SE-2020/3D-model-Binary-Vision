var vertex_data  = [];
var raw_verticies = [];
var normal_data = [];
var raw_normals = [];
var gl_context = null;
var canvas = null;

var location_PVM = null;
var location_modelMatrix =null;
var location_directionalLight = null;

var RESOLUTION_WIDTH = 800;
var RESOLUTION_HEIGHT = 600;

var FIELD_OF_VIEW = 70.0;
var nearPlane = 0.001;
var farPlane = 1000;

var light_direction = [1.0, -1.0, 1.0];

var shader_program = null;

var projectionMatrix = null;
var viewMatrix = null;
var modelMatrix = null;
var PVM = null;

var deltaTime = 0;
var then = 0;

var vertexPosition = null;
var vertexBuffer = null;
var normalPosition = null;
var normalBuffer = null;


function createModel(_data){
	
	raw_verticies = _data;
	
	createCanvas();
	initialiseContext();	
	
	gl_context.viewport(0,0, RESOLUTION_WIDTH, RESOLUTION_HEIGHT);
	gl_context.clearColor(0.3,0.3,0.3,1.0);
	gl_context.enable(gl_context.DEPTH_TEST);

	
	
	initialiseShaders();

	
	projectionMatrix = createProjectionMatrix();
	viewMatrix = calculateTransformedMatrix(0.0, 0.0, 0.0);
	modelMatrix = calculateTransformedMatrix(0.0, 0.0, -4.0);


	location_PVM = gl_context.getUniformLocation(shader_program, "PVM");
	location_modelMatrix = gl_context.getUniformLocation(shader_program, "modelMatrix");
	location_directionalLight = gl_context.getUniformLocation(shader_program, "directionalLight");
	gl_context.uniform3fv(location_directionalLight, light_direction);


	calculatePVM();
	calculateNormalData();
	convert(_data, raw_normals);
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
		calculatePVM();

		gl_context.drawArrays(gl_context.TRIANGLES, 0, vertex_data.length/3);
		
		window.requestAnimationFrame(render);
}

function convert(_vertexData, _normalData){
	vertex_data = new Float32Array(_vertexData.length);
	for (var i = 0 ; i < _vertexData.length; i++){
		vertex_data[i] = _vertexData[i];
	}
	normal_data = new Float32Array(_normalData.length);
	for (var i = 0 ; i < _normalData.length; i++){
		normal_data[i] = _normalData[i];
	}
}

function bindBuffers(){
    vertexBuffer = gl_context.createBuffer();
    gl_context.bindBuffer(gl_context.ARRAY_BUFFER, vertexBuffer);
    gl_context.bufferData(gl_context.ARRAY_BUFFER, vertex_data, gl_context.STATIC_DRAW);
	
    vertexPosition = gl_context.getAttribLocation(shader_program, "vPosition");
    gl_context.vertexAttribPointer(vertexPosition, 3, gl_context.FLOAT, false, 0, 0);
    gl_context.enableVertexAttribArray(vertexPosition);
	
	
	normalBuffer = gl_context.createBuffer();
    gl_context.bindBuffer(gl_context.ARRAY_BUFFER, normalBuffer);
    gl_context.bufferData(gl_context.ARRAY_BUFFER, normal_data, gl_context.STATIC_DRAW);
	
    normalPosition = gl_context.getAttribLocation(shader_program, "nPosition");
    gl_context.vertexAttribPointer(normalPosition, 3, gl_context.FLOAT, false, 0, 0);
    gl_context.enableVertexAttribArray(normalPosition);
	
}

function pushNormals(vec){
	for (var i =0; i < 3; i++){
	raw_normals.push(vec[0]);
	raw_normals.push(vec[1]);
	raw_normals.push(vec[2]);	
	}
}

function calculateNormalData(){
	var p1, p2, p3;
	for (var i = 0; i < raw_verticies.length/9; i++){
		p1 = [raw_verticies[i*9], raw_verticies[i*9+1], raw_verticies[i*9+2]];
		p2 = [raw_verticies[i*9+3], raw_verticies[i*9+4], raw_verticies[i*9+5]];
		p3 = [raw_verticies[i*9+6], raw_verticies[i*9+7], raw_verticies[i*9+8]];
		pushNormals(calculateNormal(p1, p2, p3));
	}

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
"attribute vec3 nPosition;																	" + '\n'+
"varying vec3 normals;																		" + '\n'+
"varying mat4 outModelMatrix;																" + '\n'+
"uniform mat4 modelMatrix;																	" + '\n'+   
"uniform mat4 PVM;																			" + '\n'+   
"void main() {																				" + '\n'+ 
"	normals = nPosition;																	" + '\n'+ 
"	outModelMatrix = modelMatrix;															" + '\n'+ 
" 	gl_Position =  PVM * vec4(vPosition, 1.0);												" + '\n'+ 
" }																							";

var fragmentShaderCode =  
"precision mediump float; 																	" + '\n'+
"uniform vec3 directionalLight;																" + '\n'+
"varying vec3 normals;																		" + '\n'+
"varying mat4 outModelMatrix;																" + '\n'+
"float diffuse;																				" + '\n'+
"vec3 calcNorm;																				" + '\n'+
"void main() { 																				" + '\n'+
"calcNorm = (outModelMatrix * vec4(normals,0.0)).xyz;										" + '\n'+
"diffuse = max(dot(normalize(calcNorm), -normalize(directionalLight)), 0.0);				" + '\n'+
"gl_FragColor = vec4(diffuse+0.6, diffuse+0.6, diffuse+0.6, 1.0);							" + '\n'+ 
" }																							" ;





//MATH

function calculatePVM(){
	PVM = mult(projectionMatrix, viewMatrix);
	PVM = mult(PVM, modelMatrix);
	gl_context.uniformMatrix4fv(location_PVM, false, PVM); 
	gl_context.uniformMatrix4fv(location_modelMatrix, false, modelMatrix); 
	}

function calculateTransformedMatrix(x, y, z) {
		return [1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				x, y, z, 1
				];
};

function mult(matA, matB){
	var res_mat = [
	(matB[0]*matA[0])+(matB[1]*matA[4])+(matB[2]*matA[8])+(matB[3]*matA[12]), (matB[0]*matA[1])+(matB[1]*matA[5])+(matB[2]*matA[9])+(matB[3]*matA[13]), (matB[0]*matA[2])+(matB[1]*matA[6])+(matB[2]*matA[10])+(matB[3]*matA[14]), (matB[0]*matA[3])+(matB[1]*matA[7])+(matB[2]*matA[11])+(matB[3]*matA[15]),
	(matB[4]*matA[0])+(matB[5]*matA[4])+(matB[6]*matA[8])+(matB[7]*matA[12]), (matB[4]*matA[1])+(matB[5]*matA[5])+(matB[6]*matA[9])+(matB[7]*matA[13]), (matB[4]*matA[2])+(matB[5]*matA[6])+(matB[6]*matA[10])+(matB[7]*matA[14]), (matB[4]*matA[3])+(matB[5]*matA[7])+(matB[6]*matA[11])+(matB[7]*matA[15]),
	(matB[8]*matA[0])+(matB[9]*matA[4])+(matB[10]*matA[8])+(matB[11]*matA[12]), (matB[8]*matA[1])+(matB[9]*matA[5])+(matB[10]*matA[9])+(matB[11]*matA[13]), (matB[8]*matA[2])+(matB[9]*matA[6])+(matB[10]*matA[10])+(matB[11]*matA[14]), (matB[8]*matA[3])+(matB[9]*matA[7])+(matB[10]*matA[11])+(matB[11]*matA[15]),
	(matB[12]*matA[0])+(matB[13]*matA[4])+(matB[14]*matA[8])+(matB[15]*matA[12]), (matB[12]*matA[1])+(matB[13]*matA[5])+(matB[14]*matA[9])+(matB[15]*matA[13]), (matB[12]*matA[2])+(matB[13]*matA[6])+(matB[14]*matA[10])+(matB[15]*matA[14]), (matB[12]*matA[3])+(matB[13]*matA[7])+(matB[14]*matA[11])+(matB[15]*matA[15])
	]
	
	return res_mat;
}


function mult2(mat1, mat2){
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
	var rotate = getIdentity();
	rotate[0] = cAngle;
	rotate[2] = -sAngle;
	rotate[8] = sAngle;
	rotate[10] = cAngle;
	return mult(mat, rotate);
}

function getIdentity(){
	return [1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1];
}


function normalize(n){
	var norm = [];
	var magni = Math.sqrt(n[0]*n[0] + n[1]*n[1] + n[2]*n[2]);
	norm[0] = n[0]/magni;
	norm[1] = n[1]/magni;
	norm[2] = n[2]/magni;
	return norm;
}

function subVec(a, b) {
	var temp = [];
	temp[0] = b[0]-a[0];
	temp[1] = b[1]-a[1];
	temp[2] = b[2]-a[2];
	return temp;
}

function calculateNormal(a, b, c){
var norm = cross(subVec(a,b), subVec(a,c));
return normalize(norm);
}

function dot(a, b){
	return ((a[0]*b[0])+(a[1]*b[1])+(a[2]*b[2]));
}

function cross(a, b){
	var c = [];
	c[0] = a[1]*b[2] - a[2]*b[1];
	c[1] = a[2]*b[0] - a[0]*b[2];
	c[2] = a[0]*b[1] - a[1]*b[0];
	return c;
}

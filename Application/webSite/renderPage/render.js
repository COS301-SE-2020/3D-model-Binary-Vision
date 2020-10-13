//make API calls in there scripts to get the names of the object files, texturews and the mtl file
var objectFile = 'sample_test.obj';
var mtlFile = 'sample_test.mtl';
var assetPath = 'assets/';
//assets/bookingid 

var done = false;

function getUrls()
{
    //this is used to set the paths and object names from the URL    
    var url = window.location.href;
    var parts = url.split("=");
    if(parts.length > 1)
    {
        var consID = parts[1];
        assetPath = 'assets/' + consID + '/';
        objectFile = consID + '.obj';
        mtlFile = consID + '.mtl';
    }
    document.getElementById("returnbutton").href = "../recordPage.html?pid=" + parts[3] + "=" + parts[2];
    run();
}

function run()
{
    //if (!Detector.webgl) {
    //    Detector.addGetWebGLMessage();
    //}
    
    var container;
    
    var camera, controls, scene, renderer;
    var lighting, ambient, keyLight, fillLight, backLight;
    
    if(done == false)
    {
        init();
        animate();
        done = true;
    }
    
    function init() {
    
        container = document.getElementById('outputModule1');
    
        /* Camera */
    
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.z = 6;
        camera.projectionMatrix.scale(new THREE.Vector3(1, -1, 1));
    
        /* Scene */
    
        scene = new THREE.Scene();
        lighting = false;
    
        ambient = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambient);
    
        keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
        keyLight.position.set(-100, 0, 100);
    
        fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
        fillLight.position.set(100, 0, 100);
    
        backLight = new THREE.DirectionalLight(0xffffff, 1.0);
        backLight.position.set(100, 0, -100).normalize();
    
        /* Model */
    
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setBaseUrl(assetPath);
        mtlLoader.setPath(assetPath);
        mtlLoader.load(mtlFile, function (materials) {
    
            materials.side = THREE.DoubleSide;
            materials.preload();
    
           //materials.materials.default.map.magFilter = THREE.NearestFilter;
            //materials.materials.default.map.minFilter = THREE.LinearFilter;
    
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(assetPath);
            objLoader.load(objectFile, function (object) {
                scene.add(object);
            });
    
        });
    
        /* Renderer */
    
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(450, 450);
        renderer.setClearColor(new THREE.Color("lightgray"));
        //renderer.setFaceCulling();
    
        container.appendChild(renderer.domElement);
    
        /* Controls */
    
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target.set( -0.2, -0.6, 1.4 );
        controls.enableDamping = false;
        controls.dampingFactor = 0.01;
        controls.enableZoom = true;
    
        /* Events */
    
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', onKeyboardEvent, false);
    
    }
    
    function onWindowResize() {
    
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize(window.innerWidth, window.innerHeight);
    
    }
    
    function onKeyboardEvent(e) {
    
        if (e.code === 'KeyL') {
    
            lighting = !lighting;
    
            if (lighting) {
    
                ambient.intensity = 0.25;
                scene.add(keyLight);
                scene.add(fillLight);
                scene.add(backLight);
    
            } else {
    
                ambient.intensity = 1.0;
                scene.remove(keyLight);
                scene.remove(fillLight);
                scene.remove(backLight);
    
            }
    
        }
        animate();
    }
    
    function animate() {
    
        requestAnimationFrame(animate);
    
        controls.update();
    
        render();
    
    }
    
    function render() {
    
        renderer.render(scene, camera);
    
    }
}

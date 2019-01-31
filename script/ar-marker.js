"use strict";

let url = new URL (window.location);
let searchParams = new URLSearchParams(url.search);
let context = searchParams.get('show');
let cont_main = document.getElementById("main");
let cont_cam = document.getElementById("camera");

let renderer,
    scene,
    camera,
    container;

let arSource,
    arContext,
    arMarker = [];

let
    mesh;

window.onload = function () {
    if (context && Object.prototype.toString.call(context) === '[object String]' && context === 'camera') {
        cont_main.style.display = "none";
        cont_cam.style.display = "block";
        // background-color for html,body set by css to whitesmoke; this will lay over video/canvas, so:
        document.body.style.backgroundColor = "transparent";
        init();
    }
};

function init(){
    container = cont_cam;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    scene = new THREE.Scene();
    camera = new THREE.Camera();

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    scene.add(camera);
    scene.visible = false;


    mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({
        color: 'red',/*0xFF00FF,*/
        transparent: false,
        opacity: 0.7
    }));
    scene.add(mesh);





    arSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
    });

    arContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: './model/camera_para.dat',
        detectionMode: 'mono',
    });

    arMarker[0] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : './marker/hiro.patt',
        changeMatrixMode: 'cameraTransformMatrix'
    });

    arMarker[1] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : './marker/dele.patt',
        changeMatrixMode: 'cameraTransformMatrix'
    });

    arMarker[2] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : './marker/dele_qr.patt',
        changeMatrixMode: 'cameraTransformMatrix'
    });





    /* handle */
    arSource.init(function(){
        arSource.onResize();
        arSource.copySizeTo(renderer.domElement);

        if(arContext.arController !== null) arSource.copySizeTo(arContext.arController.canvas);

    });

    arContext.init(function onCompleted(){

        camera.projectionMatrix.copy(arContext.getProjectionMatrix());

    });


    render();

}




function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);

    if(arSource.ready === false) return;

    arContext.update(arSource.domElement);
    scene.visible = camera.visible;


    // mesh.rotateX(.1);

}

(function () {

  video = document.createElement('video');
  video.id = 'monitor';

  video.width = window.innerWidth;
  video.height = window.innerHeight
  document.body.appendChild(video)
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  window.URL = window.URL || window.webkitURL;

  var camvideo = document.getElementById('monitor');

  if (!navigator.getUserMedia) {
    alert(
      'Sorry. <code>navigator.getUserMedia()</code> is not available.');
  } else {
    navigator.getUserMedia({video: true, audio: true}, gotStream, noStream);
  }

  function gotStream(stream) {
    if (window.URL) {
      camvideo.src = window.URL.createObjectURL(stream);
    }
    else // Opera
    {
      camvideo.src = stream;
    }

    camvideo.onerror = function (e) {
      stream.stop();
    };

    stream.onended = noStream;
  }

  function noStream(e) {
    var msg = 'No camera available.';
    if (e.code == 1) {
      msg = 'User denied access to use camera.';
    }
    alert(msg);
  }


  var container;
  var camera, controls, scene, renderer;
  var cross;
  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];
    controls.addEventListener('change', render);
    // world
    scene = new THREE.Scene();

    var geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
    var material = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.FlatShading});
    for (var i = 0; i < 500; i++) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = ( Math.random() - 0.5 ) * 1000;
      mesh.position.y = ( Math.random() - 0.5 ) * 1000;
      mesh.position.z = ( Math.random() - 0.5 ) * 1000;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      scene.add(mesh);
    }
    // lights
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);
    light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    scene.add(light);
    light = new THREE.AmbientLight(0x222222);
    scene.add(light);
    // renderer
    renderer = new THREE.WebGLRenderer({antialias: false});

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    ///////////
    // VIDEO //
    ///////////

    // create the video element
    // video = document.createElement( 'video' );
    // // video.id = 'video';
    // // video.type = ' video/ogg; codecs="theora, vorbis" ';
    // video.src = "project.mp4";
    // video.load(); // must call after setting/changing source
    // video.play();

    // alternative method --
    // create DIV in HTML:
    // <video id="myVideo" autoplay style="display:none">
    //      <source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
    // </video>
    // and set JS variable:
    // video = document.getElementById( 'myVideo' );

    videoImage = document.createElement('canvas');
    videoImage.width = window.innerWidth;
    videoImage.height = window.innerHeight;

    videoImageContext = videoImage.getContext('2d');
    // background color if no video present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    movieMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
    // the geometry on which the movie will be displayed;
    //      movie image will be scaled to fit these dimensions.
    movieGeometry = new THREE.PlaneGeometry(2, 2, 0);
    movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    // movieScreen.position.set(0,50,0);
    movieScreen.material.depthTest = false;
    movieScreen.material.depthWrite = false;

/////////////////////////////////////////////////////////////////////////////////
    //          var texture = THREE.ImageUtils.loadTexture( './1.jpg' );
    //  backgroundMesh = new THREE.Mesh(
    //     new THREE.PlaneGeometry(2, 2, 0),
    //     new THREE.MeshBasicMaterial({
    //         map: texture
    //     }));

    // backgroundMesh .material.depthTest = false;
    // backgroundMesh .material.depthWrite = false;

    // Create your background scene
    backgroundScene = new THREE.Scene();
    backgroundCamera = new THREE.Camera();

    backgroundScene.add(backgroundCamera);
    backgroundScene.add(movieScreen);

    //
    window.addEventListener('resize', onWindowResize, false);
    //
    render();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    render();
  }

  function animate() {
    requestAnimationFrame(animate);

    render();


    controls.update();
  }

  function render() {
    renderer.clear();
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      videoImageContext.drawImage(video, 0, 0);
      if (videoTexture)
        videoTexture.needsUpdate = true;
    }

    renderer.autoClear = false;

    renderer.render(backgroundScene, backgroundCamera);
    renderer.render(scene, camera);

  }
})();

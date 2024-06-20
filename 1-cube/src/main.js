import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

window.addEventListener("load", function () {
  init();
});

function init() {
  const options = {
    color: 0x00ffff,
  };
  const renderer = new THREE.WebGLRenderer({
    // alpha: true, // transparent bg
    // 까끌한 계단현상 삭제
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75, // field of view
    window.innerWidth / window.innerHeight, // 종횡비
    1, // near
    500 // far
  );

  // 이거 설정하면 움직일수있음.. 사실카메라가움직이는거임
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.autoRotate = true;
  // controls.autoRotateSpeed = 30;

  // 관성유지시키기..
  controls.enableDamping = true;
  // controls.dampingFactor = 0.01;

  // 얘네 둘은 기본값 트루라서 걍 자동임
  // controls.enableZoom = true;
  // controls.enablePan = true;

  // 최대 최소크기
  // controls.maxDistance = 50;
  // controls.minDistance = 10;

  // 수직방향으로 크기얼마나돌릴수잇는지
  // controls.maxPolarAngle = Math.PI / 2;
  // 수평방향
  // controls.minAzimuthAngle = Math.PI / 3;

  // 이거 설정하면 축 볼수있음
  const axesHelper = new THREE.AxesHelper(5);

  // scene.add(axesHelper);

  // const geometry = new THREE.BoxGeometry(2, 2, 2);

  //다면체 설정
  const cubeGeometry = new THREE.IcosahedronGeometry(1);

  // 조명에 영향을 받지 않는 meterial : mesh
  // 조명에 영향을 받는 meterial : meshstandard
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color(0x00ffff),
    emissive: 0x111111,
    // transparent: true,
    // opacity: 0.5,
    // visible: false,
    // wireframe: true,
    // side: THREE.DoubleSide,
  });

  // material.color = new THREE.Color(0x00c896);

  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  const skeletonGeometry = new THREE.IcosahedronGeometry(2);
  const skeletonMaterital = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    color: 0xaaaaaa,
  });

  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterital);

  scene.add(cube, skeleton);
  // scene.add(skeleton);

  camera.position.z = 5;
  // camera.position.set(3, 4, 5);

  // 카메라가 항상 큐브를 바라보게
  // camera.lookAt(cube.position);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  // directionalLight.position.set(-1, 2, 3);

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

  // ambientLight.position.set(3, 2, 1);
  // scene.add(ambientLight);
  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();

  // render animation 효과

  function render() {
    const elapsedTime = clock.getElapsedTime();

    // cube.rotation.x = elapsedTime;
    // cube.rotation.y = elapsedTime;

    // skeleton.rotation.x = elapsedTime * 1.5;
    // skeleton.rotation.y = elapsedTime * 1.5;

    // radian 기준으로 계산
    // cube.rotation.x = THREE.MathUtils.degToRad(45); // 45도 만큼 회전
    // cube.rotation.x = Date.now() / 1000; // x 축 기준으로 회전
    // cube.rotation.x = clock.getElapsedTime(); // x 축 기준으로 회전 어느프레임 화면에서든 똑같은 모습으로 보이도록
    // cube.rotation.x += clock.getDelta(); // x 축 기준으로 회전 어느프레임 화면에서든 똑같은 모습으로 보이도록
    // cube.position.y = Math.sin(cube.rotation.x);
    // cube.scale.x = Math.cos(cube.rotation.x);

    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(render);
  }

  // 반응형 renderer resizing

  function handleResize() {
    // 큐브 크기비율도 맞춰서 자연스럽게 리사이징
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);

    controls.update();
  }

  window.addEventListener("resize", handleResize);

  const gui = new GUI();

  // gui.add(cube.position, "y", -3, 3, 0.1);
  gui.add(cube.position, "y").min(-3).max(3).step(0.1);
  gui.add(cube, "visible");

  gui.addColor(options, "color").onChange((value) => {
    cube.material.color.set(value);
  });
}

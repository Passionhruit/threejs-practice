import * as THREE from "three";

window.addEventListener("load", function () {
  init();
});

function init() {
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

  const geometry = new THREE.BoxGeometry(2, 2, 2);

  // 조명에 영향을 받지 않는 meterial : mesh
  // 조명에 영향을 받는 meterial : meshstandard
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xcc99ff),
    // transparent: true,
    // opacity: 0.5,
    // visible: false,
    // wireframe: true,
    // side: THREE.DoubleSide,
  });

  material.color = new THREE.Color(0x00c896);

  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  // camera.position.z = 5;
  camera.position.set(3, 4, 5);

  // 카메라가 항상 큐브를 바라보게
  camera.lookAt(cube.position);

  const directionalLight = new THREE.DirectionalLight(0xf0f0f0, 1);

  directionalLight.position.set(-1, 2, 3);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

  ambientLight.position.set(3, 2, 1);
  scene.add(ambientLight);
  scene.add(directionalLight);

  renderer.render(scene, camera);
}

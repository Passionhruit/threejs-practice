import * as THREE from "three";

window.addEventListener("load", function () {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
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

  camera.position.z = 5;

  render();

  // render animation 효과

  function render() {
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  // 반응형 renderer resizing

  function handleResize() {
    // 큐브 크기비율도 맞춰서 자연스럽게 리사이징
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);
}

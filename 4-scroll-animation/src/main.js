import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

window.addEventListener("load", function () {
  init();
});

async function init() {
  gsap.registerPlugin(ScrollTrigger);

  const params = {
    waveColor: "#00ffff",
    backgroundColor: "#ffffff",
  };

  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  /** fog 속성 */

  scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);

  const camera = new THREE.PerspectiveCamera(
    75, // field of view
    window.innerWidth / window.innerHeight, // 종횡비
    1, // near
    500 // far
  );

  camera.position.set(0, 25, 150);

  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150);
  const waveMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: params.waveColor,
  });

  const wave = new THREE.Mesh(waveGeometry, waveMaterial);

  wave.rotation.x = -Math.PI / 2;
  wave.receiveShadow = true;

  // 파도모양만들기

  const waveHeight = 2.5;

  const initialZPositions = [];

  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;

    waveGeometry.attributes.position.setZ(i, z);
    initialZPositions.push(z);
  }

  wave.update = function () {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
      const z =
        initialZPositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight;

      waveGeometry.attributes.position.setZ(i, z);
    }

    waveGeometry.attributes.position.needsUpdate = true;
  };

  scene.add(wave);

  const gltfLoader = new GLTFLoader();

  const gltf = await gltfLoader.loadAsync("./models/ship2/scene.gltf");

  const ship = gltf.scene;

  ship.castShadow = true;

  ship.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
    }
  });

  ship.update = function () {
    const elapsedTime = clock.getElapsedTime();

    ship.position.y = Math.sin(elapsedTime * 3);
  };

  ship.rotation.y = Math.PI;
  ship.scale.set(2, 2, 2);

  scene.add(ship);

  const pointLight = new THREE.PointLight(0xffffff, 1);

  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.radius = 10;

  pointLight.position.set(15, 15, 15);
  scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.radius = 10;

  directionalLight.position.set(-15, 15, 15);
  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();

  // render animation 효과

  function render() {
    wave.update();
    ship.update();

    camera.lookAt(ship.position);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  // 반응형 renderer resizing

  function handleResize() {
    // 큐브 크기비율도 맞춰서 자연스럽게 리사이징
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render();
  }

  window.addEventListener("resize", handleResize);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  tl.to(params, {
    waveColor: "#4268ff",
    onUpdate: () => {
      waveMaterial.color = new THREE.Color(params.waveColor);
    },
    duration: 1.5,
  })
    .to(
      params,
      {
        backgroundColor: "#2a2a2a",
        onUpdate: () => {
          scene.background = new THREE.Color(params.backgroundColor);
        },
        duration: 1.5,
      },
      "<"
    )
    .to(
      params,
      {
        fogColor: "#2f2f2f",
        onUpdate: () => {
          scene.fog.color = new THREE.Color(params.fogColor);
        },
        duration: 1.5,
      },
      "<"
    )
    .to(camera.position, {
      x: 100,
      z: -50,
      duration: 2.5,
    })
    .to(ship.position, {
      z: 150,
      duration: 2,
    })
    .to(camera.position, {
      x: -50,
      y: 25,
      z: 100,
      duration: 2,
    })
    .to(camera.position, {
      x: 0,
      y: 50,
      z: 300,
      duration: 2,
    });

  gsap.to(".title", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".wrapper",
      scrub: true,
      pin: true,
      end: "+=1000",
    },
  });
}

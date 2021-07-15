import * as THREE from "three";
import gsap from "gsap";

const NUMBER_OF_PARTICLES = 13000;

export function addSpaceWarp(scene, layer, gui, MAX_DISTANCE = 40) {
  const Z_DISTANCE = 5;
  const Z_THRESHOLD = 0;
  const textureLoader = new THREE.TextureLoader();

  const pointTexture = textureLoader.load("/textures/circle.png");

  //////////////
  //  Meshes  //
  //////////////

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < NUMBER_OF_PARTICLES; i++) {
    const x =
      Math.random() * MAX_DISTANCE * (Math.round(Math.random()) * 2 - 1);
    const y =
      Math.random() * MAX_DISTANCE * (Math.round(Math.random()) * 2 - 1);
    const z = -Math.random() * Z_DISTANCE - Z_THRESHOLD;

    vertices.push(x, y, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(Float32Array.from(vertices), 3)
  );
  const material = new THREE.PointsMaterial({
    map: pointTexture,
    alphaTest: 0.5,
    transparent: true,
    size: 0.1,
  });
  const pointsMesh = new THREE.Points(geometry, material);
  pointsMesh.layers.set(layer);
  scene.add(pointsMesh);
  gsap.to(pointsMesh.rotation, { duration: 2, z: 0.8 });

  function animate() {
    pointsMesh.rotation.z += 0.0005;

    const ps = pointsMesh.geometry.attributes.position.array;
    for (let i = 2; i < ps.length; i += 3) {
      let tmpZ = ps[i];
      if (tmpZ >= -Z_THRESHOLD) {
        tmpZ = -Math.random() * Z_DISTANCE - Z_THRESHOLD;
      } else {
        tmpZ += 0.01;
      }

      ps[i] = tmpZ;
    }

    pointsMesh.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(ps, 3)
    );
  }

  return animate;
}

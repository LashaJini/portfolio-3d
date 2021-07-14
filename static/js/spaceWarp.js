import * as THREE from "three";
import gsap from "gsap";

export function addSpaceWarp(scene, layer, MAX_DISTANCE = 18) {
  ///////////////
  //  Loaders  //
  ///////////////

  const textureLoader = new THREE.TextureLoader();

  ////////////////
  //  Textures  //
  ////////////////

  const pointTexture = textureLoader.load("/textures/circle.png");

  //////////////
  //  Meshes  //
  //////////////

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 10000; i++) {
    const x =
      Math.random() * MAX_DISTANCE * (Math.round(Math.random()) * 2 - 1);
    const y =
      Math.random() * MAX_DISTANCE * (Math.round(Math.random()) * 2 - 1);
    const z = -Math.random() * MAX_DISTANCE - 0.5;

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
      if (tmpZ >= -0.5) {
        tmpZ = -Math.random() * MAX_DISTANCE - 0.5;
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

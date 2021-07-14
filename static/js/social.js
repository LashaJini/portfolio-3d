import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const colors = {
  githubMesh: "#ffffff",
};

export function addSocialButtons(scene, layer, delay = 0) {
  const socialGroup = new THREE.Group();
  socialGroup.position.z = 1;
  scene.add(socialGroup);

  ///////////////
  //  Loaders  //
  ///////////////

  const gltfLoader = new GLTFLoader();

  //////////////
  //  Models  //
  //////////////

  gltfLoader.load("/models/github.glb", (gltf) => {
    const githubMesh = gltf.scene.children.find(
      (mesh) => mesh.name === "GithubMesh"
    );

    githubMesh.scale.set(15, 15, 15);
    githubMesh.rotation.order = "YXZ";
    githubMesh.material.color.set(colors.githubMesh);

    githubMesh.layers.set(layer);

    socialGroup.add(githubMesh);

    gsap.fromTo(
      githubMesh.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      { ease: "expo.in", delay, duration: 1, x: 15, y: 15, z: 15 }
    );
  });

  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(layer);
  const mouse = new THREE.Vector2();
  const camera = scene.children.find(
    (item) => item.type === "PerspectiveCamera"
  );

  window.addEventListener("click", function (event) {
    mouse.x = (event.clientX / scene.userData.size.width) * 2 - 1;
    mouse.y = -((event.clientY / scene.userData.size.height) * 2 - 1);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(socialGroup.children);
    // console.log(intersects.length, mouse, socialGroup);
    if (intersects.length > 0) {
      const object = intersects[0].object;
      object.material.color = new THREE.Color("green");
    }
  });

  function animate() {
    socialGroup.children.forEach((mesh) => {
      mesh.rotation.y += 0.01;
    });
  }

  return animate;
}

import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { utils } from "./";

const colors = {
  githubMesh: "#ffffff",
  soMesh: "#ffffff",
  twitterMesh: "#ffffff",
  redditMesh: "#ffffff",
  emailMesh: "#ffffff",
  _2dMesh: "#ffffff",
};

const params = {
  size: 0.13,
  height: 0.007,
  curveSegments: 6,
  bevelThickness: 0.004,
  bevelSize: 0.004,
};

const urls = {
  Github: "https://github.com/109149",
  Stackoverflow: "https://stackoverflow.com/users/14414945/109149",
  Twitter: "https://twitter.com/109149qwe",
  Reddit: "https://reddit.com/user/109149",
  Email: "mailto:109149qwe@gmail.com",
  Portfolio2D: "https://109149.rocks"
};

const duration = 1;

export async function addSocialButtons(scene, layer, gui, delay = 0) {
  const folder = gui.addFolder("Social Buttons");
  const socialGroup = new THREE.Group();
  socialGroup.position.z = -2;
  scene.add(socialGroup);

  ///////////////
  //  Loaders  //
  ///////////////

  const gltfLoader = new GLTFLoader();
  const fontLoader = new THREE.FontLoader();

  //////////////
  //  Models  //
  //////////////

  const githubScene = await utils.gltfLoaderPromise(
    gltfLoader,
    "/portfolio-3d/portfolio-3d/models/github.glb"
  );
  const githubMesh = getMesh(githubScene, "Github");
  githubMesh.position.x = -2.5;
  githubMesh.rotation.order = "YXZ";
  githubMesh.material.color.set(colors.githubMesh);
  githubMesh.layers.set(layer);
  socialGroup.add(githubMesh);
  gsap.fromTo(
    githubMesh.scale,
    { x: 0.01, y: 0.01, z: 0.01 },
    { ease: "expo.in", delay, duration, x: 5, y: 5, z: 5 }
  );

  const soScene = await utils.gltfLoaderPromise(gltfLoader, "/portfolio-3d/portfolio-3d/models/so.glb");
  const soMesh = getMesh(soScene, "Stackoverflow");
  soMesh.position.x = -1.5;
  soMesh.rotation.order = "YXZ";
  soMesh.material.color.set(colors.soMesh);
  soMesh.layers.set(layer);
  socialGroup.add(soMesh);
  gsap.fromTo(
    soMesh.scale,
    { x: 0.01, y: 0.01, z: 0.01 },
    { ease: "expo.in", delay: delay + 0.1, duration, x: 8, y: 8, z: 8 }
  );

  const twitterScene = await utils.gltfLoaderPromise(
    gltfLoader,
    "/portfolio-3d/portfolio-3d/models/twitter.glb"
  );
  const twitterMesh = getMesh(twitterScene, "Twitter");
  twitterMesh.position.x = -0.5;
  twitterMesh.rotation.order = "YXZ";
  twitterMesh.material.color.set(colors.twitterMesh);
  twitterMesh.layers.set(layer);
  socialGroup.add(twitterMesh);
  gsap.fromTo(
    twitterMesh.scale,
    { x: 0.01, y: 0.01, z: 0.01 },
    { ease: "expo.in", delay: delay + 0.2, duration, x: 6, y: 6, z: 6 }
  );

  const redditScene = await utils.gltfLoaderPromise(
    gltfLoader,
    "/portfolio-3d/portfolio-3d/models/reddit.glb"
  );
  const redditMesh = getMesh(redditScene, "Reddit");
  redditMesh.position.x = 0.5;
  redditMesh.rotation.order = "YXZ";
  redditMesh.material.color.set(colors.redditMesh);
  redditMesh.layers.set(layer);
  socialGroup.add(redditMesh);
  gsap.fromTo(
    redditMesh.scale,
    { x: 0.01, y: 0.01, z: 0.01 },
    { ease: "expo.in", delay: delay + 0.3, duration, x: 2.5, y: 2.5, z: 2.5 }
  );

  const emailScene = await utils.gltfLoaderPromise(
    gltfLoader,
    "/portfolio-3d/portfolio-3d/models/email.glb"
  );
  const emailMesh = getMesh(emailScene, "Email");
  emailMesh.position.x = 1.5;
  emailMesh.rotation.order = "YXZ";
  emailMesh.material.color.set(colors.emailMesh);
  emailMesh.layers.set(layer);
  socialGroup.add(emailMesh);
  gsap.fromTo(
    emailMesh.scale,
    { x: 0.01, y: 0.01, z: 0.01 },
    { ease: "expo.in", delay: delay + 0.4, duration, x: 2.5, y: 8, z: 2.5 }
  );

  //////////////
  //  Meshes  //
  //////////////

  const font = await utils.fontLoaderPromise(
    fontLoader,
    "/portfolio-3d/portfolio-3d/fonts/alba.typeface.json"
  );
  const _2dGeometry = utils.createTextGeometry(font, params, "2D");
  _2dGeometry.center();
  const _2dMaterial = new THREE.MeshStandardMaterial({ color: colors._2dMesh });
  const _2dMesh = new THREE.Mesh(_2dGeometry, _2dMaterial);
  _2dMesh.name = "Portfolio2D";
  _2dMesh.position.x = 2.5;
  _2dMesh.rotation.order = "YXZ";
  _2dMesh.layers.set(layer);
  socialGroup.add(_2dMesh);
  gsap.fromTo(
    _2dMesh.scale,
    { x: 0.01, y: 0.01, z: 0.01 },
    { ease: "expo.in", delay: delay + 0.5, duration, x: 2.5, y: 2.5, z: 2.5 }
  );

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
    if (intersects.length > 0) {
      const object = intersects[0].object;
      window.open(urls[object.name], "_blank");
    }
  });

  function animate() {
    socialGroup.children.forEach((mesh) => {
      mesh.rotation.y += 0.01;
    });
  }

  ///////////
  //  GUI  //
  ///////////

  const github = folder.addFolder("Github");
  github.add(githubMesh.scale, "x", 0, 10, 0.1);
  github.add(githubMesh.scale, "y", 0, 10, 0.1);
  github.add(githubMesh.scale, "z", 0, 10, 0.1);

  const so = folder.addFolder("Stackoverflow");
  so.add(soMesh.scale, "x", 0, 10, 0.1);
  so.add(soMesh.scale, "y", 0, 10, 0.1);
  so.add(soMesh.scale, "z", 0, 10, 0.1);

  const twitter = folder.addFolder("Twitter");
  twitter.add(twitterMesh.scale, "x", 0, 10, 0.1);
  twitter.add(twitterMesh.scale, "y", 0, 10, 0.1);
  twitter.add(twitterMesh.scale, "z", 0, 10, 0.1);

  const reddit = folder.addFolder("Reddit");
  reddit.add(redditMesh.scale, "x", 0, 10, 0.1);
  reddit.add(redditMesh.scale, "y", 0, 10, 0.1);
  reddit.add(redditMesh.scale, "z", 0, 10, 0.1);

  const email = folder.addFolder("Email");
  email.add(emailMesh.scale, "x", 0, 10, 0.1);
  email.add(emailMesh.scale, "y", 0, 10, 0.1);
  email.add(emailMesh.scale, "z", 0, 10, 0.1);

  const _2d = folder.addFolder("2D");
  utils.addTextGUI(_2dMesh, _2d, params, font);

  return animate;
}

function getMesh(gltf, name) {
  return gltf.scene.children.find((child) => child.name === name);
}

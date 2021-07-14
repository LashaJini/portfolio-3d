import * as THREE from "three";
import * as dat from "dat.gui";
import vertexShader from "../../shaders/glowText/vertex.glsl";
import fragmentShader from "../../shaders/glowText/fragment.glsl";

export async function addGlowingText(scene, layer) {
  const gui = new dat.GUI();
  const params = {
    size: 0.5,
    height: 0.05,
    curveSegments: 6,
    bevelThickness: 0.01,
    bevelSize: 0.004,
  };

  const fontLoader = new THREE.FontLoader();

  function createGeometry(font, text = "Hello") {
    return new THREE.TextGeometry(text, {
      font,
      size: params.size,
      height: params.height,
      curveSegments: params.curveSegments,
      bevelEnabled: true,
      bevelThickness: params.bevelThickness,
      bevelSize: params.bevelSize,
      bevelOffset: 0,
      bevelSegments: 5,
    });
  }

  let fontLoaderPromise = function (path) {
    return new Promise((resolve) => {
      fontLoader.load(path, function (font) {
        const geometry = createGeometry(font);
        geometry.center();
        const material = new THREE.MeshStandardMaterial({ color: "green" });
        const text = new THREE.Mesh(geometry, material);
        text.position.y = 0.5;
        text.layers.set(layer);

        gui.add(params, "size", 0, 1, 0.001).onChange(() => {
          text.geometry.dispose();
          text.geometry = createGeometry(font);
        });
        gui.add(params, "height", 0, 0.1, 0.001).onChange(() => {
          text.geometry.dispose();
          text.geometry = createGeometry(font);
        });
        gui.add(params, "curveSegments", 0, 6, 0.1).onChange(() => {
          text.geometry.dispose();
          text.geometry = createGeometry(font);
        });
        gui.add(params, "bevelThickness", 0, 0.05, 0.001).onChange(() => {
          text.geometry.dispose();
          text.geometry = createGeometry(font);
        });
        gui.add(params, "bevelSize", 0, 0.05, 0.001).onChange(() => {
          text.geometry.dispose();
          text.geometry = createGeometry(font);
        });

        resolve(text);
      });
    });
  };

  const text = await fontLoaderPromise("/fonts/alba.typeface.json");

  return text;
}

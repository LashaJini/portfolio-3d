import * as THREE from "three";

export function createTextGeometry(font, params, text = "Hello") {
  const geometry = new THREE.TextGeometry(text, {
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
  geometry.userData.text = text;

  return geometry;
}

export function gltfLoaderPromise(gltfLoader, path) {
  return new Promise(function (resolve) {
    gltfLoader.load(path, resolve);
  });
}

export function fontLoaderPromise(fontLoader, path) {
  return new Promise(function (resolve) {
    fontLoader.load(path, resolve);
  });
}

export function addTextGUI(textMesh, gui, params, font) {
  const handleChange = (font) => {
    textMesh.geometry.dispose();
    const newGeometry = createTextGeometry(
      font,
      params,
      textMesh.geometry.userData.text
    );
    newGeometry.center();
    textMesh.geometry = newGeometry;
  };

  gui.add(params, "size", 0, 1, 0.001).onChange(() => handleChange(font));
  gui.add(params, "height", 0, 0.1, 0.001).onChange(() => handleChange(font));
  gui
    .add(params, "curveSegments", 0, 6, 0.1)
    .onChange(() => handleChange(font));
  gui
    .add(params, "bevelThickness", 0, 0.05, 0.001)
    .onChange(() => handleChange(font));
  gui
    .add(params, "bevelSize", 0, 0.05, 0.001)
    .onChange(() => handleChange(font));
}

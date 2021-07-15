import * as THREE from "three";
import * as dat from "dat.gui";
import vertexShader from "../../shaders/glowText/vertex.glsl";
import fragmentShader from "../../shaders/glowText/fragment.glsl";
import { utils } from "./";

const params = {
  size: 0.65,
  height: 0.05,
  curveSegments: 6,
  bevelThickness: 0.01,
  bevelSize: 0.004,
};

export async function addGlowingText(scene, layer, text, gui) {
  const folder = gui.addFolder("Text");

  const fontLoader = new THREE.FontLoader();

  const font = await utils.fontLoaderPromise(
    fontLoader,
    "/fonts/alba.typeface.json"
  );

  const geometry = utils.createTextGeometry(font, params, text);
  geometry.center();
  const material = new THREE.MeshStandardMaterial({ color: "green" });
  const textMesh = new THREE.Mesh(geometry, material);
  textMesh.position.set(0, .5, -3);
  textMesh.layers.set(layer);

  utils.addTextGUI(textMesh, folder, params, font);

  return textMesh;
}

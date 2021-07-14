precision mediump float;

uniform sampler2D uBaseTexture;
uniform sampler2D uBloomTexture;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(uBaseTexture, vUv) + texture2D(uBloomTexture, vUv);
}

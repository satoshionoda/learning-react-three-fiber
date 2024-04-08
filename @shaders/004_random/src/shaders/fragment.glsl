varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying float vVisibility;
uniform sampler2D uTexture;
uniform vec3 uMouse;
uniform float uTime;

float random (vec2 st) {
  return fract(sin(dot(st.xy,
  vec2(12.9898 ,78.2338)))*
  43758.5453123);
}

void main() {
  vec2 st = vUv;

  float rnd = random( st );

  vec3 color = vec3(rnd);

  // フラグメントの色を設定
  gl_FragColor = vec4(color, 1.0);
}



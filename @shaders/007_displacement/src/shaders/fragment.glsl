const float PI = 3.1415926535897932384626433832795;
const float DEG2RAD = PI / 180.0;
const float RAD2DEG = 180.0 / PI;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying vec4 vGlPosition;
varying float vVisibility;
uniform float uTime;
uniform vec2 uScreenSize;
uniform float uProgress;
uniform sampler2D uImgA;
uniform sampler2D uImgB;
uniform sampler2D uMask;
uniform bool uShowUV;
uniform float uParam1;
uniform float uParam2;
uniform float uParam3;
uniform float uParam4;


vec2 mirror(vec2 uv) {
  vec2 vec = mod(uv, 2.0);
  return mix(vec, 2.0 - vec, step(1.0, vec));
}

vec2 cover(vec2 uv){
  float aspect = uScreenSize.x / uScreenSize.y;

  vec2 vec = mod(uv, 1.0);
  return vec;
}

void main() {
  float aspect = uScreenSize.x / uScreenSize.y;
  vec2 maskUv = vUv;
  maskUv.y = maskUv.y / aspect;
//  maskUv = maskUv * 2.0 - 1.0;
//  maskUv.x = maskUv.x * aspect;
//  maskUv = mirror(maskUv);
//  maskUv = cover(maskUv);

  vec4 maskColor = texture2D(uMask, maskUv);
  vec2 distortedUv = vUv + (vUv * (maskColor.xy-0.5)) * uParam1;

  //  distortedUv = mirror(distortedUv);
  vec4 finalColor = texture2D(uImgA, distortedUv);
  if (uShowUV){
    finalColor = vec4(distortedUv, 1.0, 1.0);
  }
//  finalColor = maskColor;
  gl_FragColor = finalColor;
}



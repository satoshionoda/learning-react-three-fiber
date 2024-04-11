const float PI = 3.1415926535897932384626433832795;
const float DEG2RAD = PI / 180.0;
const float RAD2DEG = 180.0 / PI;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying vec4 vGlPosition;
varying float vVisibility;
uniform sampler2D uImgA;
uniform sampler2D uImgB;
uniform vec2 uScreenSize;
uniform float uProgress;
uniform bool uShowUV;
uniform float uDistortionAmount;
uniform float uMx1; // frequency
uniform float uMy1; // frequency power
uniform float uMx2;
uniform float uMy2;
uniform float uMx3; // ripple progress
uniform float uMy3;
uniform float uTime;



void main() {
  float aspect = uScreenSize.x / uScreenSize.y;
  vec2 uv = vUv;
  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  vec2 p = uv + vec2(0.0 * aspect, 0.0);
  float d = length(p);
  vec2 ripple = p / d * cos(pow(d, uMy1)*uMx1*100.0+uMx3 * -20.0)*0.03 * uDistortionAmount;
  //  ripple = p / d * cos(d*uMx1*5.0)*0.03 * uDistortionAmount;
  float step = 1.0;
    step = smoothstep(0.01, 1.0, d);
  if(d > 0.2){
    step -= smoothstep(0.2, 3.0, d);
  }
//  float step = 1.0 - smoothstep(0.01, 2.0, d);
//  step *= smoothstep(0.01, 1.0, d) / 2.0;
//  step = 1.0;
  vec2 distortedUv = vUv + ripple * step;
  //
  //  p = uv + vec2(-1.0 * aspect, -1.0);
  //  d = length(p);
  //  ripple = p / d * cos(d*uMx2*5.0+uMy2)*0.03 * uDistortionAmount;
  //  distortedUv += ripple * 0.6;

  vec4 finalColor = texture2D(uImgA, distortedUv);
  if (uShowUV){
    finalColor = vec4(distortedUv, 1.0, 1.0);
  }
  gl_FragColor = finalColor;
}



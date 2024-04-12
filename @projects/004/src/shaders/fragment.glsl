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
uniform sampler2D uImgA;
uniform sampler2D uImgB;
uniform float uProgress;
uniform bool uShowUV;
uniform float uDistortionAmount;
uniform vec2 uRippleCenter;


void main() {
  float aspect = uScreenSize.x / uScreenSize.y;
  vec2 uv = vUv;
  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  vec2 p = uv + vec2(uRippleCenter.x * aspect * -1.0, uRippleCenter.y);
  float d = length(p);
  vec2 ripple = p / d * cos(pow(d, 1.3)*20.0+uTime * -10.0)*0.03 * uDistortionAmount;
  float step = 1.0;
  step = smoothstep(0.01, 1.0, d);
  if(d > 0.2){
    step -= smoothstep(0.2, 3.0, d);
  }
  vec2 distortedUv = vUv + ripple * step;

  vec4 resultA = texture2D(uImgA, distortedUv);
  vec4 resultB = texture2D(uImgB, distortedUv);
  vec4 finalColor = mix(resultA, resultB, uProgress);
  if(uShowUV){
    finalColor = vec4(distortedUv, 1.0, 1.0);
  }
  gl_FragColor = finalColor;
}



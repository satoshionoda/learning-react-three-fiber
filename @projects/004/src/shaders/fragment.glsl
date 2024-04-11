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
uniform float uProgress;
uniform bool uShowUV;
uniform float uDistortionAmount;
uniform float uMx1;
uniform float uMy1;
uniform float uMx2;
uniform float uMy2;
uniform float uMx3;
uniform float uMy3;
uniform float uTime;

const mat4 dm = mat4(
  1.2, 2.1, 3.8, 0.3,
  1.3, 2.5, 3.1, 0.7,
  1.8, 2.6, 3.3, 0.4,
  1.6, 2.2, 3.4, 0.2
);



vec2 distort(vec2 uv, float mx, float my, int m) {
  uv = uv * 2.0 - 1.0;
  float x = uv.x;
  float y = uv.y;
  for (int i = 0; i < 4; i++) {
    x += sin(uv.y * mx * dm[m][i]);
    y += sin(uv.x * my * dm[m][i]);
  }

  uv.x +=  (x-uv.x) /5.0 * uDistortionAmount;
  uv.y +=  (y-uv.y) /5.0 * uDistortionAmount;
  //  uv.y *=0.1;
  uv = (uv + 1.0) / 2.0;
  return uv;
}


void main() {

  //  float offsetX = cos(vUv.y * 100. + uTime) + sin(vUv.y * 100. + uTime);
  //  float offsetY = sin(vUv.x * 100. + uTime) + cos(vUv.x * 100. + uTime);
  //  vec2 uvOffset = vec2(offsetX, offsetY) * 0.00;
//  vec2 p = -1.0 + 2.0 * vUv;
//  float len = length(p);
//  vec2 ripple = vUv + (p/len)*cos(len*12.0*5.0)*0.03 * uDistortionAmount;

  vec2 distortedUv = vUv;
//  distortedUv = ripple;
  distortedUv = distort(distortedUv, uMx1, uMy1, 0);
  distortedUv = distort(distortedUv, uMx2, uMy2, 1);
  distortedUv = distort(distortedUv, uMx3, uMy3, 2);
  vec4 finalColor = texture2D(uImgA, distortedUv);
  if(uShowUV){
    finalColor = vec4(distortedUv, 1.0, 1.0);
  }
  gl_FragColor = finalColor;
}



attribute float colorFactor;
attribute float size;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying float vVisibility;
varying float vColorFactor;
uniform vec3 uMouse;
uniform vec3 uVirtualCursor;
uniform float uDPI;
uniform float uMaxPointSize;
uniform float uMinPointSize;
uniform float uTranslation;
out vec4 fragColor;


#define PI 3.1415926535897932384626433832795

void main() {
  vUv = uv;
  vNormal = normal;
  vPosition = position;
  vColorFactor = colorFactor;

  vec3 newPosition = position;
  newPosition += normal * uTranslation * vColorFactor;

  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vec3 modelViewNormal = normalize(normalMatrix * normal);
  vModelViewNormal = modelViewNormal;
  //    gl_PointSize = vVisibility * (uMaxPointSize - uMinPointSize) + uMinPointSize * uDPI;
  //    gl_PointSize = uPointSize * uDPI;
  gl_PointSize = mix(uMaxPointSize, uMinPointSize, size) * uDPI / max(1.0, uTranslation / 3.0);
  vVisibility = gl_PointSize;
  //
  gl_Position = projectionMatrix * modelViewPosition;
}

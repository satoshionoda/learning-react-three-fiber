//attribute vec3 position;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float visibility;
uniform float time;
uniform float uPointSize;
uniform sampler2D uTexture;
out vec4 fragColor;
void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}

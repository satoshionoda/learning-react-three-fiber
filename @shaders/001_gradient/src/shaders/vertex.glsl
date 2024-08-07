varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uMouse;
uniform vec3 uVirtualCursor;
uniform sampler2D uTexture;
out vec4 fragColor;





void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    vec3 newPosition = position;
    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);

    gl_Position = projectionMatrix * modelViewPosition;
}

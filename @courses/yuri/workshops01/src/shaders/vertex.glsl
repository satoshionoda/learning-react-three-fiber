varying vec2 vUv;
uniform float time;

void main() {
    vUv = uv;
    vec3 newpos = vec3(position.x - 0.5, position.y - 0.5, position.z * sin(time) * 0.1);
    vec4 mvPosition = modelViewMatrix * vec4(newpos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 15.0 * sin(time) + 1.0;
}

varying vec2 vUv;
uniform sampler2D uCurrent;
uniform sampler2D uOriginal;
uniform vec3 uMouse;
uniform float uForceA;
uniform float uForceB;
uniform float uForceSpeed;

void main() {
    vec2 position = texture2D(uCurrent, vUv).xy;
    vec2 original = texture2D(uOriginal, vUv).xy;

    vec2 force = original - uMouse.xy;

    float len = length(force);
    float forceFactor = 1. / max(1., len * uForceA);


    vec2 positionToGo = original + normalize(force) * forceFactor * uForceB;

    position.xy += (positionToGo - position.xy) * uForceSpeed;

    position.xy += normalize(position.xy) * 0.001;


    gl_FragColor = vec4(position, 0.0, 1.0);
}

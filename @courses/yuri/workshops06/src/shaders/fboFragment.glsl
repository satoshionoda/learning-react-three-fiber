varying vec2 vUv;
uniform float uProgress;
uniform float uTime;
uniform sampler2D uCurrent;
uniform sampler2D uOriginalA;
uniform sampler2D uOriginalB;
uniform vec3 uMouse;

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float offset = rand(vUv);
    vec2 position = texture2D(uCurrent, vUv).xy;
    vec2 originalA = texture2D(uOriginalA, vUv).xy;
    vec2 originalB = texture2D(uOriginalB, vUv).xy;
    vec2 velocity = texture2D(uCurrent, vUv).zw;
    velocity *= 0.99;
    //
    vec2 finalOriginal = mix(originalA, originalB, uProgress);

    vec2 direction = normalize(finalOriginal - position);
    float dist = length(finalOriginal - position);
    if (dist > 0.01) {
        velocity += direction * 0.0001;
    }

    // mouse repel force
    float mouseDistance = distance(position, uMouse.xy);
    float maxDistance = 0.1;
    if (mouseDistance < maxDistance) {
        vec2 direction = normalize(position - uMouse.xy);
        velocity += direction * (1.0 - mouseDistance / maxDistance) * 0.001;
    }

    // lifespan of a particle
    float lifespan = 10.;
    float age = mod(uTime + lifespan * offset, lifespan);
    if (age < 0.1) {
        velocity = vec2(0.0, 0.001);
        position.xy = finalOriginal;
    }


    position.xy += velocity;
    gl_FragColor = vec4(position, velocity);
}

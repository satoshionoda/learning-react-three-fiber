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
    vec3 position = texture2D(uCurrent, vUv).xyz;
    vec3 originalA = texture2D(uOriginalA, vUv).xyz;
    vec3 finalOriginal = originalA;
    //    vec3 velocity = texture2D(uCurrent, vUv).zw;
    //    velocity *= 0.99;
    //

    vec3 direction = normalize(finalOriginal - position);
    float dist = length(finalOriginal - position);
    if( dist > 0.01 ) {
        position += direction  * 0.001;
    }

    // mouse repel force
    float mouseDistance = distance( position, uMouse );
    float maxDistance = 0.1;
    if( mouseDistance < maxDistance ) {
        vec3 direction = normalize( position - uMouse );
        position += direction * ( 1.0 - mouseDistance / maxDistance ) * 0.01;
    }


    // lifespan of a particle
    float lifespan = 10.;
    float age = mod( uTime+ lifespan*offset, lifespan );
    if(age<0.1){
        // velocity = vec2(0.0,0.001);
        position.xyz = finalOriginal;
    }


    //    position.xy += velocity;
    gl_FragColor = vec4(position, 1.);
}

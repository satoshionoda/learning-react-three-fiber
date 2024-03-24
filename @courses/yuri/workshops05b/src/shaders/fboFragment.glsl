varying vec2 vUv;
uniform float uProgress;
uniform sampler2D uCurrent;
uniform sampler2D uOriginalA;
uniform sampler2D uOriginalB;
uniform vec3 uMouse;
void main() {
    vec2 position = texture2D( uCurrent, vUv ).xy;
    vec2 originalA = texture2D( uOriginalA, vUv ).xy;
    vec2 originalB = texture2D( uOriginalB, vUv ).xy;
    vec2 velocity = texture2D( uCurrent, vUv ).zw;
    velocity *= 0.8;
    //
    vec2 finalOriginal = mix(originalA, originalB, uProgress);

    vec2 direction = normalize( finalOriginal - position );
    float dist = length( finalOriginal - position );
    if( dist > 0.001 ) {
        velocity += direction  * 0.001;
    }

    position.xy += velocity;
    //
    //    vec2 force = finalOriginal - uMouse.xy;
    //
    //    float len = length(force);
    //    float forceFactor = 1./max(1.,len*50.);
    //
    //
    //    vec2 positionToGo = finalOriginal + normalize(force)*forceFactor *0.3;
    //
    //    position.xy += (positionToGo - position.xy) * 0.05;

//     position.xy += normalize(position.xy ) * 0.001;


    gl_FragColor = vec4( position, velocity);
}

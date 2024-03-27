varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float visibility;
uniform sampler2D uTexture;
uniform float uPointAlpha;
void main() {
    vec2 uv = vUv;
    uv -= vec2(0.5);
    uv *= 2.0;

    // vec3(step(0.5, mod(vUv.x * 10.0, 2.0)))

    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - dot(viewDirection, vNormal);
    vec3 colorA =  vec3(1.000, 0.000, 0.729);
    vec3 colorB =  vec3(0.361, 0.200, 1.000);
    vec3 color = mix(colorB, colorA, fresnel);
//    vec3 aa = mix(0.0, 1.0, fract(viewDirection * 30.0));

    gl_FragColor = vec4(color, 1.0);
}

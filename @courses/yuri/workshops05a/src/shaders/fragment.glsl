varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uPointAlpha;
void main() {
    vec4 color = texture2D( uTexture, vUv );
    gl_FragColor = vec4( 1.,1.,1., uPointAlpha );
    // gl_FragColor = color;
}

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying float vVisibility;
uniform sampler2D uTexture;
uniform vec3 uMouse;


vec4 makeGradient(
    vec4 colorA, vec4 colorB,
    float stepA, float stepB,
    float val
) {
    // valをグラデーションの範囲内に正規化
    float mixFactor = (val - stepA) / (stepB - stepA);
    return vec4(mix(colorA, colorB, mixFactor));
}

// GLSL ES 2.0では関数パラメータの配列にサイズが必要。
#define MAX_POINTS 10

struct GradientPoint {
    vec4 color;
    float position;
};

vec4 makeGradientFromPoints(GradientPoint points[MAX_POINTS], int numPoints, float val) {
    // 最初のポイントよりも小さい場合、最初の色を返す
    if (val <= points[0].position) {
        return points[0].color;
    }
    // valが現在のポイントの位置以下の場合、前のポイントと現在のポイントの間で補間
    for (int i = 1; i < numPoints; ++i) {
        if (val <= points[i].position) {
            return makeGradient(points[i - 1].color, points[i].color, points[i - 1].position, points[i].position, val);
        }
    }
    // valが最後の位置を超えている場合、最後の色を返す
    return points[numPoints - 1].color;
}

void main() {
    GradientPoint colors[MAX_POINTS];
    colors[0] = GradientPoint(vec4(1.0, 0.6353, 0.4196, 1.0), -0.2);
    colors[1] = GradientPoint(vec4(0.5294, 0.3725, 0.6039, 1.0), 0.7);
    colors[2] = GradientPoint(vec4(0.6431, 0.2039, 0.3647, 1.0), 1.5);
    const int numColors = 3;
    float gradientPosition = (vUv.x + vUv.y) / 2.0;
    vec4 gradient = makeGradientFromPoints(colors, numColors, gradientPosition);
    gl_FragColor = gradient;
}



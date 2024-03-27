varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying float vVisibility;
uniform sampler2D uTexture;
uniform float uPointAlpha;
uniform float uIor;
uniform bool uInverseFresnel;
uniform float uFresnelPower;
uniform float uGamma;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;
uniform float uStepA;
uniform float uStepB;
uniform float uStepC;
uniform float uStepD;
uniform bool uUseColorA;
uniform bool uUseColorB;
uniform bool uUseColorC;
uniform bool uUseColorD;


vec4 multiplyColor(vec3 colorA, float val) {
    return vec4(colorA * val, 1.0);
}
vec4 makeTwoPointGradient(
    vec3 colorA, vec3 colorB,
    float stepA, float stepB,
    float val
) {
    // valをグラデーションの範囲内に正規化
    float normalizedPosition = (val - stepA) / (stepB - stepA);
    return vec4(mix(colorA, colorB, normalizedPosition), 1.0);
}

vec4 makeThreePointGradient(
    vec3 colorA, vec3 colorB, vec3 colorC,
    float stepA, float stepB, float stepC,
    float val
) {
    // valをグラデーションの範囲内に正規化
    float normalizedPosition = (val - stepA) / (stepC - stepA);
    if (normalizedPosition < stepB) {
        // stepAとstepBの間で補間
        float mixFactor = (normalizedPosition - stepA) / (stepB - stepA);
        return vec4(mix(colorA, colorB, mixFactor), 1.0);
    } else {
        // stepBとstepCの間で補間
        float mixFactor = (normalizedPosition - stepB) / (stepC - stepB);
        return vec4(mix(colorB, colorC, mixFactor), 1.0);
    }
}

vec4 makeFourPointGradient(
    vec3 colorA, vec3 colorB, vec3 colorC, vec3 colorD,
    float stepA, float stepB, float stepC, float stepD,
    float position
) {
    // positionをグラデーションの範囲内に正規化
    float normalizedPosition = (position - stepA) / (stepD - stepA);

    if (normalizedPosition < stepB) {
        // stepAとstepBの間で補間
        float mixFactor = (normalizedPosition - stepA) / (stepB - stepA);
        return vec4(mix(colorA, colorB, mixFactor), 1.0);
    } else if (normalizedPosition < stepC) {
        // stepBとstepCの間で補間
        float mixFactor = (normalizedPosition - stepB) / (stepC - stepB);
        return vec4(mix(colorB, colorC, mixFactor), 1.0);
    } else {
        // stepCとstepDの間で補間
        float mixFactor = (normalizedPosition - stepC) / (stepD - stepC);
        return vec4(mix(colorC, colorD, mixFactor), 1.0);
    }
}

void main() {
    if (vVisibility < 0.0) {
        discard;
    }
    // ポイントを丸める
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) {
        discard;
    }
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float cosTheta = dot(viewDirection, vNormal);
    float ior = uIor;
    float r0 = (1.0 - ior) / (1.0 + ior);
    r0 = r0 * r0;
    float fresnel = r0 + (1.0 - r0) * pow((1.0 - cosTheta), uFresnelPower);
    if (uInverseFresnel) {
        fresnel = 1.0 - fresnel;
    }
    fresnel = pow(fresnel, 1.0 / uGamma);
    vec4 color = vec4(vec3(fresnel), 1.0);
    if (uUseColorA && uUseColorB && uUseColorC && uUseColorD) {
        color = makeFourPointGradient(uColorA, uColorB, uColorC, uColorD, uStepA, uStepB, uStepC, uStepD, fresnel);
    } else if (uUseColorA && uUseColorB && uUseColorC) {
        color = makeThreePointGradient(uColorA, uColorB, uColorC, uStepA, uStepB, uStepC, fresnel);
    } else if (uUseColorA && uUseColorB && uUseColorD) {
        color = makeThreePointGradient(uColorA, uColorB, uColorD, uStepA, uStepB, uStepD, fresnel);
    } else if (uUseColorA && uUseColorC && uUseColorD) {
        color = makeThreePointGradient(uColorA, uColorC, uColorD, uStepA, uStepC, uStepD, fresnel);
    } else if (uUseColorB && uUseColorC && uUseColorD) {
        color = makeThreePointGradient(uColorB, uColorC, uColorD, uStepB, uStepC, uStepD, fresnel);
    } else if (uUseColorA && uUseColorB) {
        color = makeTwoPointGradient(uColorA, uColorB, uStepA, uStepB, fresnel);
    } else if (uUseColorA && uUseColorC) {
        color = makeTwoPointGradient(uColorA, uColorC, uStepA, uStepC, fresnel);
    } else if (uUseColorA && uUseColorD) {
        color = makeTwoPointGradient(uColorA, uColorD, uStepA, uStepD, fresnel);
    } else if (uUseColorB && uUseColorC) {
        color = makeTwoPointGradient(uColorB, uColorC, uStepB, uStepC, fresnel);
    } else if (uUseColorB && uUseColorD) {
        color = makeTwoPointGradient(uColorB, uColorD, uStepB, uStepD, fresnel);
    } else if (uUseColorC && uUseColorD) {
        color = makeTwoPointGradient(uColorC, uColorD, uStepC, uStepD, fresnel);
    } else if (uUseColorA) {
//        fresnel = 1.0 - fresnel;
        color = multiplyColor(uColorA, fresnel);
    } else if (uUseColorB) {
//        fresnel = 1.0 - fresnel;
        color = multiplyColor(uColorB, fresnel);
    } else if (uUseColorC) {
//        fresnel = 1.0 - fresnel;
        color = multiplyColor(uColorC, fresnel);
    } else if (uUseColorD) {
//        fresnel = 1.0 - fresnel;
        color = multiplyColor(uColorD, fresnel);
    }

    gl_FragColor = vec4(color.rgb, uPointAlpha);
}



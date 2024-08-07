varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying float vVisibility;
uniform sampler2D uTexture;
uniform vec3 uMouse;
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
vec4 makeGradient(
    vec3 colorA, vec3 colorB,
    float stepA, float stepB,
    float val
) {
    // valをグラデーションの範囲内に正規化
    float mixFactor = (val - stepA) / (stepB - stepA);
    return vec4(mix(colorA, colorB, mixFactor), 1.0);
}

vec4 makeTwoPointGradient(
    vec3 colorA, vec3 colorB,
    float stepA, float stepB,
    float val
) {
    if (val <= stepA) {
        return vec4(colorA, 1.0);
    } else if (val < stepB) {
        return makeGradient(colorA, colorB, stepA, stepB, val);
    } else {
        return vec4(colorB, 1.0);
    }
}

vec4 makeThreePointGradient(
    vec3 colorA, vec3 colorB, vec3 colorC,
    float stepA, float stepB, float stepC,
    float val
) {
    if (val <= stepA) {
        return vec4(colorA, 1.0);
    } else if (val < stepB) {
        return makeGradient(colorA, colorB, stepA, stepB, val);
    } else if (val < stepC) {
        return makeGradient(colorB, colorC, stepB, stepC, val);
    } else {
        return vec4(colorC, 1.0);
    }
}

vec4 makeFourPointGradient(
    vec3 colorA, vec3 colorB, vec3 colorC, vec3 colorD,
    float stepA, float stepB, float stepC, float stepD,
    float position
) {
    if (position < stepA) {
        return vec4(colorA, 1.0);
    } else if (position < stepB) {
        return makeGradient(colorA, colorB, stepA, stepB, position);
    } else if (position < stepC) {
        return makeGradient(colorB, colorC, stepB, stepC, position);
    } else if (position < stepD) {
        return makeGradient(colorC, colorD, stepC, stepD, position);
    } else {
        return vec4(colorD, 1.0);
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
    // フレネル
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float cosTheta = dot(viewDirection, vNormal);
    float r0 = (1.0 - uIor) / (1.0 + uIor);
    r0 = r0 * r0;
    float fresnel = r0 + (1.0 - r0) * pow((1.0 - cosTheta), uFresnelPower);
    fresnel = pow(fresnel, 1.0 / uGamma);
    if (uInverseFresnel) {
        fresnel = 1.0 - fresnel;
    }
    //
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
        color = multiplyColor(uColorA, fresnel);
    } else if (uUseColorB) {
        color = multiplyColor(uColorB, fresnel);
    } else if (uUseColorC) {
        color = multiplyColor(uColorC, fresnel);
    } else if (uUseColorD) {
        color = multiplyColor(uColorD, fresnel);
    }
//    float dist = distance(uMouse, vPosition);
//    float radius = 0.5;
//    float maxDistance = sqrt(pow(radius, 2.0) + pow(radius, 2.0))/5.0;
//    float touchFactor = (0.01 - 1.0) / maxDistance * dist + 1.0;
//    color.rgb = vec3(0.0,touchFactor,1.0);

    gl_FragColor = vec4(color.rgb, uPointAlpha);
    #include <encodings_fragment>
}



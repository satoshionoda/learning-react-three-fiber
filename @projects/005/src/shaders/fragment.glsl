varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying float vVisibility;
varying float vColorFactor;
uniform vec3 uMouse;
uniform float uPointAlpha;
uniform float uGamma;
uniform vec3 uColorA;
uniform vec3 uColorB;

const float Xn = 0.950470;
const float Yn = 1.0;
const float Zn = 1.088830;
const float T0 = 4.0 / 29.0;
const float T1 = 6.0 / 29.0;
const float T2 = 3.0 * T1 * T1;
const float T3 = T1 * T1 * T1;
const float PI = 3.141592653589793;
const float DEG2RAD = PI / 180.0;
const float RAD2DEG = 180.0 / PI;

const int MIX_TYPE_RGB = 0;
const int MIX_TYPE_HSL = 1;
const int MIX_TYPE_LCH = 2;
const int MIX_TYPE_LAB = 3;
const int MIX_TYPE_HSB = 4;

float rgb_xyz(float r) {
    if (r <= 0.04045) return r / 12.92;
    return pow((r + 0.055) / 1.055, 2.4);
}
float xyz_rgb(float r) {
    if (r <= 0.00304) return 12.92 * r;
    return 1.055 * pow(r, 1.0 / 2.4) - 0.055;
}

float xyz_lab(float t) {
    if (t > T3) return pow(t, 1.0 / 3.0);
    return t / T2 + T0;
}
float lab_xyz(float t) {
    if (t > T1) return t * t * t;
    return T2 * (t - T0);
}

// RGB LAB conversion is ported from chroma.js
// https://github.com/gka/chroma.js
vec3 RGBtoLAB(vec3 rgb) {
    float r = rgb_xyz(rgb.r);
    float g = rgb_xyz(rgb.g);
    float b = rgb_xyz(rgb.b);
    //sRGB -> D65
    float x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / Xn);
    float y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / Yn);
    float z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / Zn);
    //
    float l = 116.0 * y - 16.0;
    if (l < 0.0) {
        l = 0.0;
    }
    float a = 500.0 * (x - y);
    float b_ = 200.0 * (y - z);
    return vec3(l, a, b_);
}

vec3 LABtoRGB(vec3 lab) {
    float l = lab.x;
    float a = lab.y;
    float b = lab.z;
    //
    float y = (l + 16.0) / 116.0;
    float x = y + a / 500.0;
    float z = y - b / 200.0;

    y = lab_xyz(y) * Yn;
    x = lab_xyz(x) * Xn;
    z = lab_xyz(z) * Zn;

    //D65 -> sRGB
    float r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
    float g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
    float b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
    return vec3(r, g, b_);
}

vec3 LABtoLCH(vec3 lab) {
    float l = lab.x;
    float a = lab.y;
    float b = lab.z;
    float c = sqrt(a * a + b * b);
    float h = mod(atan(b, a) * RAD2DEG + 360.0, 360.0);
    return vec3(l, c, h);
}

vec3 LCHtoLAB(vec3 val) {
    float l = val.x;
    float c = val.y;
    float h = val.z;
    h = h * DEG2RAD;
    //
    float a = cos(h) * c;
    float b = sin(h) * c;
    return vec3(l, a, b);
}

vec3 RGBtoLCH(vec3 color) {
    vec3 lab = RGBtoLAB(color);
    return LABtoLCH(lab);
}
vec3 LCHtoRGB(vec3 color) {
    vec3 lab = LCHtoLAB(color);
    return LABtoRGB(lab);
}

vec4 makeGradient(
    vec4 colorA, vec4 colorB,
    float stepA, float stepB,
    float val,
    int mixType
) {
    float mixFactor = (val - stepA) / (stepB - stepA);
    if (mixType == MIX_TYPE_LCH) {
        float hueDiffrence = colorB.z - colorA.z;
        hueDiffrence = mod(hueDiffrence + 180.0, 360.0) - 180.0;
        float hue = colorA.z + hueDiffrence * mixFactor;
        hue = mod(hue, 360.0);
        float chroma = mix(colorA.y, colorB.y, mixFactor);
        float lightness = mix(colorA.x, colorB.x, mixFactor);
        float alpha = mix(colorA.w, colorB.w, mixFactor);
        return vec4(lightness, chroma, hue, alpha);
    } else if (mixType == MIX_TYPE_HSL || mixType == MIX_TYPE_HSB) {
        float hueDifference = colorB.x - colorA.x;
        hueDifference = mod(hueDifference + 180.0, 360.0) - 180.0;
        float hue = colorA.x + hueDifference * mixFactor;
        hue = mod(hue, 360.0);
        float saturation = mix(colorA.y, colorB.y, mixFactor);
        float brightness = mix(colorA.z, colorB.z, mixFactor);
        float alpha = mix(colorA.w, colorB.w, mixFactor);
        return vec4(hue, saturation, brightness, alpha);
    } else {
        return mix(colorA, colorB, mixFactor);
    }
}

void main() {
    if(vVisibility < 0.8) {
        discard;
    }
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) {
        discard;
    }

    vec3 mixed = makeGradient(
        vec4(RGBtoLCH(uColorA), 1),
        vec4(RGBtoLCH(uColorB), 1),
        0.0, 1.0,
        vColorFactor,
        MIX_TYPE_LCH
    ).rgb;

    vec4 color = vec4(LCHtoRGB(mixed), 1.0);
    gl_FragColor = vec4(color.rgb, 0.5);
    #include <encodings_fragment>
}


